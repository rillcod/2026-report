"use client"

import { useState, useCallback, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { UnifiedSingleReport } from "@/components/unified-single-report"
import { UnifiedBatchReport } from "@/components/unified-batch-report"
import { UnifiedReportGallery } from "@/components/unified-report-gallery"
import { UnifiedAIAssistant } from "@/components/unified-ai-assistant"
import { UnifiedSettings } from "@/components/unified-settings"
import { UnifiedReportCanvas } from "@/components/unified-report-canvas"
import { AdvancedFeaturesProvider } from "@/hooks/use-advanced-features"
import { useSavedReports } from "@/hooks/use-saved-reports"
import { useToast } from "@/hooks/use-toast"
import { useSettings } from "@/hooks/use-settings"
import { useIsMobile } from "@/hooks/use-mobile"
import {
  User,
  Users,
  GalleryThumbnailsIcon as Gallery,
  Bot,
  Settings,
  Zap,
  GraduationCap,
  Sparkles,
  Crown,
  BarChart3,
  FileText,
  Eye,
  ArrowLeft,
  CheckCircle,
  TrendingUp,
  BookOpen as BookOpenIcon,
  Award,
  Clock,
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

export default function HomePage() {
  const { toast } = useToast()
  const { settings } = useSettings()
  const isMobile = useIsMobile()
  const [activeTab, setActiveTab] = useState("single")
  const [generatedReports, setGeneratedReports] = useState<GeneratedReport[]>([])
  const [selectedReport, setSelectedReport] = useState<GeneratedReport | null>(null)
  const [showCanvas, setShowCanvas] = useState(false)
  const [systemStats, setSystemStats] = useState({
    totalReports: 0,
    studentsAssessed: 0,
    coursesOffered: 8,
    completionRate: 0
  })
  const { savedReports } = useSavedReports()

  // Update system statistics based on generated reports
  useEffect(() => {
    const uniqueStudents = new Set(generatedReports.map(r => r.studentName)).size
    const completed = generatedReports.filter(r => r.additionalData?.reportStatus === 'completed').length
    const completionRate = generatedReports.length > 0 ? Math.round((completed / generatedReports.length) * 100) : 0
    
    setSystemStats({
      totalReports: generatedReports.length,
      studentsAssessed: uniqueStudents,
      coursesOffered: 8,
      completionRate
    })
  }, [generatedReports])

  const handleReportGenerated = useCallback(
    (reportId: string, screenshotUrl: string, additionalData?: any) => {
      const newReport: GeneratedReport = {
        id: reportId,
        screenshotUrl,
        studentName: additionalData?.studentName || "Unknown Student",
        tier: additionalData?.tier || "standard",
        reportData: additionalData?.reportData,
        timestamp: new Date(),
        additionalData,
      }

      setGeneratedReports((prev) => [newReport, ...prev])

      toast({
        title: "Report Generated",
        description: `Report for ${newReport.studentName} has been created successfully.`,
      })
    },
    [toast],
  )

  const handleViewReport = (report: GeneratedReport) => {
    setSelectedReport(report)
    setShowCanvas(true)
  }

  const handleBackToSystem = () => {
    setShowCanvas(false)
    setSelectedReport(null)
  }

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

  const tabConfig = [
    {
      id: "single",
      label: "Single Report",
      icon: User,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      description: "Individual reports",
      status: "stable",
    },
    {
      id: "batch",
      label: "Batch Reports",
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      description: "Multiple students",
      status: "stable",
    },
    {
      id: "gallery",
      label: "Gallery",
      icon: Gallery,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      description: "Saved reports",
      status: "stable",
    },
    {
      id: "ai-assistant",
      label: "AI Assistant",
      icon: Bot,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
      borderColor: "border-indigo-200",
      description: "AI templates",
      status: "stable",
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      color: "text-gray-600",
      bgColor: "bg-gray-50",
      borderColor: "border-gray-200",
      description: "Preferences",
      status: "stable",
    },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "stable":
        return <Badge className="bg-green-100 text-green-800 border-green-300 text-xs">Stable</Badge>
      case "beta":
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300 text-xs">Beta</Badge>
      case "experimental":
        return <Badge className="bg-orange-100 text-orange-800 border-orange-300 text-xs">Experimental</Badge>
      default:
        return null
    }
  }

  const dashboardStats = [
    { 
      label: "Total Reports Generated", 
      value: systemStats.totalReports.toString(), 
      icon: FileText, 
      color: "text-blue-500",
      bgColor: "bg-blue-50",
      description: "Successfully generated student reports"
    },
    { 
      label: "Students Assessed", 
      value: systemStats.studentsAssessed.toString(), 
      icon: User, 
      color: "text-green-500",
      bgColor: "bg-green-50",
      description: "Unique students with progress tracking"
    },
    { 
      label: "Course Completion Rate", 
      value: `${systemStats.completionRate}%`, 
      icon: TrendingUp, 
      color: "text-purple-500",
      bgColor: "bg-purple-50",
      description: "Average completion rate across all courses"
    },
    { 
      label: "Available Courses", 
      value: systemStats.coursesOffered.toString(), 
      icon: BookOpenIcon, 
      color: "text-orange-500",
      bgColor: "bg-orange-50",
      description: "Programming courses available"
    },
  ]

  const currentTab = tabConfig.find((tab) => tab.id === activeTab)

  // Canvas view for detailed report viewing
  if (showCanvas && selectedReport) {
    return (
      <AdvancedFeaturesProvider>
        <div className="min-h-screen">
          {/* Canvas Header */}
          <div className="bg-white border-b border-gray-200 p-4 sticky top-0 z-40">
            <div className="flex items-center justify-between max-w-7xl mx-auto">
              <div className="flex items-center gap-4">
                <Button variant="outline" onClick={handleBackToSystem}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to System
                </Button>
                <div className="flex items-center gap-2">
                  {getTierIcon(selectedReport.tier || "standard")}
                  <span className="font-medium">{selectedReport.studentName}</span>
                  <Badge variant="outline">{selectedReport.tier?.toUpperCase() || "STANDARD"}</Badge>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </Button>
              </div>
            </div>
          </div>

          {/* Canvas Content */}
          <div className="container mx-auto px-4 py-6">
            <UnifiedReportCanvas
              reportData={selectedReport.reportData}
              settings={settings}
              tier={selectedReport.tier as "minimal" | "standard" | "hd"}
              onBack={handleBackToSystem}
            />
          </div>
        </div>
      </AdvancedFeaturesProvider>
    )
  }

  return (
    <AdvancedFeaturesProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        {/* Streamlined Header */}
        {/* Streamlined Header */}
        <div className="bg-white border-b border-blue-100 shadow-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-600 rounded-lg">
                  <GraduationCap className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-blue-900">Rillcod Student Progress System</h1>
                  <p className="text-sm text-blue-600">Professional report generation platform</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  System Active
                </Badge>
                <Badge variant="outline" className="text-xs">
                  <Crown className="h-3 w-3 mr-1" />
                  AI-Powered
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Statistics */}
        <div className="container mx-auto px-4 py-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {dashboardStats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <Card key={index} className="border-gray-200 shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                        <Icon className={`h-4 w-4 ${stat.color}`} />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                        <p className="text-xs text-gray-600">{stat.label}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>        {/* Main Content */}
        <div className="container mx-auto px-4 py-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            {/* Streamlined Tab Navigation */}
            <Card className="border-blue-100 shadow-sm">
              <CardContent className="p-3">
                <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-5 bg-blue-50 h-auto p-1 gap-1">
                  {tabConfig.map((tab) => {
                    const Icon = tab.icon
                    const isActive = activeTab === tab.id

                    return (
                      <TabsTrigger
                        key={tab.id}
                        value={tab.id}
                        className={`
                          flex flex-col items-center gap-1 sm:gap-2 p-2 sm:p-3 rounded-lg transition-all duration-200 text-xs sm:text-sm
                          ${
                            isActive
                              ? `${tab.bgColor} ${tab.color} ${tab.borderColor} border-2 shadow-sm`
                              : "hover:bg-gray-50 text-gray-600 border-2 border-transparent"
                          }
                        `}
                      >
                        <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                        <div className="text-center">
                          <div className="font-medium text-[10px] sm:text-sm">{tab.label}</div>
                          <div className="text-[9px] sm:text-xs text-gray-500 hidden sm:block">{tab.description}</div>
                        </div>
                      </TabsTrigger>
                    )
                  })}
                </TabsList>
              </CardContent>
            </Card>

            {/* Tab Content */}
            <div className="space-y-6">
              <TabsContent value="single" className="space-y-6">
                <UnifiedSingleReport onReportGenerated={handleReportGenerated} />
              </TabsContent>

              <TabsContent value="batch" className="space-y-6">
                <UnifiedBatchReport onReportGenerated={handleReportGenerated} />
              </TabsContent>

              <TabsContent value="gallery" className="space-y-6">
                <UnifiedReportGallery reports={generatedReports} onViewReport={handleViewReport} />
              </TabsContent>

              <TabsContent value="ai-assistant" className="space-y-6">
                <UnifiedAIAssistant />
              </TabsContent>

              <TabsContent value="settings" className="space-y-6">
                <UnifiedSettings />
              </TabsContent>
            </div>
          </Tabs>
        </div>

        {/* Footer */}
        <div className="bg-white border-t border-blue-100 mt-12">
          <div className="container mx-auto px-2 sm:px-4 py-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              {dashboardStats.map((stat, index) => (
                <Card key={index} className="border-gray-200 hover:shadow-md transition-shadow">
                  <CardContent className="p-3">
                    <div className="flex items-center gap-2">
                      <div className={`p-2 ${stat.bgColor} rounded-lg`}>
                        <stat.icon className={`h-4 w-4 ${stat.color}`} />
                      </div>
                      <div>
                        <p className="text-lg font-bold text-gray-900">{stat.value}</p>
                        <p className="text-xs text-gray-600">{stat.label}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="flex flex-col lg:flex-row items-center justify-between gap-4 pt-4 border-t border-blue-100">
              <div className="flex items-center gap-2 text-gray-600">
                <GraduationCap className="h-5 w-5 text-blue-500" />
                <span className="text-sm">© 2025 Rillcod Technologies. All rights reserved.</span>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span>Version 2.0</span>
                <span>•</span>
                <span>AI-Enhanced</span>
                <span>•</span>
                <span>Multi-Tier Reports</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdvancedFeaturesProvider>
  )
}
