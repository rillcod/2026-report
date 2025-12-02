"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
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
  BookOpen,
  Target,
  Clock,
  Users,
  Award,
  ChevronRight,
  PlayCircle,
  CheckCircle,
  Circle,
  Star,
  TrendingUp,
  Lightbulb,
  Code,
  Wrench,
  Palette,
  Globe,
  Camera,
  Save,
  Download,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Eye,
  Settings,
  BarChart3,
  Plus,
  CreditCard,
  DollarSign,
  Receipt,
  GraduationCap,
  FileText,
  ChevronDown
} from "lucide-react"
import { enhancedCourseContent, type CourseModule } from "@/lib/enhanced-course-content"

interface EnhancedCourseDisplayProps {
  selectedCourse: string
  onSelectModule?: (moduleId: string) => void
  onAddProgressItems?: (items: string[]) => void
}

export function EnhancedCourseDisplay({
  selectedCourse,
  onSelectModule,
  onAddProgressItems,
}: EnhancedCourseDisplayProps) {
  const [selectedModule, setSelectedModule] = useState<string | null>(null)
  const [expandedModule, setExpandedModule] = useState<string | null>(null)
  
  // Enhanced premium state
  const [isAutoSaving, setIsAutoSaving] = useState(false)
  const [completedModules, setCompletedModules] = useState<Set<string>>(new Set())
  const [moduleProgress, setModuleProgress] = useState<{ [key: string]: number }>({})
  const [studyNotes, setStudyNotes] = useState<{ [key: string]: string }>({})
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [lastVoiceCommand, setLastVoiceCommand] = useState<string>("")
  const [learningPath, setLearningPath] = useState<string[]>([])
  const [difficultyLevel, setDifficultyLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner')
  
  // Payment and evaluation state
  const [showPaymentView, setShowPaymentView] = useState(false)
  const [selectedEvaluation, setSelectedEvaluation] = useState<string>("")
  const [evaluationCriteria, setEvaluationCriteria] = useState<string[]>([])
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'completed' | 'overdue'>('pending')
  
  const recognitionRef = useRef<any>(null)
  const { toast } = useToast()

  // Enhanced auto-save functionality
  useEffect(() => {
    const autoSaveTimer = setTimeout(() => {
      if (Object.keys(moduleProgress).length > 0) {
        handleAutoSave()
      }
    }, 3000)

    return () => clearTimeout(autoSaveTimer)
  }, [moduleProgress, completedModules, studyNotes])

  const handleAutoSave = async () => {
    setIsAutoSaving(true)
    try {
      const autoSaveData = {
        selectedCourse,
        completedModules,
        moduleProgress,
        studyNotes,
        learningPath,
        difficultyLevel,
        timestamp: new Date().toISOString()
      }
      localStorage.setItem('courseProgress_autoSave', JSON.stringify(autoSaveData))
      
      toast({
        title: "Progress Saved",
        description: "Your course progress has been saved automatically",
        duration: 2000,
      })
    } catch (error) {
      console.error('Auto-save failed:', error)
    } finally {
      setIsAutoSaving(false)
    }
  }

  // Enhanced module completion tracking
  const markModuleComplete = (moduleId: string) => {
    setCompletedModules(prev => {
      const newCompleted = new Set(prev)
      if (newCompleted.has(moduleId)) {
        newCompleted.delete(moduleId)
        setModuleProgress(prevProgress => ({
          ...prevProgress,
          [moduleId]: 0
        }))
        toast({
          title: "Module Marked Incomplete",
          description: "Module progress reset to 0%",
        })
      } else {
        newCompleted.add(moduleId)
        setModuleProgress(prevProgress => ({
          ...prevProgress,
          [moduleId]: 100
        }))
        toast({
          title: "Module Completed! 🎉",
          description: `Great job finishing module: ${moduleId}`,
        })
      }
      return newCompleted
    })
  }

  const updateModuleProgress = (moduleId: string, progress: number) => {
    setModuleProgress(prev => ({
      ...prev,
      [moduleId]: progress
    }))
  }

  // Enhanced difficulty assessment
  const assessDifficulty = (module: CourseModule) => {
    const topicCount = module.topics?.length || 0
    const projectCount = module.projects?.length || 0
    
    if (topicCount > 8 || projectCount > 3) return 'advanced'
    if (topicCount > 5 || projectCount > 1) return 'intermediate'
    return 'beginner'
  }

  // Voice functionality
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = false
      recognitionRef.current.lang = 'en-US'

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        setIsListening(false)
        handleVoiceCommand(transcript)
      }

      recognitionRef.current.onerror = () => {
        setIsListening(false)
      }

      recognitionRef.current.onend = () => {
        setIsListening(false)
      }
    }
  }, [])

  const handleVoiceCommand = (command: string) => {
    const lowerCommand = command.toLowerCase()
    
    if (lowerCommand.includes('complete') || lowerCommand.includes('finish')) {
      if (selectedModule) {
        markModuleComplete(selectedModule)
      }
    } else if (lowerCommand.includes('next module')) {
      // Logic to select next module
      const courseData = enhancedCourseContent[selectedCourse]
      if (courseData && selectedModule) {
        const currentIndex = courseData.modules.findIndex(m => m.id === selectedModule)
        if (currentIndex < courseData.modules.length - 1) {
          const nextModule = courseData.modules[currentIndex + 1]
          setSelectedModule(nextModule.id)
          toast({
            title: "Moved to Next Module",
            description: `Now viewing: ${nextModule.name}`,
          })
        }
      }
    }
  }

  const toggleListening = () => {
    if (!recognitionRef.current) {
      toast({
        title: "Voice Recognition Not Supported",
        description: "Your browser doesn't support voice recognition.",
        variant: "destructive",
      })
      return
    }

    if (isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    } else {
      recognitionRef.current.start()
      setIsListening(true)
    }
  }

  // Add missing toggle function
  const toggleVoiceRecognition = toggleListening

  // Add module completion toggle function
  const toggleModuleCompletion = (moduleId: string) => {
    setCompletedModules(prev => {
      const newCompleted = new Set(prev)
      if (newCompleted.has(moduleId)) {
        newCompleted.delete(moduleId)
        setModuleProgress(prevProgress => ({
          ...prevProgress,
          [moduleId]: 0
        }))
        toast({
          title: "Module Marked Incomplete",
          description: "Module progress reset to 0%",
        })
      } else {
        newCompleted.add(moduleId)
        setModuleProgress(prevProgress => ({
          ...prevProgress,
          [moduleId]: 100
        }))
        toast({
          title: "Module Completed!",
          description: "Great job completing this module!",
        })
      }
      return newCompleted
    })
  }

  const speakModuleInfo = (module: CourseModule) => {
    if ('speechSynthesis' in window) {
      const text = `Module: ${module.name}. ${module.description}. This module covers ${module.topics?.length || 0} topics and includes ${module.projects?.length || 0} projects.`
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.8
      utterance.onstart = () => setIsSpeaking(true)
      utterance.onend = () => setIsSpeaking(false)
      window.speechSynthesis.speak(utterance)
    }
  }

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
    }
  }

  const courseData = enhancedCourseContent[selectedCourse]
  if (!courseData) return null

  // Get current module for voice assistant
  const currentModule = courseData?.modules.find(m => m.id === selectedModule)

  const getCourseIcon = (courseId: string) => {
    const icons = {
      scratch: <PlayCircle className="h-5 w-5" />,
      python: <Code className="h-5 w-5" />,
      robotics: <Wrench className="h-5 w-5" />,
      web: <Globe className="h-5 w-5" />,
      design: <Palette className="h-5 w-5" />,
    }
    return icons[courseId as keyof typeof icons] || <BookOpen className="h-5 w-5" />
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-500"
      case "Intermediate":
        return "bg-yellow-500"
      case "Advanced":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const addModuleProgressItems = (module: CourseModule) => {
    const items = [
      ...module.topics.map((topic) => `${module.name} - Topic Mastery: ${topic}`),
      ...module.skills.map((skill) => `Skill Development: ${skill}`),
      ...module.projects.map((project) => `Project Completion: ${project}`),
      ...module.assessments.map((assessment) => `Assessment Achievement: ${assessment}`),
    ]
    
    // Add some course-specific meta items
    const metaItems = [
      `Module ${module.name}: Successfully completed with ${difficultyLevel} proficiency`,
      `Learning Outcome: Demonstrated understanding of ${module.description.toLowerCase()}`,
      `Time Management: Completed ${module.duration} module within expected timeframe`,
    ]
    
    const allItems = [...items, ...metaItems]
    onAddProgressItems?.(allItems)
    
    toast({
      title: "Progress Items Added!",
      description: `Added ${allItems.length} comprehensive progress items from ${module.name}`,
    })
  }

  return (
    <div className="space-y-6">
      {/* Course Overview Header */}
      <Card className="bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 border-emerald-200 shadow-lg">
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-lg`}>{getCourseIcon(selectedCourse)}</div>
              <div>
                <CardTitle className="text-emerald-900">{courseData.name}</CardTitle>
                <p className="text-emerald-700 mt-1 text-sm break-words">{courseData.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-emerald-100 text-emerald-800 border-emerald-300 mt-2 sm:mt-0">
                {courseData.icon}
              </Badge>
              {/* Auto-Save Status */}
              <div className="flex items-center gap-1">
                <div className={`w-2 h-2 rounded-full ${isAutoSaving ? 'bg-amber-400' : 'bg-emerald-400'}`} />
                <span className="text-xs text-emerald-600">
                  {isAutoSaving ? 'Saving...' : 'Saved'}
                </span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-emerald-600" />
              <span className="text-emerald-700 text-sm">Duration: {courseData.totalDuration}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-emerald-600" />
              <span className="text-emerald-700 text-sm">Age: {courseData.targetAge}</span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-emerald-600" />
              <span className="text-emerald-700 text-sm">{courseData.modules.length} Modules</span>
            </div>
          </div>
          
          {/* Progress Tracking */}
          <div className="mt-4 pt-4 border-t border-emerald-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-emerald-700 text-sm">Course Progress</span>
              <span className="text-emerald-700 text-sm">
                {Math.round((completedModules.size / courseData.modules.length) * 100)}% Complete
              </span>
            </div>
            <div className="w-full bg-emerald-100 rounded-full h-2">
              <div 
                className={`bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full transition-all duration-300`}
                style={{ width: `${Math.min(100, Math.max(0, (completedModules.size / courseData.modules.length) * 100))}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Voice Control Panel */}
      <Card className="bg-gradient-to-r from-violet-50 via-purple-50 to-fuchsia-50 border-violet-200 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-violet-900">
            <Mic className="h-5 w-5 text-violet-600" />
            Voice Assistant
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-3">
            <Button
              onClick={toggleVoiceRecognition}
              variant={isListening ? "destructive" : "outline"}
              size="sm"
              className={isListening ? "bg-red-500 hover:bg-red-600" : "border-violet-300 text-violet-700 hover:bg-violet-100"}
            >
              {isListening ? <MicOff className="h-4 w-4 mr-2" /> : <Mic className="h-4 w-4 mr-2" />}
              {isListening ? "Stop Listening" : "Start Voice Commands"}
            </Button>
            
            <Button
              onClick={() => currentModule && speakModuleInfo(currentModule)}
              variant="outline"
              size="sm"
              disabled={isSpeaking || !currentModule}
              className="border-violet-300 text-violet-700 hover:bg-violet-100"
            >
              {isSpeaking ? <Volume2 className="h-4 w-4 mr-2" /> : <VolumeX className="h-4 w-4 mr-2" />}
              {isSpeaking ? "Speaking..." : "Read Module"}
            </Button>

            <div className="text-xs text-violet-600">
              Voice commands: "next module", "previous module", "mark complete", "read module"
            </div>
          </div>
          
          {lastVoiceCommand && (
            <div className="mt-3 p-2 bg-violet-50 rounded border border-violet-200">
              <span className="text-xs text-violet-700">Last command: "{lastVoiceCommand}"</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Course Evaluations & Payment Panel */}
      <Card className="bg-gradient-to-r from-amber-50 via-orange-50 to-yellow-50 border-amber-200 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-amber-900">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-amber-600" />
              Course Evaluations & Payment
            </div>
            <div className="flex items-center gap-3">
              {/* Payment View Toggle */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-amber-700">Payment View</span>
                <Switch
                  checked={showPaymentView}
                  onCheckedChange={setShowPaymentView}
                  className="data-[state=checked]:bg-amber-600"
                />
              </div>
              <Badge 
                variant="outline" 
                className={`${
                  paymentStatus === 'completed' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' :
                  paymentStatus === 'overdue' ? 'bg-red-100 text-red-800 border-red-300' :
                  'bg-amber-100 text-amber-800 border-amber-300'
                }`}
              >
                {paymentStatus === 'completed' ? 'Paid' : paymentStatus === 'overdue' ? 'Overdue' : 'Pending'}
              </Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Course-Specific Evaluations Dropdown */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-amber-800">Course Evaluation Types</label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-between border-amber-300 text-amber-700 hover:bg-amber-100">
                    {selectedEvaluation || "Select Evaluation Method"}
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-full bg-white border-amber-200">
                  <DropdownMenuLabel className="text-amber-700">Course-Specific Evaluations</DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-amber-100" />
                  <DropdownMenuItem 
                    className="text-amber-800 hover:bg-amber-50"
                    onClick={() => setSelectedEvaluation("Project Portfolio Assessment")}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Project Portfolio Assessment
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="text-amber-800 hover:bg-amber-50"
                    onClick={() => setSelectedEvaluation("Peer Review & Collaboration")}
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Peer Review & Collaboration
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="text-amber-800 hover:bg-amber-50"
                    onClick={() => setSelectedEvaluation("Live Demo Presentation")}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Live Demo Presentation
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="text-amber-800 hover:bg-amber-50"
                    onClick={() => setSelectedEvaluation("Technical Skills Assessment")}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Technical Skills Assessment
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="text-amber-800 hover:bg-amber-50"
                    onClick={() => setSelectedEvaluation("Creative Problem Solving")}
                  >
                    <Lightbulb className="h-4 w-4 mr-2" />
                    Creative Problem Solving
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="text-amber-800 hover:bg-amber-50"
                    onClick={() => setSelectedEvaluation("Course Completion Certificate")}
                  >
                    <Award className="h-4 w-4 mr-2" />
                    Course Completion Certificate
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              {selectedEvaluation && (
                <div className="p-3 bg-amber-50 rounded border border-amber-200">
                  <h4 className="text-sm font-medium text-amber-800 mb-2">Selected: {selectedEvaluation}</h4>
                  <p className="text-xs text-amber-700">
                    {selectedEvaluation === "Project Portfolio Assessment" && "Students compile and present their best work from throughout the course"}
                    {selectedEvaluation === "Peer Review & Collaboration" && "Students evaluate each other's work and provide constructive feedback"}
                    {selectedEvaluation === "Live Demo Presentation" && "Students demonstrate their projects live to the class"}
                    {selectedEvaluation === "Technical Skills Assessment" && "Comprehensive evaluation of coding and technical abilities"}
                    {selectedEvaluation === "Creative Problem Solving" && "Assessment of innovative thinking and creative solutions"}
                    {selectedEvaluation === "Course Completion Certificate" && "Official certification upon meeting all course requirements"}
                  </p>
                </div>
              )}
            </div>

            {/* Payment Management */}
            {showPaymentView && (
              <div className="space-y-3">
                <label className="text-sm font-medium text-amber-800">Payment Information</label>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-white rounded border border-amber-200">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-amber-600" />
                      <span className="text-sm text-amber-700">Course Fee</span>
                    </div>
                    <span className="text-sm font-medium text-amber-900">$299.00</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white rounded border border-amber-200">
                    <div className="flex items-center gap-2">
                      <Receipt className="h-4 w-4 text-amber-600" />
                      <span className="text-sm text-amber-700">Payment Status</span>
                    </div>
                    <Badge 
                      className={`${
                        paymentStatus === 'completed' ? 'bg-emerald-600' :
                        paymentStatus === 'overdue' ? 'bg-red-600' :
                        'bg-amber-600'
                      } text-white`}
                    >
                      {paymentStatus.charAt(0).toUpperCase() + paymentStatus.slice(1)}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white rounded border border-amber-200">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-amber-600" />
                      <span className="text-sm text-amber-700">Due Date</span>
                    </div>
                    <span className="text-sm text-amber-700">Dec 31, 2025</span>
                  </div>
                  
                  <Button 
                    className="w-full bg-amber-600 hover:bg-amber-700 text-white"
                    onClick={() => {
                      setPaymentStatus('completed')
                      toast({
                        title: "Payment Processed",
                        description: "Course payment has been successfully completed!",
                      })
                    }}
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    {paymentStatus === 'completed' ? 'Payment Complete' : 'Process Payment'}
                  </Button>
                </div>
              </div>
            )}

            {/* Evaluation Criteria */}
            {!showPaymentView && (
              <div className="space-y-3">
                <label className="text-sm font-medium text-amber-800">Evaluation Criteria</label>
                <div className="space-y-2">
                  {[
                    "Project Completion (30%)",
                    "Code Quality & Documentation (25%)",
                    "Creative Problem Solving (20%)",
                    "Peer Collaboration (15%)",
                    "Presentation Skills (10%)"
                  ].map((criterion, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-white rounded border border-amber-200">
                      <BarChart3 className="h-3 w-3 text-amber-600" />
                      <span className="text-xs text-amber-800">{criterion}</span>
                    </div>
                  ))}
                </div>
                
                <Button 
                  variant="outline" 
                  className="w-full border-amber-300 text-amber-700 hover:bg-amber-100"
                  onClick={() => {
                    toast({
                      title: "Evaluation Started",
                      description: `${selectedEvaluation || 'Course evaluation'} has been initiated.`,
                    })
                  }}
                >
                  <GraduationCap className="h-4 w-4 mr-2" />
                  Start Evaluation Process
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Learning Outcomes */}
      <Card className="bg-gradient-to-r from-rose-50 via-pink-50 to-red-50 border-rose-200 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-rose-900">
            <Target className="h-5 w-5 text-rose-600" />
            Learning Outcomes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            {courseData.learningOutcomes.map((outcome, index) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle className="h-4 w-4 text-rose-600 mt-0.5 flex-shrink-0" />
                <span className="text-rose-800 text-sm">{outcome}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Course Modules */}
      <Card className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border-blue-200 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-900">
            <BookOpen className="h-5 w-5 text-blue-600" />
            Course Modules
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-blue-100">
              <TabsTrigger value="overview" className="text-blue-800">Module Overview</TabsTrigger>
              <TabsTrigger value="detailed" className="text-blue-800">Detailed Content</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6">
              <div className="grid gap-4">
                {courseData.modules.map((module, index) => {
                  const isCompleted = completedModules.has(module.id)
                  const currentProgress = moduleProgress[module.id] || 0
                  
                  return (
                  <Card
                    key={module.id}
                    className={`bg-white shadow-md transition-all duration-300 ${
                      isCompleted 
                        ? 'border-emerald-300 bg-emerald-50' 
                        : selectedModule === module.id
                        ? 'border-blue-300 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300 hover:shadow-lg'
                    }`}
                  >
                    <CardContent className="p-4">
                      <div className="flex flex-col sm:flex-row items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <Badge className={`${getDifficultyColor(module.difficulty)} text-white`}>
                              {module.difficulty}
                            </Badge>
                            <span className="text-sm text-blue-600">{module.duration}</span>
                            {isCompleted && (
                              <Badge className="bg-emerald-600 text-white">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Completed
                              </Badge>
                            )}
                          </div>
                          <h4 className="font-semibold text-blue-900 mb-1">{module.name}</h4>
                          <p className="text-sm text-blue-700 mb-3 break-words">{module.description}</p>

                          {/* Module Progress Bar */}
                          <div className="mb-3">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs text-blue-600">Module Progress</span>
                              <span className="text-xs text-blue-600">{Math.round(currentProgress)}%</span>
                            </div>
                            <div className="w-full bg-blue-100 rounded-full h-1.5">
                              <div 
                                className={`h-1.5 rounded-full transition-all duration-300 ${
                                  isCompleted ? 'bg-emerald-500' : 'bg-blue-500'
                                }`}
                                style={{ width: `${Math.min(100, Math.max(0, currentProgress))}%` }}
                              />
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2 mb-3">
                            <div className="flex items-center gap-1">
                              <Lightbulb className="h-3 w-3 text-amber-500" />
                              <span className="text-xs text-blue-700">{module.topics.length} Topics</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3 text-blue-500" />
                              <span className="text-xs text-blue-700">{module.skills.length} Skills</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Award className="h-3 w-3 text-emerald-500" />
                              <span className="text-xs text-blue-700">{module.projects.length} Projects</span>
                            </div>
                          </div>

                          {module.prerequisites.length > 0 && (
                            <div className="mb-3">
                              <span className="text-xs text-blue-600">Prerequisites: </span>
                              <span className="text-xs text-blue-700 break-words">
                                {module.prerequisites.join(", ")}
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="flex flex-row sm:flex-col gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => addModuleProgressItems(module)}
                            className="border-blue-300 text-blue-700 hover:bg-blue-100 flex-1 sm:flex-none"
                          >
                            Add Items
                          </Button>
                          <Button
                            size="sm"
                            variant={isCompleted ? "secondary" : "default"}
                            onClick={() => toggleModuleCompletion(module.id)}
                            className={`flex-1 sm:flex-none ${
                              isCompleted 
                                ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
                                : 'bg-blue-600 hover:bg-blue-700 text-white'
                            }`}
                          >
                            {isCompleted ? (
                              <>
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Complete
                              </>
                            ) : (
                              <>
                                <Circle className="h-3 w-3 mr-1" />
                                Mark Done
                              </>
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setExpandedModule(expandedModule === module.id ? null : module.id)}
                            className="text-blue-600 hover:text-blue-800 hover:bg-blue-100"
                          >
                            <ChevronRight
                              className={`h-4 w-4 transition-transform ${expandedModule === module.id ? "rotate-90" : ""}`}
                            />
                          </Button>
                        </div>
                      </div>

                      {expandedModule === module.id && (
                        <div className="mt-4 pt-4 border-t border-blue-200">
                          <Tabs defaultValue="topics" className="w-full">
                            <TabsList className="grid w-full grid-cols-4 bg-blue-100">
                              <TabsTrigger value="topics" className="text-blue-800">Topics</TabsTrigger>
                              <TabsTrigger value="skills" className="text-blue-800">Skills</TabsTrigger>
                              <TabsTrigger value="projects" className="text-blue-800">Projects</TabsTrigger>
                              <TabsTrigger value="assessments" className="text-blue-800">Assessments</TabsTrigger>
                            </TabsList>

                            <TabsContent value="topics" className="mt-4">
                              <div className="space-y-2">
                                {module.topics.map((topic, idx) => (
                                  <div key={idx} className="flex items-start gap-2">
                                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                                    <span className="text-sm text-blue-800">{topic}</span>
                                  </div>
                                ))}
                              </div>
                            </TabsContent>

                            <TabsContent value="skills" className="mt-4">
                              <div className="space-y-2">
                                {module.skills.map((skill, idx) => (
                                  <div key={idx} className="flex items-start gap-2">
                                    <TrendingUp className="h-3 w-3 text-blue-500 mt-1 flex-shrink-0" />
                                    <span className="text-sm text-blue-800">{skill}</span>
                                  </div>
                                ))}
                              </div>
                            </TabsContent>

                            <TabsContent value="projects" className="mt-4">
                              <div className="space-y-2">
                                {module.projects.map((project, idx) => (
                                  <div key={idx} className="flex items-start gap-2">
                                    <Award className="h-3 w-3 text-emerald-500 mt-1 flex-shrink-0" />
                                    <span className="text-sm text-blue-800">{project}</span>
                                  </div>
                                ))}
                              </div>
                            </TabsContent>

                            <TabsContent value="assessments" className="mt-4">
                              <div className="space-y-2">
                                {module.assessments.map((assessment, idx) => (
                                  <div key={idx} className="flex items-start gap-2">
                                    <CheckCircle className="h-3 w-3 text-amber-500 mt-1 flex-shrink-0" />
                                    <span className="text-sm text-blue-800">{assessment}</span>
                                  </div>
                                ))}
                              </div>
                            </TabsContent>
                          </Tabs>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                  )
                })}
              </div>
            </TabsContent>

            <TabsContent value="detailed" className="mt-6">
              <Accordion type="single" collapsible className="w-full">
                {courseData.modules.map((module, index) => (
                  <AccordionItem key={module.id} value={module.id} className="border-blue-200">
                    <AccordionTrigger className="text-blue-900 hover:text-blue-700">
                      <div className="flex items-center gap-3">
                        <Badge className={`${getDifficultyColor(module.difficulty)} text-white`}>
                          Module {index + 1}
                        </Badge>
                        <span>{module.name}</span>
                        <span className="text-sm text-blue-600">({module.duration})</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-blue-800">
                      <div className="space-y-6 pt-4">
                        <div>
                          <h5 className="font-medium text-blue-900 mb-2">Module Description</h5>
                          <p className="text-sm text-blue-700">{module.description}</p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <h5 className="font-medium text-blue-900 mb-3 flex items-center gap-2">
                              <Lightbulb className="h-4 w-4 text-amber-500" />
                              Learning Topics
                            </h5>
                            <div className="space-y-2">
                              {module.topics.map((topic, idx) => (
                                <div key={idx} className="text-sm text-blue-800 pl-4 border-l-2 border-blue-300 bg-blue-50 p-2 rounded">
                                  {topic}
                                </div>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h5 className="font-medium text-blue-900 mb-3 flex items-center gap-2">
                              <Star className="h-4 w-4 text-blue-500" />
                              Skills Developed
                            </h5>
                            <div className="space-y-2">
                              {module.skills.map((skill, idx) => (
                                <div key={idx} className="text-sm text-blue-800 pl-4 border-l-2 border-blue-300 bg-blue-50 p-2 rounded">
                                  {skill}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div>
                          <h5 className="font-medium text-blue-900 mb-3 flex items-center gap-2">
                            <Award className="h-4 w-4 text-emerald-500" />
                            Hands-on Projects
                          </h5>
                          <div className="grid gap-2">
                            {module.projects.map((project, idx) => (
                              <div key={idx} className="bg-emerald-50 p-3 rounded border-l-4 border-emerald-500">
                                <span className="text-sm text-emerald-800">{project}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h5 className="font-medium text-blue-900 mb-3 flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-amber-500" />
                            Assessment Methods
                          </h5>
                          <div className="space-y-2">
                            {module.assessments.map((assessment, idx) => (
                              <div key={idx} className="text-sm text-amber-800 bg-amber-50 p-2 rounded border border-amber-200">
                                {assessment}
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="flex justify-end">
                          <Button
                            onClick={() => addModuleProgressItems(module)}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                          >
                            Add All Module Items to Report
                          </Button>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
