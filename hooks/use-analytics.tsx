"use client"

import { useState, useCallback, useRef } from "react"

interface AnalyticsEvent {
  type: string
  data: any
  timestamp: Date
}

interface AnalyticsData {
  totalReports: number
  averageGrade: number
  gradeDistribution: Record<string, number>
  mostCommonStrengths: string[]
  mostCommonGrowthAreas: string[]
  reportGenerationTimes: number[]
  userActivity: AnalyticsEvent[]
}

export function useAnalytics() {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalReports: 0,
    averageGrade: 0,
    gradeDistribution: {},
    mostCommonStrengths: [],
    mostCommonGrowthAreas: [],
    reportGenerationTimes: [],
    userActivity: [],
  })

  const eventQueue = useRef<AnalyticsEvent[]>([])

  // Track an event
  const trackEvent = useCallback((type: string, data: any) => {
    const event: AnalyticsEvent = {
      type,
      data,
      timestamp: new Date(),
    }

    eventQueue.current.push(event)

    // Process events in batches for performance
    if (eventQueue.current.length >= 10) {
      processEvents()
    }
  }, [])

  // Process queued events
  const processEvents = useCallback(() => {
    const events = [...eventQueue.current]
    eventQueue.current = []

    setAnalytics((prev) => {
      const newAnalytics = { ...prev }

      events.forEach((event) => {
        newAnalytics.userActivity.push(event)

        switch (event.type) {
          case "report_generated":
            newAnalytics.totalReports++
            if (event.data.grade) {
              newAnalytics.gradeDistribution[event.data.grade] =
                (newAnalytics.gradeDistribution[event.data.grade] || 0) + 1
            }
            if (event.data.generationTime) {
              newAnalytics.reportGenerationTimes.push(event.data.generationTime)
            }
            break
          case "strength_added":
            // Track common strengths
            break
          case "growth_area_added":
            // Track common growth areas
            break
        }
      })

      // Calculate average grade
      const grades = Object.entries(newAnalytics.gradeDistribution)
      const gradeValues = { A: 4, B: 3, C: 2, D: 1, F: 0 }
      let totalPoints = 0
      let totalGrades = 0

      grades.forEach(([grade, count]) => {
        totalPoints += (gradeValues[grade as keyof typeof gradeValues] || 0) * count
        totalGrades += count
      })

      newAnalytics.averageGrade = totalGrades > 0 ? totalPoints / totalGrades : 0

      // Keep only last 1000 events for performance
      if (newAnalytics.userActivity.length > 1000) {
        newAnalytics.userActivity = newAnalytics.userActivity.slice(-1000)
      }

      return newAnalytics
    })
  }, [])

  // Get analytics summary
  const getAnalyticsSummary = useCallback(() => {
    return {
      ...analytics,
      averageGenerationTime:
        analytics.reportGenerationTimes.length > 0
          ? analytics.reportGenerationTimes.reduce((a, b) => a + b, 0) / analytics.reportGenerationTimes.length
          : 0,
      recentActivity: analytics.userActivity.slice(-10),
    }
  }, [analytics])

  // Export analytics data
  const exportAnalytics = useCallback(() => {
    const data = getAnalyticsSummary()
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `analytics_${new Date().toISOString().slice(0, 10)}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, [getAnalyticsSummary])

  return {
    analytics,
    trackEvent,
    getAnalyticsSummary,
    exportAnalytics,
  }
}
