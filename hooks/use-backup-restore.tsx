"use client"

import { useState, useCallback } from "react"
import { useToast } from "@/hooks/use-toast"

interface BackupData {
  version: string
  timestamp: string
  reports: any[]
  settings: any
  templates: any[]
  analytics: any
}

export function useBackupRestore() {
  const { toast } = useToast()
  const [isProcessing, setIsProcessing] = useState(false)

  // Create full backup
  const createBackup = useCallback(async () => {
    setIsProcessing(true)

    try {
      const backupData: BackupData = {
        version: "1.0",
        timestamp: new Date().toISOString(),
        reports: JSON.parse(localStorage.getItem("rillcodSavedReports") || "[]"),
        settings: JSON.parse(localStorage.getItem("rillcodReportSettings") || "{}"),
        templates: JSON.parse(localStorage.getItem("rillcodTemplates") || "[]"),
        analytics: JSON.parse(localStorage.getItem("rillcodAnalytics") || "{}"),
      }

      const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `rillcod_backup_${new Date().toISOString().slice(0, 19).replace(/:/g, "-")}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast({
        title: "Backup Created",
        description: "Full backup has been downloaded successfully.",
      })
    } catch (error) {
      console.error("Backup failed:", error)
      toast({
        title: "Backup Failed",
        description: "Failed to create backup. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }, [toast])

  // Restore from backup
  const restoreFromBackup = useCallback(
    async (file: File) => {
      setIsProcessing(true)

      try {
        const text = await file.text()
        const backupData: BackupData = JSON.parse(text)

        // Validate backup structure
        if (!backupData.version || !backupData.timestamp) {
          throw new Error("Invalid backup file format")
        }

        // Confirm restore
        const confirmRestore = window.confirm(
          `This will restore data from ${new Date(backupData.timestamp).toLocaleString()}. ` +
            "Current data will be overwritten. Continue?",
        )

        if (!confirmRestore) {
          setIsProcessing(false)
          return
        }

        // Restore data
        if (backupData.reports) {
          localStorage.setItem("rillcodSavedReports", JSON.stringify(backupData.reports))
        }
        if (backupData.settings) {
          localStorage.setItem("rillcodReportSettings", JSON.stringify(backupData.settings))
        }
        if (backupData.templates) {
          localStorage.setItem("rillcodTemplates", JSON.stringify(backupData.templates))
        }
        if (backupData.analytics) {
          localStorage.setItem("rillcodAnalytics", JSON.stringify(backupData.analytics))
        }

        toast({
          title: "Restore Successful",
          description: "Data has been restored successfully. Please refresh the page.",
        })

        // Suggest page refresh
        setTimeout(() => {
          if (window.confirm("Would you like to refresh the page to see the restored data?")) {
            window.location.reload()
          }
        }, 2000)
      } catch (error) {
        console.error("Restore failed:", error)
        toast({
          title: "Restore Failed",
          description: `Failed to restore backup: ${error instanceof Error ? error.message : "Unknown error"}`,
          variant: "destructive",
        })
      } finally {
        setIsProcessing(false)
      }
    },
    [toast],
  )

  // Auto backup (called periodically)
  const createAutoBackup = useCallback(() => {
    try {
      const backupData: BackupData = {
        version: "1.0",
        timestamp: new Date().toISOString(),
        reports: JSON.parse(localStorage.getItem("rillcodSavedReports") || "[]"),
        settings: JSON.parse(localStorage.getItem("rillcodReportSettings") || "{}"),
        templates: JSON.parse(localStorage.getItem("rillcodTemplates") || "[]"),
        analytics: JSON.parse(localStorage.getItem("rillcodAnalytics") || "{}"),
      }

      // Store in localStorage with rotation (keep last 5 auto-backups)
      const autoBackups = JSON.parse(localStorage.getItem("rillcodAutoBackups") || "[]")
      autoBackups.push(backupData)

      // Keep only last 5 backups
      if (autoBackups.length > 5) {
        autoBackups.shift()
      }

      localStorage.setItem("rillcodAutoBackups", JSON.stringify(autoBackups))

      // Auto-backup created successfully
    } catch (error) {
      console.error("Auto-backup failed:", error)
    }
  }, [])

  // Get auto backup list
  const getAutoBackups = useCallback(() => {
    try {
      return JSON.parse(localStorage.getItem("rillcodAutoBackups") || "[]")
    } catch {
      return []
    }
  }, [])

  // Restore from auto backup
  const restoreFromAutoBackup = useCallback(
    (backupIndex: number) => {
      try {
        const autoBackups = getAutoBackups()
        if (backupIndex >= 0 && backupIndex < autoBackups.length) {
          const backupData = autoBackups[backupIndex]

          // Restore data
          if (backupData.reports) {
            localStorage.setItem("rillcodSavedReports", JSON.stringify(backupData.reports))
          }
          if (backupData.settings) {
            localStorage.setItem("rillcodReportSettings", JSON.stringify(backupData.settings))
          }
          if (backupData.templates) {
            localStorage.setItem("rillcodTemplates", JSON.stringify(backupData.templates))
          }

          toast({
            title: "Auto-backup Restored",
            description: "Data has been restored from auto-backup.",
          })

          return true
        }
      } catch (error) {
        console.error("Auto-backup restore failed:", error)
        toast({
          title: "Restore Failed",
          description: "Failed to restore from auto-backup.",
          variant: "destructive",
        })
      }
      return false
    },
    [getAutoBackups, toast],
  )

  return {
    createBackup,
    restoreFromBackup,
    createAutoBackup,
    getAutoBackups,
    restoreFromAutoBackup,
    isProcessing,
  }
}
