"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useBackupRestore } from "@/hooks/use-backup-restore"
import { useAnalytics } from "@/hooks/use-analytics"
import { Database, HardDrive, Activity, Clock, AlertTriangle, CheckCircle, RefreshCw, Download } from "lucide-react"

export function SystemStatus() {
  const { createBackup, createAutoBackup, getAutoBackups, isProcessing } = useBackupRestore()
  const { getAnalyticsSummary } = useAnalytics()
  const [systemInfo, setSystemInfo] = useState({
    storageUsed: 0,
    storageLimit: 5 * 1024 * 1024, // 5MB limit for localStorage
    lastBackup: null as Date | null,
    autoBackupsCount: 0,
    performanceScore: 100,
    errors: [] as string[],
  })

  useEffect(() => {
    updateSystemInfo()
    const interval = setInterval(updateSystemInfo, 30000) // Update every 30 seconds
    return () => clearInterval(interval)
  }, [])

  const updateSystemInfo = () => {
    try {
      // Calculate storage usage
      let storageUsed = 0
      for (const key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          storageUsed += localStorage[key].length + key.length
        }
      }

      // Get auto backups
      const autoBackups = getAutoBackups()
      const lastBackup = autoBackups.length > 0 ? new Date(autoBackups[autoBackups.length - 1].timestamp) : null

      // Check for errors
      const errors: string[] = []
      if (storageUsed > systemInfo.storageLimit * 0.8) {
        errors.push("Storage usage is above 80%")
      }
      if (lastBackup && Date.now() - lastBackup.getTime() > 7 * 24 * 60 * 60 * 1000) {
        errors.push("No backup created in the last 7 days")
      }

      // Calculate performance score
      let performanceScore = 100
      if (storageUsed > systemInfo.storageLimit * 0.5) performanceScore -= 20
      if (errors.length > 0) performanceScore -= errors.length * 10
      if (autoBackups.length === 0) performanceScore -= 15

      setSystemInfo({
        storageUsed,
        storageLimit: systemInfo.storageLimit,
        lastBackup,
        autoBackupsCount: autoBackups.length,
        performanceScore: Math.max(0, performanceScore),
        errors,
      })
    } catch (error) {
      console.error("Failed to update system info:", error)
    }
  }

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const getStatusColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getStatusIcon = (score: number) => {
    if (score >= 80) return <CheckCircle className="h-5 w-5 text-green-500" />
    if (score >= 60) return <AlertTriangle className="h-5 w-5 text-yellow-500" />
    return <AlertTriangle className="h-5 w-5 text-red-500" />
  }

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold flex items-center">
            <Activity className="h-5 w-5 mr-2" />
            System Status
          </h3>
          <div className="flex items-center gap-2">
            {getStatusIcon(systemInfo.performanceScore)}
            <span className={`font-medium ${getStatusColor(systemInfo.performanceScore)}`}>
              {systemInfo.performanceScore}%
            </span>
          </div>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center">
              <HardDrive className="h-8 w-8 text-blue-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Storage Used</p>
                <p className="text-lg font-bold">{formatBytes(systemInfo.storageUsed)}</p>
                <p className="text-xs text-gray-500">of {formatBytes(systemInfo.storageLimit)}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center">
              <Database className="h-8 w-8 text-green-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Auto Backups</p>
                <p className="text-lg font-bold">{systemInfo.autoBackupsCount}</p>
                <p className="text-xs text-gray-500">Available</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-purple-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Last Backup</p>
                <p className="text-lg font-bold">
                  {systemInfo.lastBackup ? systemInfo.lastBackup.toLocaleDateString() : "Never"}
                </p>
                <p className="text-xs text-gray-500">
                  {systemInfo.lastBackup ? systemInfo.lastBackup.toLocaleTimeString() : "No backups"}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center">
              <Activity className="h-8 w-8 text-orange-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Performance</p>
                <p className={`text-lg font-bold ${getStatusColor(systemInfo.performanceScore)}`}>
                  {systemInfo.performanceScore}%
                </p>
                <p className="text-xs text-gray-500">System Health</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Storage Usage Bar */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Storage Usage</span>
            <span className="text-sm text-gray-500">
              {((systemInfo.storageUsed / systemInfo.storageLimit) * 100).toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                systemInfo.storageUsed / systemInfo.storageLimit > 0.8
                  ? "bg-red-500"
                  : systemInfo.storageUsed / systemInfo.storageLimit > 0.6
                    ? "bg-yellow-500"
                    : "bg-green-500"
              }`}
              style={{ width: `${Math.min((systemInfo.storageUsed / systemInfo.storageLimit) * 100, 100)}%` }}
            />
          </div>
        </div>

        {/* Errors and Warnings */}
        {systemInfo.errors.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium text-red-600 flex items-center">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Issues Detected
            </h4>
            {systemInfo.errors.map((error, index) => (
              <Badge key={index} variant="destructive" className="mr-2">
                {error}
              </Badge>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap gap-2">
          <Button onClick={createBackup} disabled={isProcessing} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Create Backup
          </Button>

          <Button onClick={createAutoBackup} disabled={isProcessing} variant="outline" size="sm">
            <Database className="h-4 w-4 mr-2" />
            Auto Backup
          </Button>

          <Button onClick={updateSystemInfo} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Status
          </Button>

          <Button
            onClick={() => {
              // Clear cache and refresh
              if (window.confirm("This will clear all cached data and refresh the page. Continue?")) {
                localStorage.removeItem("rillcodCache")
                window.location.reload()
              }
            }}
            variant="outline"
            size="sm"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Clear Cache
          </Button>
        </div>

        {/* Analytics Summary */}
        <div className="border-t pt-4">
          <h4 className="font-medium mb-2">Quick Analytics</h4>
          <div className="text-sm text-gray-600 space-y-1">
            {(() => {
              const analytics = getAnalyticsSummary()
              return (
                <>
                  <p>Total Reports: {analytics.totalReports}</p>
                  <p>Average Grade: {analytics.averageGrade.toFixed(1)}</p>
                  <p>Recent Activity: {analytics.recentActivity.length} events</p>
                </>
              )
            })()}
          </div>
        </div>
      </div>
    </Card>
  )
}
