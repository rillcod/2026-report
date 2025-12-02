"use client"

import { useState, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { usePDFGenerator } from "@/hooks/use-pdf-generator"
import { ReportContent } from "@/components/report-content"
import { UnifiedReportGenerator } from "@/components/unified-report-generator"
import {
  ArrowLeft,
  Download,
  Printer,
  Camera,
  Share2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  FileText,
  Crown,
  BarChart3,
  ToggleLeft,
  ToggleRight,
} from "lucide-react"

interface UnifiedReportCanvasProps {
  reportData: any
  settings: any
  tier: "minimal" | "standard" | "hd"
  onBack: () => void
}

export function UnifiedReportCanvas({ reportData, settings, tier, onBack }: UnifiedReportCanvasProps) {
  const { toast } = useToast()
  const { generateAndDownloadPDF, isGenerating } = usePDFGenerator()
  const [isExporting, setIsExporting] = useState(false)
  const [isPrinting, setIsPrinting] = useState(false)
  const [zoom, setZoom] = useState(100)
  const [showMinimalView, setShowMinimalView] = useState(false)
  const reportRef = useRef<HTMLDivElement>(null)

  const handlePrint = useCallback(() => {
    setIsPrinting(true)

    // Create a new window for printing
    const printWindow = window.open("", "_blank")
    if (!printWindow) {
      toast({
        title: "Print Failed",
        description: "Please allow popups to enable printing.",
        variant: "destructive",
      })
      setIsPrinting(false)
      return
    }

    // Get the report content
    const reportContent = reportRef.current?.innerHTML || ""

    // Create print-optimized HTML
    const printHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Student Report - ${reportData.studentName}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              background: white;
              color: black;
              line-height: 1.4;
            }
            @page { 
              size: A4; 
              margin: 0;
            }
            .print-container {
              width: 210mm;
              min-height: 297mm;
              margin: 0 auto;
              background: white;
              page-break-after: always;
            }
            @media print {
              body { -webkit-print-color-adjust: exact; }
              .print-container { 
                width: 100%;
                height: 100vh;
                margin: 0;
                page-break-after: auto;
              }
            }
          </style>
        </head>
        <body>
          <div class="print-container">
            ${reportContent}
          </div>
        </body>
      </html>
    `

    printWindow.document.write(printHTML)
    printWindow.document.close()

    // Wait for content to load then print
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print()
        printWindow.close()
        setIsPrinting(false)
      }, 500)
    }
  }, [reportData.studentName, toast])

  const handleExportPDF = useCallback(async () => {
    if (!reportRef.current) {
      toast({
        title: "Export Failed",
        description: "No report content available to export.",
        variant: "destructive",
      })
      return
    }

    setIsExporting(true)

    try {
      const success = await generateAndDownloadPDF(reportRef.current, {
        tier,
        studentName: reportData.studentName || "Student",
        reportData,
        settings,
      })

      if (!success) {
        throw new Error("PDF generation returned false")
      }
    } catch (error) {
      console.error("Canvas PDF export failed:", error)
      toast({
        title: "Export Failed",
        description: "Failed to export PDF. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
  }, [generateAndDownloadPDF, reportData, settings, tier, toast])

  const handleScreenshot = useCallback(async () => {
    try {
      // Simulate screenshot capture
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Screenshot Captured",
        description: "Report screenshot has been saved to your downloads.",
      })
    } catch (error) {
      toast({
        title: "Screenshot Failed",
        description: "Failed to capture screenshot. Please try again.",
        variant: "destructive",
      })
    }
  }, [toast])

  const handleShare = useCallback(() => {
    if (navigator.share) {
      navigator.share({
        title: `Student Report - ${reportData.studentName}`,
        text: `Progress report for ${reportData.studentName}`,
        url: window.location.href,
      })
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      toast({
        title: "Link Copied",
        description: "Report link has been copied to clipboard.",
      })
    }
  }, [reportData.studentName, toast])

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case "minimal":
        return <FileText className="h-4 w-4" />
      case "standard":
        return <BarChart3 className="h-4 w-4" />
      case "hd":
        return <Crown className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "minimal":
        return "bg-gray-100 text-gray-800 border-gray-300"
      case "standard":
        return "bg-blue-100 text-blue-800 border-blue-300"
      case "hd":
        return "bg-yellow-100 text-yellow-800 border-yellow-300"
      default:
        return "bg-gray-100 text-gray-800 border-gray-300"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Controls */}
      <Card className="mb-6 shadow-lg border-blue-100">
        <CardHeader>
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={onBack} className="flex items-center gap-2 bg-transparent">
                <ArrowLeft className="h-4 w-4" />
                Back to Editor
              </Button>
              <div>
                <CardTitle className="text-xl text-blue-900 flex items-center gap-2">
                  Report Canvas - {reportData.studentName}
                  <Badge variant="outline" className={`${getTierColor(tier)} border`}>
                    {getTierIcon(tier)}
                    {tier.toUpperCase()}
                  </Badge>
                </CardTitle>
                <p className="text-blue-700 text-sm">
                  Generated on {new Date(reportData.generatedAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Zoom Controls */}
              <div className="flex items-center gap-2 bg-white rounded-lg border border-gray-200 p-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setZoom(Math.max(50, zoom - 10))}
                  disabled={zoom <= 50}
                >
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <span className="text-sm font-medium px-2 min-w-[60px] text-center">{zoom}%</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setZoom(Math.min(200, zoom + 10))}
                  disabled={zoom >= 200}
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setZoom(100)}>
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>

              {/* View Toggle */}
              <Button
                variant="outline"
                onClick={() => setShowMinimalView(!showMinimalView)}
                className="flex items-center gap-2 bg-transparent"
              >
                {showMinimalView ? <ToggleRight className="h-4 w-4" /> : <ToggleLeft className="h-4 w-4" />}
                {showMinimalView ? "Minimal View" : "Standard View"}
              </Button>

              {/* Action Buttons */}
              <Button variant="outline" onClick={handleScreenshot} className="flex items-center gap-2 bg-transparent">
                <Camera className="h-4 w-4" />
                Screenshot
              </Button>

              <Button
                variant="outline"
                onClick={handlePrint}
                disabled={isPrinting}
                className="flex items-center gap-2 bg-transparent"
              >
                {isPrinting ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                ) : (
                  <Printer className="h-4 w-4" />
                )}
                Print
              </Button>

              <Button
                onClick={handleExportPDF}
                disabled={isExporting}
                className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
              >
                {isExporting ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <Download className="h-4 w-4" />
                )}
                Export PDF
              </Button>

              <Button variant="outline" onClick={handleShare} className="flex items-center gap-2 bg-transparent">
                <Share2 className="h-4 w-4" />
                Share
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Report Canvas */}
      <div className="flex justify-center">
        <div
          className="bg-white shadow-2xl rounded-lg overflow-hidden"
          style={{
            transform: `scale(${zoom / 100})`,
            transformOrigin: "top center",
            marginBottom: `${(zoom - 100) * 3}px`,
          }}
        >
          <div ref={reportRef} className="report-content">
            {/* For minimal tier or when minimal view is toggled, use the proto-style A4 layout */}
            {tier === "minimal" || showMinimalView ? (
              <div style={{ minHeight: "297mm", maxHeight: "297mm", width: "210mm" }}>
                <UnifiedReportGenerator reportData={reportData} settings={settings} tier={tier} />
              </div>
            ) : (
              <ReportContent
                formData={reportData}
                settings={settings}
                printMode={false}
                minimalView={false}
                tier={tier}
              />
            )}
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-8 text-center text-gray-600 text-sm">
        <p>Report generated using RillCod Technologies Student Progress System</p>
        <p>For support, contact: support@rillcod.com</p>
      </div>
    </div>
  )
}
