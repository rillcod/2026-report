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
import { Search, MessageSquare, Award, ThumbsUp, TrendingUp, BookOpen, Plus, Star } from "lucide-react"

interface CommentOptionsProps {
  open?: boolean
  onClose: () => void
  onSelect: (comment: string) => void
  currentSubject?: string
  performanceLevel?: string
}

export function CommentOptions({
  open = true,
  onClose,
  onSelect,
  currentSubject = "Python Programming",
  performanceLevel = "B",
}: CommentOptionsProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedComments, setSelectedComments] = useState<string[]>([])
  const { toast } = useToast()

  const commentCategories = {
    excellent: {
      name: "Excellent Performance (A)",
      icon: Award,
      color: "bg-yellow-500",
      comments: [
        "Demonstrates exceptional mastery of programming concepts and consistently produces high-quality, well-structured code that exceeds expectations.",
        "Shows outstanding problem-solving abilities and innovative thinking, often finding creative solutions that demonstrate deep understanding of the subject matter.",
        "Exhibits exemplary work ethic and dedication, consistently going above and beyond requirements to explore advanced concepts and applications.",
        "Displays remarkable leadership qualities, frequently helping classmates and contributing positively to the learning environment.",
        "Demonstrates exceptional debugging skills and systematic approach to problem-solving, showing maturity in technical thinking.",
        "Shows outstanding creativity in project design and implementation, producing work that is both technically sound and visually impressive.",
        "Exhibits excellent communication skills when presenting technical concepts and explaining complex programming solutions to others.",
        "Demonstrates exceptional understanding of best practices in software development and consistently applies them in all work.",
        "Shows remarkable ability to learn independently and explore advanced topics beyond the curriculum requirements.",
        "Displays outstanding collaboration skills and serves as a positive role model for other students in the class.",
      ],
    },
    good: {
      name: "Good Performance (B-C)",
      icon: ThumbsUp,
      color: "bg-green-500",
      comments: [
        "Shows solid understanding of fundamental programming concepts and demonstrates consistent progress in skill development.",
        "Displays good problem-solving abilities and is developing confidence in approaching new programming challenges.",
        "Demonstrates reliable work habits and consistently completes assignments with attention to detail and quality.",
        "Shows good collaboration skills and contributes positively to group projects and class discussions.",
        "Exhibits steady improvement in coding practices and is developing a good foundation in software development principles.",
        "Demonstrates good debugging skills and is learning to approach problems systematically and methodically.",
        "Shows good creativity in project work and is developing personal style in programming and design approaches.",
        "Displays good communication skills when explaining code and technical concepts to classmates and instructors.",
        "Demonstrates good understanding of course material and applies concepts appropriately in practical assignments.",
        "Shows good motivation to learn and regularly seeks feedback to improve programming skills and knowledge.",
      ],
    },
    developing: {
      name: "Developing Skills (D-F)",
      icon: TrendingUp,
      color: "bg-blue-500",
      comments: [
        "Is developing foundational programming skills and shows potential for growth with continued practice and support.",
        "Would benefit from additional practice with basic programming concepts to build confidence and competency.",
        "Shows effort in learning but needs more time to master fundamental concepts before moving to advanced topics.",
        "Demonstrates willingness to learn and improve, with focused practice recommended in specific skill areas.",
        "Is building programming knowledge gradually and would benefit from additional support and guided practice sessions.",
        "Shows improvement over time and with continued effort and practice, has the potential to achieve course objectives.",
        "Would benefit from breaking down complex problems into smaller steps and practicing fundamental programming patterns.",
        "Demonstrates effort in assignments but needs additional support to fully grasp key programming concepts and applications.",
        "Is developing problem-solving skills and would benefit from more structured practice with debugging and testing.",
        "Shows commitment to learning and with additional practice and support, can achieve success in programming fundamentals.",
      ],
    },
    encouraging: {
      name: "Encouraging & Motivational",
      icon: Star,
      color: "bg-purple-500",
      comments: [
        "Has made significant progress this term and should feel proud of the growth demonstrated in programming skills and confidence.",
        "Shows great potential and with continued practice and dedication, is well-positioned for future success in technology fields.",
        "Demonstrates a positive attitude toward learning and challenges, which is an excellent foundation for continued growth.",
        "Has developed strong foundational skills that will serve as an excellent base for more advanced programming concepts.",
        "Shows excellent perseverance when facing challenges and demonstrates the problem-solving mindset essential for programming success.",
        "Has made impressive improvements in code quality and organization, showing real growth in technical skills.",
        "Demonstrates excellent curiosity about technology and programming, which will drive continued learning and success.",
        "Shows strong collaborative skills and positive attitude that contribute greatly to the classroom learning environment.",
        "Has developed good learning strategies and study habits that will support continued success in future coursework.",
        "Demonstrates the dedication and work ethic necessary for success in technology fields and should continue building on these strengths.",
      ],
    },
    subject_specific: {
      name: "Subject-Specific Comments",
      icon: BookOpen,
      color: "bg-indigo-500",
      comments: {
        "Scratch Programming": [
          "Demonstrates excellent understanding of Scratch block programming and visual coding concepts with creative project implementations.",
          "Shows creativity in Scratch project design with engaging storylines, interactive elements, and innovative use of sprites and costumes.",
          "Effectively uses Scratch sprites, costumes, and stage management for dynamic projects that demonstrate strong organizational skills.",
          "Demonstrates strong understanding of Scratch event handling and broadcasting systems to create complex interactive experiences.",
          "Shows proficiency with Scratch loops, conditionals, and control flow structures to implement sophisticated game mechanics.",
          "Creates well-organized Scratch projects with clear variable usage, efficient scripts, and excellent code organization.",
          "Demonstrates good Scratch debugging practices and systematic problem-solving approaches when troubleshooting project issues.",
          "Shows innovative use of Scratch features including custom blocks, cloning, and advanced sensing to create unique projects.",
          "Effectively implements game mechanics, scoring systems, and interactive storytelling in Scratch projects.",
          "Demonstrates understanding of computational thinking through visual programming concepts and logical problem decomposition.",
        ],
        "Python Programming": [
          "Shows strong understanding of Python syntax, data types, and programming fundamentals with excellent code structure.",
          "Demonstrates excellent use of Python functions, modules, and code organization principles for maintainable programming.",
          "Effectively uses Python data structures including lists, dictionaries, sets, and tuples for complex data manipulation.",
          "Shows good understanding of Python object-oriented programming and class design with proper encapsulation and inheritance.",
          "Demonstrates proficiency with Python libraries including NumPy, Pandas, and Matplotlib for data science applications.",
          "Effectively handles Python error handling, exceptions, and defensive programming practices for robust code.",
          "Shows good Python code documentation, commenting, and adherence to PEP 8 standards for professional development.",
          "Demonstrates understanding of Python algorithms, recursion, and computational complexity for efficient problem-solving.",
          "Effectively uses Python for data analysis, visualization, and scientific computing applications with creative implementations.",
          "Shows creativity in Python project implementation with clean, readable, and efficient code that follows best practices.",
        ],
        "Web Development": [
          "Demonstrates excellent understanding of HTML semantic structure and modern web standards for accessible development.",
          "Shows strong CSS styling skills with effective use of flexbox, grid, and responsive design for multi-device compatibility.",
          "Effectively implements JavaScript for interactive web functionality and DOM manipulation with clean, efficient code.",
          "Demonstrates good understanding of web accessibility principles and inclusive design practices for universal usability.",
          "Shows creativity in web design with excellent user experience and interface design skills that engage users effectively.",
          "Effectively uses CSS frameworks, preprocessors, and modern development tools for efficient and maintainable code.",
          "Demonstrates understanding of web performance optimization and cross-browser compatibility for professional deployment.",
          "Shows proficiency in HTML forms, validation, and user input handling techniques for robust web applications.",
          "Effectively organizes CSS and JavaScript code for maintainability and scalability in larger web projects.",
          "Demonstrates understanding of version control, deployment, and web development workflows for collaborative development.",
        ],
        "UI/UX Design": [
          "Demonstrates excellent understanding of user-centered design principles and methodologies for creating intuitive interfaces.",
          "Shows strong visual design skills with effective use of color theory, typography, and layout for compelling user experiences.",
          "Effectively conducts user research and applies findings to create data-driven design solutions that meet user needs.",
          "Demonstrates good understanding of design systems, style guides, and consistent branding for cohesive product experiences.",
          "Shows creativity in problem-solving with innovative and accessible design approaches that consider diverse user needs.",
          "Effectively uses design tools like Figma, Adobe Creative Suite, and prototyping software for professional design workflows.",
          "Demonstrates understanding of interaction design and micro-interactions for enhanced user experience and engagement.",
          "Shows proficiency in wireframing, prototyping, and iterative design processes for user-validated design solutions.",
          "Effectively balances aesthetic appeal with functional usability in design solutions that achieve business objectives.",
          "Demonstrates understanding of mobile-first design and responsive design principles for cross-platform experiences.",
        ],
        "Data Science": [
          "Demonstrates excellent understanding of data analysis techniques and statistical concepts for meaningful insights.",
          "Shows strong skills in data cleaning, preprocessing, and exploratory data analysis for reliable analytical foundations.",
          "Effectively uses Python libraries like Pandas, NumPy, and Scikit-learn for sophisticated data manipulation and analysis.",
          "Demonstrates good understanding of machine learning algorithms and their applications for predictive modeling.",
          "Shows creativity in data visualization using tools like Matplotlib, Seaborn, and Plotly for compelling data storytelling.",
          "Effectively handles large datasets and demonstrates understanding of data storage solutions for scalable analytics.",
          "Demonstrates understanding of statistical inference, hypothesis testing, and experimental design for valid conclusions.",
          "Shows proficiency in SQL for database querying and data extraction tasks from complex relational systems.",
          "Effectively communicates data insights through clear visualizations and compelling narratives that drive decision-making.",
          "Demonstrates understanding of ethical considerations in data science and privacy protection for responsible analytics.",
        ],
        "Mobile Development": [
          "Demonstrates excellent understanding of mobile app development principles and platform-specific best practices.",
          "Shows strong skills in platform-specific design guidelines and user experience patterns for native app experiences.",
          "Effectively implements responsive design for various screen sizes and device orientations with adaptive layouts.",
          "Demonstrates good understanding of mobile performance optimization and battery efficiency for user-friendly apps.",
          "Shows creativity in mobile app design with intuitive navigation and engaging user interfaces that enhance usability.",
          "Effectively uses development frameworks like React Native, Flutter, or native platform tools for cross-platform solutions.",
          "Demonstrates understanding of mobile device capabilities including sensors and hardware integration for rich experiences.",
          "Shows proficiency in app store optimization, deployment processes, and user acquisition strategies for successful launches.",
          "Effectively handles offline functionality, data synchronization, and network connectivity issues for robust mobile apps.",
          "Demonstrates understanding of mobile security best practices and user data protection for trustworthy applications.",
        ],
        "Game Development": [
          "Demonstrates exceptional creativity in game design and interactive storytelling with engaging gameplay mechanics.",
          "Shows mastery of game engine technologies and development workflows for professional game development.",
          "Exhibits strong skills in 2D and 3D graphics programming with visually impressive and optimized rendering.",
          "Displays excellent understanding of game physics and collision detection for realistic and responsive gameplay.",
          "Demonstrates proficiency in character animation and visual effects that enhance player immersion and engagement.",
          "Shows advanced understanding of game AI and procedural generation for dynamic and replayable game experiences.",
          "Exhibits strong skills in audio programming and sound design integration for immersive game atmospheres.",
          "Demonstrates excellent understanding of game optimization and performance for smooth gameplay across platforms.",
          "Shows proficiency in multiplayer networking and real-time systems for connected gaming experiences.",
          "Displays strong understanding of game monetization and player engagement strategies for sustainable game design.",
        ],
        "Robotics & Engineering": [
          "Demonstrates exceptional understanding of mechanical engineering principles and robot kinematics for precise control.",
          "Shows mastery of embedded programming and microcontroller integration for sophisticated robotic systems.",
          "Exhibits strong skills in sensor integration and data acquisition systems for accurate environmental perception.",
          "Displays excellent understanding of motor control and actuator systems for precise robotic movement.",
          "Demonstrates proficiency in circuit design and electronic component integration for reliable robotic hardware.",
          "Shows advanced understanding of autonomous navigation and path planning algorithms for intelligent robotic behavior.",
          "Exhibits strong problem-solving skills in mechanical design and fabrication for innovative robotic solutions.",
          "Demonstrates excellent understanding of control systems and feedback loops for stable robotic performance.",
          "Shows proficiency in 3D modeling and computer-aided design (CAD) software for professional engineering documentation.",
          "Displays strong understanding of safety protocols and engineering ethics for responsible robotic development.",
        ],
      },
    },
    narrative: {
      name: "Narrative Comments (with placeholders)",
      icon: MessageSquare,
      color: "bg-rose-500",
      comments: [
        "[Student] has shown remarkable progress in understanding programming fundamentals. With continued practice, [they] will master more advanced concepts quickly.",
        "[Student] demonstrates good understanding of core concepts. Focusing on [their] areas for growth will help [them] become a more well-rounded programmer.",
        "[Student] is developing solid programming skills. I encourage [them] to practice daily to reinforce the concepts we've covered.",
        "[Student] has demonstrated impressive creativity and logical thinking in projects. [Their] ability to implement complex features shows a strong foundation in programming concepts.",
        "[Student] has made good progress with programming fundamentals. [They] show particular strength in problem-solving and should continue exploring advanced topics.",
        "[Student] is beginning to understand programming fundamentals. [They] can create basic implementations, but would benefit from more practice with advanced concepts.",
        "[Student] has demonstrated excellent progress in technical skills. [Their] ability to write clean, well-structured code with appropriate use of best practices is impressive.",
        "[Student] shows good understanding of programming fundamentals. [They] can write functional programs and should focus on writing more modular and efficient code.",
        "[Student] is developing basic technical skills. [They] understand syntax and simple operations, but need more practice with complex problem-solving approaches.",
        "[Student] demonstrates impressive technical sensibilities in [their] projects. [Their] work shows strong understanding of software architecture and design patterns.",
      ],
    },
  }

  const filteredComments = useMemo(() => {
    const allComments: Array<{ category: string; comment: string; icon: any; color: string }> = []

    Object.entries(commentCategories).forEach(([key, category]) => {
      if (selectedCategory === "all" || selectedCategory === key) {
        let commentsToProcess: string[] = []
        
        if (key === "subject_specific") {
          // Handle subject-specific comments
          const subjectComments = (category.comments as any)[currentSubject] || []
          commentsToProcess = subjectComments
        } else {
          commentsToProcess = category.comments as string[]
        }

        commentsToProcess.forEach((comment) => {
          if (comment.toLowerCase().includes(searchTerm.toLowerCase())) {
            allComments.push({
              category: category.name,
              comment,
              icon: category.icon,
              color: category.color,
            })
          }
        })
      }
    })

    return allComments
  }, [searchTerm, selectedCategory, currentSubject])

  const handleSelectComment = (comment: string) => {
    onSelect(comment)
    onClose()
  }

  const handleMultiSelect = (comment: string) => {
    setSelectedComments(prev => 
      prev.includes(comment) 
        ? prev.filter(c => c !== comment)
        : [...prev, comment]
    )
  }

  const handleCombineComments = () => {
    if (selectedComments.length > 0) {
      const combined = selectedComments.join(" ")
      onSelect(combined)
      onClose()
      toast({
        title: "Comments Combined",
        description: `${selectedComments.length} comments have been combined.`,
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
              <h3 className="text-lg font-bold text-navy dark:text-blue-300">Select Comment</h3>
              <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                ×
              </button>
            </div>
            <div className="grid grid-cols-1 gap-2">
              {filteredComments.map((item, index) => (
                <div
                  key={index}
                  className="bg-gray-100 dark:bg-gray-700 p-2 rounded cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 text-sm"
                  onClick={() => handleSelectComment(item.comment)}
                >
                  {item.comment}
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
              <MessageSquare className="h-5 w-5" />
              Select Comments for {currentSubject}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Search and Controls */}
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search comments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              {selectedComments.length > 0 && (
                <Button onClick={handleCombineComments} variant="default">
                  <Plus className="h-4 w-4 mr-2" />
                  Combine ({selectedComments.length})
                </Button>
              )}
            </div>

            {/* Category Tabs */}
            <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
              <TabsList className="grid w-full grid-cols-3 lg:grid-cols-7">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="excellent">Excellent</TabsTrigger>
                <TabsTrigger value="good">Good</TabsTrigger>
                <TabsTrigger value="developing">Developing</TabsTrigger>
                <TabsTrigger value="encouraging">Encouraging</TabsTrigger>
                <TabsTrigger value="subject_specific">Subject</TabsTrigger>
                <TabsTrigger value="narrative">Narrative</TabsTrigger>
              </TabsList>

              <ScrollArea className="h-[60vh] mt-4 pr-4">
                <div className="space-y-3">
                  {filteredComments.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No comments found matching your search.</p>
                    </div>
                  ) : (
                    filteredComments.map((item, index) => {
                      const isSelected = selectedComments.includes(item.comment)
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
                                      onClick={() => handleMultiSelect(item.comment)}
                                      className={isSelected ? "bg-primary text-primary-foreground" : ""}
                                    >
                                      <Plus className="h-3 w-3" />
                                    </Button>
                                    <Button
                                      size="sm"
                                      onClick={() => handleSelectComment(item.comment)}
                                    >
                                      Select
                                    </Button>
                                  </div>
                                </div>
                                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                                  {item.comment}
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
