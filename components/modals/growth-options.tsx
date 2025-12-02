"use client"

import { useState, useMemo } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Search, TrendingUp, Target, BookOpen, Users, Lightbulb, Zap, Plus, ArrowUp, Code, Palette, Cpu, Globe, Smartphone, Gamepad2 } from "lucide-react"

interface GrowthOptionsProps {
  open?: boolean
  onClose: () => void
  onSelect: (growth: string) => void
  currentSubject?: string
  studentLevel?: "beginner" | "intermediate" | "advanced"
}

export function GrowthOptions({
  open = true,
  onClose,
  onSelect,
  currentSubject = "Python Programming",
  studentLevel = "intermediate",
}: GrowthOptionsProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedGrowthAreas, setSelectedGrowthAreas] = useState<string[]>([])
  const { toast } = useToast()

  const growthCategories = {
    technical: {
      name: "Technical Development",
      icon: Target,
      color: "bg-blue-500",
      areas: [
        "Focus on strengthening debugging skills through systematic error analysis and testing methodologies",
        "Develop deeper understanding of advanced programming concepts like recursion and dynamic programming",
        "Practice code optimization techniques to improve algorithm efficiency and performance",
        "Enhance understanding of data structures by implementing custom solutions and analyzing complexity",
        "Strengthen object-oriented programming skills through design pattern implementation",
        "Improve code documentation and commenting practices for better maintainability",
        "Develop proficiency in version control workflows and collaborative development practices",
        "Practice test-driven development to improve code quality and reliability",
        "Enhance understanding of software architecture and system design principles",
        "Strengthen skills in API design and integration with external services",
        "Improve understanding of database design and query optimization techniques",
        "Develop skills in mobile app development and cross-platform solutions",
        "Strengthen knowledge of web security principles and secure coding practices",
        "Practice performance profiling and optimization of applications",
        "Enhance understanding of cloud computing and deployment strategies",
        "Develop skills in machine learning and artificial intelligence applications",
        "Strengthen knowledge of DevOps practices and continuous integration",
        "Improve understanding of microservices architecture and distributed systems",
        "Practice working with different programming paradigms and languages",
        "Develop expertise in framework-specific best practices and conventions",
      ],
    },
    problem_solving: {
      name: "Problem Solving & Logic",
      icon: Lightbulb,
      color: "bg-yellow-500",
      areas: [
        "Practice breaking down complex problems into smaller, manageable components",
        "Develop systematic approaches to algorithm design and implementation",
        "Strengthen logical reasoning skills through puzzle-solving and brain teasers",
        "Improve pattern recognition abilities to identify common programming solutions",
        "Practice pseudocode writing to plan solutions before implementation",
        "Develop skills in analyzing problem requirements and edge cases",
        "Strengthen ability to choose appropriate data structures for specific problems",
        "Practice time and space complexity analysis for algorithm optimization",
        "Improve debugging strategies and systematic error identification",
        "Develop skills in researching and adapting existing solutions to new problems",
        "Strengthen mathematical reasoning and computational thinking skills",
        "Practice graph theory and tree-based problem solving techniques",
        "Develop skills in dynamic programming and greedy algorithm strategies",
        "Improve ability to recognize and implement sorting and searching algorithms",
        "Strengthen understanding of recursion and backtracking approaches",
        "Practice competitive programming to enhance speed and accuracy",
        "Develop skills in analyzing and improving algorithm efficiency",
        "Strengthen ability to handle large-scale data processing challenges",
        "Practice working with constraints and optimization problems",
        "Improve skills in mathematical modeling of real-world problems",
      ],
    },
    collaboration: {
      name: "Collaboration & Communication",
      icon: Users,
      color: "bg-green-500",
      areas: [
        "Practice explaining technical concepts clearly to both technical and non-technical audiences",
        "Develop skills in code review processes and constructive feedback delivery",
        "Strengthen teamwork abilities through pair programming and group projects",
        "Improve documentation writing for better knowledge sharing",
        "Practice presenting technical solutions and project demonstrations",
        "Develop skills in project management and task coordination",
        "Strengthen ability to ask effective questions and seek help when needed",
        "Practice giving and receiving constructive criticism on code and designs",
        "Improve skills in technical writing and proposal development",
        "Develop mentoring abilities to help other students learn",
        "Strengthen conflict resolution skills in technical discussions",
        "Practice leading team meetings and facilitating group decisions",
        "Develop skills in cross-functional collaboration with designers and stakeholders",
        "Improve ability to communicate project status and technical challenges",
        "Strengthen skills in remote collaboration and virtual teamwork",
        "Practice conducting effective technical interviews and assessments",
        "Develop ability to build consensus around technical decisions",
        "Improve skills in stakeholder management and requirement gathering",
        "Strengthen ability to delegate tasks and coordinate team efforts",
        "Practice creating and maintaining team knowledge bases and wikis",
      ],
    },
    creativity: {
      name: "Creative Thinking & Innovation",
      icon: Zap,
      color: "bg-purple-500",
      areas: [
        "Explore innovative approaches to user interface design and user experience",
        "Practice thinking outside conventional solutions to find creative alternatives",
        "Develop skills in rapid prototyping and iterative design processes",
        "Strengthen ability to combine different technologies in novel ways",
        "Practice brainstorming techniques for generating multiple solution approaches",
        "Develop artistic vision and aesthetic sense in digital design",
        "Strengthen skills in storytelling and narrative design for interactive media",
        "Practice experimental coding and exploration of emerging technologies",
        "Develop ability to identify and solve problems that others haven't noticed",
        "Strengthen skills in design thinking and human-centered problem solving",
        "Practice creating original animations and interactive visualizations",
        "Develop skills in game design and interactive entertainment programming",
        "Strengthen ability to create compelling data visualizations and infographics",
        "Practice building innovative web applications with unique features",
        "Develop skills in creative coding and generative art programming",
        "Strengthen ability to design intuitive and engaging user interactions",
        "Practice creating multimedia content and interactive presentations",
        "Develop skills in virtual and augmented reality application design",
        "Strengthen ability to innovate within technical constraints and limitations",
        "Practice combining art, technology, and functionality in creative projects",
      ],
    },
    learning: {
      name: "Learning & Growth Mindset",
      icon: BookOpen,
      color: "bg-indigo-500",
      areas: [
        "Develop more consistent study habits and practice schedules",
        "Strengthen ability to learn new technologies and frameworks independently",
        "Practice active learning techniques like teaching concepts to others",
        "Improve note-taking and knowledge organization skills",
        "Develop skills in setting and achieving learning goals",
        "Strengthen ability to seek feedback and apply it constructively",
        "Practice reflecting on learning progress and identifying areas for improvement",
        "Develop skills in online learning and self-directed education",
        "Strengthen ability to stay current with rapidly changing technology trends",
        "Practice building a professional learning network and seeking mentorship",
        "Develop skills in documenting and sharing learning experiences",
        "Strengthen ability to learn from failures and iterate on solutions",
        "Practice time management and prioritization in learning activities",
        "Develop skills in continuous integration of new knowledge with existing skills",
        "Strengthen ability to adapt learning strategies to different subjects and contexts",
        "Practice building and maintaining a professional portfolio of learning projects",
        "Develop skills in contributing to open-source projects and communities",
        "Strengthen ability to balance depth and breadth in technical learning",
        "Practice teaching and mentoring others as a way to solidify own understanding",
        "Develop lifelong learning habits that will support ongoing career development",
      ],
    },
    subject_specific: {
      name: "Subject-Specific Growth Areas",
      icon: Code,
      color: "bg-slate-500",
      areas: {
        "Scratch Programming": [
          "Could improve Scratch project organization with clear sprite naming and efficient script management",
          "Would benefit from more practice with Scratch loops and conditionals for complex game logic",
          "Should explore more complex Scratch broadcasting patterns for multi-sprite communication",
          "Needs to work on optimizing Scratch scripts for performance and reducing lag",
          "Could improve use of Scratch variables for state management and data tracking",
          "Would benefit from more practice with Scratch custom blocks for code reusability",
          "Should explore more advanced Scratch sensing and interaction techniques",
          "Needs to work on Scratch project planning and storyboarding before coding",
          "Could improve Scratch debugging skills and systematic error identification",
          "Would benefit from exploring Scratch extensions and hardware integration",
        ],
        "Python Programming": [
          "Could benefit from more practice with Python syntax fundamentals and language idioms",
          "Needs to work on Python function organization and modularity for cleaner code",
          "Should focus on Python error handling and debugging techniques",
          "Would benefit from more practice with Python object-oriented concepts",
          "Could improve Python code efficiency and optimization strategies",
          "Needs to work on Python documentation and commenting best practices",
          "Should explore more Python libraries and frameworks for different applications",
          "Would benefit from practice with Python data structures and algorithms",
          "Could improve Python testing methodologies and quality assurance",
          "Needs to work on Python project structure and package management",
        ],
        "Web Development": [
          "Could improve HTML semantic structure implementation for better accessibility",
          "Needs to work on CSS selector specificity and organization strategies",
          "Should focus on responsive design principles and mobile-first development",
          "Would benefit from more practice with CSS layout techniques like Flexbox and Grid",
          "Could improve CSS naming conventions and organization methodologies",
          "Needs to work on web accessibility implementation and inclusive design",
          "Should explore more advanced CSS features and animations",
          "Would benefit from JavaScript debugging and optimization techniques",
          "Could improve understanding of web performance and loading optimization",
          "Needs to work on cross-browser compatibility and testing strategies",
        ],
        "UI/UX Design": [
          "Could improve understanding of design principles and visual hierarchy",
          "Needs to work on color theory application in digital interface design",
          "Should focus on typography and readability in user interface contexts",
          "Would benefit from more user-centered design thinking and research methods",
          "Could improve visual consistency across different interface components",
          "Needs to work on design documentation and style guide creation",
          "Should explore more prototyping and user testing techniques",
          "Would benefit from accessibility considerations in design decisions",
          "Could improve understanding of interaction design and micro-interactions",
          "Needs to work on design system thinking and component-based design",
        ],
        "Data Science": [
          "Could improve statistical analysis fundamentals and hypothesis testing",
          "Needs to work on data cleaning and preprocessing techniques",
          "Should focus on data visualization best practices and storytelling",
          "Would benefit from more practice with machine learning algorithms",
          "Could improve Python data science library usage (Pandas, NumPy, Scikit-learn)",
          "Needs to work on SQL querying and database management skills",
          "Should explore more advanced statistical modeling techniques",
          "Would benefit from practice with big data tools and technologies",
          "Could improve data ethics and privacy protection understanding",
          "Needs to work on communicating data insights to non-technical audiences",
        ],
        "Mobile Development": [
          "Could improve understanding of mobile platform design guidelines",
          "Needs to work on responsive design for various screen sizes",
          "Should focus on mobile app performance optimization techniques",
          "Would benefit from more practice with platform-specific development tools",
          "Could improve mobile user experience and navigation design",
          "Needs to work on mobile app testing and debugging strategies",
          "Should explore more mobile device capabilities and sensor integration",
          "Would benefit from app store optimization and deployment processes",
          "Could improve mobile security and data protection implementation",
          "Needs to work on offline functionality and data synchronization",
        ],
        "Game Development": [
          "Could improve game design documentation and concept development",
          "Needs to work on game engine proficiency and workflow optimization",
          "Should focus on game physics and collision detection implementation",
          "Would benefit from more practice with character animation and rigging",
          "Could improve game AI programming and behavior trees",
          "Needs to work on game optimization and performance tuning",
          "Should explore more game art and asset creation techniques",
          "Would benefit from multiplayer networking and synchronization",
          "Could improve game monetization and business model understanding",
          "Needs to work on game testing and quality assurance processes",
        ],
        "Robotics & Engineering": [
          "Could improve understanding of mechanical engineering principles",
          "Needs to work on embedded programming and microcontroller integration",
          "Should focus on sensor integration and data acquisition systems",
          "Would benefit from more practice with motor control and actuation",
          "Could improve circuit design and electronic component knowledge",
          "Needs to work on autonomous navigation and path planning algorithms",
          "Should explore more mechanical design and 3D modeling skills",
          "Would benefit from control systems and feedback loop understanding",
          "Could improve robotics safety protocols and risk assessment",
          "Needs to work on project documentation and engineering communication",
        ],
      },
    },
  }

  const filteredGrowthAreas = useMemo(() => {
    const allAreas: Array<{ category: string; area: string; icon: any; color: string }> = []

    Object.entries(growthCategories).forEach(([key, category]) => {
      if (selectedCategory === "all" || selectedCategory === key) {
        let areasToProcess: string[] = []
        
        if (key === "subject_specific") {
          // Handle subject-specific areas
          const subjectAreas = (category.areas as any)[currentSubject] || []
          areasToProcess = subjectAreas
        } else {
          areasToProcess = category.areas as string[]
        }

        areasToProcess.forEach((area) => {
          if (area.toLowerCase().includes(searchTerm.toLowerCase())) {
            allAreas.push({
              category: category.name,
              area,
              icon: category.icon,
              color: category.color,
            })
          }
        })
      }
    })

    return allAreas
  }, [searchTerm, selectedCategory, currentSubject])

  const handleSelectGrowthArea = (area: string) => {
    onSelect(area)
    onClose()
  }

  const handleMultiSelect = (area: string) => {
    setSelectedGrowthAreas(prev => 
      prev.includes(area) 
        ? prev.filter(a => a !== area)
        : [...prev, area]
    )
  }

  const handleCombineAreas = () => {
    if (selectedGrowthAreas.length > 0) {
      const combined = selectedGrowthAreas.join(" ")
      onSelect(combined)
      onClose()
      toast({
        title: "Growth Areas Combined",
        description: `${selectedGrowthAreas.length} growth areas have been combined.`,
      })
    }
  }

  const renderContent = () => {
    if (open === false) {
      // Legacy modal rendering
      return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-bold text-navy dark:text-blue-300">Select Area for Growth</h3>
              <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                ×
              </button>
            </div>
            <div className="grid grid-cols-1 gap-2">
              {filteredGrowthAreas.map((item, index) => (
                <div
                  key={index}
                  className="bg-gray-100 dark:bg-gray-700 p-2 rounded cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 text-sm"
                  onClick={() => handleSelectGrowthArea(item.area)}
                >
                  {item.area}
                </div>
              ))}
            </div>
          </div>
        </div>
      )
    }

    // Enhanced dialog rendering
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-5xl max-h-[95vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Growth Areas for {currentSubject} ({studentLevel} level)
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Search and Controls */}
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search growth areas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              {selectedGrowthAreas.length > 0 && (
                <Button onClick={handleCombineAreas} variant="default">
                  <Plus className="h-4 w-4 mr-2" />
                  Combine ({selectedGrowthAreas.length})
                </Button>
              )}
            </div>

            {/* Category Tabs */}
            <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
              <TabsList className="grid w-full grid-cols-3 lg:grid-cols-7">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="technical">Technical</TabsTrigger>
                <TabsTrigger value="problem_solving">Problem Solving</TabsTrigger>
                <TabsTrigger value="collaboration">Collaboration</TabsTrigger>
                <TabsTrigger value="creativity">Creativity</TabsTrigger>
                <TabsTrigger value="learning">Learning</TabsTrigger>
                <TabsTrigger value="subject_specific">Subject</TabsTrigger>
              </TabsList>

              <ScrollArea className="h-[60vh] mt-4 pr-4">
                <div className="space-y-3">
                  {filteredGrowthAreas.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No growth areas found matching your search.</p>
                      <p className="text-xs mt-2">Try searching for different terms or select a different category.</p>
                    </div>
                  ) : (
                    filteredGrowthAreas.map((item, index) => {
                      const isSelected = selectedGrowthAreas.includes(item.area)
                      const Icon = item.icon

                      return (
                        <Card 
                          key={index}
                          className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                            isSelected ? "ring-2 ring-primary bg-primary/5" : ""
                          }`}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                              <div className={`p-2 rounded-full ${item.color} text-white flex-shrink-0`}>
                                <Icon className="h-4 w-4" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-2">
                                  <Badge variant="secondary" className="text-xs">
                                    {item.category}
                                  </Badge>
                                  <div className="flex gap-2">
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => handleMultiSelect(item.area)}
                                      className={isSelected ? "bg-primary text-primary-foreground" : ""}
                                      title="Add to selection"
                                    >
                                      <Plus className="h-3 w-3" />
                                    </Button>
                                    <Button
                                      size="sm"
                                      onClick={() => handleSelectGrowthArea(item.area)}
                                      title="Select this growth area"
                                    >
                                      Select
                                    </Button>
                                  </div>
                                </div>
                                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                                  {item.area}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })
                  )}
                </div>
              </ScrollArea>
            </Tabs>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return renderContent()
}
