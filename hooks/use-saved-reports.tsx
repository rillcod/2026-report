"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"

interface SavedReportsContextType {
  savedReports: any[]
  addReport: (report: any) => Promise<void>
  removeReport: (index: number) => void
  deleteReport: (reportId: string) => void
  clearReports: () => void
  loadSavedReports: () => void
  isLoading: boolean
}

const SavedReportsContext = createContext<SavedReportsContextType>({
  savedReports: [],
  addReport: async () => {},
  removeReport: () => {},
  deleteReport: () => {},
  clearReports: () => {},
  loadSavedReports: () => {},
  isLoading: false,
})

export function SavedReportsProvider({ children }: { children: ReactNode }) {
  const [savedReports, setSavedReports] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Load saved reports from localStorage
  const loadSavedReports = useCallback(() => {
    setIsLoading(true)
    try {
      const savedData = localStorage.getItem("rillcodSavedReports")
      console.log("Loading saved reports from localStorage:", savedData)
      if (savedData) {
        const reports = JSON.parse(savedData)
        console.log("Parsed saved reports:", reports)
        setSavedReports(reports)
      } else {
        console.log("No saved reports found in localStorage")
        setSavedReports([])
      }
    } catch (error) {
      console.error("Error loading saved reports:", error)
      setSavedReports([])
    } finally {
      setIsLoading(false)
    }
  }, []) // Empty dependency array since it only uses localStorage and setState

  // Load saved reports from localStorage on component mount
  useEffect(() => {
    loadSavedReports()
  }, [])

  const addReport = useCallback(async (report: any) => {
    try {
      console.log("Adding new report:", report)
      const reportWithId = {
        ...report,
        id: report.id || Date.now().toString(),
        timestamp: report.timestamp || new Date().toISOString(),
      }
      
      console.log("Report with ID:", reportWithId)
      
      // Keep full data in memory
      setSavedReports(prevReports => {
        const newReports = [...prevReports, reportWithId]
        console.log("New reports array:", newReports)
        
        // For localStorage, compress the screenshot if it's too large
        const reportToStore = { ...reportWithId }
        if (reportToStore.screenshotUrl && reportToStore.screenshotUrl.length > 100000) {
          // If screenshot is very large, store a reference instead
          reportToStore.screenshotThumbnail = reportToStore.screenshotUrl.substring(0, 50000)
          // Keep the original URL for display
        }
        
        try {
          localStorage.setItem("rillcodSavedReports", JSON.stringify(newReports))
          console.log("Successfully saved to localStorage")
        } catch (storageError) {
          console.warn("localStorage quota exceeded, trying with compressed data:", storageError)
          try {
            // Try storing without full screenshots
            const compressedReports = newReports.map(r => ({
              ...r,
              screenshotUrl: r.screenshotUrl?.substring(0, 10000) || r.screenshotThumbnail || "/images/report-default.png"
            }))
            localStorage.setItem("rillcodSavedReports", JSON.stringify(compressedReports))
            console.log("Successfully saved compressed data to localStorage")
          } catch (finalError) {
            console.warn("Could not save to localStorage, reports saved in memory only")
            // Don't throw error here, just log it
          }
        }
        
        return newReports
      })
      
      console.log("Report added successfully")
    } catch (error) {
      console.error("Error adding report:", error)
      throw error
    }
  }, []) // Empty dependency array since it uses setState with function updater

  const removeReport = useCallback((index: number) => {
    try {
      setSavedReports(prevReports => {
        const newReports = prevReports.filter((_, i) => i !== index)
        localStorage.setItem("rillcodSavedReports", JSON.stringify(newReports))
        return newReports
      })
    } catch (error) {
      console.error("Error removing report:", error)
    }
  }, [])

  const deleteReport = useCallback((reportId: string) => {
    try {
      setSavedReports(prevReports => {
        const newReports = prevReports.filter((report) => report.id !== reportId)
        localStorage.setItem("rillcodSavedReports", JSON.stringify(newReports))
        return newReports
      })
    } catch (error) {
      console.error("Error deleting report:", error)
    }
  }, [])

  const clearReports = useCallback(() => {
    try {
      setSavedReports([])
      localStorage.setItem("rillcodSavedReports", JSON.stringify([]))
    } catch (error) {
      console.error("Error clearing reports:", error)
    }
  }, [])

  return (
    <SavedReportsContext.Provider 
      value={{ 
        savedReports, 
        addReport, 
        removeReport, 
        deleteReport,
        clearReports, 
        loadSavedReports,
        isLoading 
      }}
    >
      {children}
    </SavedReportsContext.Provider>
  )
}

export function useSavedReports() {
  return useContext(SavedReportsContext)
}
