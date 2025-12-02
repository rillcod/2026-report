"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { useSettings } from "@/hooks/use-settings"
import {
  Settings,
  School,
  User,
  FileText,
  Database,
  Download,
  Upload,
  RotateCcw,
  Save,
  AlertCircle,
  Sparkles,
  CreditCard,
  Eye,
} from "lucide-react"

export function UnifiedSettings() {
  const { toast } = useToast()
  const { settings, updateSettings, resetSettings } = useSettings()
  const [activeTab, setActiveTab] = useState("school")
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [isImporting, setIsImporting] = useState(false)

  const handleSettingChange = (key: string, value: any) => {
    updateSettings({ [key]: value })
    setHasUnsavedChanges(true)
  }

  const handleSave = () => {
    setHasUnsavedChanges(false)
    toast({
      title: "Settings Saved",
      description: "All settings have been saved successfully.",
    })
  }

  const handleReset = () => {
    resetSettings()
    setHasUnsavedChanges(false)
    toast({
      title: "Settings Reset",
      description: "All settings have been reset to default values.",
    })
  }

  const handleExportSettings = async () => {
    setIsExporting(true)
    try {
      const settingsData = {
        ...settings,
        exportedAt: new Date().toISOString(),
        version: "1.0",
      }

      const blob = new Blob([JSON.stringify(settingsData, null, 2)], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `rillcod-settings-${new Date().toISOString().split("T")[0]}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      toast({
        title: "Settings Exported",
        description: "Settings have been exported successfully.",
      })
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
  }

  const handleImportSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsImporting(true)
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const importedSettings = JSON.parse(e.target?.result as string)
        updateSettings(importedSettings)
        setHasUnsavedChanges(true)
        toast({
          title: "Settings Imported",
          description: "Settings have been imported successfully.",
        })
      } catch (error) {
        toast({
          title: "Import Failed",
          description: "Failed to import settings. Please check the file format.",
          variant: "destructive",
        })
      } finally {
        setIsImporting(false)
      }
    }
    reader.readAsText(file)
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Header */}
      <Card className="bg-gradient-to-r from-gray-50 via-slate-50 to-zinc-50 border-gray-200 shadow-lg">
        <CardHeader>
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-gray-600 to-slate-600 rounded-xl shadow-lg">
                <Settings className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl text-gray-900 flex items-center gap-2">
                  Unified System Settings
                  <Sparkles className="h-5 w-5 text-blue-500" />
                </CardTitle>
                <p className="text-gray-700 text-sm">
                  Configure system preferences, school information, and report templates
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {hasUnsavedChanges && (
                <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Unsaved Changes
                </Badge>
              )}

              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handleExportSettings} disabled={isExporting}>
                  {isExporting ? (
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-gray-600 mr-2"></div>
                  ) : (
                    <Download className="h-4 w-4 mr-2" />
                  )}
                  Export
                </Button>

                <div className="relative">
                  <Input
                    type="file"
                    accept=".json"
                    onChange={handleImportSettings}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    disabled={isImporting}
                  />
                  <Button variant="outline" size="sm" disabled={isImporting}>
                    {isImporting ? (
                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-gray-600 mr-2"></div>
                    ) : (
                      <Upload className="h-4 w-4 mr-2" />
                    )}
                    Import
                  </Button>
                </div>

                <Button onClick={handleSave} size="sm" className="bg-blue-600 hover:bg-blue-700">
                  <Save className="h-4 w-4 mr-2" />
                  Save All
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Settings Tabs */}
      <Card className="shadow-lg border-gray-100">
        <CardContent className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-3 bg-gray-50 h-auto p-2">
              <TabsTrigger value="school" className="flex items-center gap-2 py-3 px-4">
                <School className="h-4 w-4" />
                <span className="hidden sm:inline">School Info</span>
                <span className="sm:hidden">School</span>
              </TabsTrigger>
              <TabsTrigger value="instructor" className="flex items-center gap-2 py-3 px-4">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Instructor</span>
                <span className="sm:hidden">Teacher</span>
              </TabsTrigger>
              <TabsTrigger value="reports" className="flex items-center gap-2 py-3 px-4">
                <FileText className="h-4 w-4" />
                <span className="hidden sm:inline">Report Settings</span>
                <span className="sm:hidden">Reports</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="school" className="space-y-6">
              <div className="space-y-6">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
                  <School className="h-5 w-5 text-blue-600" />
                  <h3 className="text-lg font-semibold text-gray-900">School Information</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="schoolName">School Name</Label>
                    <Input
                      id="schoolName"
                      value={settings.schoolName || ""}
                      onChange={(e) => handleSettingChange("schoolName", e.target.value)}
                      placeholder="Enter school name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="schoolAddress">School Address</Label>
                    <Input
                      id="schoolAddress"
                      value={settings.schoolAddress || ""}
                      onChange={(e) => handleSettingChange("schoolAddress", e.target.value)}
                      placeholder="Enter school address"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="schoolPhone">Phone Number</Label>
                    <Input
                      id="schoolPhone"
                      value={settings.schoolPhone || ""}
                      onChange={(e) => handleSettingChange("schoolPhone", e.target.value)}
                      placeholder="Enter phone number"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="schoolEmail">Email Address</Label>
                    <Input
                      id="schoolEmail"
                      type="email"
                      value={settings.schoolEmail || ""}
                      onChange={(e) => handleSettingChange("schoolEmail", e.target.value)}
                      placeholder="Enter email address"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="academicYear">Academic Year</Label>
                    <Input
                      id="academicYear"
                      value={settings.academicYear || ""}
                      onChange={(e) => handleSettingChange("academicYear", e.target.value)}
                      placeholder="e.g., 2025-2026"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="instructor" className="space-y-6">
              <div className="space-y-6">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
                  <User className="h-5 w-5 text-green-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Instructor Information</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="instructorName">Instructor Name</Label>
                    <Input
                      id="instructorName"
                      value={settings.instructorName || ""}
                      onChange={(e) => handleSettingChange("instructorName", e.target.value)}
                      placeholder="Enter instructor name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="instructorTitle">Title/Position</Label>
                    <Input
                      id="instructorTitle"
                      value={settings.instructorTitle || ""}
                      onChange={(e) => handleSettingChange("instructorTitle", e.target.value)}
                      placeholder="e.g., Senior Programming Instructor"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="instructorEmail">Email Address</Label>
                    <Input
                      id="instructorEmail"
                      type="email"
                      value={settings.instructorEmail || ""}
                      onChange={(e) => handleSettingChange("instructorEmail", e.target.value)}
                      placeholder="Enter instructor email"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <Label>Digital Signature</Label>
                  
                  {/* File Upload Section */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            if (file.size > 2 * 1024 * 1024) { // 2MB limit
                              toast({
                                title: "File Too Large",
                                description: "Please upload an image smaller than 2MB.",
                                variant: "destructive",
                              })
                              return
                            }
                            
                            if (!file.type.startsWith('image/')) {
                              toast({
                                title: "Invalid File Type",
                                description: "Please upload an image file only.",
                                variant: "destructive",
                              })
                              return
                            }

                            // Convert to base64
                            const reader = new FileReader()
                            reader.onload = (event) => {
                              const base64 = event.target?.result as string
                              handleSettingChange("digitalSignature", base64)
                              toast({
                                title: "Signature Uploaded",
                                description: "Digital signature has been uploaded successfully.",
                              })
                            }
                            reader.readAsDataURL(file)
                          }
                        }}
                        className="flex-1"
                      />
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          const input = document.querySelector('input[type="file"]') as HTMLInputElement
                          input?.click()
                        }}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Browse
                      </Button>
                    </div>
                    <p className="text-xs text-gray-600">
                      Upload a signature image (PNG, JPG, max 2MB) or paste a URL below
                    </p>
                  </div>

                  {/* URL Input Section */}
                  <div className="space-y-2">
                    <Label htmlFor="digitalSignature">Or paste signature URL</Label>
                    <Input
                      id="digitalSignature"
                      value={settings.digitalSignature && settings.digitalSignature.startsWith('data:') ? '' : settings.digitalSignature || ""}
                      onChange={(e) => handleSettingChange("digitalSignature", e.target.value)}
                      placeholder="https://example.com/signature.png"
                    />
                  </div>

                  {/* Preview Section */}
                  {settings.digitalSignature && (
                    <div className="space-y-2">
                      <Label>Preview</Label>
                      <div className="border rounded-lg p-4 bg-gray-50">
                        <img
                          src={settings.digitalSignature}
                          alt="Digital Signature Preview"
                          className="max-h-20 max-w-40 object-contain"
                          onError={(e) => {
                            const target = e.currentTarget as HTMLImageElement
                            target.style.display = "none"
                            const parent = target.parentElement
                            if (parent && !parent.querySelector('.error-message')) {
                              const error = document.createElement("div")
                              error.className = "error-message text-red-500 text-sm"
                              error.textContent = "Failed to load signature image"
                              parent.appendChild(error)
                            }
                          }}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            handleSettingChange("digitalSignature", "")
                            toast({
                              title: "Signature Removed",
                              description: "Digital signature has been cleared.",
                            })
                          }}
                          className="mt-2"
                        >
                          Remove Signature
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="reports" className="space-y-6">
              <div className="space-y-6">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
                  <FileText className="h-5 w-5 text-green-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Report Settings</h3>
                </div>

                <div className="space-y-6">
                  {/* Essential Report Options */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">Report Generation</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <Label htmlFor="autoSave" className="font-medium">
                            Auto-Save Reports
                          </Label>
                          <p className="text-sm text-gray-600">Automatically save form data while typing</p>
                        </div>
                        <Switch
                          id="autoSave"
                          checked={settings.autoSave !== false}
                          onCheckedChange={(checked) => handleSettingChange("autoSave", checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <Label htmlFor="autoGeneratePDF" className="font-medium">
                            Auto-Generate PDF
                          </Label>
                          <p className="text-sm text-gray-600">Automatically create PDF versions</p>
                        </div>
                        <Switch
                          id="autoGeneratePDF"
                          checked={settings.autoGeneratePDF !== false}
                          onCheckedChange={(checked) => handleSettingChange("autoGeneratePDF", checked)}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Report Template Selection */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">Report Template</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="reportTemplate">Default Template</Label>
                        <Select
                          value={settings.reportTemplate || "standard"}
                          onValueChange={(value) => handleSettingChange("reportTemplate", value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="minimal">Minimal Template</SelectItem>
                            <SelectItem value="standard">Standard Template</SelectItem>
                            <SelectItem value="professional">Professional Template</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="logoUrl">School Logo URL (Optional)</Label>
                        <Input
                          id="logoUrl"
                          value={settings.logoUrl || ""}
                          onChange={(e) => handleSettingChange("logoUrl", e.target.value)}
                          placeholder="URL to your school logo"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Payment Information */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900 flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-amber-600" />
                      Payment Information
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="nextTermFee">Next Term Fee</Label>
                        <Input
                          id="nextTermFee"
                          value={settings.nextTermFee || ""}
                          onChange={(e) => handleSettingChange("nextTermFee", e.target.value)}
                          placeholder="e.g., ₦15,000"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="bankDetails">Bank Details</Label>
                        <Input
                          id="bankDetails"
                          value={settings.bankDetails || ""}
                          onChange={(e) => handleSettingChange("bankDetails", e.target.value)}
                          placeholder="e.g., PROVIDUS | ACCOUNT NUMBER: 7901178957"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Report Display Features */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900 flex items-center gap-2">
                      <Eye className="h-4 w-4 text-purple-600" />
                      Report Display Features
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-violet-50 rounded-lg border border-purple-200">
                        <div>
                          <Label htmlFor="showWatermark" className="font-medium text-purple-800">
                            Show Watermark
                          </Label>
                          <p className="text-sm text-purple-700">Display school logo as background watermark</p>
                        </div>
                        <Switch
                          id="showWatermark"
                          checked={settings.showWatermark !== false}
                          onCheckedChange={(checked) => handleSettingChange("showWatermark", checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between p-3 bg-gradient-to-r from-cyan-50 to-teal-50 rounded-lg border border-cyan-200">
                        <div>
                          <Label htmlFor="showQRCode" className="font-medium text-cyan-800">
                            Show QR Code
                          </Label>
                          <p className="text-sm text-cyan-700">Generate verification QR code on certificates</p>
                        </div>
                        <Switch
                          id="showQRCode"
                          checked={settings.showQRCode !== false}
                          onCheckedChange={(checked) => handleSettingChange("showQRCode", checked)}
                        />
                      </div>
                    </div>
                  </div>

                  {/* AI Features */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900 flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-blue-600" />
                      AI-Powered Features
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                        <div>
                          <Label htmlFor="aiAssistant" className="font-medium text-blue-800">
                            AI Content Generation
                          </Label>
                          <p className="text-sm text-blue-700">Enable AI-powered content suggestions</p>
                        </div>
                        <Switch
                          id="aiAssistant"
                          checked={settings.aiAssistant !== false}
                          onCheckedChange={(checked) => handleSettingChange("aiAssistant", checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                        <div>
                          <Label htmlFor="smartSuggestions" className="font-medium text-green-800">
                            Smart Suggestions
                          </Label>
                          <p className="text-sm text-green-700">Course-specific content recommendations</p>
                        </div>
                        <Switch
                          id="smartSuggestions"
                          checked={settings.aiAssistant !== false}
                          onCheckedChange={(checked) => handleSettingChange("aiAssistant", checked)}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Export/Import Settings */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900 flex items-center gap-2">
                      <Database className="h-4 w-4" />
                      Data Management
                    </h4>
                    <div className="flex flex-wrap gap-3">
                      <Button
                        variant="outline"
                        onClick={handleExportSettings}
                        disabled={isExporting}
                        className="border-blue-200 text-blue-700 hover:bg-blue-50"
                      >
                        {isExporting ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                        ) : (
                          <Download className="h-4 w-4 mr-2" />
                        )}
                        Export Settings
                      </Button>
                      
                      <div className="relative">
                        <input
                          type="file"
                          accept=".json"
                          onChange={handleImportSettings}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          disabled={isImporting}
                          title="Import settings from JSON file"
                          aria-label="Import settings from JSON file"
                        />
                        <Button
                          variant="outline"
                          disabled={isImporting}
                          className="border-green-200 text-green-700 hover:bg-green-50"
                        >
                          {isImporting ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600 mr-2"></div>
                          ) : (
                            <Upload className="h-4 w-4 mr-2" />
                          )}
                          Import Settings
                        </Button>
                      </div>

                      <Button
                        variant="outline"
                        onClick={handleReset}
                        className="border-red-200 text-red-700 hover:bg-red-50"
                      >
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Reset to Defaults
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Save Changes Footer */}
      {hasUnsavedChanges && (
        <Card className="bg-yellow-50 border-yellow-200 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-yellow-800">
                <AlertCircle className="h-5 w-5" />
                <span className="font-medium">You have unsaved changes</span>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={() => setHasUnsavedChanges(false)}>
                  Discard
                </Button>
                <Button onClick={handleSave} className="bg-yellow-600 hover:bg-yellow-700">
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
