"use client"

import { useState, useRef, useMemo, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ReportContent } from "@/components/report-content"
import { UnifiedReportGenerator } from "@/components/unified-report-generator"
import { usePDFGenerator } from "@/hooks/use-pdf-generator"
import { Download, Printer, X, ZoomIn, ZoomOut, RotateCcw, Maximize2 } from "lucide-react"

interface PrintPreviewProps {
  formData: any
  settings: any
  onClose: () => void
  tier?: "minimal" | "standard" | "hd"
}

export function PrintPreview({ formData, settings, onClose, tier = "standard" }: PrintPreviewProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [zoom, setZoom] = useState(0.75) // Start with fit-to-width zoom
  const containerRef = useRef<HTMLDivElement>(null)
  const reportRef = useRef<HTMLDivElement>(null)
  const { generateAndDownloadPDF } = usePDFGenerator()

  const minimalReportData = useMemo(() => {
    if (tier !== "minimal") return null

    const theoryScore = Number(formData.theoryScore) || 0
    const practicalScore = Number(formData.practicalScore) || 0
    const attendance = Number(formData.attendance) || 0

    return {
      studentName: formData.studentName || "",
      schoolName: formData.schoolName || "",
      studentSection: formData.studentSection || "",
      reportDate: formData.reportDate,
      theoryScore,
      practicalScore,
      attendance,
      participation: formData.participation || "",
      projectCompletion: formData.projectCompletion || "",
      homeworkCompletion: formData.homeworkCompletion || "",
      progressItems: formData.progressItems || [],
      strengths: formData.strengths || "",
      growth: formData.growth || "",
      comments: formData.comments || "",
      certificateText: formData.certificateText || "",
      showPaymentDetails: formData.showPaymentDetails,
      tier,
      settings,
      generatedAt: new Date().toISOString(),
    }
  }, [formData, settings, tier])

  const handlePrint = () => {
    window.print()
  }

  const handleDownloadPDF = async () => {
    if (!reportRef.current) return

    setIsGenerating(true)

    try {
      const success = await generateAndDownloadPDF(reportRef.current, {
        tier,
        studentName: formData.studentName || "Student",
        reportData: formData,
        settings,
      })

      if (!success) {
        throw new Error("PDF generation failed")
      }
    } catch (error) {
      console.error("Error generating PDF:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  const zoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.25, 3))
  }

  const zoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.25, 0.5))
  }

  const resetZoom = () => {
    setZoom(1)
  }

  const fitToWidth = () => {
    // Calculate zoom to fit 210mm (A4 width) in the container
    if (containerRef.current) {
      const containerWidth = containerRef.current.clientWidth - 100 // Account for padding
      const a4WidthPx = 210 * 3.779527559 // Convert mm to pixels (1mm = 3.779527559px at 96dpi)
      const fitZoom = containerWidth / a4WidthPx
      setZoom(Math.min(Math.max(fitZoom, 0.5), 1.5))
    } else {
      setZoom(0.75) // Default fit zoom
    }
  }

  // Handle mouse wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault()
      const delta = e.deltaY > 0 ? -0.1 : 0.1
      setZoom((prev) => Math.min(Math.max(prev + delta, 0.5), 3))
    }
  }

  // Auto-fit on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      fitToWidth()
    }, 100)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <Card className="w-full max-w-4xl max-h-[90vh] flex flex-col bg-white dark:bg-gray-800">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <CardTitle>Print Preview</CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={zoomOut} disabled={zoom <= 0.5}>
                <ZoomOut className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium min-w-[60px] text-center">{Math.round(zoom * 100)}%</span>
              <Button variant="outline" size="sm" onClick={zoomIn} disabled={zoom >= 3}>
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={resetZoom} title="Reset Zoom">
                <RotateCcw className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={fitToWidth} title="Fit to Width">
                <Maximize2 className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={handlePrint}>
                <Printer className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Print</span>
              </Button>
              <Button variant="outline" size="sm" onClick={handleDownloadPDF} disabled={isGenerating}>
                {isGenerating ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-1" />
                    <span className="hidden sm:inline">Download PDF</span>
                  </>
                )}
              </Button>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent 
          ref={containerRef}
          className="overflow-auto p-0 flex-1 bg-slate-100" 
          onWheel={handleWheel}
          style={{ 
            cursor: zoom > 1 ? 'grab' : 'default',
            scrollBehavior: 'smooth'
          }}
        >
          <div 
            className="min-h-full flex justify-center items-start p-4"
            style={{
              minWidth: `${210 * 3.779527559 * zoom + 100}px`, // Ensure container is wide enough for zoomed content
              minHeight: `${297 * 3.779527559 * zoom + 100}px`, // Ensure container is tall enough for zoomed content
            }}
          >
            <div 
              className="border-2 border-slate-400 rounded-lg bg-white shadow-xl p-4 mx-auto"
              style={{
                transform: `scale(${zoom})`,
                transformOrigin: "top center",
                transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                width: "210mm",
                minWidth: "210mm",
                maxWidth: "210mm",
              }}
            >
              <div 
                ref={reportRef}
                className="bg-white rounded shadow-inner"
                style={{
                  width: "210mm",
                  minWidth: "210mm",
                  maxWidth: "210mm",
                  boxSizing: "border-box",
                }}
              >
                {tier === "minimal" && minimalReportData ? (
                  <div
                    style={{
                      minHeight: "297mm",
                      maxHeight: "297mm",
                      width: "210mm",
                    }}
                  >
                    <UnifiedReportGenerator reportData={minimalReportData} settings={settings} tier={tier} />
                  </div>
                ) : (
                  <ReportContent
                    formData={formData}
                    settings={settings}
                    printMode={true}
                    minimalView={tier === "minimal"}
                    tier={tier}
                  />
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
