"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAdvancedFeatures } from "@/hooks/use-advanced-features"
import { useToast } from "@/hooks/use-toast"
import {
  Zap,
  Palette,
  Rocket,
  Brain,
  Users,
  Shield,
  BarChart3,
  Download,
  Upload,
  RotateCcw,
  Settings,
  Crown,
  Star,
  CheckCircle,
  AlertTriangle,
  Info,
} from "lucide-react"

interface FeatureGroup {
  id: string
  name: string
  description: string
  icon: React.ComponentType<any>
  color: string
  features: Array<{
    key: keyof any
    name: string
    description: string
    impact: "low" | "medium" | "high"
    experimental?: boolean
    premium?: boolean
  }>
}

export function FeatureFlagsPanel() {
  const { features, updateFeature, resetFeatures, exportFeatures, importFeatures } = useAdvancedFeatures()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("performance")

  const featureGroups: FeatureGroup[] = [
    {
      id: "performance",
      name: "Performance",
      description: "Optimize app speed and responsiveness",
      icon: Zap,
      color: "text-yellow-500",
      features: [
        {
          key: "enableLazyLoading",
          name: "Lazy Loading",
          description: "Load components only when needed",
          impact: "high",
        },
        {
          key: "enableVirtualization",
          name: "Virtualization",
          description: "Render only visible items in large lists",
          impact: "high",
          experimental: true,
        },
        {
          key: "enableCaching",
          name: "Smart Caching",
          description: "Cache frequently accessed data",
          impact: "medium",
        },
        {
          key: "enableCompression",
          name: "Data Compression",
          description: "Compress data for faster transfers",
          impact: "medium",
        },
      ],
    },
    {
      id: "ui",
      name: "UI/UX",
      description: "Enhance user interface and experience",
      icon: Palette,
      color: "text-purple-500",
      features: [
        {
          key: "enableAnimations",
          name: "Smooth Animations",
          description: "Add fluid transitions and animations",
          impact: "low",
        },
        {
          key: "enableSoundEffects",
          name: "Sound Effects",
          description: "Audio feedback for interactions",
          impact: "low",
          experimental: true,
        },
        {
          key: "enableHapticFeedback",
          name: "Haptic Feedback",
          description: "Tactile feedback on mobile devices",
          impact: "low",
          experimental: true,
        },
        {
          key: "enableDarkMode",
          name: "Dark Mode",
          description: "Dark theme for better visibility",
          impact: "low",
        },
        {
          key: "enableHighContrast",
          name: "High Contrast",
          description: "Enhanced contrast for accessibility",
          impact: "low",
        },
      ],
    },
    {
      id: "productivity",
      name: "Productivity",
      description: "Boost efficiency and workflow",
      icon: Rocket,
      color: "text-blue-500",
      features: [
        {
          key: "enableKeyboardShortcuts",
          name: "Keyboard Shortcuts",
          description: "Quick actions via keyboard",
          impact: "high",
        },
        {
          key: "enableAutoComplete",
          name: "Auto Complete",
          description: "Smart text completion",
          impact: "medium",
        },
        {
          key: "enableSmartSuggestions",
          name: "Smart Suggestions",
          description: "AI-powered content suggestions",
          impact: "high",
        },
        {
          key: "enableBulkOperations",
          name: "Bulk Operations",
          description: "Process multiple items at once",
          impact: "high",
        },
        {
          key: "enableQuickActions",
          name: "Quick Actions",
          description: "Context-sensitive action menus",
          impact: "medium",
        },
      ],
    },
    {
      id: "ai",
      name: "AI Features",
      description: "Artificial intelligence capabilities",
      icon: Brain,
      color: "text-green-500",
      features: [
        {
          key: "enableAIAssistant",
          name: "AI Assistant",
          description: "Intelligent help and guidance",
          impact: "high",
          premium: true,
        },
        {
          key: "enableVoiceInput",
          name: "Voice Input",
          description: "Speech-to-text functionality",
          impact: "medium",
          experimental: true,
        },
        {
          key: "enableAutoTranslation",
          name: "Auto Translation",
          description: "Automatic language translation",
          impact: "medium",
          premium: true,
        },
        {
          key: "enableSentimentAnalysis",
          name: "Sentiment Analysis",
          description: "Analyze emotional tone of content",
          impact: "low",
          experimental: true,
        },
        {
          key: "enableContentGeneration",
          name: "Content Generation",
          description: "AI-powered content creation",
          impact: "high",
          premium: true,
        },
      ],
    },
    {
      id: "collaboration",
      name: "Collaboration",
      description: "Team and sharing features",
      icon: Users,
      color: "text-orange-500",
      features: [
        {
          key: "enableRealTimeSync",
          name: "Real-time Sync",
          description: "Live collaboration and updates",
          impact: "high",
          premium: true,
        },
        {
          key: "enableComments",
          name: "Comments System",
          description: "Add comments and feedback",
          impact: "medium",
          premium: true,
        },
        {
          key: "enableVersionHistory",
          name: "Version History",
          description: "Track changes over time",
          impact: "medium",
        },
        {
          key: "enableShareLinks",
          name: "Share Links",
          description: "Generate shareable links",
          impact: "low",
        },
        {
          key: "enableTeamWorkspaces",
          name: "Team Workspaces",
          description: "Collaborative team environments",
          impact: "high",
          premium: true,
        },
      ],
    },
    {
      id: "security",
      name: "Security",
      description: "Data protection and privacy",
      icon: Shield,
      color: "text-red-500",
      features: [
        {
          key: "enableEncryption",
          name: "Data Encryption",
          description: "Encrypt sensitive data",
          impact: "high",
        },
        {
          key: "enableTwoFactorAuth",
          name: "Two-Factor Auth",
          description: "Enhanced login security",
          impact: "high",
          premium: true,
        },
        {
          key: "enableAuditLogs",
          name: "Audit Logs",
          description: "Track all system activities",
          impact: "medium",
        },
        {
          key: "enablePermissions",
          name: "User Permissions",
          description: "Role-based access control",
          impact: "high",
          premium: true,
        },
        {
          key: "enableBackupRecovery",
          name: "Backup & Recovery",
          description: "Automatic data backup",
          impact: "high",
        },
      ],
    },
    {
      id: "analytics",
      name: "Analytics",
      description: "Insights and monitoring",
      icon: BarChart3,
      color: "text-indigo-500",
      features: [
        {
          key: "enableUsageTracking",
          name: "Usage Tracking",
          description: "Monitor app usage patterns",
          impact: "low",
        },
        {
          key: "enablePerformanceMonitoring",
          name: "Performance Monitoring",
          description: "Track app performance metrics",
          impact: "medium",
        },
        {
          key: "enableErrorReporting",
          name: "Error Reporting",
          description: "Automatic error detection",
          impact: "high",
        },
        {
          key: "enableA11yTesting",
          name: "Accessibility Testing",
          description: "Automated accessibility checks",
          impact: "medium",
          experimental: true,
        },
        {
          key: "enableSEOOptimization",
          name: "SEO Optimization",
          description: "Search engine optimization",
          impact: "low",
          experimental: true,
        },
      ],
    },
  ]

  const handleExport = () => {
    const featuresJson = exportFeatures()
    const blob = new Blob([featuresJson], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "feature-flags.json"
    a.click()
    URL.revokeObjectURL(url)

    toast({
      title: "Features Exported",
      description: "Feature configuration has been exported successfully.",
    })
  }

  const handleImport = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = ".json"
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          const content = e.target?.result as string
          if (importFeatures(content)) {
            toast({
              title: "Features Imported",
              description: "Feature configuration has been imported successfully.",
            })
          } else {
            toast({
              title: "Import Failed",
              description: "Invalid feature configuration file.",
              variant: "destructive",
            })
          }
        }
        reader.readAsText(file)
      }
    }
    input.click()
  }

  const handleReset = () => {
    resetFeatures()
    toast({
      title: "Features Reset",
      description: "All features have been reset to default values.",
    })
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high":
        return "text-red-500"
      case "medium":
        return "text-yellow-500"
      case "low":
        return "text-green-500"
      default:
        return "text-gray-500"
    }
  }

  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case "high":
        return AlertTriangle
      case "medium":
        return Info
      case "low":
        return CheckCircle
      default:
        return Info
    }
  }

  return (
    <Card className="bg-gray-800/50 border-gray-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-white">
              <Settings className="h-5 w-5" />
              Feature Flags
            </CardTitle>
            <CardDescription className="text-gray-400">
              Configure advanced features and experimental capabilities
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="h-4 w-4 mr-1" />
              Export
            </Button>
            <Button variant="outline" size="sm" onClick={handleImport}>
              <Upload className="h-4 w-4 mr-1" />
              Import
            </Button>
            <Button variant="outline" size="sm" onClick={handleReset}>
              <RotateCcw className="h-4 w-4 mr-1" />
              Reset
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 bg-gray-900 h-auto p-1">
            {featureGroups.map((group) => (
              <TabsTrigger key={group.id} value={group.id} className="data-[state=active]:bg-gray-700 flex-col py-2 px-1 text-xs sm:text-sm">
                <group.icon className={`h-3 w-3 sm:h-4 sm:w-4 mb-1 sm:mr-1 sm:mb-0 ${group.color}`} />
                <span className="hidden sm:inline">{group.name}</span>
                <span className="sm:hidden">{group.name.slice(0, 4)}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {featureGroups.map((group) => (
            <TabsContent key={group.id} value={group.id} className="mt-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-6">
                  <div className={`p-2 bg-gray-700 rounded-lg`}>
                    <group.icon className={`h-6 w-6 ${group.color}`} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{group.name}</h3>
                    <p className="text-sm text-gray-400">{group.description}</p>
                  </div>
                </div>

                <div className="grid gap-4">
                  {group.features.map((feature) => {
                    const ImpactIcon = getImpactIcon(feature.impact)
                    return (
                      <Card key={String(feature.key)} className="bg-gray-900/50 border-gray-700">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h4 className="font-medium text-white">{feature.name}</h4>
                                <div className="flex gap-1">
                                  {feature.experimental && (
                                    <Badge
                                      variant="outline"
                                      className="text-xs bg-yellow-900 text-yellow-200 border-yellow-700"
                                    >
                                      <Star className="h-3 w-3 mr-1" />
                                      Experimental
                                    </Badge>
                                  )}
                                  {feature.premium && (
                                    <Badge
                                      variant="outline"
                                      className="text-xs bg-purple-900 text-purple-200 border-purple-700"
                                    >
                                      <Crown className="h-3 w-3 mr-1" />
                                      Premium
                                    </Badge>
                                  )}
                                </div>
                              </div>
                              <p className="text-sm text-gray-400 mb-2">{feature.description}</p>
                              <div className="flex items-center gap-2">
                                <ImpactIcon className={`h-3 w-3 ${getImpactColor(feature.impact)}`} />
                                <span className={`text-xs font-medium ${getImpactColor(feature.impact)}`}>
                                  {feature.impact.toUpperCase()} IMPACT
                                </span>
                              </div>
                            </div>
                            <Switch
                              checked={features[feature.key as keyof typeof features]}
                              onCheckedChange={(checked) =>
                                updateFeature(feature.key as keyof typeof features, checked)
                              }
                            />
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {/* Feature Summary */}
        <Card className="mt-6 bg-gradient-to-r from-blue-900/20 to-purple-900/20 border-blue-700/50">
          <CardContent className="p-4">
            <h4 className="font-medium text-white mb-3">Feature Summary</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-400">{Object.values(features).filter(Boolean).length}</div>
                <div className="text-xs text-gray-400">Enabled</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-400">
                  {Object.values(features).filter((v) => !v).length}
                </div>
                <div className="text-xs text-gray-400">Disabled</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-400">
                  {featureGroups.reduce(
                    (acc, group) =>
                      acc +
                      group.features.filter((f) => f.experimental && features[f.key as keyof typeof features]).length,
                    0,
                  )}
                </div>
                <div className="text-xs text-gray-400">Experimental</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-400">
                  {featureGroups.reduce(
                    (acc, group) =>
                      acc + group.features.filter((f) => f.premium && features[f.key as keyof typeof features]).length,
                    0,
                  )}
                </div>
                <div className="text-xs text-gray-400">Premium</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  )
}
