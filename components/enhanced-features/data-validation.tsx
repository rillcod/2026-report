"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, AlertCircle, XCircle, Info } from "lucide-react"

interface DataValidationProps {
  formData: any
  validationErrors: Record<string, string>
}

export function DataValidation({ formData, validationErrors }: DataValidationProps) {
  const getValidationStatus = () => {
    const checks = [
      {
        id: "student-name",
        label: "Student Name",
        status: formData.studentName?.trim() ? "valid" : "invalid",
        message: formData.studentName?.trim() ? "Student name provided" : "Student name is required",
      },
      {
        id: "scores",
        label: "Performance Scores",
        status: formData.theoryScore && formData.practicalScore && formData.attendance ? "valid" : "invalid",
        message:
          formData.theoryScore && formData.practicalScore && formData.attendance
            ? "All scores provided"
            : "Theory, practical, and attendance scores required",
      },
      {
        id: "score-range",
        label: "Score Validity",
        status: (() => {
          const theory = Number(formData.theoryScore)
          const practical = Number(formData.practicalScore)
          const attendance = Number(formData.attendance)

          if (!theory || !practical || !attendance) return "warning"

          const validRange = (score: number) => score >= 0 && score <= 100
          return validRange(theory) && validRange(practical) && validRange(attendance) ? "valid" : "invalid"
        })(),
        message: (() => {
          const theory = Number(formData.theoryScore)
          const practical = Number(formData.practicalScore)
          const attendance = Number(formData.attendance)

          if (!theory || !practical || !attendance) return "Scores not yet provided"

          const validRange = (score: number) => score >= 0 && score <= 100
          return validRange(theory) && validRange(practical) && validRange(attendance)
            ? "All scores within valid range (0-100)"
            : "Some scores are outside valid range (0-100)"
        })(),
      },
      {
        id: "progress-items",
        label: "Progress Items",
        status: formData.progressItems?.length > 0 ? "valid" : "warning",
        message:
          formData.progressItems?.length > 0
            ? `${formData.progressItems.length} progress items added`
            : "No progress items added yet",
      },
      {
        id: "assessment",
        label: "Assessment Content",
        status: formData.strengths || formData.growth || formData.comments ? "valid" : "warning",
        message:
          formData.strengths || formData.growth || formData.comments
            ? "Assessment content provided"
            : "Consider adding strengths, growth areas, or comments",
      },
    ]

    const validCount = checks.filter((check) => check.status === "valid").length
    const invalidCount = checks.filter((check) => check.status === "invalid").length
    const warningCount = checks.filter((check) => check.status === "warning").length

    return { checks, validCount, invalidCount, warningCount }
  }

  const { checks, validCount, invalidCount, warningCount } = getValidationStatus()

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "valid":
        return <CheckCircle className="h-3 w-3 text-green-400" />
      case "invalid":
        return <XCircle className="h-3 w-3 text-red-400" />
      case "warning":
        return <AlertCircle className="h-3 w-3 text-yellow-400" />
      default:
        return <Info className="h-3 w-3 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "valid":
        return "text-green-400"
      case "invalid":
        return "text-red-400"
      case "warning":
        return "text-yellow-400"
      default:
        return "text-gray-400"
    }
  }

  const getOverallStatus = () => {
    if (invalidCount > 0) return { status: "invalid", color: "bg-red-500", text: "Issues Found" }
    if (warningCount > 0) return { status: "warning", color: "bg-yellow-500", text: "Warnings" }
    return { status: "valid", color: "bg-green-500", text: "All Good" }
  }

  const overallStatus = getOverallStatus()

  return (
    <Card className="bg-gray-800/50 border-gray-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white text-sm flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-blue-400" />
            Data Validation
          </CardTitle>
          <Badge className={`${overallStatus.color} text-white text-xs`}>{overallStatus.text}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Summary */}
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="text-center">
            <div className="text-green-400 font-medium">{validCount}</div>
            <div className="text-gray-400">Valid</div>
          </div>
          <div className="text-center">
            <div className="text-yellow-400 font-medium">{warningCount}</div>
            <div className="text-gray-400">Warnings</div>
          </div>
          <div className="text-center">
            <div className="text-red-400 font-medium">{invalidCount}</div>
            <div className="text-gray-400">Issues</div>
          </div>
        </div>

        {/* Validation Checks */}
        <div className="space-y-2">
          {checks.map((check) => (
            <div key={check.id} className="flex items-start gap-2 p-2 bg-gray-900/50 rounded">
              {getStatusIcon(check.status)}
              <div className="flex-1 min-w-0">
                <div className={`text-xs font-medium ${getStatusColor(check.status)}`}>{check.label}</div>
                <div className="text-xs text-gray-400 break-words">{check.message}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Validation Errors */}
        {Object.keys(validationErrors).length > 0 && (
          <div className="mt-3 p-2 bg-red-900/20 border border-red-700/50 rounded">
            <div className="text-red-400 text-xs font-medium mb-1">Validation Errors:</div>
            <div className="space-y-1">
              {Object.entries(validationErrors).map(([field, error]) => (
                <div key={field} className="text-red-300 text-xs break-words">
                  • {error}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
