"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { 
  Bot,
  Sparkles,
  FileText,
  Target,
  TrendingUp,
  MessageSquare,
  Wand2,
  BookOpen,
  Award,
  Copy,
  CheckCircle
} from "lucide-react"

interface ReportTemplate {
  id: string
  name: string
  description: string
  content: string
  category: string
  icon: React.ReactNode
  color: string
}

export function UnifiedAIAssistant() {
  const [selectedTemplate, setSelectedTemplate] = useState<ReportTemplate | null>(null)
  const [generatedContent, setGeneratedContent] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [copiedStates, setCopiedStates] = useState<{ [key: string]: boolean }>({})
  const { toast } = useToast()

  const reportTemplates: ReportTemplate[] = [
    {
      id: "strengths-template",
      name: "📊 Student Strengths Analysis",
      description: "Comprehensive template for highlighting student strengths and achievements",
      content: `[Student Name] demonstrates exceptional capabilities in several key areas:

**Technical Proficiency:**
• Shows strong understanding of [subject] fundamentals with consistent application in practical scenarios
• Demonstrates excellent problem-solving skills when faced with complex challenges
• Exhibits creativity in approaching assignments and finding innovative solutions

**Learning Approach:**
• Actively participates in class discussions and collaborative activities
• Takes initiative in seeking help when needed and supporting peer learning
• Shows growth mindset with willingness to learn from mistakes and feedback

**Professional Development:**
• Maintains consistent quality in submitted work with attention to detail
• Demonstrates reliability in meeting deadlines and project requirements
• Shows potential for advanced topics and continued growth in the field`,
      category: "evaluation",
      icon: <Target className="h-4 w-4" />,
      color: "bg-green-50 border-green-200 text-green-800"
    },
    {
      id: "growth-template",
      name: "🎯 Growth Areas Guide",
      description: "Constructive template for identifying areas of improvement",
      content: `Areas for continued development and growth:

**Technical Skills Enhancement:**
• Focus on strengthening [specific skill] through additional practice and guided exercises
• Benefit from reviewing foundational concepts to build stronger understanding
• Opportunity to explore advanced techniques and industry best practices

**Learning Strategies:**
• Encourage more frequent code review and debugging practice
• Develop stronger documentation and commenting habits
• Practice explaining technical concepts to reinforce understanding

**Next Steps:**
• Recommended resources: [specific tutorials, books, or courses]
• Practice projects that would reinforce weak areas
• Collaborative opportunities to learn from peers and mentors`,
      category: "development",
      icon: <TrendingUp className="h-4 w-4" />,
      color: "bg-blue-50 border-blue-200 text-blue-800"
    },
    {
      id: "comprehensive-template",
      name: "📋 Comprehensive Evaluation",
      description: "Complete assessment template covering all aspects of student performance",
      content: `**Overall Performance Summary:**
[Student Name] has shown [performance level] progress throughout this assessment period.

**Key Achievements:**
• Successfully completed [X] out of [Y] assignments with [quality level]
• Demonstrated proficiency in [key concepts/skills]
• Showed particular strength in [specific area]

**Technical Competencies:**
• Programming/Technical Skills: [rating and details]
• Problem-Solving Ability: [rating and details]
• Code Quality & Best Practices: [rating and details]

**Collaboration & Communication:**
• Class Participation: [rating and details]
• Peer Interaction: [rating and details]
• Help-Seeking Behavior: [rating and details]

**Recommendations:**
• Continue building on strengths in [area]
• Focus development efforts on [specific areas]
• Suggested next steps for continued learning

**Grade Justification:**
The assigned grade of [grade] reflects [explanation of performance relative to learning objectives].`,
      category: "comprehensive",
      icon: <FileText className="h-4 w-4" />,
      color: "bg-purple-50 border-purple-200 text-purple-800"
    },
    {
      id: "progress-template",
      name: "📈 Progress Tracking",
      description: "Template for documenting specific progress items and milestones",
      content: `**Learning Progress Documentation:**

**Module 1: [Topic Name]**
• Mastered: [specific skills/concepts achieved]
• Demonstrated: [practical applications completed]
• Assessment: [performance level and evidence]

**Module 2: [Topic Name]**
• Mastered: [specific skills/concepts achieved]
• Demonstrated: [practical applications completed]
• Assessment: [performance level and evidence]

**Practical Applications:**
• Project 1: [name] - [outcome and skills demonstrated]
• Project 2: [name] - [outcome and skills demonstrated]
• Labs/Exercises: [summary of hands-on work completed]

**Skill Development Timeline:**
• Week [X]: [milestone achieved]
• Week [Y]: [milestone achieved]
• Week [Z]: [milestone achieved]

**Evidence Portfolio:**
• Code samples demonstrating [skill]
• Project deliverables showing [capability]
• Assessment results indicating [proficiency level]`,
      category: "tracking",
      icon: <BookOpen className="h-4 w-4" />,
      color: "bg-orange-50 border-orange-200 text-orange-800"
    },
    {
      id: "feedback-template",
      name: "💬 Constructive Feedback",
      description: "Template for providing actionable feedback and suggestions",
      content: `**Feedback Summary for [Student Name]:**

**What's Working Well:**
✅ [Specific positive behavior or skill]
✅ [Another strength to reinforce]
✅ [Third area of success]

**Areas for Improvement:**
🎯 [Specific area with clear explanation]
   → Suggestion: [Concrete action step]
   → Resources: [Helpful materials or references]

🎯 [Second improvement area]
   → Suggestion: [Concrete action step]
   → Resources: [Helpful materials or references]

**Immediate Action Items:**
1. [Specific task to complete]
2. [Second actionable item]
3. [Third development goal]

**Looking Ahead:**
Based on current progress, focus on [specific goals] to prepare for [next level/advanced topics].

**Instructor Support:**
Available for [office hours/help sessions] to provide additional guidance on [specific topics].`,
      category: "feedback",
      icon: <MessageSquare className="h-4 w-4" />,
      color: "bg-yellow-50 border-yellow-200 text-yellow-800"
    },
    {
      id: "certificate-template",
      name: "🏆 Achievement Certificate",
      description: "Professional template for certificates and achievement recognition",
      content: `**CERTIFICATE OF ACHIEVEMENT**

This certifies that

**[STUDENT NAME]**

has successfully completed the requirements for

**[COURSE/PROGRAM NAME]**

and has demonstrated proficiency in:
• [Key skill or competency 1]
• [Key skill or competency 2]
• [Key skill or competency 3]

**Performance Summary:**
Theory Assessment: [Score]%
Practical Assessment: [Score]%
Overall Grade: [Letter Grade]

**Special Recognition:**
[Any special achievements, honors, or standout performance]

**Completion Date:** [Date]
**Institution:** [School/Organization Name]
**Instructor:** [Instructor Name]

This achievement represents [X] hours of dedicated learning and practical application in [subject area].

**Next Recommended Steps:**
• Advanced course in [related subject]
• Professional certification in [relevant area]
• Portfolio development opportunities`,
      category: "recognition",
      icon: <Award className="h-4 w-4" />,
      color: "bg-emerald-50 border-emerald-200 text-emerald-800"
    }
  ]

  const simulateAIGeneration = async (template: ReportTemplate) => {
    setIsGenerating(true)
    setSelectedTemplate(template)
    
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setGeneratedContent(template.content)
    setIsGenerating(false)
    
    toast({
      title: "Content Generated",
      description: `${template.name} template has been generated and customized.`,
    })
  }

  const copyToClipboard = async (content: string, templateId: string) => {
    try {
      await navigator.clipboard.writeText(content)
      setCopiedStates({ ...copiedStates, [templateId]: true })
      
      toast({
        title: "Copied to Clipboard",
        description: "Template content has been copied. You can paste it into your report.",
      })
      
      // Reset copied state after 2 seconds
      setTimeout(() => {
        setCopiedStates({ ...copiedStates, [templateId]: false })
      }, 2000)
    } catch (err) {
      toast({
        title: "Copy Failed",
        description: "Could not copy to clipboard. Please select and copy manually.",
        variant: "destructive"
      })
    }
  }

  const groupedTemplates = {
    evaluation: reportTemplates.filter(t => t.category === 'evaluation' || t.category === 'comprehensive'),
    development: reportTemplates.filter(t => t.category === 'development' || t.category === 'tracking'),
    communication: reportTemplates.filter(t => t.category === 'feedback' || t.category === 'recognition')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-indigo-50 via-purple-50 to-blue-50 border-indigo-200 shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl shadow-lg">
              <Bot className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl text-indigo-900 flex items-center gap-2">
                AI Report Assistant
                <Sparkles className="h-5 w-5 text-indigo-500" />
              </CardTitle>
              <p className="text-indigo-700 text-sm">Professional templates and content generation for student reports</p>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Template Selection */}
        <Card className="border-indigo-100 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-indigo-900">
              <FileText className="h-5 w-5" />
              Report Templates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="evaluation" className="space-y-4">
              <TabsList className="grid w-full grid-cols-3 bg-indigo-50">
                <TabsTrigger value="evaluation" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white text-xs">
                  Assessment
                </TabsTrigger>
                <TabsTrigger value="development" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white text-xs">
                  Development
                </TabsTrigger>
                <TabsTrigger value="communication" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white text-xs">
                  Communication
                </TabsTrigger>
              </TabsList>

              <TabsContent value="evaluation" className="space-y-3">
                {groupedTemplates.evaluation.map((template) => (
                  <Card key={template.id} className={`cursor-pointer transition-all hover:shadow-md ${template.color}`}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            {template.icon}
                            <h4 className="font-medium text-sm">{template.name}</h4>
                          </div>
                          <p className="text-xs text-gray-600 mb-3">{template.description}</p>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => simulateAIGeneration(template)}
                              disabled={isGenerating}
                              className="h-7 text-xs"
                            >
                              {isGenerating && selectedTemplate?.id === template.id ? (
                                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1"></div>
                              ) : (
                                <Wand2 className="h-3 w-3 mr-1" />
                              )}
                              Generate
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => copyToClipboard(template.content, template.id)}
                              className="h-7 text-xs"
                            >
                              {copiedStates[template.id] ? (
                                <CheckCircle className="h-3 w-3 mr-1" />
                              ) : (
                                <Copy className="h-3 w-3 mr-1" />
                              )}
                              {copiedStates[template.id] ? 'Copied!' : 'Copy'}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="development" className="space-y-3">
                {groupedTemplates.development.map((template) => (
                  <Card key={template.id} className={`cursor-pointer transition-all hover:shadow-md ${template.color}`}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            {template.icon}
                            <h4 className="font-medium text-sm">{template.name}</h4>
                          </div>
                          <p className="text-xs text-gray-600 mb-3">{template.description}</p>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => simulateAIGeneration(template)}
                              disabled={isGenerating}
                              className="h-7 text-xs"
                            >
                              {isGenerating && selectedTemplate?.id === template.id ? (
                                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1"></div>
                              ) : (
                                <Wand2 className="h-3 w-3 mr-1" />
                              )}
                              Generate
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => copyToClipboard(template.content, template.id)}
                              className="h-7 text-xs"
                            >
                              {copiedStates[template.id] ? (
                                <CheckCircle className="h-3 w-3 mr-1" />
                              ) : (
                                <Copy className="h-3 w-3 mr-1" />
                              )}
                              {copiedStates[template.id] ? 'Copied!' : 'Copy'}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="communication" className="space-y-3">
                {groupedTemplates.communication.map((template) => (
                  <Card key={template.id} className={`cursor-pointer transition-all hover:shadow-md ${template.color}`}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            {template.icon}
                            <h4 className="font-medium text-sm">{template.name}</h4>
                          </div>
                          <p className="text-xs text-gray-600 mb-3">{template.description}</p>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => simulateAIGeneration(template)}
                              disabled={isGenerating}
                              className="h-7 text-xs"
                            >
                              {isGenerating && selectedTemplate?.id === template.id ? (
                                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1"></div>
                              ) : (
                                <Wand2 className="h-3 w-3 mr-1" />
                              )}
                              Generate
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => copyToClipboard(template.content, template.id)}
                              className="h-7 text-xs"
                            >
                              {copiedStates[template.id] ? (
                                <CheckCircle className="h-3 w-3 mr-1" />
                              ) : (
                                <Copy className="h-3 w-3 mr-1" />
                              )}
                              {copiedStates[template.id] ? 'Copied!' : 'Copy'}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Generated Content Preview */}
        <Card className="border-indigo-100 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-indigo-900">
              <Sparkles className="h-5 w-5" />
              Generated Content
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedTemplate ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Badge className={selectedTemplate.color}>
                    {selectedTemplate.icon}
                    <span className="ml-1">{selectedTemplate.name}</span>
                  </Badge>
                </div>
                
                {isGenerating ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                      <p className="text-indigo-600">Generating personalized content...</p>
                    </div>
                  </div>
                ) : generatedContent ? (
                  <div className="space-y-4">
                    <Textarea
                      value={generatedContent}
                      onChange={(e) => setGeneratedContent(e.target.value)}
                      rows={12}
                      className="border-indigo-200 focus:border-indigo-400 font-mono text-sm"
                      placeholder="Generated content will appear here..."
                    />
                    <div className="flex gap-2">
                      <Button
                        onClick={() => copyToClipboard(generatedContent, 'generated')}
                        variant="outline"
                        size="sm"
                        className="border-indigo-200 text-indigo-700 hover:bg-indigo-50"
                      >
                        {copiedStates['generated'] ? (
                          <CheckCircle className="h-4 w-4 mr-1" />
                        ) : (
                          <Copy className="h-4 w-4 mr-1" />
                        )}
                        {copiedStates['generated'] ? 'Copied!' : 'Copy Content'}
                      </Button>
                    </div>
                  </div>
                ) : null}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Bot className="h-16 w-16 text-indigo-300 mb-4" />
                <h3 className="text-lg font-medium text-indigo-900 mb-2">Ready to Generate</h3>
                <p className="text-indigo-600">Select a template to generate professional report content</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
