"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import { 
  Search, 
  MessageSquare, 
  Award, 
  ThumbsUp, 
  TrendingUp, 
  BookOpen, 
  Plus, 
  Star,
  Target,
  Lightbulb,
  Zap,
  Users,
  ChevronDown,
  Sparkles,
  Brain
} from "lucide-react"

interface IntelligentSuggestionsProps {
  type: "comments" | "strengths" | "growth"
  currentSubject?: string
  performanceLevel?: string
  studentLevel?: "beginner" | "intermediate" | "advanced"
  onSelect: (content: string) => void
  children: React.ReactNode
}

export function IntelligentSuggestions({
  type,
  currentSubject = "Python Programming",
  performanceLevel = "B",
  studentLevel = "intermediate",
  onSelect,
  children
}: IntelligentSuggestionsProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const { toast } = useToast()

  const getSubjectSpecificContent = () => {
    const subject = currentSubject.toLowerCase()
    
    if (type === "comments") {
      return getCommentsForSubject(subject, performanceLevel)
    } else if (type === "strengths") {
      return getStrengthsForSubject(subject, performanceLevel)
    } else if (type === "growth") {
      return getGrowthAreasForSubject(subject, studentLevel)
    }
    
    return []
  }

  const getCommentsForSubject = (subject: string, level: string) => {
    const baseComments = {
      excellent: [
        "Demonstrates exceptional mastery of programming concepts with outstanding code quality and innovative problem-solving approaches.",
        "Shows remarkable leadership qualities and consistently helps peers while maintaining excellent academic performance.",
        "Exhibits advanced understanding that goes beyond curriculum requirements, often exploring additional concepts independently."
      ],
      good: [
        "Shows solid understanding of core concepts with consistent good performance across practical and theoretical work.",
        "Demonstrates reliable problem-solving skills and maintains good work quality with room for creative exploration.",
        "Exhibits steady progress and engagement, contributing positively to class discussions and collaborative activities."
      ],
      satisfactory: [
        "Shows developing understanding of fundamental concepts with improving practical application skills.",
        "Demonstrates effort and persistence in learning, with notable progress in specific areas of the curriculum.",
        "Shows willingness to learn and improve, benefiting from additional practice and structured support."
      ]
    }

    const subjectSpecific = {
      python: [
        "Demonstrates strong grasp of Python syntax and programming logic with clean, efficient code structure.",
        "Shows excellent understanding of object-oriented programming principles and data structure implementation.",
        "Exhibits creative problem-solving using Python libraries and frameworks effectively."
      ],
      web: [
        "Creates visually appealing and functional web applications with attention to user experience design.",
        "Demonstrates solid understanding of HTML, CSS, and JavaScript with modern development practices.",
        "Shows good grasp of responsive design principles and cross-browser compatibility considerations."
      ],
      robotics: [
        "Exhibits exceptional mechanical understanding and successfully integrates programming with hardware systems.",
        "Demonstrates innovative approach to sensor integration and autonomous behavior programming.",
        "Shows strong engineering thinking and systematic problem-solving in robotic system design."
      ]
    }

    let levelComments = []
    if (level === "A" || level === "Excellent") levelComments = baseComments.excellent
    else if (level === "B" || level === "Good") levelComments = baseComments.good
    else levelComments = baseComments.satisfactory

    const subjectKey = subject.includes("python") ? "python" : 
                     subject.includes("web") ? "web" : 
                     subject.includes("robot") ? "robotics" : "python"

    return [...levelComments, ...subjectSpecific[subjectKey]]
  }

  const getStrengthsForSubject = (subject: string, level: string) => {
    const commonStrengths = [
      "Excellent attendance and punctuality, showing strong commitment to learning",
      "Active participation in class discussions and collaborative activities",
      "Strong analytical thinking and systematic approach to problem-solving",
      "Good communication skills when explaining technical concepts",
      "Demonstrates persistence and resilience when facing challenging problems"
    ]

    const subjectStrengths = {
      python: [
        "Exceptional grasp of Python syntax and programming fundamentals",
        "Strong understanding of data structures and algorithm implementation",
        "Creative use of Python libraries for solving complex problems",
        "Excellent debugging skills and code optimization techniques",
        "Good understanding of object-oriented programming principles"
      ],
      web: [
        "Natural eye for visual design and user interface development",
        "Strong understanding of responsive web design principles",
        "Excellent integration of frontend and backend technologies",
        "Creative approach to user experience and interaction design",
        "Good grasp of modern web development frameworks and tools"
      ],
      robotics: [
        "Exceptional mechanical understanding and spatial reasoning abilities",
        "Strong integration of hardware and software components",
        "Creative problem-solving in autonomous system design",
        "Excellent understanding of sensor technologies and data processing",
        "Good engineering documentation and project planning skills"
      ]
    }

    const subjectKey = subject.includes("python") ? "python" : 
                     subject.includes("web") ? "web" : 
                     subject.includes("robot") ? "robotics" : "python"

    return [...commonStrengths, ...subjectStrengths[subjectKey]]
  }

  const getGrowthAreasForSubject = (subject: string, level: string) => {
    const commonGrowth = [
      "Focus on strengthening theoretical foundations through additional study and practice",
      "Develop better time management skills for project completion and deadline adherence",
      "Enhance collaborative skills through increased peer interaction and team projects",
      "Improve presentation skills for better communication of technical concepts",
      "Develop stronger debugging and troubleshooting methodologies"
    ]

    const subjectGrowth = {
      python: [
        "Master advanced Python concepts like decorators, generators, and context managers",
        "Strengthen understanding of algorithm complexity and optimization techniques",
        "Develop skills in test-driven development and unit testing practices",
        "Enhance knowledge of Python frameworks like Django or Flask",
        "Improve code documentation and professional development practices"
      ],
      web: [
        "Develop stronger backend programming skills and database integration",
        "Enhance understanding of web security principles and best practices",
        "Strengthen skills in modern JavaScript frameworks and state management",
        "Improve accessibility and cross-browser compatibility implementation",
        "Develop better understanding of web performance optimization"
      ],
      robotics: [
        "Enhance understanding of advanced control systems and feedback mechanisms",
        "Develop stronger skills in sensor fusion and data processing algorithms",
        "Improve mechanical design and engineering documentation practices",
        "Strengthen understanding of embedded systems and microcontroller programming",
        "Enhance skills in autonomous navigation and path planning algorithms"
      ]
    }

    const subjectKey = subject.includes("python") ? "python" : 
                     subject.includes("web") ? "web" : 
                     subject.includes("robot") ? "robotics" : "python"

    return [...commonGrowth, ...subjectGrowth[subjectKey]]
  }

  const suggestions = useMemo(() => {
    const content = getSubjectSpecificContent()
    return content.filter(item => 
      item.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [searchTerm, currentSubject, performanceLevel, studentLevel, type])

  const getIcon = () => {
    switch (type) {
      case "comments": return <MessageSquare className="h-4 w-4" />
      case "strengths": return <Star className="h-4 w-4" />
      case "growth": return <TrendingUp className="h-4 w-4" />
      default: return <Sparkles className="h-4 w-4" />
    }
  }

  const getTitle = () => {
    switch (type) {
      case "comments": return "Smart Comments"
      case "strengths": return "Strength Suggestions"
      case "growth": return "Growth Areas"
      default: return "Suggestions"
    }
  }

  const handleSelect = (suggestion: string) => {
    onSelect(suggestion)
    toast({
      title: "Suggestion Applied",
      description: `${getTitle()} has been added to the form.`,
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {children}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-96 max-h-96 bg-gray-900 border-gray-700">
        <DropdownMenuLabel className="flex items-center gap-2 text-blue-400">
          {getIcon()}
          {getTitle()} - {currentSubject}
          <Badge variant="outline" className="ml-auto bg-blue-900 text-blue-200">
            {suggestions.length}
          </Badge>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-gray-700" />
        
        <div className="p-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder={`Search ${type}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 bg-gray-800 border-gray-600 text-gray-200"
            />
          </div>
        </div>

        <ScrollArea className="max-h-64">
          <div className="p-1">
            {suggestions.length === 0 ? (
              <div className="p-4 text-center text-gray-400">
                <Brain className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No suggestions found</p>
                <p className="text-xs">Try a different search term</p>
              </div>
            ) : (
              suggestions.map((suggestion, index) => (
                <DropdownMenuItem
                  key={index}
                  className="flex-col items-start p-3 cursor-pointer hover:bg-gray-800 focus:bg-gray-800"
                  onClick={() => handleSelect(suggestion)}
                >
                  <div className="flex items-start gap-2 w-full">
                    <div className="p-1 bg-blue-900/50 rounded">
                      {getIcon()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-200 leading-relaxed break-words">
                        {suggestion}
                      </p>
                      <Badge variant="outline" className="mt-1 text-xs bg-gray-800 text-gray-400 border-gray-600">
                        {currentSubject}
                      </Badge>
                    </div>
                  </div>
                </DropdownMenuItem>
              ))
            )}
          </div>
        </ScrollArea>

        <DropdownMenuSeparator className="bg-gray-700" />
        <div className="p-2">
          <Button
            size="sm"
            variant="outline"
            className="w-full bg-blue-900 border-blue-700 text-blue-200 hover:bg-blue-800"
            onClick={() => {
              toast({
                title: "AI Assistant",
                description: "Opening enhanced AI generation panel...",
              })
            }}
          >
            <Brain className="h-4 w-4 mr-2" />
            Advanced AI Generation
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
