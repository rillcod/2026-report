"use client"

import { ReportContent } from "./report-content"

interface ReportPreviewProps {
  report: {
    studentName: string
    schoolName: string
    studentSection: string
    reportDate: string
    theoryScore: number
    practicalScore: number
    attendance: number
    participation: string
    projectCompletion: string
    homeworkCompletion: string
    progressItems: string[]
    strengths: string
    growth: string
    comments: string
    certificateText: string
    showPaymentDetails: boolean
  }
  settings: {
    courseName: string
    currentModule: string
    nextModule: string
    instructorName: string
    duration: string
    nextTermFee: string
    bankDetails: string
    digitalSignature: string | null
    schoolWebsite?: string
  }
  tier?: "minimal" | "standard" | "hd"
}

export function ReportPreview({ report, settings, tier = "standard" }: ReportPreviewProps) {
  // Convert report and settings to the format expected by ReportContent
  const formData = {
    studentName: report.studentName,
    schoolName: report.schoolName,
    studentSection: report.studentSection,
    reportDate: report.reportDate,
    theoryScore: report.theoryScore.toString(),
    practicalScore: report.practicalScore.toString(),
    attendance: report.attendance.toString(),
    participation: report.participation,
    projectCompletion: report.projectCompletion,
    homeworkCompletion: report.homeworkCompletion,
    progressItems: report.progressItems,
    strengths: report.strengths,
    growth: report.growth,
    comments: report.comments,
    certificateText: report.certificateText,
    showPaymentDetails: report.showPaymentDetails,
  }

  const reportSettings = {
    courseName: settings.courseName,
    currentModule: settings.currentModule,
    nextModule: settings.nextModule,
    instructorName: settings.instructorName,
    duration: settings.duration,
    nextTermFee: settings.nextTermFee,
    bankDetails: settings.bankDetails,
    digitalSignature: settings.digitalSignature,
    schoolWebsite: settings.schoolWebsite,
  }

  // Use minimalView for minimal tier, standard view for others
  const minimalView = tier === "minimal"

  return (
    <ReportContent 
      formData={formData} 
      settings={reportSettings} 
      printMode={false}
      minimalView={minimalView}
      tier={tier}
    />
  )
}
