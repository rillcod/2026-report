"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import {
  Sparkles,
  Target,
  TrendingUp,
  MessageSquare,
  BookOpen,
  Star,
  Lightbulb,
  CheckCircle,
  RefreshCw,
} from "lucide-react"

interface UnifiedAIContentGeneratorProps {
  onContentGenerated: (field: string, content: string) => void
  studentName: string
  currentData: any
}

export function UnifiedAIContentGenerator({
  onContentGenerated,
  studentName,
  currentData,
}: UnifiedAIContentGeneratorProps) {
  const { toast } = useToast()
  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedType, setSelectedType] = useState<string>("")
  const [generatedContent, setGeneratedContent] = useState<string>("")
  const [contentHistory, setContentHistory] = useState<Record<string, string[]>>({})

  const contentTypes = [
    {
      id: "strengths",
      label: "Key Strengths",
      icon: <Target className="h-4 w-4" />,
      description: "Highlight student's strongest areas and achievements",
      color: "text-green-600",
    },
    {
      id: "growth",
      label: "Areas for Growth",
      icon: <TrendingUp className="h-4 w-4" />,
      description: "Identify improvement opportunities and development areas",
      color: "text-orange-600",
    },
    {
      id: "comments",
      label: "Instructor Comments",
      icon: <MessageSquare className="h-4 w-4" />,
      description: "Comprehensive feedback and observations",
      color: "text-blue-600",
    },
    {
      id: "progressItems",
      label: "Course Progress",
      icon: <BookOpen className="h-4 w-4" />,
      description: "Generate course-specific learning milestones",
      color: "text-purple-600",
    },
    {
      id: "certificateText",
      label: "Certificate Text",
      icon: <Star className="h-4 w-4" />,
      description: "Create personalized certificate content",
      color: "text-yellow-600",
    },
  ]

  const generateAIContent = async (type: string) => {
    if (!studentName.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter a student name first.",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)
    setSelectedType(type)

    try {
      const theoryScore = Number(currentData.theoryScore) || 0
      const practicalScore = Number(currentData.practicalScore) || 0
      const attendance = Number(currentData.attendance) || 0
      const avgScore = (theoryScore + practicalScore + attendance) / 3

      let content = ""

      switch (type) {
        case "strengths":
          const strengths = []
          if (theoryScore >= 85) strengths.push("Excellent theoretical understanding and concept mastery")
          if (practicalScore >= 85) strengths.push("Outstanding practical application and hands-on skills")
          if (attendance >= 95) strengths.push("Exceptional attendance and commitment to learning")
          if (currentData.participation === "Excellent") strengths.push("Active class participation and engagement")
          if (avgScore >= 80) strengths.push("Consistent high performance across all areas")
          if (strengths.length === 0) {
            strengths.push("Shows willingness to learn and improve")
            strengths.push("Demonstrates effort in coursework")
          }
          content = "• " + strengths.join("\n• ")
          break

        case "growth":
          const growthAreas = []
          if (theoryScore < 70) growthAreas.push("Focus on strengthening theoretical foundations and core concepts")
          if (practicalScore < 70) growthAreas.push("Increase hands-on practice and coding exercises")
          if (attendance < 80) growthAreas.push("Improve attendance consistency for better learning continuity")
          if (currentData.participation !== "Excellent" && currentData.participation !== "Very Good") {
            growthAreas.push("Enhance class participation and engagement")
          }
          if (growthAreas.length === 0) {
            growthAreas.push("Continue challenging yourself with advanced concepts")
            growthAreas.push("Explore additional learning resources and practice materials")
          }
          content = "• " + growthAreas.join("\n• ")
          break

        case "comments":
          if (avgScore >= 85) {
            content = `${studentName} has demonstrated exceptional performance throughout the course. Their strong grasp of both theoretical concepts and practical applications makes them a standout student. They consistently show initiative, ask thoughtful questions, and help create a positive learning environment. With continued dedication, they are well-prepared for advanced challenges and have the potential to excel in more complex programming concepts.`
          } else if (avgScore >= 70) {
            content = `${studentName} shows solid understanding of the course material with good performance in most areas. They demonstrate consistent effort and engagement in class activities. There are opportunities for improvement, particularly in ${theoryScore < practicalScore ? "theoretical concepts and foundational understanding" : "practical applications and hands-on implementation"}. Overall progress is commendable, and with focused practice, they can achieve even better results.`
          } else {
            content = `${studentName} is developing foundational skills in the subject and shows willingness to learn. While there have been some challenges with ${theoryScore < 50 ? "theoretical concepts" : "practical implementation"}, they demonstrate persistence and effort. Additional practice, review sessions, and one-on-one support will help strengthen their understanding and build confidence in the material.`
          }
          break

        case "progressItems":
          const subject = currentData.courseName || "Programming"
          const courseType = subject.toLowerCase()
          
          let progressItems = []
          if (courseType.includes("web")) {
            progressItems = [
              "HTML Fundamentals: Structure and semantic markup",
              "CSS Styling: Layout, responsive design, and visual styling",
              "JavaScript Basics: Variables, functions, and DOM manipulation",
              "Frontend Frameworks: Modern development with React/Vue/Angular",
              "Backend Development: Server-side programming and APIs",
              "Database Integration: Working with data storage and retrieval",
              "Project Development: Building complete web applications"
            ]
          } else if (courseType.includes("python")) {
            progressItems = [
              "Python Syntax: Variables, data types, and basic operations",
              "Control Flow: Conditional statements and loops",
              "Functions & Modules: Code organization and reusability",
              "Data Structures: Lists, dictionaries, and sets",
              "Object-Oriented Programming: Classes and inheritance",
              "File Handling: Reading and writing data",
              "Libraries & Frameworks: Using external packages"
            ]
          } else if (courseType.includes("robot")) {
            progressItems = [
              "Hardware Components: Understanding sensors and actuators",
              "Programming Logic: Control algorithms and decision making",
              "Sensor Integration: Reading and processing sensor data",
              "Motor Control: Movement and positioning systems",
              "Autonomous Behavior: Independent navigation and tasks",
              "System Integration: Combining hardware and software",
              "Project Implementation: Building complete robotic systems"
            ]
          } else {
            progressItems = [
              "Fundamentals: Core concepts and principles",
              "Basic Implementation: Applying theoretical knowledge",
              "Problem Solving: Analytical thinking and debugging",
              "Practical Application: Hands-on project development",
              "Advanced Concepts: Exploring complex topics",
              "Integration Skills: Combining multiple concepts",
              "Project Completion: Building comprehensive solutions"
            ]
          }
          content = progressItems.join("\n")
          break

        case "certificateText":
          content = `This certifies that ${studentName} has successfully completed the Programming Fundamentals course, demonstrating ${avgScore >= 85 ? "exceptional" : avgScore >= 70 ? "solid" : "foundational"} proficiency in core programming concepts. Through dedicated effort and commitment to excellence in technology education, ${studentName} has shown ${avgScore >= 80 ? "outstanding" : "commendable"} progress and is well-prepared for continued learning in advanced programming topics.`
          break

        default:
          content = "AI-generated content will appear here."
      }

      setGeneratedContent(content)

      // Store in history
      setContentHistory((prev) => ({
        ...prev,
        [type]: [...(prev[type] || []), content],
      }))

      toast({
        title: "AI Content Generated",
        description: `${contentTypes.find((t) => t.id === type)?.label} content has been generated successfully.`,
      })
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Failed to generate AI content. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const applyContent = () => {
    if (generatedContent && selectedType) {
      if (selectedType === "progressItems") {
        // For progress items, split by newlines and create array, then join as string
        const items = generatedContent.split("\n").filter((item) => item.trim())
        onContentGenerated(selectedType, items.join("\n"))
      } else {
        onContentGenerated(selectedType, generatedContent)
      }

      toast({
        title: "Content Applied",
        description: "The generated content has been applied to the form.",
      })

      setGeneratedContent("")
      setSelectedType("")
    }
  }

  const regenerateContent = () => {
    if (selectedType) {
      generateAIContent(selectedType)
    }
  }

  return (
    <div className="space-y-4">
      {/* Content Type Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {contentTypes.map((type) => (
          <Card
            key={type.id}
            className={`cursor-pointer transition-all hover:shadow-md border-2 ${
              selectedType === type.id ? "border-purple-300 bg-purple-50" : "border-gray-200 hover:border-purple-200"
            }`}
            onClick={() => generateAIContent(type.id)}
          >
            <CardContent className="p-3">
              <div className="flex items-center gap-2 mb-2">
                <div className={type.color}>{type.icon}</div>
                <span className="font-medium text-sm">{type.label}</span>
              </div>
              <p className="text-xs text-gray-600">{type.description}</p>
              {contentHistory[type.id] && contentHistory[type.id].length > 0 && (
                <Badge variant="outline" className="mt-2 text-xs">
                  {contentHistory[type.id].length} generated
                </Badge>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Generation Status */}
      {isGenerating && (
        <Card className="border-purple-200 bg-purple-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-600"></div>
              <div>
                <p className="font-medium text-purple-900">Generating AI Content...</p>
                <p className="text-sm text-purple-700">
                  Creating {contentTypes.find((t) => t.id === selectedType)?.label.toLowerCase()} for {studentName}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Generated Content Preview */}
      {generatedContent && !isGenerating && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-green-900 flex items-center gap-2 text-base">
              <Lightbulb className="h-4 w-4" />
              Generated {contentTypes.find((t) => t.id === selectedType)?.label}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={generatedContent}
              onChange={(e) => setGeneratedContent(e.target.value)}
              rows={6}
              className="bg-white border-green-200"
              placeholder="Generated content will appear here..."
            />

            <div className="flex flex-wrap gap-2">
              <Button onClick={applyContent} className="bg-green-600 hover:bg-green-700">
                <CheckCircle className="h-4 w-4 mr-2" />
                Apply Content
              </Button>
              <Button onClick={regenerateContent} variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Regenerate
              </Button>
              <Button
                onClick={() => {
                  setGeneratedContent("")
                  setSelectedType("")
                }}
                variant="outline"
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Tips */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Sparkles className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900 mb-1">AI Content Tips</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Fill in student scores first for more accurate content generation</li>
                <li>• Generated content can be edited before applying to the form</li>
                <li>• Multiple versions are saved in history for each content type</li>
                <li>• Content is personalized based on student performance data</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
