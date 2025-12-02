"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu"
import { 
  Search, 
  Sparkles, 
  Target, 
  TrendingUp, 
  Award, 
  BookOpen, 
  Users, 
  Lightbulb,
  Star,
  CheckCircle,
  ArrowRight,
  Wand2
} from "lucide-react"

interface SuggestionItem {
  id: string
  text: string
  category: string
  level: "beginner" | "intermediate" | "advanced"
  relevanceScore: number
  courseSpecific?: boolean
}

interface IntelligentSuggestionsDropdownProps {
  type: "strengths" | "growth" | "comments"
  currentSubject: string
  studentLevel?: "beginner" | "intermediate" | "advanced"
  performanceLevel?: string
  onSelect: (suggestion: string) => void
  triggerText?: string
  maxSelections?: number
}

export function IntelligentSuggestionsDropdown({
  type,
  currentSubject,
  studentLevel = "intermediate",
  performanceLevel = "B",
  onSelect,
  triggerText,
  maxSelections = 3
}: IntelligentSuggestionsDropdownProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const { toast } = useToast()

  // Course-specific suggestion database - EXPANDED with much more content
  const suggestionDatabase = useMemo(() => {
    const common = {
      strengths: {
        programming: [
          { text: "Demonstrates strong logical thinking and problem-solving approach", category: "Problem Solving", level: "intermediate" as const, relevanceScore: 0.9 },
          { text: "Shows excellent understanding of programming fundamentals", category: "Technical Skills", level: "beginner" as const, relevanceScore: 0.85 },
          { text: "Writes clean, well-structured code with good naming conventions", category: "Code Quality", level: "intermediate" as const, relevanceScore: 0.8 },
          { text: "Demonstrates creativity in finding elegant solutions to complex problems", category: "Innovation", level: "advanced" as const, relevanceScore: 0.9 },
          { text: "Excellent debugging skills and systematic error resolution", category: "Technical Skills", level: "advanced" as const, relevanceScore: 0.85 },
          { text: "Strong grasp of object-oriented programming principles", category: "Technical Skills", level: "intermediate" as const, relevanceScore: 0.8 },
          { text: "Shows initiative in exploring advanced concepts beyond curriculum", category: "Self-Learning", level: "advanced" as const, relevanceScore: 0.9 },
          { text: "Consistently produces well-documented and maintainable code", category: "Code Quality", level: "intermediate" as const, relevanceScore: 0.85 },
          { text: "Excellent understanding of data structures and algorithm efficiency", category: "Technical Skills", level: "advanced" as const, relevanceScore: 0.9 },
          { text: "Strong ability to break down complex problems into manageable components", category: "Problem Solving", level: "intermediate" as const, relevanceScore: 0.85 },
          { text: "Demonstrates proficiency in multiple programming paradigms", category: "Technical Skills", level: "advanced" as const, relevanceScore: 0.9 },
          { text: "Shows excellent time management and project organization skills", category: "Professional Skills", level: "intermediate" as const, relevanceScore: 0.8 },
          { text: "Active participation in code reviews and collaborative development", category: "Teamwork", level: "intermediate" as const, relevanceScore: 0.85 },
          { text: "Excellent understanding of version control and collaborative workflows", category: "Professional Skills", level: "intermediate" as const, relevanceScore: 0.85 },
          { text: "Demonstrates strong analytical skills when optimizing code performance", category: "Performance", level: "advanced" as const, relevanceScore: 0.9 },
          { text: "Shows exceptional attention to detail in error handling and edge cases", category: "Code Quality", level: "advanced" as const, relevanceScore: 0.9 },
          { text: "Excellent ability to learn new technologies and frameworks quickly", category: "Adaptability", level: "intermediate" as const, relevanceScore: 0.85 },
          { text: "Strong foundation in software engineering best practices", category: "Professional Skills", level: "advanced" as const, relevanceScore: 0.9 }
        ],
        robotics: [
          { text: "Exceptional mechanical understanding and spatial reasoning abilities", category: "Engineering", level: "intermediate" as const, relevanceScore: 0.9, courseSpecific: true },
          { text: "Strong integration of hardware and software components", category: "System Integration", level: "advanced" as const, relevanceScore: 0.85, courseSpecific: true },
          { text: "Innovative approach to sensor integration and data processing", category: "Innovation", level: "advanced" as const, relevanceScore: 0.8, courseSpecific: true },
          { text: "Excellent troubleshooting skills for complex robotic systems", category: "Problem Solving", level: "intermediate" as const, relevanceScore: 0.85, courseSpecific: true },
          { text: "Demonstrates strong understanding of control systems and automation", category: "Technical Skills", level: "advanced" as const, relevanceScore: 0.9, courseSpecific: true },
          { text: "Excellent mechanical design and prototyping capabilities", category: "Engineering", level: "intermediate" as const, relevanceScore: 0.9, courseSpecific: true },
          { text: "Strong understanding of electronics and circuit design principles", category: "Technical Skills", level: "advanced" as const, relevanceScore: 0.85, courseSpecific: true },
          { text: "Innovative solutions for autonomous navigation and path planning", category: "AI Integration", level: "advanced" as const, relevanceScore: 0.9, courseSpecific: true },
          { text: "Excellent documentation of engineering design processes", category: "Professional Skills", level: "intermediate" as const, relevanceScore: 0.85, courseSpecific: true },
          { text: "Strong ability to integrate multiple sensor types effectively", category: "System Integration", level: "advanced" as const, relevanceScore: 0.9, courseSpecific: true },
          { text: "Demonstrates excellent understanding of PID control algorithms", category: "Control Systems", level: "advanced" as const, relevanceScore: 0.9, courseSpecific: true },
          { text: "Shows strong safety awareness in robotics workshop practices", category: "Professional Skills", level: "intermediate" as const, relevanceScore: 0.85, courseSpecific: true },
          { text: "Excellent problem-solving in mechanical and software integration", category: "Problem Solving", level: "advanced" as const, relevanceScore: 0.9, courseSpecific: true },
          { text: "Strong understanding of embedded systems programming", category: "Technical Skills", level: "advanced" as const, relevanceScore: 0.9, courseSpecific: true }
        ],
        web: [
          { text: "Natural eye for user interface design and user experience", category: "Design", level: "intermediate" as const, relevanceScore: 0.9, courseSpecific: true },
          { text: "Strong understanding of responsive design principles", category: "Technical Skills", level: "intermediate" as const, relevanceScore: 0.85, courseSpecific: true },
          { text: "Excellent integration of frontend and backend technologies", category: "Full-Stack", level: "advanced" as const, relevanceScore: 0.8, courseSpecific: true },
          { text: "Shows creativity in solving complex user interaction challenges", category: "Innovation", level: "advanced" as const, relevanceScore: 0.85, courseSpecific: true },
          { text: "Strong attention to detail in cross-browser compatibility", category: "Quality Assurance", level: "intermediate" as const, relevanceScore: 0.8, courseSpecific: true },
          { text: "Excellent understanding of modern CSS frameworks and preprocessors", category: "Frontend", level: "intermediate" as const, relevanceScore: 0.85, courseSpecific: true },
          { text: "Strong proficiency in JavaScript ES6+ and modern frameworks", category: "Frontend", level: "advanced" as const, relevanceScore: 0.9, courseSpecific: true },
          { text: "Demonstrates excellent understanding of RESTful API design", category: "Backend", level: "intermediate" as const, relevanceScore: 0.85, courseSpecific: true },
          { text: "Strong skills in database design and optimization", category: "Backend", level: "advanced" as const, relevanceScore: 0.9, courseSpecific: true },
          { text: "Excellent understanding of web security best practices", category: "Security", level: "advanced" as const, relevanceScore: 0.9, courseSpecific: true },
          { text: "Shows strong ability to optimize web performance and loading times", category: "Performance", level: "advanced" as const, relevanceScore: 0.9, courseSpecific: true },
          { text: "Excellent understanding of accessibility standards and WCAG compliance", category: "Quality Assurance", level: "intermediate" as const, relevanceScore: 0.85, courseSpecific: true },
          { text: "Strong skills in progressive web app development", category: "Frontend", level: "advanced" as const, relevanceScore: 0.9, courseSpecific: true },
          { text: "Demonstrates excellent understanding of state management patterns", category: "Frontend", level: "advanced" as const, relevanceScore: 0.9, courseSpecific: true }
        ]
      },
      growth: {
        programming: [
          { text: "Focus on strengthening algorithmic thinking through practice problems", category: "Core Skills", level: "beginner" as const, relevanceScore: 0.9 },
          { text: "Develop deeper understanding of data structures and their applications", category: "Technical Knowledge", level: "intermediate" as const, relevanceScore: 0.85 },
          { text: "Improve code optimization and efficiency considerations", category: "Performance", level: "advanced" as const, relevanceScore: 0.8 },
          { text: "Enhance testing methodologies and quality assurance practices", category: "Best Practices", level: "intermediate" as const, relevanceScore: 0.85 },
          { text: "Build stronger foundation in software design patterns", category: "Architecture", level: "advanced" as const, relevanceScore: 0.9 },
          { text: "Develop collaborative coding skills and version control usage", category: "Teamwork", level: "intermediate" as const, relevanceScore: 0.8 },
          { text: "Strengthen understanding of memory management and resource optimization", category: "Performance", level: "advanced" as const, relevanceScore: 0.9 },
          { text: "Improve code documentation and technical writing skills", category: "Professional Skills", level: "intermediate" as const, relevanceScore: 0.85 },
          { text: "Develop stronger debugging methodologies and error handling", category: "Problem Solving", level: "intermediate" as const, relevanceScore: 0.85 },
          { text: "Focus on understanding software architecture and system design", category: "Architecture", level: "advanced" as const, relevanceScore: 0.9 },
          { text: "Enhance knowledge of concurrent programming and multithreading", category: "Advanced Topics", level: "advanced" as const, relevanceScore: 0.9 },
          { text: "Improve understanding of design patterns and their appropriate use", category: "Architecture", level: "intermediate" as const, relevanceScore: 0.85 },
          { text: "Develop stronger skills in code refactoring and technical debt management", category: "Best Practices", level: "intermediate" as const, relevanceScore: 0.85 },
          { text: "Focus on improving time complexity analysis and algorithm efficiency", category: "Core Skills", level: "advanced" as const, relevanceScore: 0.9 },
          { text: "Enhance understanding of software testing strategies and test coverage", category: "Best Practices", level: "intermediate" as const, relevanceScore: 0.85 },
          { text: "Develop stronger skills in API design and integration", category: "Professional Skills", level: "intermediate" as const, relevanceScore: 0.85 },
          { text: "Improve understanding of security vulnerabilities and secure coding practices", category: "Security", level: "advanced" as const, relevanceScore: 0.9 },
          { text: "Focus on building larger-scale projects to develop system thinking", category: "Architecture", level: "advanced" as const, relevanceScore: 0.9 }
        ],
        robotics: [
          { text: "Strengthen understanding of advanced sensor fusion techniques", category: "Technical Skills", level: "advanced" as const, relevanceScore: 0.9, courseSpecific: true },
          { text: "Develop deeper knowledge of control theory and PID systems", category: "Control Systems", level: "advanced" as const, relevanceScore: 0.85, courseSpecific: true },
          { text: "Improve mechanical design and CAD modeling skills", category: "Design", level: "intermediate" as const, relevanceScore: 0.8, courseSpecific: true },
          { text: "Focus on autonomous navigation and path planning algorithms", category: "AI Integration", level: "advanced" as const, relevanceScore: 0.9, courseSpecific: true },
          { text: "Enhance understanding of embedded systems programming", category: "Programming", level: "intermediate" as const, relevanceScore: 0.85, courseSpecific: true },
          { text: "Develop stronger skills in computer vision and image processing", category: "AI Integration", level: "advanced" as const, relevanceScore: 0.9, courseSpecific: true },
          { text: "Improve understanding of motor control and actuator systems", category: "Control Systems", level: "intermediate" as const, relevanceScore: 0.85, courseSpecific: true },
          { text: "Focus on strengthening knowledge of wireless communication protocols", category: "System Integration", level: "advanced" as const, relevanceScore: 0.9, courseSpecific: true },
          { text: "Enhance skills in robot simulation and virtual testing environments", category: "Professional Skills", level: "intermediate" as const, relevanceScore: 0.85, courseSpecific: true },
          { text: "Develop deeper understanding of machine learning for robotics", category: "AI Integration", level: "advanced" as const, relevanceScore: 0.9, courseSpecific: true },
          { text: "Improve documentation of engineering design decisions", category: "Professional Skills", level: "intermediate" as const, relevanceScore: 0.85, courseSpecific: true },
          { text: "Focus on understanding advanced feedback control mechanisms", category: "Control Systems", level: "advanced" as const, relevanceScore: 0.9, courseSpecific: true },
          { text: "Enhance skills in troubleshooting complex hardware-software interactions", category: "Problem Solving", level: "advanced" as const, relevanceScore: 0.9, courseSpecific: true },
          { text: "Develop stronger understanding of safety protocols and risk assessment", category: "Professional Skills", level: "intermediate" as const, relevanceScore: 0.85, courseSpecific: true }
        ],
        web: [
          { text: "Develop stronger backend API design and database optimization skills", category: "Backend", level: "intermediate" as const, relevanceScore: 0.9, courseSpecific: true },
          { text: "Improve understanding of modern JavaScript frameworks and libraries", category: "Frontend", level: "intermediate" as const, relevanceScore: 0.85, courseSpecific: true },
          { text: "Focus on security best practices and vulnerability prevention", category: "Security", level: "advanced" as const, relevanceScore: 0.8, courseSpecific: true },
          { text: "Enhance performance optimization and progressive web app concepts", category: "Performance", level: "advanced" as const, relevanceScore: 0.85, courseSpecific: true },
          { text: "Develop stronger testing strategies for web applications", category: "Quality Assurance", level: "intermediate" as const, relevanceScore: 0.8, courseSpecific: true },
          { text: "Improve understanding of server-side rendering and static site generation", category: "Frontend", level: "advanced" as const, relevanceScore: 0.9, courseSpecific: true },
          { text: "Focus on strengthening knowledge of cloud deployment and DevOps practices", category: "Professional Skills", level: "advanced" as const, relevanceScore: 0.9, courseSpecific: true },
          { text: "Enhance understanding of microservices architecture and API gateway patterns", category: "Architecture", level: "advanced" as const, relevanceScore: 0.9, courseSpecific: true },
          { text: "Develop stronger skills in database query optimization and indexing", category: "Backend", level: "advanced" as const, relevanceScore: 0.9, courseSpecific: true },
          { text: "Improve understanding of web accessibility standards and implementation", category: "Quality Assurance", level: "intermediate" as const, relevanceScore: 0.85, courseSpecific: true },
          { text: "Focus on enhancing knowledge of GraphQL and alternative API architectures", category: "Backend", level: "advanced" as const, relevanceScore: 0.9, courseSpecific: true },
          { text: "Develop stronger skills in web performance monitoring and analytics", category: "Performance", level: "advanced" as const, relevanceScore: 0.9, courseSpecific: true },
          { text: "Improve understanding of containerization and orchestration technologies", category: "Professional Skills", level: "advanced" as const, relevanceScore: 0.9, courseSpecific: true },
          { text: "Enhance skills in user experience research and usability testing", category: "Design", level: "intermediate" as const, relevanceScore: 0.85, courseSpecific: true }
        ]
      },
      comments: {
        excellent: [
          { text: "Consistently exceeds expectations with innovative solutions and exceptional quality work", category: "Excellence", level: "advanced" as const, relevanceScore: 0.95 },
          { text: "Demonstrates remarkable leadership qualities and positively influences peer learning", category: "Leadership", level: "advanced" as const, relevanceScore: 0.9 },
          { text: "Shows outstanding initiative in exploring concepts beyond the curriculum", category: "Self-Direction", level: "advanced" as const, relevanceScore: 0.85 },
          { text: "Produces consistently high-quality work with attention to detail and best practices", category: "Quality", level: "intermediate" as const, relevanceScore: 0.9 },
          { text: "Exhibits exceptional problem-solving abilities and creative thinking in challenging scenarios", category: "Problem Solving", level: "advanced" as const, relevanceScore: 0.95 },
          { text: "Demonstrates mastery of advanced concepts and applies them effectively in complex projects", category: "Technical Skills", level: "advanced" as const, relevanceScore: 0.95 },
          { text: "Shows exceptional dedication to continuous learning and skill improvement", category: "Growth Mindset", level: "advanced" as const, relevanceScore: 0.9 },
          { text: "Consistently helps peers understand difficult concepts and contributes to collaborative learning", category: "Leadership", level: "intermediate" as const, relevanceScore: 0.9 },
          { text: "Produces work that demonstrates deep understanding and innovative application of concepts", category: "Excellence", level: "advanced" as const, relevanceScore: 0.95 },
          { text: "Shows exceptional ability to identify and solve problems independently", category: "Self-Direction", level: "advanced" as const, relevanceScore: 0.9 },
          { text: "Demonstrates outstanding communication skills when explaining technical concepts", category: "Communication", level: "intermediate" as const, relevanceScore: 0.9 },
          { text: "Consistently delivers projects ahead of schedule with exceptional quality", category: "Professional Skills", level: "advanced" as const, relevanceScore: 0.95 }
        ],
        good: [
          { text: "Shows solid understanding of concepts with good practical application", category: "Understanding", level: "intermediate" as const, relevanceScore: 0.8 },
          { text: "Demonstrates steady progress and good work ethic throughout the course", category: "Progress", level: "intermediate" as const, relevanceScore: 0.85 },
          { text: "Collaborates well with peers and contributes positively to group projects", category: "Teamwork", level: "intermediate" as const, relevanceScore: 0.8 },
          { text: "Shows good problem-solving approach with methodical thinking", category: "Problem Solving", level: "intermediate" as const, relevanceScore: 0.85 },
          { text: "Demonstrates consistent effort and engagement in class activities", category: "Engagement", level: "intermediate" as const, relevanceScore: 0.8 },
          { text: "Shows good understanding of fundamental concepts with room for advanced exploration", category: "Understanding", level: "intermediate" as const, relevanceScore: 0.85 },
          { text: "Produces quality work that meets expectations and shows good attention to detail", category: "Quality", level: "intermediate" as const, relevanceScore: 0.85 },
          { text: "Demonstrates good time management and project completion skills", category: "Professional Skills", level: "intermediate" as const, relevanceScore: 0.8 },
          { text: "Shows improvement in technical skills and understanding throughout the course", category: "Progress", level: "intermediate" as const, relevanceScore: 0.85 },
          { text: "Collaborates effectively and shows good communication in team settings", category: "Teamwork", level: "intermediate" as const, relevanceScore: 0.85 },
          { text: "Demonstrates good debugging skills and systematic approach to problem-solving", category: "Problem Solving", level: "intermediate" as const, relevanceScore: 0.85 },
          { text: "Shows good foundation in core concepts with potential for advanced development", category: "Foundation", level: "intermediate" as const, relevanceScore: 0.85 }
        ],
        developing: [
          { text: "Shows willingness to learn and improve with consistent effort", category: "Growth Mindset", level: "beginner" as const, relevanceScore: 0.8 },
          { text: "Demonstrates improving understanding with additional practice and support", category: "Development", level: "beginner" as const, relevanceScore: 0.85 },
          { text: "Benefits from guided practice and structured learning approaches", category: "Learning Style", level: "beginner" as const, relevanceScore: 0.8 },
          { text: "Shows progress in foundational concepts with continued reinforcement", category: "Foundation", level: "beginner" as const, relevanceScore: 0.85 },
          { text: "Demonstrates positive attitude toward learning and accepts constructive feedback", category: "Growth Mindset", level: "beginner" as const, relevanceScore: 0.85 },
          { text: "Shows improvement in basic skills with continued practice and guidance", category: "Development", level: "beginner" as const, relevanceScore: 0.85 },
          { text: "Benefits from additional examples and step-by-step instruction", category: "Learning Style", level: "beginner" as const, relevanceScore: 0.8 },
          { text: "Demonstrates growing confidence in applying fundamental concepts", category: "Foundation", level: "beginner" as const, relevanceScore: 0.85 },
          { text: "Shows increasing engagement and participation in class activities", category: "Engagement", level: "beginner" as const, relevanceScore: 0.8 },
          { text: "Demonstrates progress in understanding basic programming principles", category: "Development", level: "beginner" as const, relevanceScore: 0.85 },
          { text: "Shows willingness to ask questions and seek help when needed", category: "Growth Mindset", level: "beginner" as const, relevanceScore: 0.85 },
          { text: "Benefits from peer collaboration and group learning activities", category: "Learning Style", level: "beginner" as const, relevanceScore: 0.85 }
        ]
      }
    }

    // Select appropriate suggestions based on course and type
    const courseKey = currentSubject.toLowerCase().includes('robot') ? 'robotics' :
                      currentSubject.toLowerCase().includes('web') ? 'web' : 'programming'
    
    let suggestions: Omit<SuggestionItem, "id">[] = []

    if (type === 'comments') {
      const perfKey = performanceLevel === 'A' ? 'excellent' :
                      performanceLevel === 'B' || performanceLevel === 'C' ? 'good' : 'developing'
      suggestions = common.comments[perfKey] || common.comments.good
    } else {
      suggestions = common[type]?.[courseKey] || common[type].programming
    }

    // Add unique id to each suggestion
    return suggestions.map((item, idx) => ({
      ...item,
      id: `${type}-${courseKey}-${idx}`
    }))
  }, [currentSubject, type, performanceLevel])

  // Filter and rank suggestions based on search term and relevance
  const filteredSuggestions = useMemo(() => {
    const filtered = suggestionDatabase.filter(item => {
      const matchesSearch = searchTerm === "" || 
        item.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesLevel = studentLevel === "beginner" ? true :
                          studentLevel === "intermediate" ? item.level !== "advanced" :
                          true // Advanced students can see all levels
      
      return matchesSearch && matchesLevel
    })

    // Sort by relevance score and course specificity
    return filtered.sort((a, b) => {
      const aScore = a.relevanceScore + (a.courseSpecific ? 0.1 : 0)
      const bScore = b.relevanceScore + (b.courseSpecific ? 0.1 : 0)
      return bScore - aScore
    }).slice(0, 25) // Increased to 25 suggestions for more content
  }, [suggestionDatabase, searchTerm, studentLevel])

  const handleSelectItem = (item: SuggestionItem) => {
    if (selectedItems.includes(item.text)) {
      setSelectedItems(prev => prev.filter(text => text !== item.text))
    } else {
      if (selectedItems.length >= maxSelections) {
        toast({
          title: "Selection Limit",
          description: `Maximum ${maxSelections} items can be selected`,
          variant: "destructive"
        })
        return
      }
      setSelectedItems(prev => [...prev, item.text])
    }
  }

  const handleApplySelected = () => {
    if (selectedItems.length === 0) {
      toast({
        title: "No Selection",
        description: "Please select at least one item",
        variant: "destructive"
      })
      return
    }

    const combined = selectedItems.join("\n• ")
    onSelect(`• ${combined}`)
    setSelectedItems([])
    setIsOpen(false)
    
    toast({
      title: "Applied Successfully",
      description: `${selectedItems.length} suggestion(s) applied`,
    })
  }

  const getCategoryIcon = (category: string) => {
    const iconMap: Record<string, any> = {
      "Problem Solving": Target,
      "Technical Skills": BookOpen,
      "Innovation": Lightbulb,
      "Leadership": Users,
      "Excellence": Award,
      "Quality": CheckCircle,
      "Engineering": Wand2,
      "Design": Star,
      default: Sparkles
    }
    const IconComponent = iconMap[category] || iconMap.default
    return <IconComponent className="h-3 w-3" />
  }

  const getButtonText = () => {
    if (triggerText) return triggerText
    
    const typeLabels = {
      strengths: "🌟 Smart Strengths",
      growth: "📈 Growth Suggestions", 
      comments: "💬 Comment Templates"
    }
    return typeLabels[type]
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="gap-1.5 sm:gap-2 text-xs sm:text-sm w-full sm:w-auto touch-manipulation"
        >
          <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          <span className="truncate">{getButtonText()}</span>
          {selectedItems.length > 0 && (
            <Badge variant="secondary" className="ml-1 text-xs px-1.5 py-0">
              {selectedItems.length}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        className="w-[calc(100vw-2rem)] sm:w-96 md:w-[28rem] p-0 max-h-[85vh] sm:max-h-[80vh] flex flex-col" 
        align="start"
        sideOffset={4}
      >
        <div className="p-3 sm:p-4 border-b flex-shrink-0">
          <div className="flex items-center gap-2 mb-2 sm:mb-3 flex-wrap">
            <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-purple-500 flex-shrink-0" />
            <h3 className="font-medium text-sm sm:text-base">Intelligent Suggestions</h3>
            <Badge variant="outline" className="ml-auto text-xs">
              {filteredSuggestions.length} available
            </Badge>
          </div>
          <div className="relative">
            <Search className="absolute left-2.5 sm:left-3 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-400" />
            <Input
              placeholder="Search suggestions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 sm:pl-9 text-sm h-9 sm:h-10 touch-manipulation"
            />
          </div>
        </div>
        
        <ScrollArea className="flex-1 overflow-y-auto max-h-[60vh] sm:max-h-[50vh]">
          <div className="p-2 sm:p-3">
            {filteredSuggestions.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Search className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">No suggestions found</p>
                <p className="text-xs mt-1">Try a different search term</p>
              </div>
            ) : (
              filteredSuggestions.map((item) => (
                <Card
                  key={item.id || item.text}
                  className={`mb-2 cursor-pointer transition-all hover:bg-gray-50 active:bg-gray-100 touch-manipulation ${
                    selectedItems.includes(item.text) ? "bg-blue-50 border-blue-200 ring-2 ring-blue-300" : ""
                  }`}
                  onClick={() => handleSelectItem(item)}
                >
                  <CardContent className="p-2.5 sm:p-3">
                    <div className="flex items-start gap-2 sm:gap-3">
                      <div className="p-1 bg-gray-100 rounded flex-shrink-0">
                        {getCategoryIcon(item.category)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 sm:gap-2 mb-1 flex-wrap">
                          <Badge variant="outline" className="text-[10px] sm:text-xs px-1.5 py-0">
                            {item.category}
                          </Badge>
                          <Badge 
                            variant={item.level === "advanced" ? "default" : "secondary"} 
                            className="text-[10px] sm:text-xs px-1.5 py-0"
                          >
                            {item.level}
                          </Badge>
                          {item.courseSpecific && (
                            <Badge variant="secondary" className="text-[10px] sm:text-xs bg-green-100 text-green-700 px-1.5 py-0">
                              Course
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs sm:text-sm text-gray-700 leading-relaxed break-words">
                          {item.text}
                        </p>
                        <div className="flex items-center gap-1 mt-1.5 sm:mt-2 flex-wrap">
                          <div className="flex">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`h-2.5 w-2.5 sm:h-3 sm:w-3 ${
                                  i < Math.round(item.relevanceScore * 5)
                                    ? "text-yellow-400 fill-current"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-[10px] sm:text-xs text-gray-500 ml-1">
                            {Math.round(item.relevanceScore * 100)}%
                          </span>
                        </div>
                      </div>
                      {selectedItems.includes(item.text) && (
                        <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </ScrollArea>
        
        {selectedItems.length > 0 && (
          <div className="p-3 sm:p-4 border-t bg-gray-50 flex-shrink-0">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 sm:gap-0">
              <span className="text-xs sm:text-sm text-gray-600 text-center sm:text-left">
                {selectedItems.length} item(s) selected
              </span>
              <div className="flex gap-2 w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedItems([])}
                  className="flex-1 sm:flex-none text-xs sm:text-sm touch-manipulation"
                >
                  Clear
                </Button>
                <Button
                  size="sm"
                  onClick={handleApplySelected}
                  className="gap-1.5 sm:gap-2 flex-1 sm:flex-none text-xs sm:text-sm touch-manipulation"
                >
                  Apply
                  <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
