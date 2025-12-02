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
import { Search, Code, Palette, Cpu, Globe, Smartphone, Gamepad2, Star, Plus, Sparkles, Lightbulb, Zap } from "lucide-react"

interface StrengthOptionsProps {
  open?: boolean
  onClose: () => void
  onSelect: (strength: string) => void
  currentSubject?: string
  studentLevel?: "beginner" | "intermediate" | "advanced"
}

export function StrengthOptions({
  open = true,
  onClose,
  onSelect,
  currentSubject = "Python Programming",
  studentLevel = "intermediate",
}: StrengthOptionsProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedStrengths, setSelectedStrengths] = useState<string[]>([])
  const { toast } = useToast()

  const strengthCategories = {
    technical: {
      name: "Technical Skills",
      icon: Code,
      color: "bg-blue-500",
      strengths: [
        "Demonstrates exceptional problem-solving abilities when debugging complex code",
        "Shows mastery of fundamental programming concepts including variables, loops, and functions",
        "Exhibits strong logical thinking skills when breaking down complex problems into smaller components",
        "Displays excellent understanding of data structures and their practical applications",
        "Demonstrates proficiency in writing clean, well-documented, and maintainable code",
        "Shows advanced understanding of object-oriented programming principles",
        "Exhibits strong debugging skills and systematic approach to error resolution",
        "Demonstrates excellent grasp of algorithm design and optimization techniques",
        "Shows proficiency in version control systems and collaborative development practices",
        "Displays strong understanding of software testing and quality assurance principles",
      ],
    },
    creative: {
      name: "Creative & Design",
      icon: Palette,
      color: "bg-purple-500",
      strengths: [
        "Demonstrates exceptional creativity in user interface design and user experience planning",
        "Shows innovative thinking when approaching design challenges and aesthetic solutions",
        "Exhibits strong visual design sense with excellent color theory and typography choices",
        "Displays creative problem-solving skills when designing interactive user experiences",
        "Demonstrates excellent understanding of design principles and visual hierarchy",
        "Shows proficiency in creating engaging and intuitive user interfaces",
        "Exhibits strong artistic vision combined with technical implementation skills",
        "Demonstrates excellent prototyping skills and iterative design processes",
        "Shows creativity in combining different technologies to create unique solutions",
        "Displays strong understanding of accessibility principles in design",
      ],
    },
    robotics: {
      name: "Robotics & Engineering",
      icon: Cpu,
      color: "bg-orange-500",
      strengths: [
        "Demonstrates exceptional understanding of mechanical engineering principles and robot kinematics",
        "Shows mastery of embedded programming and microcontroller integration",
        "Exhibits strong skills in sensor integration and data acquisition systems",
        "Displays excellent understanding of motor control and actuator systems",
        "Demonstrates proficiency in circuit design and electronic component integration",
        "Shows advanced understanding of autonomous navigation and path planning algorithms",
        "Exhibits strong problem-solving skills in mechanical design and fabrication",
        "Demonstrates excellent understanding of control systems and feedback loops",
        "Shows proficiency in 3D modeling and computer-aided design (CAD) software",
        "Displays strong understanding of safety protocols and engineering ethics",
      ],
    },
    web: {
      name: "Web Development",
      icon: Globe,
      color: "bg-green-500",
      strengths: [
        "Demonstrates exceptional understanding of modern web technologies and frameworks",
        "Shows mastery of responsive design principles and cross-browser compatibility",
        "Exhibits strong skills in both frontend and backend development",
        "Displays excellent understanding of web security and best practices",
        "Demonstrates proficiency in database design and API development",
        "Shows advanced understanding of web performance optimization techniques",
        "Exhibits strong skills in modern JavaScript frameworks and libraries",
        "Demonstrates excellent understanding of web accessibility standards",
        "Shows proficiency in deployment and DevOps practices",
        "Displays strong understanding of progressive web app development",
      ],
    },
    mobile: {
      name: "Mobile Development",
      icon: Smartphone,
      color: "bg-indigo-500",
      strengths: [
        "Demonstrates exceptional understanding of mobile app development principles",
        "Shows mastery of platform-specific design guidelines and user experience patterns",
        "Exhibits strong skills in cross-platform development frameworks",
        "Displays excellent understanding of mobile performance optimization",
        "Demonstrates proficiency in mobile device capabilities and sensor integration",
        "Shows advanced understanding of mobile app security and data protection",
        "Exhibits strong skills in app store optimization and deployment processes",
        "Demonstrates excellent understanding of mobile testing and debugging",
        "Shows proficiency in offline functionality and data synchronization",
        "Displays strong understanding of mobile monetization and analytics",
      ],
    },
    gaming: {
      name: "Game Development",
      icon: Gamepad2,
      color: "bg-red-500",
      strengths: [
        "Demonstrates exceptional creativity in game design and interactive storytelling",
        "Shows mastery of game engine technologies and development workflows",
        "Exhibits strong skills in 2D and 3D graphics programming",
        "Displays excellent understanding of game physics and collision detection",
        "Demonstrates proficiency in character animation and visual effects",
        "Shows advanced understanding of game AI and procedural generation",
        "Exhibits strong skills in audio programming and sound design integration",
        "Demonstrates excellent understanding of game optimization and performance",
        "Shows proficiency in multiplayer networking and real-time systems",
        "Displays strong understanding of game monetization and player engagement",
      ],
    },
    collaboration: {
      name: "Collaboration & Communication",
      icon: Star,
      color: "bg-pink-500",
      strengths: [
        "Demonstrates excellent communication skills when explaining technical concepts to others",
        "Shows strong leadership abilities in team projects and group collaborations",
        "Exhibits exceptional mentoring skills when helping classmates understand difficult concepts",
        "Displays excellent presentation skills during project demonstrations and code reviews",
        "Demonstrates strong conflict resolution skills in technical discussions and team dynamics",
        "Shows proficiency in giving and receiving constructive feedback on code and design",
        "Exhibits excellent documentation skills that benefit the entire team",
        "Demonstrates strong project management abilities and task coordination",
        "Shows excellent cross-functional collaboration with designers and stakeholders",
        "Displays strong ability to build consensus around technical decisions and solutions",
        "Demonstrates exceptional patience and empathy when teaching others",
        "Shows excellent active listening skills during team discussions and planning sessions",
        "Exhibits strong networking abilities and builds positive professional relationships",
        "Demonstrates excellent time management in collaborative environments",
        "Shows strong cultural awareness and inclusivity in diverse team settings",
      ],
    },
    analytical: {
      name: "Analytical & Problem-Solving",
      icon: Lightbulb,
      color: "bg-yellow-500",
      strengths: [
        "Demonstrates exceptional analytical thinking when breaking down complex problems",
        "Shows systematic approach to debugging and error resolution",
        "Exhibits strong pattern recognition abilities in code and data analysis",
        "Displays excellent logical reasoning and computational thinking skills",
        "Demonstrates strong research skills when investigating new technologies",
        "Shows excellent attention to detail in code review and testing processes",
        "Exhibits strong mathematical reasoning for algorithm development",
        "Demonstrates excellent critical thinking when evaluating different solutions",
        "Shows strong data interpretation and statistical analysis capabilities",
        "Displays excellent troubleshooting methodology and systematic problem-solving",
        "Demonstrates strong ability to identify root causes of complex issues",
        "Shows excellent capacity for abstract thinking and conceptual modeling",
        "Exhibits strong optimization skills for performance and efficiency improvements",
        "Demonstrates excellent risk assessment and mitigation planning abilities",
        "Shows strong strategic thinking for long-term project planning and architecture",
      ],
    },
    innovation: {
      name: "Innovation & Creativity",
      icon: Zap,
      color: "bg-purple-600",
      strengths: [
        "Demonstrates exceptional creative thinking in solution design and implementation",
        "Shows innovative approaches to traditional programming challenges",
        "Exhibits strong entrepreneurial mindset and business problem-solving abilities",
        "Displays excellent imagination in user experience and interface design",
        "Demonstrates strong artistic vision combined with technical expertise",
        "Shows excellent brainstorming and ideation skills in team environments",
        "Exhibits strong experimental coding and prototyping abilities",
        "Demonstrates excellent storytelling abilities for project presentation and documentation",
        "Shows strong design thinking methodology and human-centered problem solving",
        "Displays excellent adaptability when working with new and emerging technologies",
        "Demonstrates strong ability to think outside conventional solutions",
        "Shows excellent capacity for combining different technologies in novel ways",
        "Exhibits strong vision for future technology trends and applications",
        "Demonstrates excellent ability to inspire and motivate others through creative solutions",
        "Shows strong passion for continuous learning and exploration of new ideas",
      ],
    },
    subject_specific: {
      name: "Subject-Specific Strengths",
      icon: Sparkles,
      color: "bg-gradient-to-r from-purple-500 to-pink-500",
      strengths: {
        "Scratch Programming": [
          "Exceptional creativity in Scratch sprite design and interactive storytelling with engaging narratives",
          "Strong understanding of Scratch event-based programming and broadcasting for complex multi-sprite interactions",
          "Excellent use of Scratch cloning mechanisms to create dynamic and scalable game elements",
          "Impressive mastery of Scratch variables and lists for sophisticated data management and game state tracking",
          "Excellent application of Scratch sensing blocks for responsive and interactive user experiences",
          "Innovative use of Scratch custom blocks for code reusability and advanced programming patterns",
          "Outstanding implementation of Scratch conditional logic and loops for complex game mechanics",
          "Exceptional attention to detail in Scratch animation and costume management for polished projects",
          "Strong problem-solving skills when debugging Scratch scripts and optimizing performance",
          "Excellent understanding of Scratch stage management and coordinate systems for precise control",
        ],
        "Python Programming": [
          "Strong understanding of Python syntax, data structures, and programming fundamentals with clean implementation",
          "Excellent implementation of Python functions and modules with proper code organization and structure",
          "Impressive use of Python list comprehensions and advanced data manipulation techniques",
          "Strong grasp of Python object-oriented programming concepts with effective class design and inheritance",
          "Effective use of Python exception handling and defensive programming practices for robust code",
          "Excellent Python file handling and data processing skills for real-world applications",
          "Strong understanding of Python libraries and packages including NumPy, Pandas, and Matplotlib",
          "Impressive debugging skills and systematic approach to Python error resolution",
          "Excellent code documentation and commenting practices following Python conventions",
          "Strong understanding of Python algorithms and computational complexity for efficient solutions",
        ],
        "Web Development": [
          "Excellent HTML semantic structure implementation for accessible and well-organized web content",
          "Strong CSS styling and layout skills with effective use of modern layout techniques",
          "Impressive responsive design implementation that works seamlessly across all device sizes",
          "Creative use of CSS animations and transitions to enhance user experience and engagement",
          "Strong understanding of CSS Flexbox and Grid for sophisticated layout designs",
          "Excellent attention to cross-browser compatibility and web standards compliance",
          "Impressive implementation of accessible web design following WCAG guidelines",
          "Strong JavaScript skills for interactive web functionality and DOM manipulation",
          "Excellent understanding of web performance optimization and loading strategies",
          "Strong integration skills combining HTML, CSS, and JavaScript for cohesive web applications",
        ],
        "UI/UX Design": [
          "Strong visual design sensibilities with excellent aesthetic awareness and artistic vision",
          "Excellent understanding of color theory and typography for compelling visual communications",
          "Impressive user interface design skills that prioritize usability and user experience",
          "Strong application of design principles including hierarchy, balance, and contrast",
          "Excellent user research and testing skills for data-driven design decisions",
          "Strong prototyping abilities using industry-standard design tools and methodologies",
          "Impressive attention to design consistency and style guide implementation",
          "Excellent understanding of accessibility considerations in design for inclusive experiences",
          "Strong wireframing and information architecture skills for logical design organization",
          "Impressive ability to translate complex requirements into intuitive design solutions",
        ],
        "Data Science": [
          "Excellent data analysis and statistical reasoning skills for meaningful insights",
          "Strong data cleaning and preprocessing abilities for reliable analytical foundations",
          "Impressive data visualization skills using tools like Matplotlib, Seaborn, and Plotly",
          "Excellent understanding of machine learning algorithms and their practical applications",
          "Strong statistical modeling and hypothesis testing for valid scientific conclusions",
          "Impressive database querying and SQL skills for complex data extraction",
          "Excellent Python data science library usage including Pandas, NumPy, and Scikit-learn",
          "Strong ability to communicate data insights through clear narratives and presentations",
          "Impressive handling of large datasets and understanding of scalable analytics solutions",
          "Excellent understanding of data ethics and privacy considerations in analytical work",
        ],
        "Mobile Development": [
          "Excellent understanding of mobile app development principles and platform-specific guidelines",
          "Strong implementation of responsive design for various screen sizes and device orientations",
          "Impressive mobile user experience design with intuitive navigation and interaction patterns",
          "Excellent mobile performance optimization skills for smooth and efficient applications",
          "Strong integration of mobile device capabilities including sensors and hardware features",
          "Impressive understanding of mobile app security and user data protection",
          "Excellent app store optimization and deployment process management",
          "Strong mobile testing and debugging skills across different devices and platforms",
          "Impressive implementation of offline functionality and data synchronization",
          "Excellent understanding of mobile analytics and user engagement strategies",
        ],
        "Game Development": [
          "Exceptional creativity in game design and interactive storytelling with engaging gameplay",
          "Strong mastery of game engine technologies and efficient development workflows",
          "Impressive skills in 2D and 3D graphics programming with visually stunning results",
          "Excellent understanding of game physics and collision detection for realistic interactions",
          "Strong character animation and visual effects skills that enhance player immersion",
          "Impressive game AI programming and procedural generation for dynamic experiences",
          "Excellent audio programming and sound design integration for atmospheric games",
          "Strong game optimization and performance tuning for smooth gameplay",
          "Impressive multiplayer networking and real-time system implementation",
          "Excellent understanding of game monetization and player engagement strategies",
        ],
        "Robotics & Engineering": [
          "Exceptional understanding of mechanical engineering principles and robot kinematics",
          "Strong mastery of embedded programming and microcontroller integration",
          "Impressive sensor integration and data acquisition system design",
          "Excellent motor control and actuator system implementation",
          "Strong circuit design and electronic component integration skills",
          "Impressive autonomous navigation and path planning algorithm development",
          "Excellent mechanical design and fabrication problem-solving abilities",
          "Strong control systems and feedback loop implementation",
          "Impressive 3D modeling and CAD software proficiency",
          "Excellent understanding of robotics safety protocols and engineering ethics",
        ],
      },
    },
  }

  const filteredStrengths = useMemo(() => {
    const allStrengths: Array<{ category: string; strength: string; icon: any; color: string }> = []

    Object.entries(strengthCategories).forEach(([key, category]) => {
      if (selectedCategory === "all" || selectedCategory === key) {
        let strengthsToProcess: string[] = []
        
        if (key === "subject_specific") {
          // Handle subject-specific strengths
          const subjectStrengths = (category.strengths as any)[currentSubject] || []
          strengthsToProcess = subjectStrengths
        } else {
          strengthsToProcess = category.strengths as string[]
        }

        strengthsToProcess.forEach((strength) => {
          if (strength.toLowerCase().includes(searchTerm.toLowerCase())) {
            allStrengths.push({
              category: category.name,
              strength,
              icon: category.icon,
              color: category.color,
            })
          }
        })
      }
    })

    return allStrengths
  }, [searchTerm, selectedCategory, currentSubject])

  const handleSelectStrength = (strength: string) => {
    onSelect(strength)
    onClose()
  }

  const handleMultiSelect = (strength: string) => {
    setSelectedStrengths(prev => 
      prev.includes(strength) 
        ? prev.filter(s => s !== strength)
        : [...prev, strength]
    )
  }

  const handleCombineStrengths = () => {
    if (selectedStrengths.length > 0) {
      const combined = selectedStrengths.join(" ")
      onSelect(combined)
      onClose()
      toast({
        title: "Strengths Combined",
        description: `${selectedStrengths.length} strengths have been combined.`,
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
              <h3 className="text-lg font-bold text-navy dark:text-blue-300">Select Strength</h3>
              <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                ×
              </button>
            </div>
            <div className="grid grid-cols-1 gap-2">
              {filteredStrengths.map((item, index) => (
                <div
                  key={index}
                  className="bg-gray-100 dark:bg-gray-700 p-2 rounded cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 text-sm"
                  onClick={() => handleSelectStrength(item.strength)}
                >
                  {item.strength}
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
              <Star className="h-5 w-5" />
              Strengths for {currentSubject} ({studentLevel} level)
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Search and Controls */}
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search strengths..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              {selectedStrengths.length > 0 && (
                <Button onClick={handleCombineStrengths} variant="default">
                  <Plus className="h-4 w-4 mr-2" />
                  Combine ({selectedStrengths.length})
                </Button>
              )}
            </div>

            {/* Category Tabs */}
            <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
              <TabsList className="grid w-full grid-cols-5 lg:grid-cols-11">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="technical">Technical</TabsTrigger>
                <TabsTrigger value="creative">Creative</TabsTrigger>
                <TabsTrigger value="web">Web</TabsTrigger>
                <TabsTrigger value="mobile">Mobile</TabsTrigger>
                <TabsTrigger value="gaming">Gaming</TabsTrigger>
                <TabsTrigger value="robotics">Robotics</TabsTrigger>
                <TabsTrigger value="collaboration">Communication</TabsTrigger>
                <TabsTrigger value="analytical">Analytical</TabsTrigger>
                <TabsTrigger value="innovation">Innovation</TabsTrigger>
                <TabsTrigger value="subject_specific">Subject</TabsTrigger>
              </TabsList>

              <ScrollArea className="h-[60vh] mt-4 pr-4">
                <div className="space-y-3">
                  {filteredStrengths.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Star className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No strengths found matching your search.</p>
                      <p className="text-xs mt-2">Try searching for different terms or select a different category.</p>
                    </div>
                  ) : (
                    filteredStrengths.map((item, index) => {
                      const isSelected = selectedStrengths.includes(item.strength)
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
                                      onClick={() => handleMultiSelect(item.strength)}
                                      className={isSelected ? "bg-primary text-primary-foreground" : ""}
                                      title="Add to selection"
                                    >
                                      <Plus className="h-3 w-3" />
                                    </Button>
                                    <Button
                                      size="sm"
                                      onClick={() => handleSelectStrength(item.strength)}
                                      title="Select this strength"
                                    >
                                      Select
                                    </Button>
                                  </div>
                                </div>
                                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                                  {item.strength}
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
