"use client"

import type React from "react"
import { useState, useRef, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { useSettings } from "@/hooks/use-settings"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Users,
  Upload,
  FileSpreadsheet,
  Download,
  CheckCircle,
  AlertCircle,
  Play,
  Pause,
  RotateCcw,
  Crown,
  BarChart3,
  FileText,
  Trash2,
  Plus,
  Eye,
  FileDown,
  Camera,
  Save,
  Clock,
  AlertTriangle,
  X,
} from "lucide-react"

type ReportTier = "minimal" | "standard" | "hd"
type StudentStatus = "pending" | "processing" | "completed" | "error"

interface ValidationErrors {
  [field: string]: string | null
}

interface StudentData {
  id: string
  studentName: string
  schoolName: string
  studentSection: string
  theoryScore: number
  practicalScore: number
  attendance: number
  participation: string
  projectCompletion: string
  homeworkCompletion: string
  progressItems: string[]
  strengths: string
  growth: string
  comments: string
  certificateText: string
  showPaymentDetails: boolean
  studentPhoto?: File | null
  photoPreview?: string
  status: StudentStatus
  validationErrors: ValidationErrors
  courseName?: string
  instructorName?: string
  duration?: string
}

interface BatchProgress {
  total: number
  completed: number
  current: string
  errors: string[]
}

interface UnifiedBatchReportProps {
  onReportGenerated: (reportId: string, screenshotUrl: string, additionalData?: any) => void
}

export function UnifiedBatchReport({ onReportGenerated }: UnifiedBatchReportProps) {
  const { toast } = useToast()
  const { settings } = useSettings()
  const [activeTab, setActiveTab] = useState("upload")
  const [reportTier, setReportTier] = useState<ReportTier>("standard")
  const [studentsData, setStudentsData] = useState<StudentData[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [isAutoSaving, setIsAutoSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [batchProgress, setBatchProgress] = useState<BatchProgress>({
    total: 0,
    completed: 0,
    current: "",
    errors: [],
  })
  const [generatedReports, setGeneratedReports] = useState<any[]>([])
  const [selectedStudentIndex, setSelectedStudentIndex] = useState<number | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Auto-save functionality
  useEffect(() => {
    if (studentsData.length > 0) {
      const autoSaveTimer = setTimeout(() => {
        autoSave()
      }, 3000)
      return () => clearTimeout(autoSaveTimer)
    }
  }, [studentsData])

  const autoSave = async () => {
    setIsAutoSaving(true)
    try {
      localStorage.setItem('batch_report_draft', JSON.stringify({
        studentsData,
        reportTier,
        savedAt: new Date().toISOString()
      }))
      setLastSaved(new Date())
    } catch (error) {
      console.error('Auto-save failed:', error)
    } finally {
      setIsAutoSaving(false)
    }
  }

  const getStatusIcon = (status: StudentStatus) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4 text-gray-500" />
      case "processing":
        return <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent" />
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "error":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const downloadTemplate = () => {
    const csvContent = `student_name,school_name,section,theory_score,practical_score,attendance,participation,project_completion,homework_completion,strengths,growth,comments,course_name
John Doe,ABC School,Grade 10,85,90,95,Excellent,Completed,Completed,Strong problem solver,Needs more practice,Excellent student,Web Development
Jane Smith,XYZ Academy,Grade 11,78,82,88,Good,Completed most,Completed,Good analytical skills,Focus on theory,Good progress,Programming Basics
Mike Johnson,DEF Institute,Grade 9,92,88,96,Very Good,Completed,Completed most,Outstanding performance,Continue excellence,Top performer,Data Science`

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", "batch_report_template.csv")
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    toast({
      title: "Template Downloaded",
      description: "CSV template has been downloaded successfully.",
    })
  }

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (file.type !== "text/csv" && !file.name.endsWith('.csv')) {
      toast({
        title: "Invalid File Type",
        description: "Please upload a CSV file.",
        variant: "destructive",
      })
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const csv = e.target?.result as string
      const lines = csv.split('\n')
      const headers = lines[0].split(',').map(h => h.trim())
      
      const students: StudentData[] = []
      
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim())
        if (values.length < headers.length || !values[0]) continue
        
        const student: StudentData = {
          id: `student-${Date.now()}-${i}`,
          studentName: values[0] || "",
          schoolName: values[1] || "",
          studentSection: values[2] || "",
          theoryScore: Number(values[3]) || 0,
          practicalScore: Number(values[4]) || 0,
          attendance: Number(values[5]) || 0,
          participation: values[6] || "",
          projectCompletion: values[7] || "",
          homeworkCompletion: values[8] || "",
          strengths: values[9] || "",
          growth: values[10] || "",
          comments: values[11] || "",
          courseName: values[12] || "",
          progressItems: [],
          certificateText: "",
          showPaymentDetails: false,
          status: "pending",
          validationErrors: {},
        }
        students.push(student)
      }
      
      setStudentsData(students)
      setActiveTab("students")
      
      toast({
        title: "CSV Uploaded",
        description: `${students.length} students imported successfully.`,
      })
    }
    
    reader.readAsText(file)
  }, [toast])

  const generateReports = async () => {
    if (studentsData.length === 0) {
      toast({
        title: "No Students",
        description: "Please add students before generating reports.",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)
    setBatchProgress({
      total: studentsData.length,
      completed: 0,
      current: "",
      errors: [],
    })

    try {
      const reports = []
      for (let i = 0; i < studentsData.length; i++) {
        if (isPaused) {
          await new Promise(resolve => {
            const checkPause = () => {
              if (!isPaused) resolve(void 0)
              else setTimeout(checkPause, 100)
            }
            checkPause()
          })
        }

        const student = studentsData[i]
        setBatchProgress(prev => ({
          ...prev,
          current: student.studentName,
          completed: i
        }))

        // Simulate report generation
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        const reportData = {
          id: `report-${student.id}`,
          studentName: student.studentName,
          tier: reportTier,
          timestamp: new Date(),
          data: student
        }
        
        reports.push(reportData)
        
        setBatchProgress(prev => ({
          ...prev,
          completed: i + 1
        }))
      }

      setGeneratedReports(reports)
      setActiveTab("results")
      
      toast({
        title: "Reports Generated",
        description: `Successfully generated ${reports.length} reports.`,
      })
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Failed to generate reports. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
      setBatchProgress(prev => ({ ...prev, current: "" }))
    }
  }

  return (
    <div className="space-y-6">
      {/* Streamlined Header */}
      <Card className="border-blue-200 shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Users className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg text-blue-900">Batch Report Generator</CardTitle>
                <p className="text-sm text-blue-600">Generate multiple student reports efficiently</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {(isAutoSaving || lastSaved) && (
                <Badge variant="outline" className="text-xs">
                  {isAutoSaving ? 'Saving...' : `Saved ${lastSaved?.toLocaleTimeString()}`}
                </Badge>
              )}
              <Badge variant="outline" className="text-xs">
                {studentsData.length} Students
              </Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Report Generation Progress */}
      {isGenerating && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-orange-600 border-t-transparent"></div>
                <span className="font-medium text-orange-900">
                  Generating Reports... ({batchProgress.completed}/{batchProgress.total})
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsPaused(!isPaused)}
                  className="border-orange-300"
                >
                  {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                  {isPaused ? 'Resume' : 'Pause'}
                </Button>
              </div>
            </div>
            <Progress value={(batchProgress.completed / batchProgress.total) * 100} className="mb-2" />
            {batchProgress.current && (
              <p className="text-sm text-orange-700">
                Currently processing: {batchProgress.current}
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Main Content */}
      <Card className="border-blue-100 shadow-sm">
        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="border-b border-blue-100 px-3 sm:px-6 pt-4 sm:pt-6">
              <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 bg-blue-50 h-auto gap-1 p-1">
                <TabsTrigger value="upload" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-xs sm:text-sm p-2 flex items-center justify-center gap-1 sm:gap-2">
                  <Upload className="h-4 w-4 shrink-0" />
                  <span className="hidden sm:inline">Upload Data</span>
                  <span className="sm:hidden">Upload</span>
                </TabsTrigger>
                <TabsTrigger value="students" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-xs sm:text-sm p-2 flex items-center justify-center gap-1 sm:gap-2">
                  <Users className="h-4 w-4 shrink-0" />
                  <span className="hidden sm:inline">Students ({studentsData.length})</span>
                  <span className="sm:hidden">Students</span>
                </TabsTrigger>
                <TabsTrigger value="generate" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-xs sm:text-sm p-2 flex items-center justify-center gap-1 sm:gap-2">
                  <FileSpreadsheet className="h-4 w-4 shrink-0" />
                  <span className="hidden sm:inline">Generate</span>
                  <span className="sm:hidden">Gen</span>
                </TabsTrigger>
                <TabsTrigger value="results" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-xs sm:text-sm p-2 flex items-center justify-center gap-1 sm:gap-2">
                  <Download className="h-4 w-4 shrink-0" />
                  <span className="hidden sm:inline">Results ({generatedReports.length})</span>
                  <span className="sm:hidden">Results</span>
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Upload Tab - Enhanced */}
            <TabsContent value="upload" className="p-6 space-y-6">
              <div className="text-center">
                <div className="border-2 border-dashed border-blue-300 rounded-lg p-8 bg-gradient-to-br from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 transition-colors duration-300">
                  <div className="relative">
                    <Upload className="h-16 w-16 text-blue-400 mx-auto mb-4 animate-bounce" />
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">+</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-blue-900 mb-2">Upload Student Data</h3>
                  <p className="text-blue-600 mb-6 max-w-md mx-auto">
                    Drag & drop your CSV file here or click to browse. 
                    <br />
                    <span className="text-sm">Supports bulk import of student records</span>
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg transform hover:scale-105 transition-all duration-200"
                      size="lg"
                    >
                      <Upload className="h-5 w-5 mr-2" />
                      Choose CSV File
                    </Button>
                    <div className="text-gray-400 font-medium">OR</div>
                    <Button
                      variant="outline"
                      onClick={downloadTemplate}
                      className="border-2 border-blue-300 text-blue-700 hover:bg-blue-50 shadow-md"
                      size="lg"
                    >
                      <Download className="h-5 w-5 mr-2" />
                      Download Template
                    </Button>
                  </div>
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>
              </div>
              
              {/* Enhanced Format Guide */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <span className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center mr-2">
                      <span className="text-white text-xs">📋</span>
                    </span>
                    CSV Format Requirements
                  </h4>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                      First row should contain headers
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                      Required: student_name, school_name, theory_score, practical_score
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                      Scores should be numbers between 0-100
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                      Use comma separation for values
                    </li>
                  </ul>
                </div>

                <div className="bg-green-50 rounded-lg p-5 border border-green-200">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <span className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center mr-2">
                      <span className="text-white text-xs">✨</span>
                    </span>
                    Pro Tips
                  </h4>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-green-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                      Download our template for the perfect format
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-green-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                      Include all optional fields for richer reports
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-green-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                      Validate data before upload to avoid errors
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-green-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                      Auto-save keeps your progress safe
                    </li>
                  </ul>
                </div>
              </div>

              {/* Quick Stats */}
              {studentsData.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">Last Upload Summary</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                    <div className="text-center">
                      <div className="text-xl font-bold text-blue-600">{studentsData.length}</div>
                      <div className="text-blue-700">Students</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-green-600">
                        {Math.round(studentsData.reduce((acc, s) => acc + s.theoryScore, 0) / studentsData.length)}
                      </div>
                      <div className="text-blue-700">Avg Theory</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-purple-600">
                        {Math.round(studentsData.reduce((acc, s) => acc + s.practicalScore, 0) / studentsData.length)}
                      </div>
                      <div className="text-blue-700">Avg Practical</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-orange-600">
                        {Math.round(studentsData.reduce((acc, s) => acc + s.attendance, 0) / studentsData.length)}%
                      </div>
                      <div className="text-blue-700">Avg Attendance</div>
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>

            {/* Students Tab - Enhanced */}
            <TabsContent value="students" className="p-6">
              {studentsData.length === 0 ? (
                <div className="text-center py-12">
                  <div className="relative">
                    <Users className="h-20 w-20 text-gray-300 mx-auto mb-6" />
                    <div className="absolute -top-2 -right-6 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center animate-pulse">
                      <span className="text-white text-sm font-bold">0</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">No students uploaded yet</h3>
                  <p className="text-gray-500 mb-6">Upload a CSV file to get started with batch report generation</p>
                  <Button
                    onClick={() => setActiveTab("upload")}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Go to Upload
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Enhanced Header with Actions */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Student Management</h3>
                      <p className="text-gray-600">
                        {studentsData.length} student{studentsData.length !== 1 ? 's' : ''} ready for report generation
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="text-sm px-3 py-1">
                        Total: {studentsData.length}
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          if (confirm('Are you sure you want to clear all students? This action cannot be undone.')) {
                            setStudentsData([])
                          }
                        }}
                        className="text-red-600 border-red-300 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Clear All
                      </Button>
                    </div>
                  </div>

                  {/* Quick Stats Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-2xl font-bold text-blue-600">
                            {Math.round(studentsData.reduce((acc, s) => acc + s.theoryScore, 0) / studentsData.length)}
                          </div>
                          <div className="text-sm text-blue-700">Avg Theory Score</div>
                        </div>
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 text-lg">📚</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-2xl font-bold text-green-600">
                            {Math.round(studentsData.reduce((acc, s) => acc + s.practicalScore, 0) / studentsData.length)}
                          </div>
                          <div className="text-sm text-green-700">Avg Practical Score</div>
                        </div>
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <span className="text-green-600 text-lg">🛠️</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-2xl font-bold text-purple-600">
                            {Math.round(studentsData.reduce((acc, s) => acc + s.attendance, 0) / studentsData.length)}%
                          </div>
                          <div className="text-sm text-purple-700">Avg Attendance</div>
                        </div>
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                          <span className="text-purple-600 text-lg">📅</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-2xl font-bold text-orange-600">
                            {studentsData.filter(s => s.status === 'completed').length}
                          </div>
                          <div className="text-sm text-orange-700">Processed</div>
                        </div>
                        <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                          <span className="text-orange-600 text-lg">✅</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Enhanced Student List */}
                  <div className="space-y-3">
                    {studentsData.map((student, index) => (
                      <Card key={student.id} className="border-gray-200 hover:shadow-md transition-shadow duration-200">
                        <CardContent className="p-5">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="relative">
                                <Avatar className="h-12 w-12 border-2 border-gray-200">
                                  <AvatarImage src={student.photoPreview} />
                                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                                    {student.studentName.slice(0, 2).toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="absolute -bottom-1 -right-1">
                                  {getStatusIcon(student.status)}
                                </div>
                              </div>
                              <div className="flex-1">
                                <h4 className="font-semibold text-gray-900 text-lg">{student.studentName}</h4>
                                <p className="text-gray-600">{student.schoolName} • {student.studentSection}</p>
                                <div className="flex items-center gap-4 mt-2">
                                  <span className="text-sm text-blue-600 bg-blue-100 px-2 py-1 rounded">
                                    Theory: {student.theoryScore}%
                                  </span>
                                  <span className="text-sm text-green-600 bg-green-100 px-2 py-1 rounded">
                                    Practical: {student.practicalScore}%
                                  </span>
                                  <span className="text-sm text-purple-600 bg-purple-100 px-2 py-1 rounded">
                                    Attendance: {student.attendance}%
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4 mr-1" />
                                Preview
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => {
                                  const newData = studentsData.filter(s => s.id !== student.id)
                                  setStudentsData(newData)
                                }}
                                className="text-red-600 border-red-300 hover:bg-red-50"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>

            {/* Generate Tab - Enhanced */}
            <TabsContent value="generate" className="p-6 space-y-6">
              <div className="space-y-6">
                {/* Report Quality Selection */}
                <div>
                  <Label className="text-lg font-semibold text-gray-900 mb-4 block">Choose Report Quality</Label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div
                      className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                        reportTier === "minimal" 
                          ? "border-gray-600 bg-gray-50 shadow-lg transform scale-105" 
                          : "border-gray-300 hover:border-gray-400 hover:shadow-md"
                      }`}
                      onClick={() => setReportTier("minimal")}
                    >
                      <div className="text-center">
                        <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-3">
                          <FileText className="h-6 w-6 text-white" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Minimal</h3>
                        <p className="text-sm text-gray-600 mb-3">Basic information and scores</p>
                        <div className="text-xs text-gray-500">
                          • Essential data only<br/>
                          • Quick generation<br/>
                          • Compact format
                        </div>
                      </div>
                    </div>

                    <div
                      className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                        reportTier === "standard" 
                          ? "border-blue-600 bg-blue-50 shadow-lg transform scale-105" 
                          : "border-gray-300 hover:border-blue-400 hover:shadow-md"
                      }`}
                      onClick={() => setReportTier("standard")}
                    >
                      <div className="text-center">
                        <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                          <BarChart3 className="h-6 w-6 text-white" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Standard</h3>
                        <p className="text-sm text-gray-600 mb-3">Comprehensive analysis</p>
                        <div className="text-xs text-gray-500">
                          • Detailed metrics<br/>
                          • Progress tracking<br/>
                          • Professional layout
                        </div>
                      </div>
                    </div>

                    <div
                      className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                        reportTier === "hd" 
                          ? "border-amber-600 bg-amber-50 shadow-lg transform scale-105" 
                          : "border-gray-300 hover:border-amber-400 hover:shadow-md"
                      }`}
                      onClick={() => setReportTier("hd")}
                    >
                      <div className="text-center">
                        <div className="w-12 h-12 bg-amber-600 rounded-full flex items-center justify-center mx-auto mb-3">
                          <Crown className="h-6 w-6 text-white" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">HD Premium</h3>
                        <p className="text-sm text-gray-600 mb-3">Ultra-detailed reports</p>
                        <div className="text-xs text-gray-500">
                          • Enhanced visuals<br/>
                          • Comprehensive insights<br/>
                          • Premium formatting
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Generation Summary */}
                <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-6 border border-gray-200">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <span className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                      <span className="text-white text-sm">📊</span>
                    </span>
                    Generation Summary
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600 mb-1">{studentsData.length}</div>
                      <div className="text-sm text-gray-600">Students to process</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600 mb-1 capitalize">{reportTier}</div>
                      <div className="text-sm text-gray-600">Report quality</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-600 mb-1">
                        {Math.round(studentsData.length * (reportTier === 'minimal' ? 0.5 : reportTier === 'standard' ? 1.5 : 3))}s
                      </div>
                      <div className="text-sm text-gray-600">Est. time</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-orange-600 mb-1">PDF</div>
                      <div className="text-sm text-gray-600">Output format</div>
                    </div>
                  </div>
                </div>

                {/* Generation Options */}
                <div className="bg-white rounded-xl p-6 border border-gray-200">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <span className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center mr-3">
                      <span className="text-white text-sm">⚙️</span>
                    </span>
                    Generation Options
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm font-medium text-gray-700">Auto-pause on errors</span>
                        <div className="w-10 h-6 bg-blue-600 rounded-full flex items-center justify-end p-1">
                          <div className="w-4 h-4 bg-white rounded-full"></div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm font-medium text-gray-700">Generate ZIP archive</span>
                        <div className="w-10 h-6 bg-blue-600 rounded-full flex items-center justify-end p-1">
                          <div className="w-4 h-4 bg-white rounded-full"></div>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm font-medium text-gray-700">Email notifications</span>
                        <div className="w-10 h-6 bg-gray-300 rounded-full flex items-center justify-start p-1">
                          <div className="w-4 h-4 bg-white rounded-full"></div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm font-medium text-gray-700">Watermark reports</span>
                        <div className="w-10 h-6 bg-gray-300 rounded-full flex items-center justify-start p-1">
                          <div className="w-4 h-4 bg-white rounded-full"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Generate Button */}
                <Button
                  onClick={generateReports}
                  disabled={isGenerating || studentsData.length === 0}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg h-14 text-lg font-semibold"
                >
                  {isGenerating ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3" />
                      Generating {batchProgress.completed}/{batchProgress.total} Reports...
                    </>
                  ) : (
                    <>
                      <FileSpreadsheet className="h-5 w-5 mr-3" />
                      Generate All {studentsData.length} Reports
                    </>
                  )}
                </Button>

                {studentsData.length === 0 && (
                  <div className="text-center py-8 bg-yellow-50 rounded-xl border border-yellow-200">
                    <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-3" />
                    <p className="text-yellow-700 font-medium">No students available for report generation</p>
                    <p className="text-yellow-600 text-sm mt-1">Please upload student data first</p>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Results Tab - Enhanced */}
            <TabsContent value="results" className="p-6">
              {generatedReports.length === 0 ? (
                <div className="text-center py-12">
                  <div className="relative">
                    <FileDown className="h-20 w-20 text-gray-300 mx-auto mb-6" />
                    <div className="absolute -top-2 -right-6 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">0</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">No reports generated yet</h3>
                  <p className="text-gray-500 mb-6">Generate reports to see them here with download options</p>
                  <Button
                    onClick={() => setActiveTab("generate")}
                    className="bg-blue-600 hover:bg-blue-700"
                    disabled={studentsData.length === 0}
                  >
                    <FileSpreadsheet className="h-4 w-4 mr-2" />
                    {studentsData.length === 0 ? 'Upload Students First' : 'Generate Reports'}
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Enhanced Header with Batch Actions */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Generated Reports</h3>
                      <p className="text-gray-600">
                        {generatedReports.length} report{generatedReports.length !== 1 ? 's' : ''} ready for download
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="text-sm px-3 py-1 bg-green-50 text-green-700 border-green-300">
                        Complete: {generatedReports.length}
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-blue-600 border-blue-300 hover:bg-blue-50"
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Download All ZIP
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          if (confirm('Are you sure you want to clear all generated reports?')) {
                            setGeneratedReports([])
                          }
                        }}
                        className="text-red-600 border-red-300 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Clear All
                      </Button>
                    </div>
                  </div>

                  {/* Generation Statistics */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-2xl font-bold text-green-600">{generatedReports.length}</div>
                          <div className="text-sm text-green-700">Successfully Generated</div>
                        </div>
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-2xl font-bold text-blue-600">
                            {generatedReports.filter(r => r.tier === 'hd').length}
                          </div>
                          <div className="text-sm text-blue-700">HD Premium</div>
                        </div>
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <Crown className="h-5 w-5 text-blue-600" />
                        </div>
                      </div>
                    </div>

                    <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-2xl font-bold text-purple-600">
                            {generatedReports.filter(r => r.tier === 'standard').length}
                          </div>
                          <div className="text-sm text-purple-700">Standard</div>
                        </div>
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                          <BarChart3 className="h-5 w-5 text-purple-600" />
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-2xl font-bold text-gray-600">
                            {generatedReports.filter(r => r.tier === 'minimal').length}
                          </div>
                          <div className="text-sm text-gray-700">Minimal</div>
                        </div>
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                          <FileText className="h-5 w-5 text-gray-600" />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Enhanced Report List */}
                  <div className="space-y-3">
                    {generatedReports.map((report, index) => {
                      const tierConfig = {
                        minimal: { color: 'gray', icon: FileText, bg: 'bg-gray-100', text: 'text-gray-600' },
                        standard: { color: 'blue', icon: BarChart3, bg: 'bg-blue-100', text: 'text-blue-600' },
                        hd: { color: 'amber', icon: Crown, bg: 'bg-amber-100', text: 'text-amber-600' }
                      }
                      const config = tierConfig[report.tier as keyof typeof tierConfig]
                      const IconComponent = config.icon

                      return (
                        <Card key={report.id} className="border-gray-200 hover:shadow-md transition-shadow duration-200">
                          <CardContent className="p-5">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 ${config.bg} rounded-xl flex items-center justify-center`}>
                                  <IconComponent className={`h-6 w-6 ${config.text}`} />
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-semibold text-gray-900 text-lg">{report.studentName}</h4>
                                  <div className="flex items-center gap-4 mt-1">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
                                      {report.tier.charAt(0).toUpperCase() + report.tier.slice(1)} Quality
                                    </span>
                                    <span className="text-sm text-gray-500">
                                      Generated at {report.timestamp.toLocaleTimeString()} on {report.timestamp.toLocaleDateString()}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button variant="outline" size="sm" className="hover:bg-blue-50 border-blue-300">
                                  <Eye className="h-4 w-4 mr-1" />
                                  Preview
                                </Button>
                                <Button variant="outline" size="sm" className="hover:bg-green-50 border-green-300">
                                  <Download className="h-4 w-4 mr-1" />
                                  PDF
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => {
                                    const newReports = generatedReports.filter(r => r.id !== report.id)
                                    setGeneratedReports(newReports)
                                  }}
                                  className="text-red-600 border-red-300 hover:bg-red-50"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
