"use client"

import { useRef, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ReportContent } from "@/components/report-content"
import { UnifiedReportGenerator } from "@/components/unified-report-generator"
import { usePDFGenerator } from "@/hooks/use-pdf-generator"
import { useSettings } from "@/hooks/use-settings"
import { Download, Printer, ArrowLeft, ZoomIn, ZoomOut, RotateCcw } from "lucide-react"
import { useState } from "react"

interface ReportPreviewStandaloneProps {
  formData: any
  settings?: any
  tier?: "minimal" | "standard" | "hd"
  onBack?: () => void
}

export function ReportPreviewStandalone({ 
  formData, 
  settings: propSettings, 
  tier = "standard",
  onBack 
}: ReportPreviewStandaloneProps) {
  const { settings: defaultSettings } = useSettings()
  const settings = propSettings || defaultSettings
  const reportRef = useRef<HTMLDivElement>(null)
  const { generateAndDownloadPDF } = usePDFGenerator()
  const [zoom, setZoom] = useState(100)

  // Convert formData to minimal report format if needed
  const minimalReportData = useMemo(() => {
    if (tier === "minimal") {
      return {
        studentName: formData.studentName || "Unknown Student",
        schoolName: formData.schoolName || "",
        studentSection: formData.studentSection || "",
        reportDate: formData.reportDate || new Date().toISOString().split("T")[0],
        theoryScore: Number(formData.theoryScore) || 0,
        practicalScore: Number(formData.practicalScore) || 0,
        attendance: Number(formData.attendance) || 0,
        participation: formData.participation || "",
        projectCompletion: formData.projectCompletion || "",
        homeworkCompletion: formData.homeworkCompletion || "",
        progressItems: formData.progressItems || [],
        strengths: formData.strengths || "",
        growth: formData.growth || "",
        comments: formData.comments || "",
        certificateText: formData.certificateText || "",
        showPaymentDetails: formData.showPaymentDetails || false,
        tier: "minimal",
        settings: settings,
        generatedAt: new Date().toISOString(),
      }
    }
    return null
  }, [formData, settings, tier])

  const handleDownloadPDF = async () => {
    if (!reportRef.current) return

    await generateAndDownloadPDF(reportRef.current, {
      tier,
      studentName: formData.studentName || "Student",
      reportData: formData,
      settings,
    })
  }

  const handlePrint = () => {
    window.print()
  }

  const zoomIn = () => {
    setZoom((prev) => Math.min(prev + 10, 200))
  }

  const zoomOut = () => {
    setZoom((prev) => Math.max(prev - 10, 50))
  }

  const resetZoom = () => {
    setZoom(100)
  }

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      {/* Header Controls - Compact */}
      <Card className="shadow-md border-blue-100 rounded-none border-x-0 border-t-0 z-50">
        <CardHeader className="py-3 px-4">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              {onBack && (
                <Button variant="outline" size="sm" onClick={onBack} className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>
              )}
              <div>
                <CardTitle className="text-lg text-blue-900">
                  {formData.studentName || "Student"} - Report Preview
                </CardTitle>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Zoom Controls */}
              <div className="flex items-center gap-1 bg-white rounded-lg border border-gray-200 p-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={zoomOut}
                  disabled={zoom <= 50}
                  className="h-7 w-7 p-0"
                >
                  <ZoomOut className="h-3.5 w-3.5" />
                </Button>
                <span className="text-xs font-medium px-1.5 min-w-[45px] text-center">{zoom}%</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={zoomIn}
                  disabled={zoom >= 200}
                  className="h-7 w-7 p-0"
                >
                  <ZoomIn className="h-3.5 w-3.5" />
                </Button>
                <Button variant="ghost" size="sm" onClick={resetZoom} className="h-7 w-7 p-0">
                  <RotateCcw className="h-3.5 w-3.5" />
                </Button>
              </div>

              {/* Action Buttons */}
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrint}
                className="flex items-center gap-2"
              >
                <Printer className="h-3.5 w-3.5" />
                Print
              </Button>

              <Button
                size="sm"
                onClick={handleDownloadPDF}
                className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
              >
                <Download className="h-3.5 w-3.5" />
                PDF
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Report Preview - Full Height */}
      <div className="flex-1 flex justify-center items-start overflow-auto p-2">
        <div 
          className="bg-white shadow-2xl overflow-hidden transition-transform duration-200"
          style={{ 
            transform: `scale(${zoom / 100})`, 
            transformOrigin: "top center"
          }}
        >
          <div ref={reportRef} className="report-content">
            {tier === "minimal" && minimalReportData ? (
              <div
                style={{
                  minHeight: "297mm",
                  maxHeight: "297mm",
                  width: "210mm",
                }}
              >
                <UnifiedReportGenerator 
                  reportData={minimalReportData} 
                  settings={settings} 
                  tier={tier} 
                />
              </div>
            ) : (
              <ReportContent
                formData={formData}
                settings={settings}
                printMode={false}
                minimalView={tier === "minimal"}
                tier={tier}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

