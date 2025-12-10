"use client"

import { useMemo } from "react"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Target, Brain, Code, Users, Award, Lightbulb, BookOpen, Zap } from "lucide-react"

interface StudentAnalyticsProps {
  studentData: {
    name: string
    theoryScore: number
    practicalScore: number
    attendance: number
    course: string
    progressItems: any[]
    level: string
  }
  printMode?: boolean
  compact?: boolean
}

export function StudentAnalytics({ studentData, printMode = false, compact = false }: StudentAnalyticsProps) {
  const { theoryScore, practicalScore, attendance, progressItems, level, course } = studentData

  // Course-specific AI insights function
  const getCourseSpecificInsights = (course: string, theory: number, practical: number) => {
    const insights = []
    const recommendations = []

    if (course?.toLowerCase().includes('programming') || course?.toLowerCase().includes('coding')) {
      if (practical > theory) {
        insights.push("Natural coding aptitude with strong problem-solving skills")
        recommendations.push("Explore advanced algorithms and data structures")
      } else if (theory > practical) {
        insights.push("Strong understanding of programming concepts")
        recommendations.push("Focus on more coding practice and project work")
      }
    } else if (course?.toLowerCase().includes('web') || course?.toLowerCase().includes('frontend')) {
      if (practical > 80) {
        insights.push("Excellent web development implementation skills")
        recommendations.push("Consider learning advanced frameworks or backend integration")
      }
    }

    return { insights, recommendations }
  }

  // Advanced AI-powered analytics
  const analytics = useMemo(() => {
    const overallScore = (theoryScore + practicalScore) / 2
    const completedItems = progressItems?.filter(item => item.status === 'completed').length || 0
    const totalItems = progressItems?.length || 0
    const completionRate = totalItems > 0 ? (completedItems / totalItems) * 100 : 0

    // AI-powered performance classification
    const performanceLevel = overallScore >= 90 ? "Exceptional" :
                            overallScore >= 85 ? "Advanced" :
                            overallScore >= 75 ? "Proficient" :
                            overallScore >= 65 ? "Developing" : "Emerging"

    // Learning style analysis based on theory vs practical scores
    const learningStyle = theoryScore > practicalScore + 10 ? "Theoretical Learner" :
                         practicalScore > theoryScore + 10 ? "Hands-on Learner" :
                         "Balanced Learner"

    // Engagement level based on attendance and completion
    const engagementLevel = (attendance + completionRate) / 2
    const engagement = engagementLevel >= 90 ? "Highly Engaged" :
                      engagementLevel >= 80 ? "Well Engaged" :
                      engagementLevel >= 70 ? "Moderately Engaged" : "Needs Motivation"

    // AI-generated insights
    const insights = []
    const recommendations = []

    // Performance insights
    if (overallScore >= 85) {
      insights.push("Demonstrates mastery of core concepts")
      recommendations.push("Consider advanced projects or mentoring opportunities")
    } else if (overallScore < 70) {
      insights.push("Requires additional support in fundamental areas")
      recommendations.push("Schedule one-on-one tutoring sessions")
    }

    // Learning style insights
    if (learningStyle === "Theoretical Learner") {
      insights.push("Excels in conceptual understanding")
      recommendations.push("Incorporate more practical applications to balance skills")
    } else if (learningStyle === "Hands-on Learner") {
      insights.push("Strong practical implementation skills")
      recommendations.push("Strengthen theoretical foundation with concept reviews")
    }

    // Engagement insights
    if (engagement === "Highly Engaged") {
      insights.push("Shows excellent commitment and participation")
    } else if (engagementLevel < 70) {
      insights.push("May benefit from increased interaction and support")
      recommendations.push("Explore alternative learning methods or peer collaboration")
    }

    // Course-specific insights
    const courseInsights = getCourseSpecificInsights(course, theoryScore, practicalScore)
    insights.push(...courseInsights.insights)
    recommendations.push(...courseInsights.recommendations)

    return {
      overallScore,
      completionRate,
      performanceLevel,
      learningStyle,
      engagement,
      insights: insights.slice(0, 4),
      recommendations: recommendations.slice(0, 3),
      completedItems,
      totalItems,
      engagementLevel
    }
  }, [theoryScore, practicalScore, attendance, progressItems, course])

  const chartSize = printMode ? 120 : compact ? 140 : 160
  const fontSize = printMode ? "9px" : "11px"

  // Enhanced performance metrics for visualization
  const performanceMetrics = [
    { 
      name: "Theory", 
      score: theoryScore, 
      icon: Brain, 
      color: "#8b5cf6",
      description: "Conceptual Understanding"
    },
    { 
      name: "Practical", 
      score: practicalScore, 
      icon: Code, 
      color: "#06b6d4",
      description: "Implementation Skills"
    },
    { 
      name: "Attendance", 
      score: attendance, 
      icon: Users, 
      color: "#10b981",
      description: "Class Participation"
    },
    { 
      name: "Completion", 
      score: analytics.completionRate, 
      icon: Target, 
      color: "#f59e0b",
      description: "Task Achievement"
    }
  ]

  // Create modern donut chart
  const createDonutChart = (metrics: typeof performanceMetrics) => {
    const centerX = chartSize / 2
    const centerY = chartSize / 2
    const outerRadius = chartSize / 2 - 20
    const innerRadius = outerRadius - 25
    
    let currentAngle = -90 // Start from top

    return metrics.map((metric, index) => {
      const percentage = metric.score / 100
      const angle = percentage * 90 // Each metric gets 90 degrees max
      const startAngle = currentAngle
      const endAngle = currentAngle + angle
      
      // Calculate arc path
      const startAngleRad = (startAngle * Math.PI) / 180
      const endAngleRad = (endAngle * Math.PI) / 180
      
      const x1 = centerX + outerRadius * Math.cos(startAngleRad)
      const y1 = centerY + outerRadius * Math.sin(startAngleRad)
      const x2 = centerX + outerRadius * Math.cos(endAngleRad)
      const y2 = centerY + outerRadius * Math.sin(endAngleRad)
      
      const x3 = centerX + innerRadius * Math.cos(endAngleRad)
      const y3 = centerY + innerRadius * Math.sin(endAngleRad)
      const x4 = centerX + innerRadius * Math.cos(startAngleRad)
      const y4 = centerY + innerRadius * Math.sin(startAngleRad)
      
      const largeArcFlag = angle > 180 ? 1 : 0
      
      const pathData = [
        `M ${x1} ${y1}`,
        `A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
        `L ${x3} ${y3}`,
        `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x4} ${y4}`,
        'Z'
      ].join(' ')
      
      currentAngle += 90 // Move to next quadrant
      
      return {
        pathData,
        color: metric.color,
        score: metric.score,
        name: metric.name,
        icon: metric.icon
      }
    })
  }

  const donutSegments = createDonutChart(performanceMetrics)

  return (
    <div className={`space-y-${compact ? '2' : '3'}`}>
      {/* Performance Overview with Modern Donut Chart */}
      <div className={`grid grid-cols-1 ${!compact && !printMode ? 'lg:grid-cols-2' : ''} gap-3`}>
        <div className="flex flex-col items-center">
          <h5 className={`font-bold text-gray-800 ${printMode ? 'text-xs mb-1' : 'text-sm mb-2'} flex items-center gap-2`}>
            <Zap className="w-3 h-3 text-purple-600" />
            Performance Matrix
          </h5>
          <div className="relative">
            <svg width={chartSize} height={chartSize} className="overflow-visible">
              {/* Donut segments */}
              {donutSegments.map((segment, index) => (
                <path
                  key={index}
                  d={segment.pathData}
                  fill={segment.color}
                  opacity="0.8"
                  stroke="white"
                  strokeWidth="2"
                />
              ))}
              
              {/* Center score */}
              <circle
                cx={chartSize / 2}
                cy={chartSize / 2}
                r="35"
                fill="url(#centerGradient)"
                stroke="#e5e7eb"
                strokeWidth="2"
              />
              
              <text
                x={chartSize / 2}
                y={chartSize / 2 - 5}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={printMode ? "16" : "20"}
                fill="#1f2937"
                fontWeight="bold"
              >
                {analytics.overallScore.toFixed(0)}%
              </text>
              
              <text
                x={chartSize / 2}
                y={chartSize / 2 + 12}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={printMode ? "8" : "10"}
                fill="#6b7280"
                fontWeight="500"
              >
                Overall
              </text>
              
              {/* Gradient definition */}
              <defs>
                <linearGradient id="centerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f3f4f6" />
                  <stop offset="100%" stopColor="#e5e7eb" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          
          {/* Legend - Mobile Optimized */}
          <div className={`grid grid-cols-2 gap-1 mt-2 ${printMode ? 'text-xs' : 'text-xs'}`}>
            {performanceMetrics.map((metric, index) => (
              <div key={index} className="flex items-center gap-1">
                <div 
                  className="w-2 h-2 rounded-full flex-shrink-0" 
                  style={{ backgroundColor: metric.color }}
                />
                <span className="text-gray-600 truncate">{metric.name}</span>
                <span className="font-semibold text-gray-800 ml-auto">{metric.score}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* AI Insights Panel - Mobile Optimized */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Brain className="w-3 h-3 text-blue-600" />
            <h5 className={`font-bold text-gray-800 ${printMode ? 'text-xs' : 'text-sm'}`}>
              AI Analysis
            </h5>
          </div>
          
          {/* Compact Performance Indicators */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className={`text-gray-600 ${printMode ? 'text-xs' : 'text-sm'}`}>Level:</span>
              <Badge 
                variant={analytics.performanceLevel === "Exceptional" || analytics.performanceLevel === "Advanced" ? "default" : 
                        analytics.performanceLevel === "Proficient" ? "secondary" : "outline"}
                className="text-xs px-2 py-0.5 font-semibold"
              >
                {analytics.performanceLevel}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <span className={`text-gray-600 ${printMode ? 'text-xs' : 'text-sm'}`}>Style:</span>
              <Badge variant="outline" className="text-xs px-2 py-0.5">
                {analytics.learningStyle}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <span className={`text-gray-600 ${printMode ? 'text-xs' : 'text-sm'}`}>Engagement:</span>
              <Badge 
                variant={analytics.engagement === "Highly Engaged" ? "default" : 
                        analytics.engagement === "Well Engaged" ? "secondary" : "outline"}
                className="text-xs px-2 py-0.5"
              >
                {analytics.engagement}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* AI Insights and Recommendations - Mobile Optimized */}
      <div className="space-y-3">
        {/* Key Insights - Condensed */}
        <div>
          <h6 className={`font-bold text-blue-700 ${printMode ? 'text-xs mb-1' : 'text-sm mb-2'} flex items-center gap-1`}>
            <Lightbulb className="w-3 h-3" />
            Key Insights
          </h6>
          <div className="space-y-1">
            {analytics.insights.slice(0, compact ? 2 : 3).map((insight, index) => (
              <div key={index} className={`flex items-start gap-2 ${printMode ? 'text-xs' : 'text-xs'}`}>
                <div className="w-1 h-1 bg-blue-500 rounded-full mt-1.5 flex-shrink-0" />
                <span className="text-blue-700 leading-tight">{insight}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recommendations - Condensed */}
        <div>
          <h6 className={`font-bold text-green-700 ${printMode ? 'text-xs mb-1' : 'text-sm mb-2'} flex items-center gap-1`}>
            <Award className="w-3 h-3" />
            Recommendations
          </h6>
          <div className="space-y-1">
            {analytics.recommendations.slice(0, compact ? 2 : 2).map((recommendation, index) => (
              <div key={index} className={`flex items-start gap-2 ${printMode ? 'text-xs' : 'text-xs'}`}>
                <div className="w-1 h-1 bg-green-500 rounded-full mt-1.5 flex-shrink-0" />
                <span className="text-green-700 leading-tight">{recommendation}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Progress Trajectory - Mobile Optimized */}
      <div className="border-t border-gray-200 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-3 h-3 text-purple-600" />
            <span className={`font-bold text-purple-700 ${printMode ? 'text-xs' : 'text-sm'}`}>
              Progress
            </span>
          </div>
          <div className="flex items-center gap-2">
            {analytics.overallScore >= 80 ? (
              <TrendingUp className="w-3 h-3 text-green-500" />
            ) : analytics.overallScore >= 60 ? (
              <Target className="w-3 h-3 text-yellow-500" />
            ) : (
              <TrendingDown className="w-3 h-3 text-red-500" />
            )}
            <span className={`font-semibold ${
              analytics.overallScore >= 80 ? 'text-green-600' :
              analytics.overallScore >= 60 ? 'text-yellow-600' : 'text-red-600'
            } ${printMode ? 'text-xs' : 'text-sm'}`}>
              {analytics.overallScore >= 80 ? 'Ascending' :
               analytics.overallScore >= 60 ? 'Stable' : 'Needs Focus'}
            </span>
          </div>
        </div>
        <div className="flex items-center justify-between mt-1">
          <span className={`text-gray-600 ${printMode ? 'text-xs' : 'text-xs'}`}>
            Tasks: {analytics.completedItems}/{analytics.totalItems}
          </span>
          <span className={`text-gray-600 ${printMode ? 'text-xs' : 'text-xs'}`}>
            Completion: {analytics.completionRate.toFixed(0)}%
          </span>
        </div>
      </div>
    </div>
  )
}