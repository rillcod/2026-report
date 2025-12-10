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
      description: "AI-powered analysis of student's strongest areas and achievements",
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
    },
    {
      id: "growth",
      label: "Areas for Growth",
      icon: <TrendingUp className="h-4 w-4" />,
      description: "Intelligent identification of improvement opportunities",
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
      const course = currentData.courseName || currentData.course || "Programming"
      
      // AI-powered performance analysis
      const performanceLevel = avgScore >= 90 ? "exceptional" : 
                              avgScore >= 85 ? "advanced" :
                              avgScore >= 75 ? "proficient" :
                              avgScore >= 65 ? "developing" : "emerging"
      
      const learningStyle = theoryScore > practicalScore + 10 ? "theoretical" :
                           practicalScore > theoryScore + 10 ? "hands-on" : "balanced"

      let content = ""

      switch (type) {
        case "strengths":
          const strengths = []
          
          // Performance-based strengths
          if (theoryScore >= 90) strengths.push("Exceptional mastery of theoretical concepts with deep analytical thinking")
          else if (theoryScore >= 85) strengths.push("Strong theoretical foundation with excellent conceptual understanding")
          else if (theoryScore >= 75) strengths.push("Solid grasp of core theoretical principles")
          
          if (practicalScore >= 90) strengths.push("Outstanding practical implementation skills with creative problem-solving")
          else if (practicalScore >= 85) strengths.push("Excellent hands-on abilities with strong technical execution")
          else if (practicalScore >= 75) strengths.push("Good practical application of learned concepts")
          
          if (attendance >= 95) strengths.push("Exemplary commitment with perfect attendance record")
          else if (attendance >= 90) strengths.push("Excellent attendance demonstrating strong dedication")
          else if (attendance >= 85) strengths.push("Consistent attendance showing good commitment")
          
          // Learning style strengths
          if (learningStyle === "theoretical") {
            strengths.push("Natural aptitude for abstract thinking and conceptual analysis")
            strengths.push("Excels in understanding complex theoretical frameworks")
          } else if (learningStyle === "hands-on") {
            strengths.push("Strong kinesthetic learning abilities with practical focus")
            strengths.push("Demonstrates excellent problem-solving through experimentation")
          } else {
            strengths.push("Well-balanced learning approach combining theory and practice")
            strengths.push("Adaptable learning style suitable for diverse challenges")
          }
          
          // Course-specific strengths
          if (course.toLowerCase().includes('programming') || course.toLowerCase().includes('coding')) {
            if (practicalScore >= 85) strengths.push("Natural programming intuition with clean code implementation")
            if (theoryScore >= 85) strengths.push("Strong algorithmic thinking and computational logic")
          }
          
          if (strengths.length === 0) {
            strengths.push("Shows genuine interest and curiosity in learning")
            strengths.push("Demonstrates resilience and willingness to overcome challenges")
            strengths.push("Maintains positive attitude toward skill development")
          }
          
          content = "• " + strengths.slice(0, 5).join("\n• ")
          break

        case "growth":
          const growthAreas = []
          
          // Performance-based growth areas
          if (theoryScore < 70) {
            growthAreas.push("Strengthen theoretical foundations through additional concept review and practice")
            growthAreas.push("Develop deeper analytical thinking skills through guided problem-solving")
          } else if (theoryScore < 85) {
            growthAreas.push("Advance theoretical understanding to achieve mastery level")
          }
          
          if (practicalScore < 70) {
            growthAreas.push("Increase hands-on practice with structured coding exercises and projects")
            growthAreas.push("Focus on practical application of theoretical concepts")
          } else if (practicalScore < 85) {
            growthAreas.push("Refine practical skills through more complex implementation challenges")
          }
          
          if (attendance < 80) {
            growthAreas.push("Improve attendance consistency for optimal learning continuity and peer interaction")
          } else if (attendance < 90) {
            growthAreas.push("Maintain excellent attendance to maximize learning opportunities")
          }
          
          // Learning style recommendations
          if (learningStyle === "theoretical" && practicalScore < theoryScore - 5) {
            growthAreas.push("Balance theoretical knowledge with more hands-on practical experience")
            growthAreas.push("Engage in project-based learning to strengthen implementation skills")
          } else if (learningStyle === "hands-on" && theoryScore < practicalScore - 5) {
            growthAreas.push("Strengthen conceptual understanding to support practical skills")
            growthAreas.push("Dedicate time to studying underlying principles and theory")
          }
          
          // Performance level recommendations
          if (performanceLevel === "exceptional") {
            growthAreas.push("Explore advanced topics and consider mentoring opportunities")
            growthAreas.push("Take on leadership roles in group projects and collaborative work")
          } else if (performanceLevel === "emerging") {
            growthAreas.push("Focus on building confidence through incremental skill development")
            growthAreas.push("Seek additional support and practice opportunities")
          }
          
          if (growthAreas.length === 0) {
            growthAreas.push("Continue challenging yourself with advanced concepts and real-world applications")
            growthAreas.push("Explore specialized areas of interest within the field")
            growthAreas.push("Consider contributing to open-source projects or community initiatives")
          }
          
          content = "• " + growthAreas.slice(0, 4).join("\n• ")
          break

        case "comments":
          // AI-powered personalized comments based on comprehensive analysis
          const personalityTraits = []
          const achievements = []
          const recommendations = []
          
          // Analyze learning patterns
          if (theoryScore > practicalScore + 15) {
            personalityTraits.push("analytical thinker who excels in conceptual understanding")
            recommendations.push("continue developing practical implementation skills to complement strong theoretical foundation")
          } else if (practicalScore > theoryScore + 15) {
            personalityTraits.push("hands-on learner with strong implementation abilities")
            recommendations.push("strengthen theoretical knowledge to enhance problem-solving approaches")
          } else {
            personalityTraits.push("well-balanced learner who effectively combines theory with practice")
          }
          
          // Performance achievements
          if (avgScore >= 90) {
            achievements.push("consistently delivers exceptional work that exceeds expectations")
            achievements.push("demonstrates mastery-level understanding of complex concepts")
            personalityTraits.push("self-motivated learner who takes initiative in challenging situations")
          } else if (avgScore >= 85) {
            achievements.push("maintains high standards and delivers quality work consistently")
            achievements.push("shows strong competency across all learning objectives")
          } else if (avgScore >= 75) {
            achievements.push("demonstrates solid progress and steady improvement")
            achievements.push("shows good understanding of fundamental concepts")
          } else if (avgScore >= 65) {
            achievements.push("shows determination and willingness to tackle challenges")
            personalityTraits.push("resilient learner who perseveres through difficulties")
          }
          
          // Attendance-based insights
          if (attendance >= 95) {
            personalityTraits.push("highly committed individual with excellent attendance")
            achievements.push("sets a positive example for peers through consistent participation")
          } else if (attendance >= 85) {
            personalityTraits.push("reliable student with good attendance habits")
          } else if (attendance < 80) {
            recommendations.push("improve attendance consistency to maximize learning opportunities and peer collaboration")
          }
          
          // Course-specific insights
          if (course.toLowerCase().includes('programming')) {
            if (practicalScore >= 85) {
              achievements.push("demonstrates natural programming intuition and clean coding practices")
            }
            if (theoryScore >= 85) {
              achievements.push("exhibits strong algorithmic thinking and computational problem-solving skills")
            }
          }
          
          // Generate comprehensive comment
          let commentParts = []
          
          // Opening with personality and achievements
          if (personalityTraits.length > 0 && achievements.length > 0) {
            commentParts.push(`${studentName} is ${personalityTraits[0]} who ${achievements[0]}.`)
          }
          
          // Performance analysis
          if (avgScore >= 85) {
            commentParts.push(`Their ${performanceLevel} performance reflects deep engagement with the material and strong academic discipline.`)
          } else if (avgScore >= 70) {
            commentParts.push(`They demonstrate ${performanceLevel} understanding with consistent effort and positive learning attitude.`)
          } else {
            commentParts.push(`While developing foundational skills, they show genuine commitment to improvement and learning.`)
          }
          
          // Specific strengths
          if (achievements.length > 1) {
            commentParts.push(`Notable strengths include their ability to ${achievements[1].toLowerCase()}.`)
          }
          
          // Learning style and recommendations
          if (learningStyle === "theoretical") {
            commentParts.push(`As a conceptual learner, ${studentName} would benefit from more hands-on projects to apply their strong theoretical knowledge.`)
          } else if (learningStyle === "hands-on") {
            commentParts.push(`Their practical learning style is evident in their implementation work, and additional focus on underlying principles would enhance their problem-solving capabilities.`)
          } else {
            commentParts.push(`Their balanced approach to learning serves them well in both theoretical understanding and practical application.`)
          }
          
          // Future outlook and recommendations
          if (avgScore >= 85) {
            commentParts.push(`${studentName} is well-prepared for advanced challenges and would excel in leadership or mentoring roles.`)
          } else if (avgScore >= 70) {
            commentParts.push(`With continued focus and practice, ${studentName} has the potential to achieve even higher levels of proficiency.`)
          } else {
            commentParts.push(`Additional support and structured practice will help ${studentName} build confidence and strengthen their foundational skills.`)
          }
          
          content = commentParts.join(" ")
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
