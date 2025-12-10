"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ReportContent } from "@/components/report-content"
import { useSavedReports } from "@/hooks/use-saved-reports"
import { useToast } from "@/hooks/use-toast"
import {
  GalleryThumbnailsIcon as Gallery,
  Search,
  Filter,
  Eye,
  Download,
  FileText,
  BarChart3,
  Crown,
  Calendar,
  User,
  SortAsc,
  SortDesc,
  Trash2,
  RefreshCw,
  ArrowLeft,
} from "lucide-react"

interface GeneratedReport {
  id: string
  screenshotUrl: string
  studentName?: string
  tier?: string
  reportData?: any
  timestamp: Date
  additionalData?: any
}

// Optimized tier utility functions (moved outside component to prevent re-creation)
const getTierIcon = (tier: string) => {
  switch (tier) {
    case "minimal":
      return <FileText className="h-4 w-4" />
    case "standard":
      return <BarChart3 className="h-4 w-4" />
    case "hd":
      return <Crown className="h-4 w-4 text-yellow-600" />
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

interface UnifiedReportGalleryProps {
  reports: GeneratedReport[]
  onViewReport: (report: GeneratedReport) => void
  onDeleteReport?: (reportId: string) => void
}

export function UnifiedReportGallery({ reports, onViewReport, onDeleteReport }: UnifiedReportGalleryProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterTier, setFilterTier] = useState<string>("all")
  const [sortBy, setSortBy] = useState<"date" | "name" | "tier">("date")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [viewingReport, setViewingReport] = useState<GeneratedReport | null>(null)
  const { savedReports, loadSavedReports, deleteReport, addReport, isLoading } = useSavedReports()
  const { toast } = useToast()

  // Load saved reports on component mount
  useEffect(() => {
    console.log("Gallery - Loading saved reports, current count:", savedReports.length)
    if (savedReports.length === 0) {
      loadSavedReports()
    }
  }, [savedReports.length]) // Remove loadSavedReports from dependencies to prevent infinite loop

  // Combine props reports with saved reports (memoized)
  const allReports = useMemo(() => [
    ...reports,
    ...savedReports.map((report) => ({
      id: report.id,
      screenshotUrl: report.screenshotUrl || report.screenshotThumbnail || "/images/report-default.png",
      studentName: report.studentName,
      tier: report.tier || "standard",
      reportData: report.reportData,
      timestamp: new Date(report.timestamp),
      additionalData: report.additionalData,
    })),
  ], [reports, savedReports])

  // Debug logging (moved after allReports definition)
  useEffect(() => {
    console.log("Gallery - Props reports:", reports)
    console.log("Gallery - Saved reports from hook:", savedReports)
    console.log("Gallery - All reports combined:", allReports)
  }, [reports, savedReports]) // Remove allReports from dependencies to prevent infinite loop

  // Filter and sort reports (memoized for performance)
  const filteredAndSortedReports = useMemo(() => {
    return allReports
      .filter((report) => {
        const matchesSearch = report.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) || false
        const matchesTier = filterTier === "all" || report.tier === filterTier
        return matchesSearch && matchesTier
      })
      .sort((a, b) => {
        let comparison = 0
        switch (sortBy) {
          case "date":
            comparison = a.timestamp.getTime() - b.timestamp.getTime()
            break
          case "name":
            comparison = (a.studentName || "").localeCompare(b.studentName || "")
            break
          case "tier":
            comparison = (a.tier || "").localeCompare(b.tier || "")
            break
        }
        return sortOrder === "asc" ? comparison : -comparison
      })
  }, [allReports, searchTerm, filterTier, sortBy, sortOrder])

  // Statistics calculation (memoized)
  const statistics = useMemo(() => ({
    total: allReports.length,
    minimal: allReports.filter((r) => r.tier === "minimal").length,
    standard: allReports.filter((r) => r.tier === "standard").length,
    hd: allReports.filter((r) => r.tier === "hd").length,
  }), [allReports])

  const handleDownload = useCallback(async (report: GeneratedReport) => {
    try {
      setIsDownloading(true)
      let url: string
      let shouldRevoke = false

      // If it's a data URL, convert to blob
      if (report.screenshotUrl.startsWith("data:")) {
        const response = await fetch(report.screenshotUrl)
        const blob = await response.blob()
        url = URL.createObjectURL(blob)
        shouldRevoke = true
      } else {
        // Regular URL download
        url = report.screenshotUrl
      }

      const link = document.createElement("a")
      link.href = url
      link.download = `${report.studentName || "Student"}_Report_${report.timestamp.toISOString().split("T")[0]}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      // Clean up object URL to prevent memory leaks
      if (shouldRevoke) {
        URL.revokeObjectURL(url)
      }

      toast({
        title: "Download Started",
        description: "Report image download has started.",
      })
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Failed to download the report image.",
        variant: "destructive",
      })
    } finally {
      setIsDownloading(false)
    }
  }, [toast])

  const handleDelete = useCallback(async (reportId: string) => {
    try {
      deleteReport(reportId)
      if (onDeleteReport) {
        onDeleteReport(reportId)
      }
      toast({
        title: "Report Deleted",
        description: "Report has been successfully deleted.",
      })
    } catch (error) {
      toast({
        title: "Delete Failed",
        description: "Failed to delete the report.",
        variant: "destructive",
      })
    }
  }, [deleteReport, onDeleteReport, toast])

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true)
    try {
      loadSavedReports()
      toast({
        title: "Gallery Refreshed",
        description: "Report gallery has been refreshed successfully.",
      })
    } catch (error) {
      toast({
        title: "Refresh Failed",
        description: "Failed to refresh the gallery. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsRefreshing(false)
    }
  }, [loadSavedReports, toast])

  const handleAddTestReport = useCallback(async () => {
    try {
      await addReport({
        studentName: "Test Student " + Date.now(),
        tier: "standard",
        screenshotUrl: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==",
        reportData: { test: true }
      })
      toast({
        title: "Test Report Added",
        description: "A test report has been added to the gallery."
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add test report.",
        variant: "destructive"
      })
    }
  }, [addReport, toast])

  const handleViewReport = useCallback((report: GeneratedReport) => {
    // Use the prop callback if provided, otherwise use internal viewing
    if (onViewReport) {
      onViewReport(report)
    } else {
      setViewingReport(report)
    }
  }, [onViewReport])

  const handleBackToGallery = useCallback(() => {
    setViewingReport(null)
  }, [])

  // If viewing a report, show the standard ReportContent
  if (viewingReport) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header Controls */}
        <Card className="mb-6 shadow-lg border-blue-100">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button variant="outline" onClick={handleBackToGallery} className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Gallery
                </Button>
                <div>
                  <CardTitle className="text-xl text-blue-900 flex items-center gap-2">
                    Report View - {viewingReport.studentName}
                  </CardTitle>
                  <p className="text-blue-700 text-sm">
                    Generated on {viewingReport.timestamp.toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Standard Report Content */}
        <div className="flex justify-center">
          <div className="bg-white shadow-2xl rounded-lg overflow-hidden max-w-4xl w-full">
            <ReportContent 
              formData={viewingReport.reportData || {}}
              settings={{}}
              printMode={false}
              minimalView={viewingReport.tier === "minimal"}
              tier={viewingReport.tier as "minimal" | "standard" | "hd" || "standard"}
            />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Gallery Header */}
      <Card className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border-blue-200 shadow-lg">
        <CardHeader>
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl shadow-lg">
                <Gallery className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl text-blue-900">Report Gallery</CardTitle>
                <p className="text-blue-700 text-sm">View, manage, and download generated reports</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                {statistics.total} Total Reports
              </Badge>
              <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing || isLoading}>
                <RefreshCw className={`h-4 w-4 mr-1 ${(isRefreshing || isLoading) ? "animate-spin" : ""}`} />
                {isRefreshing ? "Refreshing..." : "Refresh"}
              </Button>
              <Button variant="outline" size="sm" onClick={handleAddTestReport}>
                Add Test Report
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Filters and Search */}
      <Card className="border-blue-100 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-900">
            <Filter className="h-5 w-5" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-blue-900">Search Students</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by student name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-blue-200 focus:border-blue-400"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-blue-900">Filter by Tier</label>
              <Select value={filterTier} onValueChange={setFilterTier}>
                <SelectTrigger className="border-blue-200 focus:border-blue-400">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tiers</SelectItem>
                  <SelectItem value="minimal">Minimal</SelectItem>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="hd">HD Premium</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-blue-900">Sort By</label>
              <Select value={sortBy} onValueChange={(value: "date" | "name" | "tier") => setSortBy(value)}>
                <SelectTrigger className="border-blue-200 focus:border-blue-400">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Date Created</SelectItem>
                  <SelectItem value="name">Student Name</SelectItem>
                  <SelectItem value="tier">Report Tier</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-blue-900">Sort Order</label>
              <Button
                variant="outline"
                onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                className="w-full justify-start border-blue-200 hover:bg-blue-50"
              >
                {sortOrder === "asc" ? (
                  <>
                    <SortAsc className="h-4 w-4 mr-2" />
                    Ascending
                  </>
                ) : (
                  <>
                    <SortDesc className="h-4 w-4 mr-2" />
                    Descending
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reports Grid */}
      {filteredAndSortedReports.length === 0 ? (
        <Card className="border-blue-100">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Gallery className="h-16 w-16 text-blue-300 mb-4" />
            <h3 className="text-lg font-medium text-blue-900 mb-2">No Reports Found</h3>
            <p className="text-blue-600 text-center max-w-md">
              {allReports.length === 0
                ? "No reports have been generated yet. Create your first report using the Single Report or Batch Reports tabs."
                : "No reports match your current filters. Try adjusting your search criteria."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAndSortedReports.map((report) => (
            <Card
              key={report.id}
              className="group hover:shadow-xl transition-all duration-300 border-blue-100 hover:border-blue-300"
            >
              <CardContent className="p-0">
                {/* Report Preview */}
                <div className="aspect-[3/4] bg-gradient-to-br from-blue-50 to-indigo-50 rounded-t-lg overflow-hidden relative">
                  <img
                    src={report.screenshotUrl || "/images/report-default.png"}
                    alt={`Report for ${report.studentName}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      const target = e.currentTarget as HTMLImageElement
                      target.src = "/images/report-default.png"
                    }}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                  <div className="absolute top-3 right-3">
                    <Badge className={`${getTierColor(report.tier || "standard")} border shadow-sm`}>
                      {getTierIcon(report.tier || "standard")}
                      <span className="ml-1 capitalize">{report.tier}</span>
                    </Badge>
                  </div>
                </div>

                {/* Report Info */}
                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="font-medium text-blue-900 flex items-center gap-2">
                      <User className="h-4 w-4 text-blue-500" />
                      {report.studentName || "Unknown Student"}
                    </h3>
                    <p className="text-sm text-blue-600 flex items-center gap-2 mt-1">
                      <Calendar className="h-3 w-3" />
                      {report.timestamp.toLocaleDateString()} at {report.timestamp.toLocaleTimeString()}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewReport(report)}
                      className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200"
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownload(report)}
                      disabled={isDownloading}
                      className="flex-1 bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
                    >
                      <Download className="h-3 w-3 mr-1" />
                      {isDownloading ? "Downloading..." : "Download"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(report.id)}
                      className="bg-red-50 hover:bg-red-100 text-red-700 border-red-200"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Gallery Stats */}
      {statistics.total > 0 && (
        <Card className="border-blue-100 shadow-md">
          <CardHeader>
            <CardTitle className="text-lg text-blue-900">Gallery Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-100">
                <div className="text-2xl font-bold text-blue-900">{statistics.total}</div>
                <div className="text-sm text-blue-600">Total Reports</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-100">
                <div className="text-2xl font-bold text-gray-900">{statistics.minimal}</div>
                <div className="text-sm text-gray-600">Minimal Reports</div>
              </div>
              <div className="text-center p-4 bg-indigo-50 rounded-lg border border-indigo-100">
                <div className="text-2xl font-bold text-indigo-900">{statistics.standard}</div>
                <div className="text-sm text-indigo-600">Standard Reports</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-100">
                <div className="text-2xl font-bold text-yellow-900">{statistics.hd}</div>
                <div className="text-sm text-yellow-600">HD Premium</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
