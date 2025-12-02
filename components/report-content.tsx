"use client"

import { useEffect, useRef, useState, useMemo } from "react"
import QRCode from "qrcode"
import { calculateGrade, replacePlaceholders } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { getEnhancedCourseContent } from "@/lib/enhanced-course-content"
import ProgressItemList from "./progress-item-list"
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from "recharts"

interface ReportContentProps {
  formData: any
  settings: any
  printMode?: boolean
  minimalView?: boolean
  tier?: "minimal" | "standard" | "hd"
}

// Helper function to determine student level
const getStudentLevel = (theoryScore: number, practicalScore: number, attendance: number) => {
  const overallScore = (theoryScore + practicalScore) / 2
  if (overallScore >= 85 && attendance >= 85) return "advanced"
  if (overallScore >= 70 && attendance >= 70) return "intermediate"
  return "beginner"
}

// Helper function to get grade color
function getGradeColor(grade: string) {
  switch (grade) {
    case "A":
      return {
        outer: "linear-gradient(135deg, #d4af37 0%, #f9f295 50%, #d4af37 100%)",
        inner: "linear-gradient(135deg, #b8860b 0%, #d4af37 50%, #b8860b 100%)",
        border: "#b8860b",
      }
    case "B":
      return {
        outer: "linear-gradient(135deg, #C0C0C0 0%, #E8E8E8 50%, #C0C0C0 100%)",
        inner: "linear-gradient(135deg, #A9A9A9 0%, #C0C0C0 50%, #A9A9A9 100%)",
        border: "#A9A9A9",
      }
    case "C":
      return {
        outer: "linear-gradient(135deg, #CD7F32 0%, #E6BE8A 50%, #CD7F32 100%)",
        inner: "linear-gradient(135deg, #B87333 0%, #CD7F32 50%, #B87333 100%)",
        border: "#B87333",
      }
    default:
      return {
        outer: "linear-gradient(135deg, #6c757d 0%, #adb5bd 50%, #6c757d 100%)",
        inner: "linear-gradient(135deg, #495057 0%, #6c757d 50%, #495057 100%)",
        border: "#495057",
      }
  }
}

export function ReportContent({ formData, settings, printMode = false, minimalView = false, tier = "standard" }: ReportContentProps) {
  const reportRef = useRef<HTMLDivElement>(null)
  const qrCodeRef = useRef<HTMLDivElement>(null)
  const [logoLoaded, setLogoLoaded] = useState(false)

  const isHDPremium = tier === "hd"
  const enhancedSpacing = printMode ? "" : (isHDPremium ? "space-y-8" : "space-y-6")
  const sectionSpacing = printMode ? "mb-1" : "mb-6"
  const cardPadding = printMode ? "p-2" : "p-6"

  const getCourseData = (courseName: string) => {
    const courseContent = getEnhancedCourseContent(courseName);
    return courseContent || getEnhancedCourseContent("scratch");
  };

  const generateCourseSpecificComments = (courseName: string, studentName: string, level: "beginner" | "intermediate" | "advanced", scores: {theory: number, practical: number, attendance: number}) => {
    const course = getCourseData(courseName);
    if (!course || !course.comments) return "No comments available.";
    const firstName = studentName.split(" ")[0] || "The student";
    const commentTemplates = course.comments;
    const levelComments = commentTemplates[level];
    
    let selectedComment = levelComments[0]; // Default
    if (scores.theory >= 90 && scores.practical >= 90) {
      selectedComment = levelComments[levelComments.length - 1];
    } else if (scores.theory >= 80 || scores.practical >= 80) {
      selectedComment = levelComments[Math.min(1, levelComments.length - 1)];
    }
    
    return selectedComment.replace(/\[firstName\]/g, firstName);
  };

  const generateCourseSpecificStrengths = (courseName: string, studentName: string, level: "beginner" | "intermediate" | "advanced", scores: {theory: number, practical: number, attendance: number}) => {
    const course = getCourseData(courseName);
    if (!course || !course.strengths) return [];
    const strengthTemplates = course.strengths;
    const levelStrengths = strengthTemplates[level];
    
    const selectedStrengths: string[] = [];
    if (scores.theory >= 85) selectedStrengths.push(levelStrengths[0]);
    if (scores.practical >= 85) selectedStrengths.push(levelStrengths[1]);
    if (scores.attendance >= 90 && levelStrengths.length > 4) selectedStrengths.push(levelStrengths[4]);
    if (selectedStrengths.length < 2 && levelStrengths.length > 2) {
      selectedStrengths.push(levelStrengths[2]);
    }
    
    return selectedStrengths.slice(0, 3);
  };

  const generateCourseSpecificGrowthAreas = (courseName: string, studentName: string, level: "beginner" | "intermediate" | "advanced", scores: {theory: number, practical: number, attendance: number}) => {
    const course = getCourseData(courseName);
    if (!course || !course.growthAreas) return [];
    const growthTemplates = course.growthAreas;
    const levelGrowth = growthTemplates[level];

    const selectedGrowth: string[] = [];
    if (scores.theory < 80) selectedGrowth.push(levelGrowth[0]);
    if (scores.practical < 80) selectedGrowth.push(levelGrowth[1]);
    if (scores.attendance < 85 && levelGrowth.length > 4) selectedGrowth.push(levelGrowth[4]);
    if (selectedGrowth.length < 2 && levelGrowth.length > 2) {
      selectedGrowth.push(levelGrowth[2]);
    }

    return selectedGrowth.slice(0, 3);
  };

  const {
    formattedDate,
    theoryScore,
    practicalScore,
    attendance,
    theoryGrade,
    practicalGrade,
    attendanceGrade,
    overallGrade,
    processedCertText,
    gradeColor,
    courseData,
    studentLevel,
    courseSpecificComments,
    courseSpecificStrengths,
    courseSpecificGrowthAreas,
    courseProgressItems,
  } = useMemo(() => {
    const reportDate = formData.reportDate ? new Date(formData.reportDate) : new Date()
    const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" }
    const formattedDate = reportDate.toLocaleDateString("en-US", options)

    const theoryScore = Number.isNaN(Number.parseInt(formData.theoryScore)) ? 0 : Number.parseInt(formData.theoryScore) || 0
    const practicalScore = Number.isNaN(Number.parseInt(formData.practicalScore)) ? 0 : Number.parseInt(formData.practicalScore) || 0
    const attendance = Number.isNaN(Number.parseInt(formData.attendance)) ? 0 : Number.parseInt(formData.attendance) || 0

    const theoryGrade = calculateGrade(theoryScore)
    const practicalGrade = calculateGrade(practicalScore)
    const attendanceGrade = calculateGrade(attendance)
    
    const calculatedOverallScore = (theoryScore + practicalScore + attendance) / 3
    const overallScore = Number.isNaN(calculatedOverallScore) ? 0 : Math.round(calculatedOverallScore)
    const overallGrade = calculateGrade(overallScore)

    // Prefer course selected in the form, then global settings, then fallback
    const courseName = formData.courseName || settings.courseName || "Python Programming";
    const studentName = formData.studentName || "The student";
    const studentLevel = getStudentLevel(theoryScore, practicalScore, attendance);
    
    const scores = { theory: theoryScore, practical: practicalScore, attendance };

    const generatedComments = generateCourseSpecificComments(courseName, studentName, studentLevel, scores);
    const generatedStrengths = generateCourseSpecificStrengths(courseName, studentName, studentLevel, scores);
    const generatedGrowth = generateCourseSpecificGrowthAreas(courseName, studentName, studentLevel, scores);

    const courseSpecificComments = formData.comments || generatedComments;

    // Normalize strengths and growth areas so ReportContent can always map over arrays
    const normalizeList = (value: unknown, fallback: string[]): string[] => {
      if (Array.isArray(value)) return value as string[];
      if (typeof value === "string") {
        const items = value
          .split(/\r?\n/)
          .map((item) => item.trim())
          .filter(Boolean);
        if (items.length > 0) return items;
      }
      return fallback;
    };

    const courseSpecificStrengths = normalizeList(formData.strengths, generatedStrengths);
    const courseSpecificGrowthAreas = normalizeList(formData.growth, generatedGrowth);
    
    const courseData = getCourseData(courseName);
    const courseProgressItems = formData.progressItems && formData.progressItems.length > 0 
      ? formData.progressItems 
      : courseData?.modules?.[0]?.topics || [];

    const processedCertText = replacePlaceholders(
      formData.certificateText ||
        `This certifies that [Student Name] has successfully completed the ${courseData?.name || '[Course Name]'} course, demonstrating ${studentLevel}-level proficiency in ${courseName} at Rillcod Technologies.`,
      {
        "Student Name": studentName,
        "Course Name": courseName,
        "Course Module": settings.currentModule || courseData?.modules?.[0]?.name || "[Course Module]",
      }
    )

    const gradeColor = getGradeColor(overallGrade)

    return {
      formattedDate,
      theoryScore,
      practicalScore,
      attendance,
      theoryGrade,
      practicalGrade,
      attendanceGrade,
      overallGrade,
      processedCertText,
      gradeColor,
      courseData,
      studentLevel,
      courseSpecificComments,
      courseSpecificStrengths,
      courseSpecificGrowthAreas,
      courseProgressItems,
    }
  }, [formData, settings])

  useEffect(() => {
    if (settings.showQRCode !== false && qrCodeRef.current) {
      const qrData = `STUDENT: ${formData.studentName || "Unknown"}
COURSE: ${settings.courseName || "Unknown"}
OVERALL GRADE: ${overallGrade}
DATE: ${formattedDate}`
      
      const canvas = document.createElement("canvas")
      QRCode.toCanvas(canvas, qrData, { width: 120, margin: 1 }, (error) => {
        if (error) console.error(error)
        if (qrCodeRef.current) {
          qrCodeRef.current.innerHTML = ""
          qrCodeRef.current.appendChild(canvas)
        }
      })
    }
  }, [formData, settings, overallGrade, formattedDate])

  if (minimalView) {
    return (
        <div>Minimal View</div>
    )
  }

  return (
    <div
      ref={reportRef}
      className={`page ${printMode ? "bg-white" : "bg-white"} text-black ${printMode ? "print-mode" : ""} ${enhancedSpacing}`}
      style={{
        fontSize: printMode ? (isHDPremium ? "12px" : "11px") : (isHDPremium ? "14px" : "12px"),
        width: "210mm",
        minWidth: "210mm",
        maxWidth: "210mm",
        minHeight: printMode ? "auto" : "auto",
        maxHeight: printMode ? "297mm" : "none",
        boxSizing: "border-box",
        overflowX: "hidden",
        overflowY: "visible",
        padding: printMode ? "1mm" : (isHDPremium ? "24px" : "16px"),
        margin: "0 auto",
        color: "#000000",
        pageBreakAfter: printMode ? "always" : "auto",
        pageBreakInside: printMode ? "avoid" : "auto",
        display: "block",
        visibility: "visible",
        opacity: 1,
      }}
    >

      <div className={`mb-${isHDPremium ? '8' : '6'} relative z-10`}>
        {isHDPremium || tier === "standard" ? (
          <div className={`bg-white ${printMode ? '' : 'border border-gray-200 rounded-xl shadow-lg'} overflow-hidden`}>
            <div className={`${printMode ? 'bg-gray-800' : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600'} ${printMode ? 'p-2' : 'p-5'}`} style={printMode ? { backgroundColor: '#1f2937', color: '#ffffff' } : { color: 'white' }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="bg-white p-2.5 rounded-full shadow-xl">
                    <img
                      src="/images/rillcod-logo.png"
                      alt="Rillcod Technologies"
                      className="h-10 w-10 object-contain"
                      style={{ display: 'block', visibility: 'visible', opacity: 1 }}
                    />
                  </div>
                  <div>
                  <div className={`${printMode ? 'text-2xl' : 'text-xl'} font-bold tracking-wide`} style={printMode ? { color: '#ffffff' } : { color: 'white' }}>RILLCOD TECHNOLOGIES</div>
                    <div className={`${printMode ? 'text-base' : 'text-sm'} mt-0.5`} style={printMode ? { color: '#ffffff' } : { color: 'rgba(255, 255, 255, 0.9)' }}>Excellence in Educational Technology</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`${printMode ? 'text-lg' : 'text-base'} font-semibold tracking-wide`} style={printMode ? { color: '#ffffff' } : { color: 'white' }}>Student Progress Report</div>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-2.5 border-b border-gray-200">
              <div className={`flex flex-wrap items-center justify-center gap-x-4 gap-y-1 ${printMode ? 'text-sm' : 'text-xs'}`}>
                <div className="flex items-center gap-1.5">
                  <span className="text-blue-800 font-semibold">📍</span>
                  <span className="text-gray-700">26 Ogiesoba Avenue, Off Airport Road, GRA, Benin City</span>
                </div>
                <span className="text-gray-400">•</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-blue-800 font-semibold">📞</span>
                  <span className="text-gray-700">08116600091</span>
                </div>
                <span className="text-gray-400">•</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-blue-800 font-semibold">✉️</span>
                  <span className="text-gray-700">rillcod@gmail.com</span>
                </div>
                <span className="text-gray-400">•</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-blue-800 font-semibold">🌐</span>
                  <span className="text-gray-700">www.rillcod.com</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div
              className="bg-gradient-to-r from-navy-900 via-navy-800 to-navy-900 text-white p-4 rounded-t-lg"
              style={{ background: "linear-gradient(90deg, #1e3a8a 0%, #1e40af 50%, #1e3a8a 100%)" }}
            >
              <div className="grid grid-cols-3 gap-4 items-center">
                <div className="text-left">
                  <div className="text-sm font-bold mb-1 text-white">RILLCOD TECHNOLOGIES</div>
                  <div className="text-xs opacity-95 text-white/90">Coding Today, Innovating Tomorrow</div>
                </div>

                <div className="flex justify-center items-center">
                  <div className="bg-white rounded-full p-2 shadow-lg">
                    <img
                      src="/images/rillcod-logo.png"
                      alt="Rillcod Logo"
                      crossOrigin="anonymous"
                      style={{ height: "40px", maxWidth: "120px", display: "block", objectFit: "contain" }}
                      onLoad={() => setLogoLoaded(true)}
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder-logo.png"
                      }}
                    />
                  </div>
                </div>

                <div className="text-right text-xs">
                  <div className="font-semibold text-white">rillcod@gmail.com</div>
                  <div className="opacity-95 text-white/90">08116600091</div>
                </div>
              </div>
            </div>

            <div className="text-white text-center py-3 font-bold text-lg tracking-wide" style={{ background: "linear-gradient(90deg, #dc2626 0%, #ef4444 50%, #dc2626 100%)" }}>
              STUDENT PROGRESS REPORT
            </div>

            <div className="bg-gray-100 text-center py-1.5 text-xs text-gray-800 border-b-2" style={{ borderColor: "#dc2626" }}>
              📍 26 Ogiesoba Avenue, Off Airport Road, GRA, Benin City • 📞 08116600091 • ✉️ rillcod@gmail.com • 🌐 {settings.schoolWebsite || "www.rillcod.com"}
            </div>
          </div>
        )}
      </div>

      <div className={`${sectionSpacing} relative z-10`}>
        <div className={`bg-white ${printMode ? '' : 'border border-gray-200 rounded-lg shadow-sm'} overflow-hidden`}>
          <div className={`${printMode ? 'bg-gray-700' : 'bg-gradient-to-r from-blue-600 to-blue-700'} ${printMode ? 'px-3 py-1.5' : 'px-6 py-4'}`} style={printMode ? { backgroundColor: '#374151', color: '#ffffff' } : { color: 'white' }}>
            <h3 className={`${printMode ? 'text-sm' : 'text-lg'} font-semibold tracking-wide`} style={printMode ? { color: '#ffffff' } : { color: 'white' }}>STUDENT INFORMATION</h3>
          </div>
          <div className={`${cardPadding} ${printMode ? 'text-xs' : 'text-sm'}`}>
            <div className={`grid grid-cols-1 md:grid-cols-2 ${printMode ? 'gap-2' : 'gap-3'}`}>
              <div className={printMode ? "space-y-0.5" : "space-y-2"}>
            <div className="flex items-start">
              <span className={`${printMode ? 'text-xs' : 'text-sm'} font-semibold ${printMode ? 'w-24' : 'w-32'} shrink-0`} style={{ color: "#1e3a8a" }}>Student Name:</span>
              <span className={`${printMode ? 'text-xs' : 'text-sm'} text-gray-900 font-medium flex-1`}>{formData.studentName || "[Full Name]"}</span>
            </div>
            <div className="flex items-start">
              <span className={`${printMode ? 'text-xs' : 'text-sm'} font-semibold ${printMode ? 'w-24' : 'w-32'} shrink-0`} style={{ color: "#1e3a8a" }}>School:</span>
              <span className={`${printMode ? 'text-xs' : 'text-sm'} text-gray-900 flex-1`}>{formData.schoolName || settings.schoolName || "[School Name]"}</span>
            </div>
            <div className="flex items-start">
              <span className={`${printMode ? 'text-xs' : 'text-sm'} font-semibold ${printMode ? 'w-24' : 'w-32'} shrink-0`} style={{ color: "#1e3a8a" }}>Section/Class:</span>
              <span className={`${printMode ? 'text-xs' : 'text-sm'} text-gray-900 flex-1`}>{formData.studentSection || "[Section/Class]"}</span>
            </div>
            <div className="flex items-start">
              <span className={`${printMode ? 'text-xs' : 'text-sm'} font-semibold ${printMode ? 'w-24' : 'w-32'} shrink-0`} style={{ color: "#1e3a8a" }}>Course:</span>
              <span className={`${printMode ? 'text-xs' : 'text-sm'} text-gray-900 flex-1`}>
                {formData.courseName || settings.courseName || "Python Programming"}
              </span>
            </div>
          </div>
          <div className={printMode ? "space-y-0.5" : "space-y-2"}>
            <div className="flex items-start">
              <span className={`${printMode ? 'text-xs' : 'text-sm'} font-semibold ${printMode ? 'w-24' : 'w-32'} shrink-0`} style={{ color: "#1e3a8a" }}>Current Module:</span>
              <span className={`${printMode ? 'text-xs' : 'text-sm'} text-gray-900 flex-1`}>{settings.currentModule || "Variables to Conditionals"}</span>
            </div>
            <div className="flex items-start">
              <span className={`${printMode ? 'text-xs' : 'text-sm'} font-semibold ${printMode ? 'w-24' : 'w-32'} shrink-0`} style={{ color: "#1e3a8a" }}>Report Date:</span>
              <span className={`${printMode ? 'text-xs' : 'text-sm'} text-gray-900 flex-1`}>{formattedDate}</span>
            </div>
            <div className="flex items-start">
              <span className={`${printMode ? 'text-xs' : 'text-sm'} font-semibold ${printMode ? 'w-24' : 'w-32'} shrink-0`} style={{ color: "#1e3a8a" }}>Instructor:</span>
              <span className={`${printMode ? 'text-xs' : 'text-sm'} text-gray-900 flex-1`}>{settings.instructorName || "Rillcod Instructor"}</span>
            </div>
            <div className="flex items-start">
              <span className={`${printMode ? 'text-xs' : 'text-sm'} font-semibold ${printMode ? 'w-24' : 'w-32'} shrink-0`} style={{ color: "#1e3a8a" }}>Duration:</span>
              <span className={`${printMode ? 'text-xs' : 'text-sm'} text-gray-900 flex-1`}>{settings.duration || "12 weeks"}</span>
            </div>
          </div>
            </div>
          </div>
        </div>
      </div>

      <div className={`${sectionSpacing} relative z-10`}>
        <div className={`bg-white ${printMode ? '' : 'border border-gray-200 rounded-lg shadow-sm'} overflow-hidden`}>
          <div className={`${printMode ? 'bg-gray-700' : 'bg-gradient-to-r from-indigo-600 to-indigo-700'} ${printMode ? 'px-3 py-1.5' : 'px-6 py-4'}`} style={printMode ? { backgroundColor: '#374151', color: '#ffffff' } : { color: 'white' }}>
            <h3 className={`${printMode ? 'text-sm' : 'text-lg'} font-semibold tracking-wide`} style={printMode ? { color: '#ffffff' } : { color: 'white' }}>COURSE PROGRESS</h3>
          </div>
          
          <div className={cardPadding}>
            <div className={printMode ? "space-y-0.5" : "space-y-3"}>
              <ProgressItemList title="Learning Milestones" items={courseProgressItems} />
            </div>

            {/* Next Module Section */}
            <div className={`${printMode ? 'mt-1' : 'mt-6'} bg-gray-50 rounded-lg ${printMode ? 'p-1' : 'p-4'}`}>
              <h5 className={`${printMode ? 'text-xs' : 'text-sm'} font-semibold text-gray-900 ${printMode ? 'mb-0' : 'mb-1'}`}>
                Next Module: {settings.nextModule || formData.nextModule || "To be announced"}
              </h5>
            </div>
          </div>
        </div>
      </div>

      <div className={`grid grid-cols-1 lg:grid-cols-2 ${printMode ? 'gap-3' : 'gap-6'} ${sectionSpacing} relative z-10`}>
        <div className={`bg-white ${printMode ? '' : 'border border-gray-200 rounded-lg shadow-sm'} overflow-hidden`}>
          <div className={`${printMode ? 'bg-gray-700' : 'bg-gradient-to-r from-slate-600 to-slate-700'} ${printMode ? 'px-3 py-1.5' : 'px-6 py-4'}`} style={printMode ? { backgroundColor: '#374151', color: '#ffffff' } : { color: 'white' }}>
            <h3 className={`${printMode ? 'text-sm' : 'text-lg'} font-semibold tracking-wide`} style={printMode ? { color: '#ffffff' } : { color: 'white' }}>PERFORMANCE METRICS</h3>
          </div>
          
          <div className={`${cardPadding} ${printMode ? 'space-y-1' : 'space-y-4'}`}>
            {/* Performance Bar Chart */}
            <div className={`bg-slate-50 ${printMode ? 'border-0' : 'border border-slate-200 rounded-lg'} ${printMode ? 'p-1' : 'p-4'}`}>
              {!printMode && (
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-slate-900 mb-3">Performance Overview</h4>
                </div>
              )}
              <ResponsiveContainer width="100%" height={printMode ? 150 : 200}>
                <BarChart
                  data={[
                    { name: "Theory", score: theoryScore, fill: "#3b82f6", grade: theoryGrade },
                    { name: "Practical", score: practicalScore, fill: "#10b981", grade: practicalGrade },
                    { name: "Attendance", score: attendance, fill: "#8b5cf6", grade: attendanceGrade },
                  ]}
                  margin={{ top: 5, right: 5, left: 5, bottom: printMode ? 10 : 20 }}
                >
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: printMode ? 11 : 13, fill: '#64748b', fontWeight: 'bold' }}
                    axisLine={{ stroke: '#cbd5e1' }}
                    tickFormatter={(value, index) => {
                      const scores = [
                        { name: "Theory", score: theoryScore, grade: theoryGrade },
                        { name: "Practical", score: practicalScore, grade: practicalGrade },
                        { name: "Attendance", score: attendance, grade: attendanceGrade },
                      ]
                      const item = scores[index]
                      return item ? `${value}\n${item.score}% (${item.grade})` : value
                    }}
                    height={printMode ? 20 : 30}
                  />
                  <YAxis 
                    domain={[0, 100]}
                    tick={{ fontSize: printMode ? 10 : 12, fill: '#64748b' }}
                    axisLine={{ stroke: '#cbd5e1' }}
                    width={printMode ? 30 : 40}
                  />
                  <Bar 
                    dataKey="score" 
                    radius={[8, 8, 0, 0]}
                    label={{ position: 'top', fontSize: printMode ? 10 : 12, fill: '#475569', fontWeight: 'bold' }}
                  >
                    {[
                      { name: "Theory", score: theoryScore, fill: "#3b82f6" },
                      { name: "Practical", score: practicalScore, fill: "#10b981" },
                      { name: "Attendance", score: attendance, fill: "#8b5cf6" },
                    ].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className={`${printMode ? 'pt-2' : 'pt-4'} border-t border-gray-200`}>
              <h4 className={`${printMode ? 'text-xs' : 'text-sm'} font-semibold text-slate-900 ${printMode ? 'mb-1' : 'mb-3'}`}>Assessment Summary</h4>
              <div className={printMode ? "space-y-1" : "space-y-2.5"}>
                <div className={`flex items-center justify-between ${printMode ? 'py-0.5' : 'py-1.5'}`}>
                  <span className={`${printMode ? 'text-xs' : 'text-sm'} text-gray-600 font-medium`}>Participation:</span>
                  <span className={`${printMode ? 'text-xs' : 'text-sm'} font-semibold text-slate-700`}>{formData.participation || "Very Good"}</span>
                </div>
                <div className={`flex items-center justify-between ${printMode ? 'py-0.5' : 'py-1.5'}`}>
                  <span className={`${printMode ? 'text-xs' : 'text-sm'} text-gray-600 font-medium`}>Projects:</span>
                  <span className={`${printMode ? 'text-xs' : 'text-sm'} font-semibold text-slate-700`}>{formData.projectCompletion || "Not Specified"}</span>
                </div>
                <div className={`flex items-center justify-between ${printMode ? 'py-0.5' : 'py-1.5'}`}>
                  <span className={`${printMode ? 'text-xs' : 'text-sm'} text-gray-600 font-medium`}>Homework:</span>
                  <span className={`${printMode ? 'text-xs' : 'text-sm'} font-semibold text-slate-700`}>{formData.homeworkCompletion || "Not Specified"}</span>
                </div>
                <div className={`flex items-center justify-between ${printMode ? 'pt-1 mt-1' : 'pt-3 mt-3'} border-t-2 border-gray-300`}>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className={`${printMode ? 'text-xs' : 'text-sm'} text-gray-600 font-bold`}>Overall Grade:</span>
                    <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className={`${printMode ? 'text-2xl' : 'text-3xl'} font-black text-indigo-700 tracking-tight`}>{overallGrade}</span>
                    <svg className="w-5 h-5 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={`bg-white ${printMode ? '' : 'border border-gray-200 rounded-lg shadow-sm'} overflow-hidden`}>
          <div className={`${printMode ? 'bg-gray-700' : 'bg-gradient-to-r from-blue-600 to-blue-700'} ${printMode ? 'px-3 py-1.5' : 'px-6 py-4'}`} style={printMode ? { backgroundColor: '#374151', color: '#ffffff' } : { color: 'white' }}>
            <h3 className={`${printMode ? 'text-sm' : 'text-lg'} font-semibold tracking-wide`} style={printMode ? { color: '#ffffff' } : { color: 'white' }}>INSTRUCTOR EVALUATION</h3>
          </div>
          <div className={cardPadding}>
            <div className={printMode ? "space-y-1" : "space-y-4"}>
                <div className={`bg-white ${printMode ? 'border-l-2' : 'border-l-4'} border-green-500 ${printMode ? 'p-1.5' : 'p-4'} ${printMode ? '' : 'hover:shadow-sm transition-shadow'}`}>
                    <h4 className={`${printMode ? 'text-xs' : 'text-base'} font-semibold text-gray-900 ${printMode ? 'mb-0.5' : 'mb-2'}`}>Key Strengths</h4>
                    <ul className={`list-disc list-inside ${printMode ? 'space-y-0' : 'space-y-1'} ${printMode ? 'text-xs' : 'text-sm'} text-gray-700`}>
                        {courseSpecificStrengths.map((strength, index) => <li key={index}>{strength}</li>)}
                    </ul>
                </div>
                <div className={`bg-white ${printMode ? 'border-l-2' : 'border-l-4'} border-yellow-500 ${printMode ? 'p-1.5' : 'p-4'} ${printMode ? '' : 'hover:shadow-sm transition-shadow'}`}>
                    <h4 className={`${printMode ? 'text-xs' : 'text-base'} font-semibold text-gray-900 ${printMode ? 'mb-0.5' : 'mb-2'}`}>Areas for Growth</h4>
                    <ul className={`list-disc list-inside ${printMode ? 'space-y-0' : 'space-y-1'} ${printMode ? 'text-xs' : 'text-sm'} text-gray-700`}>
                        {courseSpecificGrowthAreas.map((area, index) => <li key={index}>{area}</li>)}
                    </ul>
                </div>
            </div>

            <div className={`${printMode ? 'mt-1' : 'mt-6'} ${printMode ? 'bg-white border-l-2 border-gray-400' : 'bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border border-gray-200'} ${printMode ? 'p-1.5' : 'p-5'}`}>
              <h4 className={`${printMode ? 'text-xs' : 'text-base'} font-semibold text-gray-900 ${printMode ? 'mb-1' : 'mb-3'} flex items-center`}>
                <span className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center mr-2">
                  <span className="text-white text-xs font-bold">💭</span>
                </span>
                Instructor Overall Assessment
              </h4>
              <div className={`${printMode ? 'text-xs' : 'text-sm'} text-gray-700 ${printMode ? 'leading-tight' : 'leading-relaxed'}`}>
                {courseSpecificComments}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={`${sectionSpacing} relative z-10 ${printMode ? '' : 'overflow-visible'}`}>
        <div className={`bg-white ${printMode ? '' : 'border border-gray-200 rounded-lg shadow-sm'} ${printMode ? 'overflow-hidden' : 'overflow-visible'}`}>
          <div className={`${printMode ? 'bg-gray-700' : 'bg-gradient-to-r from-amber-600 to-yellow-600'} ${printMode ? 'px-3 py-1.5' : 'px-6 py-4'}`} style={printMode ? { backgroundColor: '#374151', color: '#ffffff' } : { color: 'white' }}>
            <h3 className={`${printMode ? 'text-sm' : 'text-lg'} font-semibold tracking-wide text-center`} style={printMode ? { color: '#ffffff' } : { color: 'white' }}>CERTIFICATE OF COMPLETION</h3>
          </div>
          
          <div className={`certificate-container ${printMode ? 'bg-white' : 'bg-gradient-to-br from-amber-50 to-yellow-50'} ${cardPadding} text-center ${isHDPremium ? 'text-base' : 'text-sm'} relative ${printMode ? 'overflow-hidden' : 'overflow-visible'} ${printMode ? '' : 'shadow-xl'} ${printMode ? '' : 'backdrop-blur-sm'}`} style={printMode ? {} : { 
            border: '3px solid #f59e0b', 
            borderRadius: '12px',
            boxShadow: '0 10px 25px -5px rgba(245, 158, 11, 0.2), 0 8px 10px -6px rgba(245, 158, 11, 0.1)',
            background: printMode ? 'white' : 'linear-gradient(135deg, #fef3c7 0%, #fde68a 50%, #fcd34d 100%)'
          }}>
            {/* Decorative Corner Elements - Top Left */}
            {!printMode && (
              <div className="absolute -top-4 -left-4 w-20 h-20 z-20" style={{ pointerEvents: 'none' }}>
                <svg viewBox="0 0 80 80" className="w-full h-full" style={{ filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.2))' }}>
                  <path d="M40,10 C25,10 10,25 10,40 C10,55 25,70 40,70" fill="none" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round"/>
                  <circle cx="20" cy="20" r="4" fill="#f59e0b"/>
                  <circle cx="30" cy="15" r="3" fill="#fbbf24"/>
                  <circle cx="15" cy="30" r="3" fill="#fbbf24"/>
                  <path d="M25,25 Q30,20 35,25" fill="none" stroke="#f59e0b" strokeWidth="2"/>
                  <circle cx="28" cy="22" r="2" fill="#fbbf24"/>
                </svg>
              </div>
            )}
            
            {/* Decorative Corner Elements - Top Right */}
            {!printMode && (
              <div className="absolute -top-4 -right-4 w-20 h-20 z-20" style={{ pointerEvents: 'none' }}>
                <svg viewBox="0 0 80 80" className="w-full h-full transform rotate-90" style={{ filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.2))' }}>
                  <path d="M40,10 C25,10 10,25 10,40 C10,55 25,70 40,70" fill="none" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round"/>
                  <circle cx="20" cy="20" r="4" fill="#f59e0b"/>
                  <circle cx="30" cy="15" r="3" fill="#fbbf24"/>
                  <circle cx="15" cy="30" r="3" fill="#fbbf24"/>
                  <path d="M25,25 Q30,20 35,25" fill="none" stroke="#f59e0b" strokeWidth="2"/>
                  <circle cx="28" cy="22" r="2" fill="#fbbf24"/>
                </svg>
              </div>
            )}
            
            {/* Decorative Corner Elements - Bottom Left */}
            {!printMode && (
              <div className="absolute -bottom-4 -left-4 w-20 h-20 z-20" style={{ pointerEvents: 'none' }}>
                <svg viewBox="0 0 80 80" className="w-full h-full transform -rotate-90" style={{ filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.2))' }}>
                  <path d="M40,10 C25,10 10,25 10,40 C10,55 25,70 40,70" fill="none" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round"/>
                  <circle cx="20" cy="20" r="4" fill="#f59e0b"/>
                  <circle cx="30" cy="15" r="3" fill="#fbbf24"/>
                  <circle cx="15" cy="30" r="3" fill="#fbbf24"/>
                  <path d="M25,25 Q30,20 35,25" fill="none" stroke="#f59e0b" strokeWidth="2"/>
                  <circle cx="28" cy="22" r="2" fill="#fbbf24"/>
                </svg>
              </div>
            )}
            
            {/* Decorative Corner Elements - Bottom Right */}
            {!printMode && (
              <div className="absolute -bottom-4 -right-4 w-20 h-20 z-20" style={{ pointerEvents: 'none' }}>
                <svg viewBox="0 0 80 80" className="w-full h-full transform rotate-180" style={{ filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.2))' }}>
                  <path d="M40,10 C25,10 10,25 10,40 C10,55 25,70 40,70" fill="none" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round"/>
                  <circle cx="20" cy="20" r="4" fill="#f59e0b"/>
                  <circle cx="30" cy="15" r="3" fill="#fbbf24"/>
                  <circle cx="15" cy="30" r="3" fill="#fbbf24"/>
                  <path d="M25,25 Q30,20 35,25" fill="none" stroke="#f59e0b" strokeWidth="2"/>
                  <circle cx="28" cy="22" r="2" fill="#fbbf24"/>
                </svg>
              </div>
            )}
            
            {/* Decorative Border Pattern */}
            {!printMode && (
              <div className="absolute inset-0 pointer-events-none" style={{
                backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 10px, rgba(245, 158, 11, 0.1) 10px, rgba(245, 158, 11, 0.1) 12px),
                                  repeating-linear-gradient(90deg, transparent, transparent 10px, rgba(245, 158, 11, 0.1) 10px, rgba(245, 158, 11, 0.1) 12px)`,
                borderRadius: '8px'
              }}></div>
            )}
            
            <div className={`relative z-10 ${printMode ? 'py-1 px-1' : (isHDPremium ? 'py-6 px-8' : 'py-4 px-6')}`}>
              <div className={`text-amber-800 font-serif ${printMode ? 'text-xs' : (isHDPremium ? 'text-xl' : 'text-lg')} ${printMode ? 'mb-1' : 'mb-6'} ${printMode ? 'leading-tight' : 'leading-relaxed'} ${printMode ? '' : 'drop-shadow-sm'} ${printMode ? '' : 'relative'}`} style={printMode ? {} : { textShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                {!printMode && (
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 z-30" style={{ pointerEvents: 'none' }}>
                    <svg width="60" height="30" viewBox="0 0 60 30" style={{ filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.2))' }}>
                      <path d="M30,5 Q20,15 30,25 Q40,15 30,5" fill="#f59e0b" opacity="0.8"/>
                      <circle cx="22" cy="12" r="3" fill="#fbbf24"/>
                      <circle cx="38" cy="12" r="3" fill="#fbbf24"/>
                      <circle cx="30" cy="8" r="2.5" fill="#fcd34d"/>
                      <circle cx="30" cy="22" r="2.5" fill="#fcd34d"/>
                      <circle cx="30" cy="15" r="2" fill="#fef3c7"/>
                    </svg>
                  </div>
                )}
                {processedCertText}
              </div>

              {/* Decorative Separator with Flower Pattern */}
              <div className={`relative ${printMode ? 'mt-0.5 pt-0.5' : 'mt-8 pt-6'}`}>
                {!printMode && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30" style={{ pointerEvents: 'none' }}>
                    <div className="bg-gradient-to-br from-amber-50 to-yellow-50 px-4 py-1 rounded-full">
                      <svg width="60" height="25" viewBox="0 0 60 25" style={{ filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.2))' }}>
                        <path d="M30,12 Q22,6 15,12 Q22,18 30,12 Q38,18 45,12 Q38,6 30,12" fill="#f59e0b" opacity="0.9"/>
                        <circle cx="22" cy="12" r="3" fill="#fbbf24"/>
                        <circle cx="38" cy="12" r="3" fill="#fbbf24"/>
                        <circle cx="30" cy="9" r="2" fill="#fcd34d"/>
                        <circle cx="30" cy="15" r="2" fill="#fcd34d"/>
                        <circle cx="30" cy="12" r="2.5" fill="#fef3c7"/>
                      </svg>
                    </div>
                  </div>
                )}
                <div className={`${printMode ? 'border-t border-gray-300' : 'border-t-2 border-amber-300'} ${printMode ? '' : 'relative'}`} style={printMode ? {} : { 
                  backgroundImage: printMode ? 'none' : 'linear-gradient(to right, transparent, rgba(245, 158, 11, 0.3), transparent)',
                  backgroundSize: '100% 2px',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat'
                }}></div>
              </div>
              
              <div className={`flex justify-between items-end ${printMode ? 'mt-0.5' : 'mt-6'}`}>
              <div className={`${printMode ? 'w-28' : 'w-40'} flex flex-col items-center`}>
                <div className={`signature-container ${printMode ? 'mb-1' : 'mb-4'}`}>
                  {settings.digitalSignature ? (
                    <img
                      src={settings.digitalSignature || "/placeholder.svg"}
                      alt="Digital Signature"
                      className={`signature-image ${printMode ? 'max-h-8 max-w-20' : 'max-h-16 max-w-32'}`}
                      crossOrigin="anonymous"
                      onError={(e) => {
                        console.error("Error loading signature image")
                        const target = e.currentTarget as HTMLImageElement
                        target.style.display = "none"
                        const parent = target.parentElement
                        if (parent) {
                          const fallback = document.createElement("div")
                          fallback.className = `border-t-2 ${printMode ? 'mt-2' : 'mt-6'} mx-auto ${printMode ? 'w-16' : 'w-24'} border-blue-800`
                          parent.appendChild(fallback)
                        }
                      }}
                    />
                  ) : (
                    <div className={`border-t-2 ${printMode ? 'mt-2' : 'mt-6'} mx-auto ${printMode ? 'w-16' : 'w-24'} border-blue-800`}></div>
                  )}
                </div>
                <p className={`${printMode ? 'text-[10px]' : 'text-xs'} text-amber-700 font-medium`}>
                  Instructor's Signature
                </p>
              </div>

              {formData.showPaymentDetails && (
                <div className={`text-center flex-1 ${printMode ? 'mx-1' : 'mx-6'}`}>
                  <div className={`bg-white bg-opacity-80 ${printMode ? 'p-0.5' : 'p-3'} rounded border border-amber-400`}>
                    <div className={`font-bold ${printMode ? 'text-[10px]' : 'text-xs'} text-amber-800 ${printMode ? 'mb-0.5' : 'mb-1'}`}>
                      NEXT TERM FEE PAYMENT
                    </div>
                    <div className={`${printMode ? 'text-[10px]' : 'text-xs'} text-amber-700`}>
                      {settings.nextTermFee || "₦15,000"} TO RILLCOD LTD.
                    </div>
                    <div className={`${printMode ? 'text-[10px]' : 'text-xs'} text-amber-600 ${printMode ? 'mt-0.5' : 'mt-1'}`}>
                      BANK: {settings.bankDetails || "PROVIDUS | ACCOUNT NUMBER: 7901178957"}
                    </div>
                  </div>
                </div>
              )}

              {(settings.showQRCode !== false) && (
                <div className={`${printMode ? 'w-24' : 'w-32'} flex flex-col items-center`}>
                  <div ref={qrCodeRef} className={printMode ? "mb-1" : "mb-2"}></div>
                  <p className={`${printMode ? 'text-[10px]' : 'text-xs'} text-amber-700 font-medium text-center`}>
                    Verification Code
                  </p>
                </div>
              )}
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  )
}
