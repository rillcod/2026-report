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

  // Course-specific suggestion database
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
          { text: "Shows initiative in exploring advanced concepts beyond curriculum", category: "Self-Learning", level: "advanced" as const, relevanceScore: 0.9 }
        ],
        robotics: [
          { text: "Exceptional mechanical understanding and spatial reasoning abilities", category: "Engineering", level: "intermediate" as const, relevanceScore: 0.9, courseSpecific: true },
          { text: "Strong integration of hardware and software components", category: "System Integration", level: "advanced" as const, relevanceScore: 0.85, courseSpecific: true },
          { text: "Innovative approach to sensor integration and data processing", category: "Innovation", level: "advanced" as const, relevanceScore: 0.8, courseSpecific: true },
          { text: "Excellent troubleshooting skills for complex robotic systems", category: "Problem Solving", level: "intermediate" as const, relevanceScore: 0.85, courseSpecific: true },
          { text: "Demonstrates strong understanding of control systems and automation", category: "Technical Skills", level: "advanced" as const, relevanceScore: 0.9, courseSpecific: true }
        ],
        web: [
          { text: "Natural eye for user interface design and user experience", category: "Design", level: "intermediate" as const, relevanceScore: 0.9, courseSpecific: true },
          { text: "Strong understanding of responsive design principles", category: "Technical Skills", level: "intermediate" as const, relevanceScore: 0.85, courseSpecific: true },
          { text: "Excellent integration of frontend and backend technologies", category: "Full-Stack", level: "advanced" as const, relevanceScore: 0.8, courseSpecific: true },
          { text: "Shows creativity in solving complex user interaction challenges", category: "Innovation", level: "advanced" as const, relevanceScore: 0.85, courseSpecific: true },
          { text: "Strong attention to detail in cross-browser compatibility", category: "Quality Assurance", level: "intermediate" as const, relevanceScore: 0.8, courseSpecific: true }
        ]
      },
      growth: {
        programming: [
          { text: "Focus on strengthening algorithmic thinking through practice problems", category: "Core Skills", level: "beginner" as const, relevanceScore: 0.9 },
          { text: "Develop deeper understanding of data structures and their applications", category: "Technical Knowledge", level: "intermediate" as const, relevanceScore: 0.85 },
          { text: "Improve code optimization and efficiency considerations", category: "Performance", level: "advanced" as const, relevanceScore: 0.8 },
          { text: "Enhance testing methodologies and quality assurance practices", category: "Best Practices", level: "intermediate" as const, relevanceScore: 0.85 },
          { text: "Build stronger foundation in software design patterns", category: "Architecture", level: "advanced" as const, relevanceScore: 0.9 },
          { text: "Develop collaborative coding skills and version control usage", category: "Teamwork", level: "intermediate" as const, relevanceScore: 0.8 }
        ],
        robotics: [
          { text: "Strengthen understanding of advanced sensor fusion techniques", category: "Technical Skills", level: "advanced" as const, relevanceScore: 0.9, courseSpecific: true },
          { text: "Develop deeper knowledge of control theory and PID systems", category: "Control Systems", level: "advanced" as const, relevanceScore: 0.85, courseSpecific: true },
          { text: "Improve mechanical design and CAD modeling skills", category: "Design", level: "intermediate" as const, relevanceScore: 0.8, courseSpecific: true },
          { text: "Focus on autonomous navigation and path planning algorithms", category: "AI Integration", level: "advanced" as const, relevanceScore: 0.9, courseSpecific: true },
          { text: "Enhance understanding of embedded systems programming", category: "Programming", level: "intermediate" as const, relevanceScore: 0.85, courseSpecific: true }
        ],
        web: [
          { text: "Develop stronger backend API design and database optimization skills", category: "Backend", level: "intermediate" as const, relevanceScore: 0.9, courseSpecific: true },
          { text: "Improve understanding of modern JavaScript frameworks and libraries", category: "Frontend", level: "intermediate" as const, relevanceScore: 0.85, courseSpecific: true },
          { text: "Focus on security best practices and vulnerability prevention", category: "Security", level: "advanced" as const, relevanceScore: 0.8, courseSpecific: true },
          { text: "Enhance performance optimization and progressive web app concepts", category: "Performance", level: "advanced" as const, relevanceScore: 0.85, courseSpecific: true },
          { text: "Develop stronger testing strategies for web applications", category: "Quality Assurance", level: "intermediate" as const, relevanceScore: 0.8, courseSpecific: true }
        ]
      },
      comments: {
        excellent: [
          { text: "Consistently exceeds expectations with innovative solutions and exceptional quality work", category: "Excellence", level: "advanced" as const, relevanceScore: 0.95 },
          { text: "Demonstrates remarkable leadership qualities and positively influences peer learning", category: "Leadership", level: "advanced" as const, relevanceScore: 0.9 },
          { text: "Shows outstanding initiative in exploring concepts beyond the curriculum", category: "Self-Direction", level: "advanced" as const, relevanceScore: 0.85 },
          { text: "Produces consistently high-quality work with attention to detail and best practices", category: "Quality", level: "intermediate" as const, relevanceScore: 0.9 }
        ],
        good: [
          { text: "Shows solid understanding of concepts with good practical application", category: "Understanding", level: "intermediate" as const, relevanceScore: 0.8 },
          { text: "Demonstrates steady progress and good work ethic throughout the course", category: "Progress", level: "intermediate" as const, relevanceScore: 0.85 },
          { text: "Collaborates well with peers and contributes positively to group projects", category: "Teamwork", level: "intermediate" as const, relevanceScore: 0.8 },
          { text: "Shows good problem-solving approach with methodical thinking", category: "Problem Solving", level: "intermediate" as const, relevanceScore: 0.85 }
        ],
        developing: [
          { text: "Shows willingness to learn and improve with consistent effort", category: "Growth Mindset", level: "beginner" as const, relevanceScore: 0.8 },
          { text: "Demonstrates improving understanding with additional practice and support", category: "Development", level: "beginner" as const, relevanceScore: 0.85 },
          { text: "Benefits from guided practice and structured learning approaches", category: "Learning Style", level: "beginner" as const, relevanceScore: 0.8 },
          { text: "Shows progress in foundational concepts with continued reinforcement", category: "Foundation", level: "beginner" as const, relevanceScore: 0.85 }
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
    }).slice(0, 12) // Limit to top 12 suggestions
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
        <Button variant="outline" size="sm" className="gap-2">
          <Sparkles className="h-4 w-4" />
          {getButtonText()}
          {selectedItems.length > 0 && (
            <Badge variant="secondary" className="ml-1">
              {selectedItems.length}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-96 p-0" align="start">
        <div className="p-4 border-b">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="h-5 w-5 text-purple-500" />
            <h3 className="font-medium">Intelligent Suggestions</h3>
            <Badge variant="outline" className="ml-auto">
              {filteredSuggestions.length} available
            </Badge>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search suggestions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
        
        <ScrollArea className="max-h-80">
          <div className="p-2">
            {filteredSuggestions.map((item) => (
              <Card
                key={item.id || item.text}
                className={`mb-2 cursor-pointer transition-all hover:bg-gray-50 ${
                  selectedItems.includes(item.text) ? "bg-blue-50 border-blue-200" : ""
                }`}
                onClick={() => handleSelectItem(item)}
              >
                <CardContent className="p-3">
                  <div className="flex items-start gap-3">
                    <div className="p-1 bg-gray-100 rounded">
                      {getCategoryIcon(item.category)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-xs">
                          {item.category}
                        </Badge>
                        <Badge variant={item.level === "advanced" ? "default" : "secondary"} className="text-xs">
                          {item.level}
                        </Badge>
                        {item.courseSpecific && (
                          <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                            Course Specific
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {item.text}
                      </p>
                      <div className="flex items-center gap-1 mt-2">
                        <div className="flex">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3 w-3 ${
                                i < Math.round(item.relevanceScore * 5)
                                  ? "text-yellow-400 fill-current"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-gray-500 ml-1">
                          {Math.round(item.relevanceScore * 100)}% relevance
                        </span>
                      </div>
                    </div>
                    {selectedItems.includes(item.text) && (
                      <CheckCircle className="h-5 w-5 text-blue-500 flex-shrink-0" />
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
        
        {selectedItems.length > 0 && (
          <div className="p-4 border-t bg-gray-50">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                {selectedItems.length} item(s) selected
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedItems([])}
                >
                  Clear
                </Button>
                <Button
                  size="sm"
                  onClick={handleApplySelected}
                  className="gap-2"
                >
                  Apply Selected
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
