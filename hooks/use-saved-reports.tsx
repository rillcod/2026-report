"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface SavedReportsContextType {
  savedReports: any[]
  addReport: (report: any) => void
  removeReport: (index: number) => void
  deleteReport: (reportId: string) => void
  clearReports: () => void
  loadSavedReports: () => void
  isLoading: boolean
}

const SavedReportsContext = createContext<SavedReportsContextType>({
  savedReports: [],
  addReport: () => {},
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
  const loadSavedReports = () => {
    setIsLoading(true)
    try {
      const savedData = localStorage.getItem("rillcodSavedReports")
      if (savedData) {
        const reports = JSON.parse(savedData)
        setSavedReports(reports)
      }
    } catch (error) {
      console.error("Error loading saved reports:", error)
      setSavedReports([])
    } finally {
      setIsLoading(false)
    }
  }

  // Load saved reports from localStorage on component mount
  useEffect(() => {
    loadSavedReports()
  }, [])

  const addReport = (report: any) => {
    try {
      const reportWithId = {
        ...report,
        id: report.id || Date.now().toString(),
        timestamp: report.timestamp || new Date().toISOString(),
      }
      const newReports = [...savedReports, reportWithId]
      setSavedReports(newReports)
      localStorage.setItem("rillcodSavedReports", JSON.stringify(newReports))
    } catch (error) {
      console.error("Error adding report:", error)
    }
  }

  const removeReport = (index: number) => {
    try {
      const newReports = savedReports.filter((_, i) => i !== index)
      setSavedReports(newReports)
      localStorage.setItem("rillcodSavedReports", JSON.stringify(newReports))
    } catch (error) {
      console.error("Error removing report:", error)
    }
  }

  const deleteReport = (reportId: string) => {
    try {
      const newReports = savedReports.filter((report) => report.id !== reportId)
      setSavedReports(newReports)
      localStorage.setItem("rillcodSavedReports", JSON.stringify(newReports))
    } catch (error) {
      console.error("Error deleting report:", error)
    }
  }

  const clearReports = () => {
    try {
      setSavedReports([])
      localStorage.setItem("rillcodSavedReports", JSON.stringify([]))
    } catch (error) {
      console.error("Error clearing reports:", error)
    }
  }

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
