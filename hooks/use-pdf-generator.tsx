"use client"

import { useState, useCallback } from "react"
import { jsPDF } from "jspdf"
import html2canvas from "html2canvas"
import { useToast } from "@/hooks/use-toast"

interface PDFOptions {
  tier: "minimal" | "standard" | "hd"
  studentName: string
  reportData: any
  settings: any
}

export function usePDFGenerator() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationProgress, setGenerationProgress] = useState(0)
  const { toast } = useToast()

  const generateAndDownloadPDF = useCallback(
    async (element: HTMLElement, options: PDFOptions): Promise<boolean> => {
      if (!element) {
        toast({
          title: "PDF Generation Failed",
          description: "No element provided for PDF generation.",
          variant: "destructive",
        })
        return false
      }

      setIsGenerating(true)
      setGenerationProgress(0)

      try {
        // Apply compact spacing class for PDF generation
        element.classList.add("pdf-compact-mode")
        if (options.tier === "hd") {
          element.classList.add("hd-mode")
        }
        
        // Small delay to ensure CSS is applied
        await new Promise(resolve => setTimeout(resolve, 50))

        // Step 1: Capture element as canvas (25% progress)
        setGenerationProgress(25)
        const canvas = await html2canvas(element, {
          scale: options.tier === "hd" ? 3 : 2,
          logging: false,
          useCORS: true,
          allowTaint: true,
          backgroundColor: "#ffffff",
          width: element.scrollWidth,
          height: element.scrollHeight,
        })

        // Step 2: Convert to image data (50% progress)
        setGenerationProgress(50)
        const imgData = canvas.toDataURL("image/png", 1.0)

        // Step 3: Create PDF (75% progress)
        setGenerationProgress(75)
        const pdf = new jsPDF("p", "mm", "a4")
        const pageWidth = pdf.internal.pageSize.getWidth() // 210mm
        const pageHeight = pdf.internal.pageSize.getHeight() // 297mm

        // Calculate dimensions to fit A4 with minimal margins
        const margin = 3 // 3mm margin on all sides for maximum content usage
        const usableWidth = pageWidth - (margin * 2) // 204mm
        const usableHeight = pageHeight - (margin * 2) // 291mm per page

        // Calculate image dimensions maintaining aspect ratio
        const imgAspectRatio = canvas.width / canvas.height
        let imgWidth = usableWidth
        let imgHeight = imgWidth / imgAspectRatio

        // If content is taller than one page, split across multiple pages
        if (imgHeight > usableHeight) {
          const totalPages = Math.ceil(imgHeight / usableHeight)
          let sourceY = 0
          let remainingHeight = imgHeight

          for (let page = 0; page < totalPages; page++) {
            if (page > 0) {
              pdf.addPage()
            }

            // Calculate slice for this page
            const heightOnThisPage = Math.min(remainingHeight, usableHeight)
            const sourceSliceHeight = (heightOnThisPage / imgHeight) * canvas.height

            // Create canvas slice for this page
            const pageCanvas = document.createElement("canvas")
            pageCanvas.width = canvas.width
            pageCanvas.height = sourceSliceHeight
            const ctx = pageCanvas.getContext("2d")
            
            if (ctx) {
              ctx.drawImage(
                canvas,
                0, sourceY, canvas.width, sourceSliceHeight,
                0, 0, canvas.width, sourceSliceHeight
              )
              const pageImgData = pageCanvas.toDataURL("image/png", 1.0)
              pdf.addImage(pageImgData, "PNG", margin, margin, imgWidth, heightOnThisPage)
            }

            sourceY += sourceSliceHeight
            remainingHeight -= heightOnThisPage
          }
        } else {
          // Content fits on one page
          const imgData = canvas.toDataURL("image/png", 1.0)
          const x = (pageWidth - imgWidth) / 2
          const y = (pageHeight - imgHeight) / 2
          pdf.addImage(imgData, "PNG", x, y, imgWidth, imgHeight)
        }

        // Add metadata
        pdf.setProperties({
          title: `Student Progress Report - ${options.studentName}`,
          subject: "Student Progress Report",
          author: options.settings.instructorName || "RillCod Technologies",
          creator: "Unified Report System",
          keywords: `student,report,${options.tier},${options.studentName}`,
        })

        // Step 4: Save PDF (100% progress)
        setGenerationProgress(100)
        const fileName = `${options.studentName.replace(/\s+/g, "_")}_${options.tier.toUpperCase()}_Report_${new Date().toISOString().split("T")[0]}.pdf`
        pdf.save(fileName)

        toast({
          title: "PDF Generated Successfully",
          description: `${options.tier.toUpperCase()} report PDF has been downloaded for ${options.studentName}.`,
        })

        return true
      } catch (error) {
        console.error("PDF generation failed:", error)
        toast({
          title: "PDF Generation Failed",
          description: "An error occurred while generating the PDF. Please try again.",
          variant: "destructive",
        })
        return false
      } finally {
        // Ensure cleanup even on error
        try {
          element.classList.remove("pdf-compact-mode")
        } catch (e) {
          // Ignore cleanup errors
        }
        setIsGenerating(false)
        setGenerationProgress(0)
      }
    },
    [toast],
  )

  const generateBatchPDFs = useCallback(
    async (
      elements: Array<{ element: HTMLElement; options: PDFOptions }>,
    ): Promise<Array<{ success: boolean; fileName?: string; error?: string }>> => {
      setIsGenerating(true)
      const results: Array<{ success: boolean; fileName?: string; error?: string }> = []

      try {
        for (let i = 0; i < elements.length; i++) {
          const { element, options } = elements[i]
          setGenerationProgress((i / elements.length) * 100)

          try {
            const success = await generateAndDownloadPDF(element, options)
            results.push({
              success,
              fileName: success
                ? `${options.studentName.replace(/\s+/g, "_")}_${options.tier.toUpperCase()}_Report.pdf`
                : undefined,
            })
          } catch (error) {
            results.push({
              success: false,
              error: error instanceof Error ? error.message : "Unknown error",
            })
          }
        }

        toast({
          title: "Batch PDF Generation Complete",
          description: `Generated ${results.filter((r) => r.success).length} out of ${results.length} PDFs.`,
        })

        return results
      } catch (error) {
        console.error("Batch PDF generation failed:", error)
        toast({
          title: "Batch PDF Generation Failed",
          description: "An error occurred during batch PDF generation.",
          variant: "destructive",
        })
        return []
      } finally {
        setIsGenerating(false)
        setGenerationProgress(0)
      }
    },
    [generateAndDownloadPDF, toast],
  )

  return {
    generateAndDownloadPDF,
    generateBatchPDFs,
    isGenerating,
    generationProgress,
  }
}
