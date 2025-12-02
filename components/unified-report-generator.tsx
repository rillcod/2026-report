"use client"
import { Badge } from "@/components/ui/badge"
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts"

interface ReportData {
  studentName: string
  schoolName: string
  studentSection: string
  reportDate: string
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
  tier: "minimal" | "standard" | "hd"
  settings: any
  generatedAt: string
}

interface UnifiedReportGeneratorProps {
  reportData: ReportData
  settings: any
  tier: "minimal" | "standard" | "hd"
}

export function UnifiedReportGenerator({ reportData, settings, tier }: UnifiedReportGeneratorProps) {
  const calculateGrade = (score: number): string => {
    if (score >= 85) return "A"
    if (score >= 70) return "B"
    if (score >= 65) return "C"
    if (score >= 50) return "D"
    return "F"
  }

  const getGradeColor = (grade: string): string => {
    switch (grade) {
      case "A":
        return "text-green-600"
      case "B":
        return "text-blue-600"
      case "C":
        return "text-yellow-600"
      case "D":
        return "text-orange-600"
      default:
        return "text-red-600"
    }
  }

  const chartData = [
    { name: "Theory", score: reportData.theoryScore, fill: "#3b82f6" },
    { name: "Practical", score: reportData.practicalScore, fill: "#10b981" },
    { name: "Attendance", score: reportData.attendance, fill: "#f59e0b" },
  ]

  const pieData = [
    { name: "Completed", value: reportData.theoryScore, fill: "#10b981" },
    { name: "Remaining", value: 100 - reportData.theoryScore, fill: "#e5e7eb" },
  ]

  const overallScore = Math.round((reportData.theoryScore + reportData.practicalScore + reportData.attendance) / 3)
  const overallGrade = calculateGrade(overallScore)

  return (
    <div
      className="w-full max-w-4xl mx-auto bg-white"
      style={{
        minHeight: "297mm",
        maxHeight: "297mm",
        width: "210mm",
        fontSize: "11px",
        lineHeight: "1.3",
        overflow: "hidden",
        padding: "8mm",
      }}
    >
      {/* Header Section */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b-2 border-red-600">
        <div className="flex items-center gap-3">
          <img
            src="/images/rillcod-logo.png"
            alt="RillCod Technologies"
            className="h-12 w-auto"
            onError={(e) => {
              e.currentTarget.style.display = "none"
            }}
          />
          <div>
            <h1 className="text-lg font-bold text-navy-900">RillCod Technologies</h1>
            <p className="text-xs text-gray-600">Student Progress Report</p>
          </div>
        </div>
        <div className="text-right text-xs text-gray-600">
          <div>Report Date: {new Date(reportData.reportDate).toLocaleDateString()}</div>
          <div>Generated: {new Date(reportData.generatedAt).toLocaleDateString()}</div>
          <Badge variant="outline" className="mt-1">
            {tier.toUpperCase()} Report
          </Badge>
        </div>
      </div>

      {/* Student Information */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="space-y-2">
          <div className="bg-blue-50 p-2 rounded border-l-4 border-blue-500">
            <div className="text-xs font-medium text-blue-800">Student Name</div>
            <div className="font-bold text-blue-900">{reportData.studentName}</div>
          </div>
          <div className="bg-green-50 p-2 rounded border-l-4 border-green-500">
            <div className="text-xs font-medium text-green-800">School</div>
            <div className="font-bold text-green-900">{reportData.schoolName || "Not Specified"}</div>
          </div>
        </div>
        <div className="space-y-2">
          <div className="bg-purple-50 p-2 rounded border-l-4 border-purple-500">
            <div className="text-xs font-medium text-purple-800">Section/Class</div>
            <div className="font-bold text-purple-900">{reportData.studentSection || "Not Specified"}</div>
          </div>
          <div className="bg-orange-50 p-2 rounded border-l-4 border-orange-500">
            <div className="text-xs font-medium text-orange-800">Course</div>
            <div className="font-bold text-orange-900">{settings.courseName || "Programming Fundamentals"}</div>
          </div>
        </div>
      </div>

      {/* Course Progress Section */}
      <div className="mb-4">
        <div className="bg-red-600 text-white p-2 mb-2 rounded">
          <h2 className="font-bold text-sm">Course Progress</h2>
        </div>
        <div className="grid grid-cols-1 gap-1 text-xs">
          {reportData.progressItems.slice(0, 6).map((item, index) => (
            <div key={index} className="flex items-center gap-2 p-1 border-b border-gray-200">
              <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">✓</span>
              </div>
              <span className="flex-1">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Assessment */}
      <div className="mb-4">
        <div className="bg-red-600 text-white p-2 mb-2 rounded">
          <h2 className="font-bold text-sm">Performance Assessment</h2>
        </div>
        <div className="grid grid-cols-4 gap-2 text-xs">
          <div className="bg-blue-50 p-2 rounded text-center border">
            <div className="font-bold text-blue-900">Theory</div>
            <div className="text-lg font-bold text-blue-600">{reportData.theoryScore}%</div>
            <Badge className={`text-xs ${getGradeColor(calculateGrade(reportData.theoryScore))}`}>
              {calculateGrade(reportData.theoryScore)}
            </Badge>
          </div>
          <div className="bg-green-50 p-2 rounded text-center border">
            <div className="font-bold text-green-900">Practical</div>
            <div className="text-lg font-bold text-green-600">{reportData.practicalScore}%</div>
            <Badge className={`text-xs ${getGradeColor(calculateGrade(reportData.practicalScore))}`}>
              {calculateGrade(reportData.practicalScore)}
            </Badge>
          </div>
          <div className="bg-yellow-50 p-2 rounded text-center border">
            <div className="font-bold text-yellow-900">Attendance</div>
            <div className="text-lg font-bold text-yellow-600">{reportData.attendance}%</div>
            <Badge className={`text-xs ${getGradeColor(calculateGrade(reportData.attendance))}`}>
              {calculateGrade(reportData.attendance)}
            </Badge>
          </div>
          <div className="bg-purple-50 p-2 rounded text-center border">
            <div className="font-bold text-purple-900">Overall</div>
            <div className="text-lg font-bold text-purple-600">{overallScore}%</div>
            <Badge className={`text-xs ${getGradeColor(overallGrade)}`}>{overallGrade}</Badge>
          </div>
        </div>
      </div>

      {/* Charts and Evaluation Section */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* Performance Chart */}
        <div className="bg-gray-50 p-3 rounded border">
          <h3 className="font-bold text-xs mb-2 text-center">Performance Overview</h3>
          <div className="h-24">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="name" tick={{ fontSize: 8 }} />
                <YAxis tick={{ fontSize: 8 }} />
                <Bar dataKey="score" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Evaluation Section */}
        <div className="space-y-2">
          <div className="bg-green-50 p-2 rounded border">
            <h4 className="font-bold text-xs text-green-800 mb-1">Key Strengths</h4>
            <div className="text-xs text-green-700 leading-tight">
              {reportData.strengths || "Excellent problem-solving skills and consistent performance"}
            </div>
          </div>
          <div className="bg-orange-50 p-2 rounded border">
            <h4 className="font-bold text-xs text-orange-800 mb-1">Areas for Growth</h4>
            <div className="text-xs text-orange-700 leading-tight">
              {reportData.growth || "Continue practicing advanced concepts and algorithms"}
            </div>
          </div>
        </div>
      </div>

      {/* Instructor Comments */}
      <div className="mb-4">
        <div className="bg-red-600 text-white p-2 mb-2 rounded">
          <h2 className="font-bold text-sm">Instructor Comments</h2>
        </div>
        <div className="bg-gray-50 p-3 rounded border text-xs leading-relaxed">
          {reportData.comments ||
            `${reportData.studentName} has shown consistent progress throughout the course. Their dedication to learning and problem-solving approach is commendable. With continued practice and focus, they are well-positioned for success in advanced programming concepts.`}
        </div>
      </div>

      {/* Certificate Section */}
      <div className="bg-gradient-to-r from-yellow-100 via-yellow-50 to-yellow-100 border-2 border-yellow-400 rounded-lg p-4 mt-auto">
        <div className="text-center mb-3">
          <h2 className="text-sm font-bold text-yellow-800 mb-2">Certificate of Completion</h2>
          <div className="text-xs text-yellow-700 leading-relaxed">
            {reportData.certificateText ||
              `This certifies that ${reportData.studentName} has successfully completed the ${settings.courseName || "Programming Fundamentals"} course, demonstrating proficiency in core programming concepts and showing commitment to excellence in technology education.`}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 items-end">
          {/* Signature Section */}
          <div className="text-center">
            <div className="border-b border-yellow-600 mb-1 h-8"></div>
            <div className="text-xs font-medium text-yellow-800">Instructor Signature</div>
            <div className="text-xs text-yellow-600">RillCod Technologies</div>
          </div>

          {/* Payment Details */}
          {reportData.showPaymentDetails && (
            <div className="text-center">
              <div className="text-xs font-bold text-yellow-800 mb-1">Payment Confirmed</div>
              <div className="text-xs text-yellow-700">
                <div>Amount: ₦50,000</div>
                <div>Date: {new Date(reportData.reportDate).toLocaleDateString()}</div>
                <div>Status: Completed</div>
              </div>
            </div>
          )}

          {/* QR Code */}
          <div className="text-center">
            <div className="w-16 h-16 bg-yellow-200 border border-yellow-400 rounded mx-auto mb-1 flex items-center justify-center">
              <div className="text-xs text-yellow-600">QR</div>
            </div>
            <div className="text-xs text-yellow-600">Verify Certificate</div>
          </div>
        </div>
      </div>
    </div>
  )
}
