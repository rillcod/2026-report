"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Lightbulb, TrendingUp, Target, CheckCircle, X } from "lucide-react"

interface SmartSuggestionsProps {
  formData: any
  onApplySuggestion: (field: string, value: any) => void
}

export function SmartSuggestions({ formData, onApplySuggestion }: SmartSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<any[]>([])
  const [dismissedSuggestions, setDismissedSuggestions] = useState<string[]>([])

  useEffect(() => {
    generateSuggestions()
  }, [formData])

  const generateSuggestions = () => {
    const newSuggestions = []

    // Performance-based suggestions
    if (formData.theoryScore && formData.practicalScore) {
      const theory = Number(formData.theoryScore)
      const practical = Number(formData.practicalScore)

      if (theory > practical + 15) {
        newSuggestions.push({
          id: "theory-practical-gap",
          type: "performance",
          title: "Theory-Practice Gap",
          description: "Student excels in theory but needs more hands-on practice",
          suggestion: "Focus on practical exercises and project-based learning",
          field: "growth",
          value: "Increase hands-on coding practice to match theoretical understanding",
          icon: Target,
          priority: "high",
        })
      }

      if (practical > theory + 15) {
        newSuggestions.push({
          id: "practical-theory-gap",
          type: "performance",
          title: "Practice-Theory Gap",
          description: "Strong practical skills but could strengthen theoretical foundation",
          suggestion: "Review fundamental concepts and documentation",
          field: "growth",
          value: "Strengthen theoretical foundations through concept review and documentation study",
          icon: Target,
          priority: "medium",
        })
      }

      if (theory >= 85 && practical >= 85) {
        newSuggestions.push({
          id: "high-performer",
          type: "strength",
          title: "High Performer",
          description: "Excellent performance in both theory and practice",
          suggestion: "Consider advanced challenges and mentoring opportunities",
          field: "strengths",
          value: "Demonstrates exceptional mastery of both theoretical concepts and practical application",
          icon: TrendingUp,
          priority: "low",
        })
      }
    }

    // Attendance-based suggestions
    if (formData.attendance) {
      const attendance = Number(formData.attendance)

      if (attendance < 80) {
        newSuggestions.push({
          id: "low-attendance",
          type: "concern",
          title: "Attendance Concern",
          description: "Low attendance may impact learning progress",
          suggestion: "Discuss attendance barriers and support strategies",
          field: "growth",
          value: "Improve attendance consistency to maximize learning opportunities",
          icon: Target,
          priority: "high",
        })
      }

      if (attendance >= 95) {
        newSuggestions.push({
          id: "excellent-attendance",
          type: "strength",
          title: "Excellent Attendance",
          description: "Outstanding commitment to learning",
          suggestion: "Acknowledge dedication and consistency",
          field: "strengths",
          value: "Demonstrates exceptional commitment with excellent attendance record",
          icon: CheckCircle,
          priority: "low",
        })
      }
    }

    // Progress items suggestions
    if (formData.progressItems.length === 0) {
      newSuggestions.push({
        id: "no-progress-items",
        type: "content",
        title: "Add Progress Items",
        description: "No learning progress items have been added",
        suggestion: "Use course content or AI assistant to add specific progress items",
        field: "progressItems",
        value: [],
        icon: Lightbulb,
        priority: "medium",
      })
    }

    // Filter out dismissed suggestions
    const filteredSuggestions = newSuggestions.filter((suggestion) => !dismissedSuggestions.includes(suggestion.id))

    setSuggestions(filteredSuggestions)
  }

  const applySuggestion = (suggestion: any) => {
    onApplySuggestion(suggestion.field, suggestion.value)
    dismissSuggestion(suggestion.id)
  }

  const dismissSuggestion = (id: string) => {
    setDismissedSuggestions((prev) => [...prev, id])
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500"
      case "medium":
        return "bg-yellow-500"
      case "low":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "performance":
        return "text-blue-400"
      case "strength":
        return "text-green-400"
      case "concern":
        return "text-red-400"
      case "content":
        return "text-purple-400"
      default:
        return "text-gray-400"
    }
  }

  if (suggestions.length === 0) {
    return null
  }

  return (
    <Card className="bg-gray-800/50 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white text-sm flex items-center gap-2">
          <Lightbulb className="h-4 w-4 text-yellow-400" />
          Smart Suggestions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {suggestions.map((suggestion) => {
          const IconComponent = suggestion.icon
          return (
            <div key={suggestion.id} className="p-3 bg-gray-900/50 rounded-lg border border-gray-700">
              <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                <div className="flex flex-wrap items-center gap-2">
                  <IconComponent className={`h-3 w-3 ${getTypeColor(suggestion.type)}`} />
                  <span className="text-white text-xs font-medium">{suggestion.title}</span>
                  <Badge className={`${getPriorityColor(suggestion.priority)} text-white text-xs`}>
                    {suggestion.priority}
                  </Badge>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => dismissSuggestion(suggestion.id)}
                  className="h-4 w-4 p-0 text-gray-400 hover:text-white"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>

              <p className="text-gray-400 text-xs mb-2 break-words">{suggestion.description}</p>
              <p className="text-gray-300 text-xs mb-3 italic break-words">"{suggestion.suggestion}"</p>

              <Button
                size="sm"
                variant="outline"
                onClick={() => applySuggestion(suggestion)}
                className="w-full border-gray-600 text-gray-300 hover:bg-gray-700 text-xs"
              >
                Apply Suggestion
              </Button>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
