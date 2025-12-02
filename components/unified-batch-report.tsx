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
  currentModule?: string
  nextModule?: string
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
    const csvContent = `student_name,school_name,section,theory_score,practical_score,attendance,participation,project_completion,homework_completion,strengths,growth,comments,course_name,duration,current_module,next_module
John Doe,ABC School,Grade 10,85,90,95,Excellent,Completed,Completed,Strong problem solver,Needs more practice,Excellent student,Web Development,12 weeks,JavaScript Basics,React Components
Jane Smith,XYZ Academy,Grade 11,78,82,88,Good,Completed most,Completed,Good analytical skills,Focus on theory,Good progress,Programming Basics,8 weeks,Python Functions,Object-Oriented Programming
Mike Johnson,DEF Institute,Grade 9,92,88,96,Very Good,Completed,Completed most,Outstanding performance,Continue excellence,Top performer,Data Science,16 weeks,Data Visualization,Machine Learning`

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
          duration: values[13] || "",
          currentModule: values[14] || "",
          nextModule: values[15] || "",
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
            <div className="border-b border-blue-100 px-6 pt-6">
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

            {/* Upload Tab */}
            <TabsContent value="upload" className="p-6 space-y-6">
              <div className="text-center">
                <div className="border-2 border-dashed border-blue-300 rounded-lg p-8 bg-blue-50">
                  <Upload className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">Upload Student Data</h3>
                  <p className="text-blue-600 mb-4">Upload a CSV file with student information</p>
                  
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Choose CSV File
                    </Button>
                    <Button
                      variant="outline"
                      onClick={downloadTemplate}
                      className="border-blue-300 text-blue-700"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download Template
                    </Button>
                  </div>
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv"
                    onChange={handleFileUpload}
                    className="hidden"
                    aria-label="Upload CSV file"
                  />
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">CSV Format Requirements:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• First row should contain headers</li>
                  <li>• Required columns: student_name, school_name, theory_score, practical_score</li>
                  <li>• Optional columns: duration, current_module, next_module, course_name</li>
                  <li>• Scores should be numbers between 0-100</li>
                  <li>• Use comma separation for values</li>
                  <li>• Download the template for correct format</li>
                </ul>
              </div>
            </TabsContent>

            {/* Students Tab */}
            <TabsContent value="students" className="p-6">
              {studentsData.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No students uploaded yet</p>
                  <p className="text-sm text-gray-400">Upload a CSV file to get started</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">Student List ({studentsData.length})</h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setStudentsData([])}
                      className="text-red-600 border-red-300"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Clear All
                    </Button>
                  </div>
                  
                  <div className="grid gap-3">
                    {studentsData.map((student, index) => (
                      <Card key={student.id} className="border-gray-200">
                        <CardContent className="p-4">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10">
                                  <AvatarImage src={student.photoPreview} />
                                  <AvatarFallback>
                                    {student.studentName.slice(0, 2).toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <h4 className="font-medium">{student.studentName}</h4>
                                  <p className="text-sm text-gray-500">{student.schoolName} • {student.studentSection}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                {getStatusIcon(student.status)}
                              </div>
                            </div>
                            
                            {/* Course Information */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                              <div className="bg-blue-50 p-2 rounded">
                                <span className="text-blue-600 font-medium">Course:</span>
                                <p className="text-gray-900">{student.courseName || "Not specified"}</p>
                              </div>
                              <div className="bg-green-50 p-2 rounded">
                                <span className="text-green-600 font-medium">Duration:</span>
                                <p className="text-gray-900">{student.duration || "Not specified"}</p>
                              </div>
                              <div className="bg-purple-50 p-2 rounded">
                                <span className="text-purple-600 font-medium">Current Module:</span>
                                <p className="text-gray-900">{student.currentModule || "Not specified"}</p>
                              </div>
                            </div>
                            
                            {/* Scores and Progress */}
                            <div className="flex flex-wrap gap-2">
                              <Badge variant="outline" className="text-xs">
                                Theory: {student.theoryScore}%
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                Practical: {student.practicalScore}%
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                Attendance: {student.attendance}%
                              </Badge>
                              {student.nextModule && (
                                <Badge variant="secondary" className="text-xs">
                                  Next: {student.nextModule}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>

            {/* Generate Tab */}
            <TabsContent value="generate" className="p-6 space-y-6">
              <div className="space-y-4">
                <div>
                  <Label className="text-base font-medium text-gray-900">Report Quality</Label>
                  <div className="flex flex-col sm:flex-row gap-2 mt-2">
                    <Button
                      variant={reportTier === "minimal" ? "default" : "outline"}
                      onClick={() => setReportTier("minimal")}
                      className={`w-full sm:flex-1 ${reportTier === "minimal" ? "bg-gray-600" : ""}`}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Minimal
                    </Button>
                    <Button
                      variant={reportTier === "standard" ? "default" : "outline"}
                      onClick={() => setReportTier("standard")}
                      className={`w-full sm:flex-1 ${reportTier === "standard" ? "bg-blue-600" : ""}`}
                    >
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Standard
                    </Button>
                    <Button
                      variant={reportTier === "hd" ? "default" : "outline"}
                      onClick={() => setReportTier("hd")}
                      className={`w-full sm:flex-1 ${reportTier === "hd" ? "bg-amber-600" : ""}`}
                    >
                      <Crown className="h-4 w-4 mr-2" />
                      HD Premium
                    </Button>
                  </div>
                </div>

                <div className="border rounded-lg p-4 bg-gray-50">
                  <h4 className="font-medium text-gray-900 mb-2">Generation Summary</h4>
                  <div className="space-y-2 sm:grid sm:grid-cols-2 sm:gap-4 sm:space-y-0 text-sm">
                    <div>
                      <span className="text-gray-600">Students to process:</span>
                      <span className="font-medium ml-2">{studentsData.length}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Report quality:</span>
                      <span className="font-medium ml-2 capitalize">{reportTier}</span>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={generateReports}
                  disabled={isGenerating || studentsData.length === 0}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  size="lg"
                >
                  {isGenerating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                      Generating Reports...
                    </>
                  ) : (
                    <>
                      <FileSpreadsheet className="h-4 w-4 mr-2" />
                      Generate All Reports
                    </>
                  )}
                </Button>
              </div>
            </TabsContent>

            {/* Results Tab */}
            <TabsContent value="results" className="p-6">
              {generatedReports.length === 0 ? (
                <div className="text-center py-8">
                  <FileDown className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No reports generated yet</p>
                  <p className="text-sm text-gray-400">Generate reports to see them here</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">Generated Reports ({generatedReports.length})</h3>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-blue-600 border-blue-300"
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Download All
                    </Button>
                  </div>
                  
                  <div className="grid gap-3">
                    {generatedReports.map((report, index) => (
                      <Card key={report.id} className="border-gray-200">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                <CheckCircle className="h-5 w-5 text-green-600" />
                              </div>
                              <div>
                                <h4 className="font-medium">{report.studentName}</h4>
                                <p className="text-sm text-gray-500">
                                  {report.tier.charAt(0).toUpperCase() + report.tier.slice(1)} • Generated {report.timestamp.toLocaleTimeString()}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </Button>
                              <Button variant="outline" size="sm">
                                <Download className="h-4 w-4 mr-1" />
                                PDF
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
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
