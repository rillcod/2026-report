"use client"

import { useState, useCallback } from "react"
import { useToast } from "@/hooks/use-toast"
import * as XLSX from "xlsx"

interface ExportOptions {
  format: "csv" | "excel" | "json" | "pdf"
  includeAnalytics?: boolean
  dateRange?: { start: Date; end: Date }
  filters?: Record<string, any>
}

export function useDataExport() {
  const { toast } = useToast()
  const [isExporting, setIsExporting] = useState(false)

  // Export reports to various formats
  const exportReports = useCallback(
    async (reports: any[], options: ExportOptions) => {
      setIsExporting(true)

      try {
        switch (options.format) {
          case "csv":
            await exportToCSV(reports, options)
            break
          case "excel":
            await exportToExcel(reports, options)
            break
          case "json":
            await exportToJSON(reports, options)
            break
          default:
            throw new Error("Unsupported export format")
        }

        toast({
          title: "Export Successful",
          description: `Data exported to ${options.format.toUpperCase()} format.`,
        })
      } catch (error) {
        console.error("Export failed:", error)
        toast({
          title: "Export Failed",
          description: `Failed to export data: ${error instanceof Error ? error.message : "Unknown error"}`,
          variant: "destructive",
        })
      } finally {
        setIsExporting(false)
      }
    },
    [toast],
  )

  const exportToCSV = async (reports: any[], options: ExportOptions) => {
    const headers = [
      "Student Name",
      "School",
      "Section",
      "Report Date",
      "Theory Score",
      "Practical Score",
      "Attendance",
      "Overall Grade",
      "Strengths",
      "Growth Areas",
      "Comments",
    ]

    const rows = reports.map((report) => {
      const theory = Number(report.theoryScore) || 0;
      const practical = Number(report.practicalScore) || 0;
      const attendance = Number(report.attendance) || 0;
      const average = isNaN(theory) || isNaN(practical) || isNaN(attendance) ? 0 : (theory + practical + attendance) / 3;
      const overallGrade = calculateGrade(average);
      return [
        report.studentName || "",
        report.schoolName || "",
        report.studentSection || "",
        report.reportDate || "",
        report.theoryScore || "",
        report.practicalScore || "",
        report.attendance || "",
        overallGrade,
        report.strengths || "",
        report.growth || "",
        report.comments || "",
      ]
    })

    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    downloadBlob(blob, `reports_${new Date().toISOString().slice(0, 10)}.csv`)
  }

  const exportToExcel = async (reports: any[], options: ExportOptions) => {
    const workbook = XLSX.utils.book_new()

    // Main reports sheet
    const reportsData = reports.map((report) => ({
      "Student Name": report.studentName || "",
      School: report.schoolName || "",
      Section: report.studentSection || "",
      "Report Date": report.reportDate || "",
      "Theory Score": report.theoryScore || "",
      "Practical Score": report.practicalScore || "",
      Attendance: report.attendance || "",
      "Overall Grade": (() => {
        const theory = Number(report.theoryScore) || 0;
        const practical = Number(report.practicalScore) || 0;
        const attendance = Number(report.attendance) || 0;
        const average = isNaN(theory) || isNaN(practical) || isNaN(attendance) ? 0 : (theory + practical + attendance) / 3;
        return calculateGrade(average);
      })(),
      Strengths: report.strengths || "",
      "Growth Areas": report.growth || "",
      Comments: report.comments || "",
    }))

    const reportsSheet = XLSX.utils.json_to_sheet(reportsData)
    XLSX.utils.book_append_sheet(workbook, reportsSheet, "Reports")

    // Analytics sheet if requested
    if (options.includeAnalytics) {
      const analyticsData = generateAnalyticsData(reports)
      const analyticsSheet = XLSX.utils.json_to_sheet(analyticsData)
      XLSX.utils.book_append_sheet(workbook, analyticsSheet, "Analytics")
    }

    // Grade distribution sheet
    const gradeDistribution = calculateGradeDistribution(reports)
    const gradeSheet = XLSX.utils.json_to_sheet(gradeDistribution)
    XLSX.utils.book_append_sheet(workbook, gradeSheet, "Grade Distribution")

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" })
    const blob = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" })
    downloadBlob(blob, `reports_${new Date().toISOString().slice(0, 10)}.xlsx`)
  }

  const exportToJSON = async (reports: any[], options: ExportOptions) => {
    const exportData = {
      metadata: {
        exportDate: new Date().toISOString(),
        totalReports: reports.length,
        format: "json",
        version: "1.0",
      },
      reports: reports,
      analytics: options.includeAnalytics ? generateAnalyticsData(reports) : undefined,
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" })
    downloadBlob(blob, `reports_${new Date().toISOString().slice(0, 10)}.json`)
  }

  const downloadBlob = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const calculateGrade = (score: number): string => {
    if (score >= 85) return "A"
    if (score >= 70) return "B"
    if (score >= 65) return "C"
    if (score >= 50) return "D"
    return "F"
  }

  const generateAnalyticsData = (reports: any[]) => {
    const grades = reports.map((r) => {
      const theory = Number(r.theoryScore) || 0;
      const practical = Number(r.practicalScore) || 0;
      const attendance = Number(r.attendance) || 0;
      const average = isNaN(theory) || isNaN(practical) || isNaN(attendance) ? 0 : (theory + practical + attendance) / 3;
      return calculateGrade(average);
    })
    const gradeDistribution = grades.reduce(
      (acc, grade) => {
        acc[grade] = (acc[grade] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    return [
      { Metric: "Total Reports", Value: reports.length },
      {
        Metric: "Average Theory Score",
        Value: reports.reduce((sum, r) => sum + Number(r.theoryScore || 0), 0) / reports.length,
      },
      {
        Metric: "Average Practical Score",
        Value: reports.reduce((sum, r) => sum + Number(r.practicalScore || 0), 0) / reports.length,
      },
      {
        Metric: "Average Attendance",
        Value: reports.reduce((sum, r) => sum + Number(r.attendance || 0), 0) / reports.length,
      },
      ...Object.entries(gradeDistribution).map(([grade, count]) => ({ Metric: `Grade ${grade} Count`, Value: count })),
    ]
  }

  const calculateGradeDistribution = (reports: any[]) => {
    const grades = reports.map((r) => {
      const theory = Number(r.theoryScore) || 0;
      const practical = Number(r.practicalScore) || 0;
      const attendance = Number(r.attendance) || 0;
      const average = isNaN(theory) || isNaN(practical) || isNaN(attendance) ? 0 : (theory + practical + attendance) / 3;
      return calculateGrade(average);
    })
    const distribution = grades.reduce(
      (acc, grade) => {
        acc[grade] = (acc[grade] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    return Object.entries(distribution).map(([grade, count]) => ({
      Grade: grade,
      Count: count,
      Percentage: ((count / reports.length) * 100).toFixed(1) + "%",
    }))
  }

  return {
    exportReports,
    isExporting,
  }
}
