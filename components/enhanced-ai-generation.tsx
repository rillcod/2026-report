"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { 
  Brain, 
  Sparkles, 
  Wand2, 
  Target, 
  TrendingUp, 
  MessageSquare, 
  RefreshCw, 
  Copy, 
  Check, 
  Plus,
  Camera,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Save,
  Upload,
  Download,
  Eye,
  Settings
} from "lucide-react"
import { generateAdvancedAIContent } from "@/lib/enhanced-course-content"

interface StudentData {
  studentName: string
  theoryScore: number
  practicalScore: number
  attendance: number
  participation: string
  photo?: File
  photoPreview?: string
}

interface EnhancedAIGenerationProps {
  onGenerate: (content: string, type: string) => void
  studentData: StudentData
  currentSubject: string
  onSubjectChange?: (subject: string) => void
}

export function EnhancedAIGeneration({ onGenerate, studentData, currentSubject, onSubjectChange }: EnhancedAIGenerationProps) {
  const [activeTemplate, setActiveTemplate] = useState("comprehensive")
  const [creativity, setCreativity] = useState([7])
  const [contentLength, setContentLength] = useState([5])
  const [includeExamples, setIncludeExamples] = useState(true)
  const [personalizedTone, setPersonalizedTone] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedContent, setGeneratedContent] = useState("")
  const [copied, setCopied] = useState(false)
  
  // Enhanced premium state
  const [isAutoSaving, setIsAutoSaving] = useState(false)
  const [generationHistory, setGenerationHistory] = useState<string[]>([])
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [voicePrompt, setVoicePrompt] = useState("")
  const [uploadProgress, setUploadProgress] = useState(0)
  const [confidenceScore, setConfidenceScore] = useState(0)
  const [processingTime, setProcessingTime] = useState(0)
  
  const recognitionRef = useRef<any>(null)
  const photoInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  // Enhanced auto-save functionality
  useEffect(() => {
    const autoSaveTimer = setTimeout(() => {
      if (generatedContent) {
        handleAutoSave()
      }
    }, 3000)

    return () => clearTimeout(autoSaveTimer)
  }, [generatedContent, activeTemplate, creativity, contentLength])

  // Clear generated content when subject changes
  useEffect(() => {
    setGeneratedContent("")
    setGenerationHistory([])
    
    if (currentSubject) {
      toast({
        title: "Subject Updated",
        description: `Now generating content for ${currentSubject}`,
        duration: 3000,
      })
    }
  }, [currentSubject, toast])

  const handleAutoSave = async () => {
    setIsAutoSaving(true)
    try {
      const autoSaveData = {
        template: activeTemplate,
        creativity: creativity[0],
        contentLength: contentLength[0],
        generatedContent,
        timestamp: new Date().toISOString(),
        studentData,
        currentSubject
      }
      localStorage.setItem('aiGeneration_autoSave', JSON.stringify(autoSaveData))
      
      toast({
        title: "Auto-saved",
        description: "AI generation settings saved automatically",
        duration: 2000,
      })
    } catch (error) {
      console.error('Auto-save failed:', error)
    } finally {
      setIsAutoSaving(false)
    }
  }

  // Voice recognition setup
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = false
      recognitionRef.current.lang = 'en-US'

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        setVoicePrompt(transcript)
        setIsListening(false)
        
        toast({
          title: "Voice Command Received",
          description: `Processing: "${transcript}"`,
        })
        
        // Process voice command
        handleVoiceCommand(transcript)
      }

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error)
        setIsListening(false)
        toast({
          title: "Voice Recognition Error",
          description: "Could not process voice input. Please try again.",
          variant: "destructive",
        })
      }

      recognitionRef.current.onend = () => {
        setIsListening(false)
      }
    }
  }, [])

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

  const handleVoiceCommand = (command: string) => {
    const lowerCommand = command.toLowerCase()
    
    if (lowerCommand.includes('generate') || lowerCommand.includes('create')) {
      handleGenerate()
    } else if (lowerCommand.includes('comprehensive')) {
      setActiveTemplate('comprehensive')
    } else if (lowerCommand.includes('strength')) {
      setActiveTemplate('strengths')
    } else if (lowerCommand.includes('growth')) {
      setActiveTemplate('growth')
    } else if (lowerCommand.includes('high creativity')) {
      setCreativity([9])
    } else if (lowerCommand.includes('low creativity')) {
      setCreativity([3])
    }
  }

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.8
      utterance.pitch = 1
      utterance.volume = 0.8
      
      utterance.onstart = () => setIsSpeaking(true)
      utterance.onend = () => setIsSpeaking(false)
      utterance.onerror = () => setIsSpeaking(false)
      
      window.speechSynthesis.speak(utterance)
    }
  }

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
    }
  }

  const templates: Record<string, any> = {
    comprehensive: {
      name: "Comprehensive Assessment",
      icon: Brain,
      color: "bg-blue-500",
      description: "Complete evaluation with strengths, growth areas, and detailed feedback",
    },
    strengths: {
      name: "Strengths Focus",
      icon: Sparkles,
      color: "bg-yellow-500",
      description: "Highlight student's key strengths and achievements",
    },
    growth: {
      name: "Growth Areas",
      icon: TrendingUp,
      color: "bg-green-500",
      description: "Focus on development opportunities and improvement strategies",
    },
    narrative: {
      name: "Narrative Style",
      icon: MessageSquare,
      color: "bg-purple-500",
      description: "Story-like assessment with engaging, personal language",
    },
    technical: {
      name: "Technical Analysis",
      icon: Target,
      color: "bg-red-500",
      description: "Detailed technical skill assessment with specific examples",
    },
    creative: {
      name: "Creative & Inspiring",
      icon: Wand2,
      color: "bg-pink-500",
      description: "Motivational and creative assessment to inspire continued learning",
    },
  }

  const generateContent = async (type: string) => {
    // Validate subject selection first
    if (!currentSubject || currentSubject.trim() === "") {
      toast({
        title: "Subject Required",
        description: "Please select a course/subject before generating content.",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)
    setGeneratedContent("")
    const startTime = Date.now()

    try {
      // Validate student data
      if (!studentData.studentName || !currentSubject) {
        throw new Error("Missing required student information")
      }

      // Enhanced photo analysis if available
      let photoAnalysis = ""
      if (studentData.photo) {
        photoAnalysis = await analyzeStudentPhoto(studentData.photo)
      }

      // Set progress to completion
      setUploadProgress(100)

      let content = ""
      const avgScore = (studentData.theoryScore + studentData.practicalScore) / 2
      const grade = avgScore >= 85 ? "A" : avgScore >= 70 ? "B" : avgScore >= 60 ? "C" : "D"
      
      // Calculate confidence score based on data completeness
      let confidence = 0.7
      if (studentData.theoryScore > 0) confidence += 0.1
      if (studentData.practicalScore > 0) confidence += 0.1
      if (studentData.attendance > 0) confidence += 0.05
      if (studentData.participation) confidence += 0.05
      if (photoAnalysis) confidence += 0.1

      switch (activeTemplate) {
        case "comprehensive":
          content = generateComprehensiveAssessment(studentData, currentSubject, grade, photoAnalysis)
          break
        case "strengths":
          content = generateStrengthsAssessment(studentData, currentSubject, grade, photoAnalysis)
          break
        case "growth":
          content = generateGrowthAssessment(studentData, currentSubject, grade, photoAnalysis)
          break
        case "narrative":
          content = generateNarrativeAssessment(studentData, currentSubject, grade, photoAnalysis)
          break
        case "technical":
          content = generateTechnicalAssessment(studentData, currentSubject, grade, photoAnalysis)
          break
        case "creative":
          content = generateCreativeAssessment(studentData, currentSubject, grade, photoAnalysis)
          break
        default:
          content = generateComprehensiveAssessment(studentData, currentSubject, grade, photoAnalysis)
      }

      if (!content.trim()) {
        throw new Error("Failed to generate content")
      }

      // Enhanced content with metadata
      const enhancedContent = `${content}\n\n---\n**AI Generation Metadata:**\n- Confidence: ${Math.round(confidence * 100)}%\n- Processing Time: ${((Date.now() - startTime) / 1000).toFixed(1)}s\n- Template: ${templates[activeTemplate]?.name || activeTemplate}\n- Creativity Level: ${creativity[0]}/10`

      setGeneratedContent(enhancedContent)
      setConfidenceScore(confidence * 100)
      setProcessingTime((Date.now() - startTime) / 1000)
      
      // Add to generation history
      setGenerationHistory(prev => [enhancedContent, ...prev.slice(0, 4)])
      
      // Call parent callback
      onGenerate(enhancedContent, activeTemplate)

      toast({
        title: "Content Generated Successfully",
        description: `${templates[activeTemplate]?.name || activeTemplate} generated with ${Math.round(confidence * 100)}% confidence`,
      })

    } catch (error) {
      console.error("Content generation error:", error)
      const errorContent = `⚠️ **Generation Error**\n\nSorry, there was an issue generating the ${activeTemplate} content. Please try again or contact support if the problem persists.\n\nError: ${error instanceof Error ? error.message : 'Unknown error'}`
      setGeneratedContent(errorContent)

      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
      setUploadProgress(0)
    }
  }

  // Enhanced photo analysis function
  const analyzeStudentPhoto = async (photo: File): Promise<string> => {
    return new Promise((resolve) => {
      // Simulate photo processing
      setTimeout(() => {
        resolve(`📷 **Photo Analysis:** Visual assessment of student engagement and presentation in submitted image`)
      }, 1000)
    })
  }

  // Enhanced generation functions with photo analysis support
  const handleGenerate = () => generateContent(activeTemplate)

  const generateComprehensiveAssessment = (data: StudentData, subject: string, grade: string, photoAnalysis?: string) => {
    // Use enhanced course-specific content
    const baseContent = generateAdvancedAIContent(subject, data)
    return photoAnalysis ? `${baseContent}\n\n${photoAnalysis}` : baseContent
  }

  const generateStrengthsAssessment = (data: StudentData, subject: string, grade: string, photoAnalysis?: string) => {
    const baseContent = `**Key Strengths - ${data.studentName}**

🌟 **Technical Excellence**
${data.practicalScore >= 85 ? "• Outstanding practical programming skills with consistent high-quality code output" : "• Solid practical skills with room for continued growth"}
${data.theoryScore >= 85 ? "• Exceptional grasp of theoretical concepts and underlying principles" : "• Good understanding of core concepts with potential for deeper exploration"}

🎯 **Learning Characteristics**
• ${data.attendance >= 95 ? "Exemplary" : data.attendance >= 85 ? "Excellent" : "Good"} attendance record showing strong commitment (${data.attendance}%)
• ${data.participation === "Excellent" ? "Outstanding class participation with valuable contributions" : "Active engagement in learning activities"}
• ${grade === "A" ? "Consistently exceeds expectations" : grade === "B" ? "Meets and often exceeds standards" : "Shows steady progress toward goals"}

🚀 **Special Abilities**
${subject === "Robotics" ? "• Shows exceptional mechanical understanding and engineering thinking" : ""}
${subject === "Web Development" ? "• Demonstrates strong design sense and user experience awareness" : ""}
${subject === "Python Programming" ? "• Exhibits logical problem-solving approach and algorithmic thinking" : ""}
• ${creativity[0] > 7 ? "Creative problem-solving with innovative approaches" : "Systematic and methodical approach to challenges"}
• ${personalizedTone ? `${data.studentName}'s positive attitude and curiosity drive continuous improvement` : "Maintains growth mindset and learning enthusiasm"}`

    return photoAnalysis ? `${baseContent}\n\n${photoAnalysis}` : baseContent
  }

  const generateGrowthAssessment = (data: StudentData, subject: string, grade: string, photoAnalysis?: string) => {
    const baseContent = `**Growth & Development Plan - ${data.studentName}**

📈 **Priority Development Areas**

**Technical Skills Enhancement:**
${data.theoryScore < 80 ? "• Strengthen theoretical foundations through focused study sessions" : "• Explore advanced theoretical concepts beyond current curriculum"}
${data.practicalScore < 80 ? "• Increase hands-on practice with guided coding exercises" : "• Take on more complex practical challenges"}

**Learning Strategies:**
${data.attendance < 90 ? "• Improve attendance consistency to maximize learning opportunities" : "• Maintain excellent attendance while exploring independent learning"}
• ${contentLength[0] > 5 ? "Develop deeper understanding through extended project work" : "Focus on mastering fundamental concepts before advancing"}
• ${includeExamples ? "Build portfolio projects to demonstrate and reinforce learning" : "Practice core skills through repetition and variation"}

**Subject-Specific Growth:**
${subject === "Robotics" ? "• Focus on advanced sensor integration and autonomous system design" : ""}
${subject === "Web Development" ? "• Develop full-stack capabilities and modern framework proficiency" : ""}
${subject === "Python Programming" ? "• Master advanced data structures and algorithm optimization" : ""}

**Recommended Actions:**
1. Set weekly learning goals with measurable outcomes
2. Seek peer collaboration and study group participation
3. Practice explaining concepts to others to deepen understanding
4. ${personalizedTone ? `${data.studentName} should celebrate progress while maintaining growth focus` : "Maintain consistent effort and positive learning attitude"}

**Timeline:** 4-6 weeks for noticeable improvement with daily practice`

    return photoAnalysis ? `${baseContent}\n\n${photoAnalysis}` : baseContent
  }

  const generateNarrativeAssessment = (data: StudentData, subject: string, grade: string, photoAnalysis?: string) => {
    const baseContent = `**Learning Journey - ${data.studentName}**

${data.studentName} has embarked on an exciting journey in ${subject}, and the progress has been truly remarkable to witness. With a current performance level of ${grade}, ${data.studentName} demonstrates the kind of dedication and curiosity that makes teaching such a rewarding experience.

**The Story So Far:**
What stands out most about ${data.studentName}'s approach to learning is ${data.participation === "Excellent" ? "the enthusiastic participation in every class discussion" : "the thoughtful engagement with new concepts"}. With ${data.attendance}% attendance, ${data.studentName} has shown up ready to learn, and it shows in the work produced.

**Moments of Excellence:**
${data.practicalScore > data.theoryScore ? `${data.studentName} truly shines when working on practical projects, bringing theoretical concepts to life with creativity and skill.` : `${data.studentName} demonstrates a deep understanding of the theoretical foundations that make practical work meaningful.`}

**The Path Forward:**
Like any great learning story, there are always new chapters to write. ${data.studentName} is positioned to ${grade === "A" ? "take on leadership roles and mentor other students" : grade === "B" ? "push toward excellence with focused effort" : "build confidence through consistent practice and support"}.

**What Makes This Special:**
${personalizedTone ? `${data.studentName}'s unique perspective and approach to problem-solving adds value to our classroom community.` : "The commitment to growth and learning creates a positive impact on the entire class."} 

The journey in ${subject} is just beginning, and the foundation being built now will support amazing achievements in the future.`

    return photoAnalysis ? `${baseContent}\n\n${photoAnalysis}` : baseContent
  }

  const generateTechnicalAssessment = (data: StudentData, subject: string, grade: string, photoAnalysis?: string) => {
    const baseContent = `**Technical Skills Analysis - ${data.studentName}**

**Performance Metrics:**
• Theory Score: ${data.theoryScore}% (${data.theoryScore >= 85 ? "Advanced" : data.theoryScore >= 70 ? "Proficient" : "Developing"})
• Practical Score: ${data.practicalScore}% (${data.practicalScore >= 85 ? "Advanced" : data.practicalScore >= 70 ? "Proficient" : "Developing"})
• Overall Grade: ${grade} (${((data.theoryScore + data.practicalScore) / 2).toFixed(1)}%)

**Technical Competencies:**

${
  subject === "Python Programming"
    ? `
**Programming Fundamentals:**
• Variable manipulation and data type understanding: ${data.theoryScore >= 80 ? "Mastered" : "In Progress"}
• Control structures (loops, conditionals): ${data.practicalScore >= 80 ? "Proficient" : "Developing"}
• Function design and implementation: ${grade === "A" ? "Advanced" : "Intermediate"}
• Object-oriented programming concepts: ${data.theoryScore >= 75 ? "Good grasp" : "Needs reinforcement"}

**Problem-Solving Approach:**
• Algorithm design: ${data.practicalScore >= 85 ? "Systematic and efficient" : "Developing methodology"}
• Debugging techniques: ${grade === "A" ? "Advanced troubleshooting" : "Basic error identification"}
• Code optimization: ${data.practicalScore >= 80 ? "Considers efficiency" : "Focus on functionality"}`
    : ""
}

${
  subject === "Robotics"
    ? `
**Engineering Skills:**
• Mechanical design understanding: ${data.practicalScore >= 80 ? "Strong spatial reasoning" : "Developing 3D thinking"}
• Circuit design and electronics: ${data.theoryScore >= 75 ? "Good component knowledge" : "Basic understanding"}
• Programming microcontrollers: ${grade === "A" ? "Advanced embedded coding" : "Fundamental programming"}
• Sensor integration: ${data.practicalScore >= 85 ? "Multi-sensor fusion" : "Single sensor applications"}

**System Integration:**
• Hardware-software interface: ${data.practicalScore >= 80 ? "Seamless integration" : "Basic connectivity"}
• Autonomous behavior programming: ${grade === "A" ? "Complex decision trees" : "Simple automation"}`
    : ""
}

**Recommendations for Technical Growth:**
• ${data.theoryScore < 80 ? "Strengthen theoretical foundations through documentation study" : "Explore advanced theoretical applications"}
• ${data.practicalScore < 80 ? "Increase hands-on lab time and project complexity" : "Take on mentoring roles for practical skills"}
• Focus on ${subject === "Robotics" ? "advanced control systems and AI integration" : "software architecture and design patterns"}`

    return photoAnalysis ? `${baseContent}\n\n${photoAnalysis}` : baseContent
  }

  const generateCreativeAssessment = (data: StudentData, subject: string, grade: string, photoAnalysis?: string) => {
    const baseContent = `**Creative Learning Profile - ${data.studentName}** ✨

🎨 **The Artist-Engineer:**
${data.studentName} brings a unique creative spark to ${subject} that transforms ordinary assignments into extraordinary explorations. With a ${grade} performance level, there's a beautiful blend of technical skill and creative vision at work.

🌟 **Innovation Highlights:**
• **Creative Problem-Solving:** ${data.practicalScore >= 85 ? "Consistently finds elegant, innovative solutions that surprise and delight" : "Shows emerging creative thinking with growing confidence"}
• **Design Aesthetic:** ${subject.includes("Web") || subject.includes("Design") ? "Natural eye for visual harmony and user experience" : "Brings visual thinking to technical challenges"}
• **Unique Perspective:** ${personalizedTone ? `${data.studentName}'s approach often reveals new ways of thinking about familiar problems` : "Offers fresh insights that enrich class discussions"}

🚀 **Creative Superpowers:**
${creativity[0] >= 8 ? "• **Visionary Thinking:** Sees possibilities others miss and isn't afraid to explore uncharted territory" : "• **Emerging Vision:** Developing confidence to explore creative solutions"}
${data.participation === "Excellent" ? "• **Collaborative Creativity:** Inspires others and builds on ideas to create something greater" : "• **Individual Expression:** Developing personal creative voice and style"}
• **Technical Artistry:** ${grade === "A" ? "Masters the tools to bring creative visions to life" : "Building skills to express creative ideas through technology"}

🎯 **Creative Challenges Ahead:**
• Push creative boundaries while maintaining technical excellence
• ${subject === "Robotics" ? "Design robots that are both functional and aesthetically pleasing" : "Create projects that solve real problems with style"}
• Share creative process with others to inspire collaborative innovation
• ${includeExamples ? "Build a portfolio showcasing the intersection of creativity and technology" : "Continue exploring the artistic side of technical work"}

💫 **The Creative Journey:**
${data.studentName} is discovering that ${subject} isn't just about code or circuits—it's about bringing imagination to life through technology. The future holds endless possibilities for someone who sees the world through both creative and technical lenses.

Keep dreaming, keep building, keep creating! 🌈`

    return photoAnalysis ? `${baseContent}\n\n${photoAnalysis}` : baseContent
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedContent)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Card className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 border-purple-700/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-purple-300">
          <Brain className="h-5 w-5" />
          Enhanced AI Content Generation
          <Badge variant="outline" className="bg-purple-900 text-purple-200">
            {currentSubject}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Course/Subject Selection */}
        <Card className="bg-gray-800/30 border-gray-600">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-sm flex items-center gap-2">
              <Target className="h-4 w-4" />
              Course Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <Label className="text-purple-300 mb-2 block">Current Subject/Course</Label>
                {onSubjectChange ? (
                  <Select value={currentSubject} onValueChange={onSubjectChange}>
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue placeholder="Select a subject..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Python Programming">Python Programming</SelectItem>
                      <SelectItem value="Web Development">Web Development</SelectItem>
                      <SelectItem value="Robotics">Robotics</SelectItem>
                      <SelectItem value="Data Science">Data Science</SelectItem>
                      <SelectItem value="Machine Learning">Machine Learning</SelectItem>
                      <SelectItem value="Mobile App Development">Mobile App Development</SelectItem>
                      <SelectItem value="Database Management">Database Management</SelectItem>
                      <SelectItem value="Cybersecurity">Cybersecurity</SelectItem>
                      <SelectItem value="UI/UX Design">UI/UX Design</SelectItem>
                      <SelectItem value="Game Development">Game Development</SelectItem>
                      <SelectItem value="DevOps">DevOps</SelectItem>
                      <SelectItem value="Mathematics">Mathematics</SelectItem>
                      <SelectItem value="Physics">Physics</SelectItem>
                      <SelectItem value="Chemistry">Chemistry</SelectItem>
                      <SelectItem value="Biology">Biology</SelectItem>
                      <SelectItem value="Computer Science">Computer Science</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="p-3 bg-gray-700 border border-gray-600 rounded-md">
                    <p className="text-white font-medium">{currentSubject || "No subject selected"}</p>
                  </div>
                )}
              </div>
              <div className="text-center">
                <Badge 
                  variant={currentSubject ? "default" : "destructive"} 
                  className={currentSubject ? "bg-green-600 text-white" : "bg-red-600 text-white"}
                >
                  {currentSubject ? "✓ Active" : "⚠ Not Set"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI Settings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-purple-300 mb-2 block">Creativity Level: {creativity[0]}/10</Label>
            <Slider value={creativity} onValueChange={setCreativity} min={1} max={10} step={1} className="w-full" />
          </div>
          <div>
            <Label className="text-purple-300 mb-2 block">Content Length: {contentLength[0]}/10</Label>
            <Slider
              value={contentLength}
              onValueChange={setContentLength}
              min={1}
              max={10}
              step={1}
              className="w-full"
            />
          </div>
        </div>

        <div className="flex gap-4">
          <div className="flex items-center space-x-2">
            <Switch id="examples" checked={includeExamples} onCheckedChange={setIncludeExamples} />
            <Label htmlFor="examples" className="text-purple-300">
              Include Examples
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="personalized" checked={personalizedTone} onCheckedChange={setPersonalizedTone} />
            <Label htmlFor="personalized" className="text-purple-300">
              Personalized Tone
            </Label>
          </div>
        </div>

        {/* Template Selection */}
        <Tabs value={activeTemplate} onValueChange={setActiveTemplate}>
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 bg-gray-800 h-auto p-1">
            {Object.entries(templates).map(([key, template]) => (
              <TabsTrigger 
                key={key} 
                value={key} 
                className="data-[state=active]:bg-purple-600 flex-col py-2 px-2 min-h-[3rem] text-xs"
              >
                <template.icon className="h-3 w-3 mb-1" />
                <span className="text-[10px] sm:text-xs leading-tight text-center">
                  {template.name.split(" ")[0]}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>

          {Object.entries(templates).map(([key, template]) => (
            <TabsContent key={key} value={key} className="mt-4">
              <Card className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`p-2 rounded-lg ${template.color}`}>
                      <template.icon className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <h4 className="font-medium text-white">{template.name}</h4>
                      <p className="text-sm text-gray-400">{template.description}</p>
                    </div>
                  </div>
                  <Button
                    onClick={() => generateContent(key)}
                    disabled={isGenerating}
                    className="w-full bg-purple-600 hover:bg-purple-700"
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Wand2 className="h-4 w-4 mr-2" />
                        Generate {template.name}
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>

        {/* Generated Content */}
        {generatedContent && (
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <CardTitle className="text-white">Generated Content</CardTitle>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={copyToClipboard}
                    className="border-gray-600 text-gray-300 hover:bg-gray-700 w-full sm:w-auto"
                  >
                    {copied ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                    {copied ? "Copied" : "Copy"}
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => onGenerate(generatedContent, activeTemplate)}
                    className="bg-purple-600 hover:bg-purple-700 w-full sm:w-auto"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Use Content
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Textarea
                value={generatedContent}
                onChange={(e) => setGeneratedContent(e.target.value)}
                className="min-h-[300px] bg-gray-900 border-gray-700 text-gray-200"
                placeholder="Generated content will appear here..."
              />
            </CardContent>
          </Card>
        )}

        {/* Student Data Preview */}
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-sm">Student Data Context</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
              <div>
                <Label className="text-gray-400">Course/Subject</Label>
                <p className="text-white font-medium">{currentSubject || "Not selected"}</p>
              </div>
              <div>
                <Label className="text-gray-400">Student</Label>
                <p className="text-white">{studentData.studentName || "Not provided"}</p>
              </div>
              <div>
                <Label className="text-gray-400">Theory Score</Label>
                <p className="text-white">{studentData.theoryScore}%</p>
              </div>
              <div>
                <Label className="text-gray-400">Practical Score</Label>
                <p className="text-white">{studentData.practicalScore}%</p>
              </div>
              <div>
                <Label className="text-gray-400">Attendance</Label>
                <p className="text-white">{studentData.attendance}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  )
}
