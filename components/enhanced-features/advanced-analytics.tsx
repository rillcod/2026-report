"use client"

import { useState, useMemo } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts"
import { TrendingUp, Users, Award, Calendar, Download } from "lucide-react"

interface AdvancedAnalyticsProps {
  reports: any[]
  onExport?: (data: any) => void
}

export function AdvancedAnalytics({ reports, onExport }: AdvancedAnalyticsProps) {
  const [timeRange, setTimeRange] = useState("all")
  const [chartType, setChartType] = useState("overview")

  // Calculate analytics data
  const analyticsData = useMemo(() => {
    if (!reports.length) return null

    // Filter by time range
    let filteredReports = reports
    if (timeRange !== "all") {
      const now = new Date()
      const daysBack = timeRange === "week" ? 7 : timeRange === "month" ? 30 : 90
      const cutoffDate = new Date(now.getTime() - daysBack * 24 * 60 * 60 * 1000)
      filteredReports = reports.filter((r) => new Date(r.reportDate) >= cutoffDate)
    }

    // Grade distribution
    const gradeDistribution = filteredReports.reduce(
      (acc, report) => {
        const theory = Number(report.theoryScore) || 0;
        const practical = Number(report.practicalScore) || 0;
        const attendance = Number(report.attendance) || 0;
        const avgScore = isNaN(theory) || isNaN(practical) || isNaN(attendance) ? 0 : (theory + practical + attendance) / 3;
        const grade = calculateGrade(avgScore)
        acc[grade] = (acc[grade] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    // Performance trends
    const performanceTrends = filteredReports
      .sort((a, b) => new Date(a.reportDate).getTime() - new Date(b.reportDate).getTime())
      .map((report) => ({
        date: new Date(report.reportDate).toLocaleDateString(),
        theory: Number(report.theoryScore) || 0,
        practical: Number(report.practicalScore) || 0,
        attendance: Number(report.attendance) || 0,
        overall: (() => {
          const theory = Number(report.theoryScore) || 0;
          const practical = Number(report.practicalScore) || 0;
          const attendance = Number(report.attendance) || 0;
          return isNaN(theory) || isNaN(practical) || isNaN(attendance) ? 0 : (theory + practical + attendance) / 3;
        })(),
      }))

    // School performance
    const schoolPerformance = filteredReports.reduce(
      (acc, report) => {
        const school = report.schoolName || "Unknown"
        if (!acc[school]) {
          acc[school] = { total: 0, sum: 0, reports: 0 }
        }
        const theory = Number(report.theoryScore) || 0;
        const practical = Number(report.practicalScore) || 0;
        const attendance = Number(report.attendance) || 0;
        const avgScore = isNaN(theory) || isNaN(practical) || isNaN(attendance) ? 0 : (theory + practical + attendance) / 3;
        acc[school].sum += avgScore
        acc[school].reports += 1
        acc[school].total = acc[school].sum / acc[school].reports
        return acc
      },
      {} as Record<string, any>,
    )

    // Subject performance
    const subjectPerformance = [
      {
        subject: "Theory",
        average: filteredReports.reduce((sum, r) => {
          const score = Number(r.theoryScore) || 0;
          return sum + (isNaN(score) ? 0 : score);
        }, 0) / (filteredReports.length || 1),
        count: filteredReports.length,
      },
      {
        subject: "Practical",
        average: filteredReports.reduce((sum, r) => {
          const score = Number(r.practicalScore) || 0;
          return sum + (isNaN(score) ? 0 : score);
        }, 0) / (filteredReports.length || 1),
        count: filteredReports.length,
      },
      {
        subject: "Attendance",
        average: filteredReports.reduce((sum, r) => {
          const score = Number(r.attendance) || 0;
          return sum + (isNaN(score) ? 0 : score);
        }, 0) / (filteredReports.length || 1),
        count: filteredReports.length,
      },
    ]

    // Define grade value mapping outside the reduce function
    const gradeValueMap: Record<string, number> = { A: 4, B: 3, C: 2, D: 1, F: 0 }

    return {
      totalReports: filteredReports.length,
      averageGrade:
        Object.entries(gradeDistribution).reduce((acc, [grade, count]) => {
          const gradeValue = gradeValueMap[grade] || 0
          return acc + gradeValue * (count as number)
        }, 0) / filteredReports.length,
      gradeDistribution: Object.entries(gradeDistribution).map(([grade, count]) => {
        const countNumber = count as number
        return {
          grade,
          count: countNumber,
          percentage: ((countNumber / filteredReports.length) * 100).toFixed(1),
        }
      }),
      performanceTrends,
      schoolPerformance: Object.entries(schoolPerformance).map(([school, data]) => {
        const schoolData = data as { total: number; reports: number }
        return {
          school,
          average: schoolData.total.toFixed(1),
          reports: schoolData.reports,
        }
      }),
      subjectPerformance,
    }
  }, [reports, timeRange])

  const calculateGrade = (score: number): string => {
    if (score >= 85) return "A"
    if (score >= 70) return "B"
    if (score >= 65) return "C"
    if (score >= 50) return "D"
    return "F"
  }

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

  if (!analyticsData) {
    return (
      <Card className="p-6">
        <div className="text-center text-gray-500">
          <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No data available for analytics</p>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex justify-between items-center">
        <div className="flex gap-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="week">Last Week</SelectItem>
              <SelectItem value="month">Last Month</SelectItem>
              <SelectItem value="quarter">Last Quarter</SelectItem>
            </SelectContent>
          </Select>

          <Select value={chartType} onValueChange={setChartType}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="overview">Overview</SelectItem>
              <SelectItem value="trends">Trends</SelectItem>
              <SelectItem value="schools">Schools</SelectItem>
              <SelectItem value="subjects">Subjects</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button onClick={() => onExport?.(analyticsData)} variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export Analytics
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-blue-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Reports</p>
              <p className="text-2xl font-bold">{analyticsData.totalReports}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center">
            <Award className="h-8 w-8 text-green-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Average Grade</p>
              <p className="text-2xl font-bold">{analyticsData.averageGrade.toFixed(1)}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-purple-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Top Grade</p>
              <p className="text-2xl font-bold">
                {analyticsData.gradeDistribution.sort((a, b) => b.count - a.count)[0]?.grade || "N/A"}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-orange-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Time Range</p>
              <p className="text-2xl font-bold">{timeRange === "all" ? "All" : timeRange}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Charts */}
      {chartType === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Grade Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analyticsData.gradeDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ grade, percentage }) => `${grade}: ${percentage}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {analyticsData.gradeDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Subject Performance</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analyticsData.subjectPerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="subject" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="average" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>
      )}

      {chartType === "trends" && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Performance Trends</h3>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={analyticsData.performanceTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="theory" stroke="#8884d8" name="Theory" />
              <Line type="monotone" dataKey="practical" stroke="#82ca9d" name="Practical" />
              <Line type="monotone" dataKey="attendance" stroke="#ffc658" name="Attendance" />
              <Line type="monotone" dataKey="overall" stroke="#ff7300" name="Overall" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      )}

      {chartType === "schools" && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">School Performance</h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={analyticsData.schoolPerformance}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="school" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="average" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      )}
    </div>
  )
}
