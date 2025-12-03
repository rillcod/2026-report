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
        
        // Find the actual .page element if element is a wrapper
        let targetElement = element
        const pageElement = element.querySelector('.page[data-pdf-element="report"]') || 
                           element.querySelector('.page') ||
                           element.querySelector('[data-pdf-element="report"]')
        if (pageElement) {
          targetElement = pageElement as HTMLElement
        }
        
        // Mobile compatibility: Scroll element into view and ensure visibility
        targetElement.scrollIntoView({ behavior: 'instant', block: 'start', inline: 'nearest' })
        
        // Wait for element to be in view and for any animations to complete
        await new Promise(resolve => setTimeout(resolve, isMobile ? 200 : 150))
        
        // Store original styles for restoration (use targetElement)
        originalStyles = {
          position: targetElement.style.position,
          top: targetElement.style.top,
          left: targetElement.style.left,
          zIndex: targetElement.style.zIndex,
          visibility: targetElement.style.visibility,
          opacity: targetElement.style.opacity,
          transform: targetElement.style.transform,
          width: targetElement.style.width,
          minWidth: targetElement.style.minWidth,
          maxWidth: targetElement.style.maxWidth,
          height: targetElement.style.height,
          minHeight: targetElement.style.minHeight,
          maxHeight: targetElement.style.maxHeight,
        }
        
        // Force element to be visible and properly positioned for capture
        targetElement.style.position = 'relative'
        targetElement.style.visibility = 'visible'
        targetElement.style.opacity = '1'
        targetElement.style.zIndex = '9999'
        targetElement.style.transform = 'none'
        targetElement.style.scale = '1'
        targetElement.style.zoom = '1'
        
        // Remove any parent transforms that might affect capture
        let parent = targetElement.parentElement
        while (parent && parent !== document.body) {
          const parentStyle = window.getComputedStyle(parent)
          if (parentStyle.transform && parentStyle.transform !== 'none') {
            // Save original transform for restoration
            ;(parent as any).__pdfOriginalTransform = (parent as HTMLElement).style.transform || ''
            ;(parent as HTMLElement).style.setProperty('transform', 'none', 'important')
            ;(parent as HTMLElement).style.setProperty('scale', '1', 'important')
          }
          // Also remove any overflow hidden that might clip content
          if (parentStyle.overflow === 'hidden' || parentStyle.overflowY === 'hidden') {
            ;(parent as any).__pdfOriginalOverflow = (parent as HTMLElement).style.overflow || ''
            ;(parent as HTMLElement).style.setProperty('overflow', 'visible', 'important')
          }
          parent = parent.parentElement
        }
        
        // Force desktop layout for consistent PDF output regardless of device
        const originalClasses = targetElement.className
        targetElement.classList.add("pdf-compact-mode", "pdf-desktop-layout", "pdf-force-desktop")
        if (options.tier === "hd") {
          targetElement.classList.add("hd-mode")
        }
        
        // Ensure fixed A4 dimensions and prevent responsive stacking
        targetElement.style.width = "210mm"
        targetElement.style.minWidth = "210mm"
        targetElement.style.maxWidth = "210mm"
        targetElement.style.height = "auto"
        targetElement.style.minHeight = "auto"
        targetElement.style.maxHeight = "none"
        
        // Force desktop layout - prevent mobile stacking
        // Apply comprehensive layout fixes to all elements
        const allChildren = targetElement.querySelectorAll('*')
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
            
            // Force flex containers to row direction (except certificate section)
            if (display === 'flex' || child.classList.contains('flex')) {
              // Check if this is the certificate section flex container
              const isCertificateFlex = child.getAttribute('data-certificate-layout') === 'true' ||
                                       (child.closest('.certificate-container') && 
                                        (child.classList.contains('justify-between') || 
                                         child.classList.contains('items-end')))
              
              child.style.setProperty('display', 'flex', 'important')
              if (isCertificateFlex) {
                // Preserve certificate layout: justify-between and items-end
                child.style.setProperty('justify-content', 'space-between', 'important')
                child.style.setProperty('align-items', 'flex-end', 'important')
                child.style.setProperty('flex-direction', 'row', 'important')
                child.style.setProperty('flex-wrap', 'nowrap', 'important')
              } else if (child.classList.contains('flex-col')) {
                // Only force row if not in certificate section
                if (!child.closest('.certificate-container')) {
                  child.style.setProperty('flex-direction', 'row', 'important')
                } else {
                  // Preserve flex-col in certificate section
                  child.style.setProperty('flex-direction', 'column', 'important')
                  child.style.setProperty('flex-shrink', '0', 'important')
                }
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
        
        // Longer delay on mobile to ensure rendering is complete
        await new Promise(resolve => setTimeout(resolve, isMobile ? 400 : 200))
        
        // Step 1: Capture element as canvas (25% progress)
        setGenerationProgress(25)
        
        // Validate element dimensions before capture
        const elementWidth = targetElement.scrollWidth || targetElement.offsetWidth || 794 // 210mm in px
        // Force max height to 297mm (A4 page height) to ensure single page
        const maxPageHeight = 297 * 3.779527559 // 297mm in pixels at 96 DPI
        let elementHeight = targetElement.scrollHeight || targetElement.offsetHeight || 1123
        // Cap height at A4 page height
        if (elementHeight > maxPageHeight) {
          elementHeight = maxPageHeight
          // Apply max height constraint to element
          targetElement.style.maxHeight = '297mm'
          targetElement.style.overflowY = 'hidden'
        }
        
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
          removeContainer: false,
          // Ensure we capture the exact element without transforms
          x: 0,
          y: 0,
          scrollX: 0,
          scrollY: 0,
        }
        
        // Only add window dimensions if they're valid - use fixed A4 dimensions
        const fixedWidth = 210 * 3.779527559 // 210mm in pixels at 96 DPI
        const fixedHeight = 297 * 3.779527559 // 297mm in pixels at 96 DPI
        canvasOptions.windowWidth = fixedWidth
        canvasOptions.windowHeight = Math.max(elementHeight, fixedHeight)
        
        // Add onclone callback
        canvasOptions.onclone = (clonedDoc: Document) => {
          try {
            // Ensure cloned element is visible
            const clonedElement = clonedDoc.querySelector(`[data-pdf-element="${targetElement.getAttribute('data-pdf-element') || 'report'}"]`) || 
                                 clonedDoc.body.querySelector('.page') ||
                                 clonedDoc.body.firstElementChild
            if (clonedElement) {
              const clonedEl = clonedElement as HTMLElement
              clonedEl.style.visibility = 'visible'
              clonedEl.style.opacity = '1'
              clonedEl.style.width = '210mm'
              clonedEl.style.minWidth = '210mm'
              clonedEl.style.maxWidth = '210mm'
              clonedEl.style.maxHeight = '297mm'
              clonedEl.style.overflowY = 'hidden'
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
                  
                  // Force flex to row (except certificate section which needs specific layout)
                  if (hasFlex || child.style.display === 'flex') {
                    // Check if this is the certificate section flex container
                    const isCertificateFlex = child.getAttribute('data-certificate-layout') === 'true' ||
                                             (child.closest('.certificate-container') && 
                                              (child.classList.contains('justify-between') || 
                                               child.style.justifyContent === 'space-between' ||
                                               child.classList.contains('items-end')))
                    
                    child.style.setProperty('display', 'flex', 'important')
                    if (isCertificateFlex) {
                      // Preserve certificate layout: justify-between and items-end
                      child.style.setProperty('justify-content', 'space-between', 'important')
                      child.style.setProperty('align-items', 'flex-end', 'important')
                      child.style.setProperty('flex-direction', 'row', 'important')
                      child.style.setProperty('flex-wrap', 'nowrap', 'important')
                    } else if (child.classList.contains('flex-col')) {
                      // Only force row if not in certificate section
                      if (!child.closest('.certificate-container')) {
                        child.style.setProperty('flex-direction', 'row', 'important')
                      }
                    } else {
                      child.style.setProperty('flex-direction', 'row', 'important')
                    }
                  }
                  
                  // Preserve certificate section child flex-col elements
                  if (child.classList.contains('flex-col') && child.closest('.certificate-container')) {
                    child.style.setProperty('display', 'flex', 'important')
                    child.style.setProperty('flex-direction', 'column', 'important')
                    child.style.setProperty('flex-shrink', '0', 'important')
                  }
                  
                  // Preserve payment section margins for proper centering
                  if (child.getAttribute('data-payment-section') === 'true' || 
                      (child.classList.contains('flex-1') && child.closest('.certificate-container') && child.textContent?.includes('PAYMENT'))) {
                    // Preserve or apply margins for payment section
                    const marginLeft = child.style.marginLeft || '12px'
                    const marginRight = child.style.marginRight || '12px'
                    child.style.setProperty('margin-left', marginLeft, 'important')
                    child.style.setProperty('margin-right', marginRight, 'important')
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
        
        const canvas = await html2canvas(targetElement, canvasOptions).catch((canvasError) => {
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

        // Force single page - scale down if content exceeds page height
        if (imgHeight > usableHeight) {
          // Scale down to fit on one page
          const scale = usableHeight / imgHeight
          imgHeight = usableHeight
          imgWidth = imgWidth * scale
        }

        // If content is still taller than one page (shouldn't happen now), split across multiple pages
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
          // Find target element again for cleanup
          let targetElement = element
          const pageElement = element.querySelector('.page[data-pdf-element="report"]') || 
                             element.querySelector('.page') ||
                             element.querySelector('[data-pdf-element="report"]')
          if (pageElement) {
            targetElement = pageElement as HTMLElement
          }
          
          targetElement.classList.remove("pdf-compact-mode", "pdf-desktop-layout", "pdf-force-desktop", "hd-mode")
          
          // Restore original styles
          if (originalStyles) {
            Object.entries(originalStyles).forEach(([prop, value]) => {
              if (value) {
                targetElement.style.setProperty(prop, value)
              } else {
                targetElement.style.removeProperty(prop)
              }
            })
          }
          
          // Restore parent overflow and transform styles
          let parent = targetElement.parentElement
          while (parent && parent !== document.body) {
            // Restore overflow
            const savedOverflow = (parent as any).__pdfOriginalOverflow
            if (savedOverflow !== undefined) {
              if (savedOverflow) {
                (parent as HTMLElement).style.overflow = savedOverflow
              } else {
                (parent as HTMLElement).style.removeProperty('overflow')
              }
              delete (parent as any).__pdfOriginalOverflow
            }
            
            // Restore parent transforms if they were saved
            const savedTransform = (parent as any).__pdfOriginalTransform
            if (savedTransform !== undefined) {
              if (savedTransform) {
                (parent as HTMLElement).style.transform = savedTransform
              } else {
                (parent as HTMLElement).style.removeProperty('transform')
              }
              delete (parent as any).__pdfOriginalTransform
            }
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
