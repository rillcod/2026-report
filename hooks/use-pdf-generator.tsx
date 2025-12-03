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

      // Store original styles for restoration (declared outside try for finally access)
      let originalStyles: Record<string, string> | null = null

      try {
        // Detect mobile once at the start
        const isMobile = window.innerWidth < 768
        
        // Validate element exists and is in DOM
        if (!element || !element.isConnected) {
          throw new Error("Element is not connected to the DOM. Please ensure the report is visible before generating PDF.")
        }
        
        // Add data attribute for onclone identification
        if (!element.getAttribute('data-pdf-element')) {
          element.setAttribute('data-pdf-element', 'report')
        }
        
        // Mobile compatibility: Scroll element into view and ensure visibility
        element.scrollIntoView({ behavior: 'instant', block: 'start', inline: 'nearest' })
        
        // Wait for element to be in view
        await new Promise(resolve => setTimeout(resolve, 100))
        
        // Store original styles for restoration
        originalStyles = {
          position: element.style.position,
          top: element.style.top,
          left: element.style.left,
          zIndex: element.style.zIndex,
          visibility: element.style.visibility,
          opacity: element.style.opacity,
          transform: element.style.transform,
          width: element.style.width,
          minWidth: element.style.minWidth,
          maxWidth: element.style.maxWidth,
        }
        
        // Force element to be visible and properly positioned for capture
        element.style.position = 'relative'
        element.style.visibility = 'visible'
        element.style.opacity = '1'
        element.style.zIndex = '9999'
        element.style.transform = 'none'
        
        // Force desktop layout for consistent PDF output regardless of device
        const originalClasses = element.className
        element.classList.add("pdf-compact-mode", "pdf-desktop-layout", "pdf-force-desktop")
        if (options.tier === "hd") {
          element.classList.add("hd-mode")
        }
        
        // Ensure fixed A4 dimensions and prevent responsive stacking
        element.style.width = "210mm"
        element.style.minWidth = "210mm"
        element.style.maxWidth = "210mm"
        
        // Force desktop layout - prevent mobile stacking
        // Apply comprehensive layout fixes to all elements
        const allChildren = element.querySelectorAll('*')
        allChildren.forEach((child: any) => {
          if (child.style) {
            // Get computed styles to check current layout
            const computedStyle = window.getComputedStyle(child)
            const display = computedStyle.display
            
            // Force grid layouts to stay as grid
            if (display === 'grid' || child.classList.contains('grid')) {
              child.style.setProperty('display', 'grid', 'important')
              // Preserve grid-template-columns if set inline
              if (child.style.gridTemplateColumns) {
                child.style.setProperty('grid-template-columns', child.style.gridTemplateColumns, 'important')
              } else if (child.classList.contains('grid-cols-2')) {
                child.style.setProperty('grid-template-columns', '1fr 1fr', 'important')
              } else if (child.classList.contains('grid-cols-3')) {
                child.style.setProperty('grid-template-columns', 'repeat(3, 1fr)', 'important')
              }
            }
            
            // Force flex containers to row direction
            if (display === 'flex' || child.classList.contains('flex')) {
              child.style.setProperty('display', 'flex', 'important')
              if (child.classList.contains('flex-col')) {
                child.style.setProperty('flex-direction', 'row', 'important')
              } else {
                child.style.setProperty('flex-direction', 'row', 'important')
              }
            }
            
            // Ensure elements don't collapse
            if (isMobile) {
              // Don't force block on grid/flex elements
              if (display !== 'grid' && display !== 'flex' && !child.classList.contains('grid') && !child.classList.contains('flex')) {
                // Only apply to non-layout elements
              }
            }
            
            // Ensure box-sizing is correct
            child.style.setProperty('box-sizing', 'border-box', 'important')
          }
        })
        
        // Mobile: Ensure parent containers don't clip content
        let parent = element.parentElement
        while (parent && parent !== document.body) {
          const parentStyle = window.getComputedStyle(parent)
          if (parentStyle.overflow === 'hidden' || parentStyle.overflowY === 'hidden') {
            parent.style.setProperty('overflow', 'visible', 'important')
          }
          parent = parent.parentElement
        }
        
        // Longer delay on mobile to ensure rendering is complete
        await new Promise(resolve => setTimeout(resolve, isMobile ? 300 : 150))

        // Step 1: Capture element as canvas (25% progress)
        setGenerationProgress(25)
        
        // Validate element dimensions before capture
        const elementWidth = element.scrollWidth || element.offsetWidth || 794 // 210mm in px
        const elementHeight = element.scrollHeight || element.offsetHeight || 1123 // 297mm in px
        
        if (elementWidth === 0 || elementHeight === 0) {
          throw new Error(`Invalid element dimensions: ${elementWidth}x${elementHeight}. Element may not be visible.`)
        }
        
        // Mobile-optimized html2canvas options
        const scale = isMobile ? (options.tier === "hd" ? 2 : 1.5) : (options.tier === "hd" ? 3 : 2)
        
        // Simplified html2canvas config for better compatibility
        const canvasOptions: any = {
          scale: scale,
          logging: false,
          useCORS: true,
          allowTaint: false,
          backgroundColor: "#ffffff",
          width: elementWidth,
          height: elementHeight,
          imageTimeout: isMobile ? 15000 : 10000,
          foreignObjectRendering: false,
        }
        
        // Only add window dimensions if they're valid
        if (window.innerWidth > 0 && window.innerHeight > 0) {
          canvasOptions.windowWidth = isMobile ? 210 * 3.779527559 : Math.max(window.innerWidth, 794)
          canvasOptions.windowHeight = Math.max(window.innerHeight, 1123)
        }
        
        // Add onclone callback
        canvasOptions.onclone = (clonedDoc: Document) => {
          try {
            // Ensure cloned element is visible
            const clonedElement = clonedDoc.querySelector(`[data-pdf-element="${element.getAttribute('data-pdf-element') || 'report'}"]`) || 
                                 clonedDoc.body.querySelector('.page') ||
                                 clonedDoc.body.firstElementChild
            if (clonedElement) {
              const clonedEl = clonedElement as HTMLElement
              clonedEl.style.visibility = 'visible'
              clonedEl.style.opacity = '1'
              clonedEl.style.width = '210mm'
              clonedEl.style.minWidth = '210mm'
              clonedEl.style.maxWidth = '210mm'
              clonedEl.style.display = 'block'
              clonedEl.style.boxSizing = 'border-box'
              
              // Apply pdf-force-desktop class to cloned element
              clonedEl.classList.add('pdf-force-desktop')
              
              // Fix all grid and flex layouts in cloned document
              const clonedChildren = clonedEl.querySelectorAll('*')
              clonedChildren.forEach((child: any) => {
                if (child.style) {
                  // Use classList to determine layout type (more reliable than computed styles in clone)
                  const hasGrid = child.classList.contains('grid')
                  const hasFlex = child.classList.contains('flex')
                  
                  // Force grid layouts
                  if (hasGrid || child.style.display === 'grid') {
                    child.style.setProperty('display', 'grid', 'important')
                    // Preserve inline grid-template-columns if set
                    if (child.style.gridTemplateColumns) {
                      child.style.setProperty('grid-template-columns', child.style.gridTemplateColumns, 'important')
                    } else if (child.classList.contains('grid-cols-2')) {
                      child.style.setProperty('grid-template-columns', '1fr 1fr', 'important')
                    } else if (child.classList.contains('grid-cols-3')) {
                      child.style.setProperty('grid-template-columns', 'repeat(3, 1fr)', 'important')
                    } else if (child.classList.contains('grid-cols-1')) {
                      // Convert single column to 2 columns for better space usage
                      child.style.setProperty('grid-template-columns', '1fr 1fr', 'important')
                    }
                  }
                  
                  // Force flex to row
                  if (hasFlex || child.style.display === 'flex') {
                    child.style.setProperty('display', 'flex', 'important')
                    if (child.classList.contains('flex-col')) {
                      child.style.setProperty('flex-direction', 'row', 'important')
                    } else {
                      child.style.setProperty('flex-direction', 'row', 'important')
                    }
                  }
                  
                  child.style.setProperty('box-sizing', 'border-box', 'important')
                  child.style.setProperty('overflow', 'visible', 'important')
                  child.style.setProperty('overflow-x', 'visible', 'important')
                  child.style.setProperty('overflow-y', 'visible', 'important')
                }
              })
            }
          } catch (cloneError) {
            console.warn("onclone error (non-critical):", cloneError)
          }
        }
        
        const canvas = await html2canvas(element, canvasOptions).catch((canvasError) => {
          console.error("html2canvas error:", canvasError)
          throw new Error(`Canvas capture failed: ${canvasError instanceof Error ? canvasError.message : 'Unknown error'}`)
        })
        
        if (!canvas || canvas.width === 0 || canvas.height === 0) {
          throw new Error(`Invalid canvas dimensions: ${canvas?.width || 0}x${canvas?.height || 0}`)
        }

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
        
        // Mobile-compatible download (reuse isMobile from top of try block)
        if (isMobile && navigator.share) {
          // Use Web Share API on mobile if available
          try {
            const pdfBlob = pdf.output('blob')
            const file = new File([pdfBlob], fileName, { type: 'application/pdf' })
            await navigator.share({
              title: `Student Report - ${options.studentName}`,
              text: `${options.tier.toUpperCase()} report for ${options.studentName}`,
              files: [file]
            })
            toast({
              title: "PDF Shared Successfully",
              description: `Report PDF has been shared for ${options.studentName}.`,
            })
          } catch (shareError: any) {
            // Fallback to regular download if share is cancelled or fails
            if (shareError.name !== 'AbortError') {
              pdf.save(fileName)
              toast({
                title: "PDF Generated Successfully",
                description: `${options.tier.toUpperCase()} report PDF has been downloaded for ${options.studentName}.`,
              })
            }
          }
        } else {
          // Standard download for desktop
          pdf.save(fileName)
          toast({
            title: "PDF Generated Successfully",
            description: `${options.tier.toUpperCase()} report PDF has been downloaded for ${options.studentName}.`,
          })
        }

        return true
      } catch (error) {
        console.error("PDF generation failed:", error)
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
        toast({
          title: "PDF Generation Failed",
          description: errorMessage.length > 100 ? `${errorMessage.substring(0, 100)}...` : errorMessage,
          variant: "destructive",
        })
        return false
      } finally {
        // Ensure cleanup even on error - restore original styles
        try {
          element.classList.remove("pdf-compact-mode", "pdf-desktop-layout", "pdf-force-desktop", "hd-mode")
          
          // Restore original styles
          if (originalStyles) {
            Object.entries(originalStyles).forEach(([prop, value]) => {
              if (value) {
                element.style.setProperty(prop, value)
              } else {
                element.style.removeProperty(prop)
              }
            })
          }
          
          // Restore parent overflow styles
          let parent = element.parentElement
          while (parent && parent !== document.body) {
            parent.style.removeProperty('overflow')
            parent = parent.parentElement
          }
        } catch (e) {
          console.warn("Cleanup error (non-critical):", e)
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
