"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface Settings {
  // Course Settings
  courseName: string
  currentModule: string
  nextModule: string
  instructorName: string
  duration: string
  nextTermFee: string
  bankDetails: string
  digitalSignature: string | null
  
  // School Settings
  schoolName?: string
  schoolAddress?: string
  schoolPhone?: string
  schoolEmail?: string
  schoolWebsite?: string
  academicYear?: string
  schoolMotto?: string
  
  // Instructor Settings
  instructorTitle?: string
  instructorEmail?: string
  instructorPhone?: string
  instructorBio?: string
  
  // Course Details
  courseCode?: string
  totalHours?: string
  courseDescription?: string
  
  // Appearance Settings
  primaryColor?: string
  secondaryColor?: string
  logoUrl?: string
  reportTemplate?: string
  
  // Feature Toggles
  showWatermark?: boolean
  showQRCode?: boolean
  enableHDReports?: boolean
  autoGeneratePDF?: boolean
  
  // System Settings
  autoSave?: boolean
  dataBackup?: boolean
  requireAuth?: boolean
  encryptData?: boolean
  
  // Notification Settings
  emailNotifications?: boolean
  systemAlerts?: boolean
  
  // AI Settings
  aiAssistant?: boolean
  advancedAnalytics?: boolean
}

interface SettingsContextType {
  settings: Settings
  updateSettings: (newSettings: Partial<Settings>) => boolean
  resetSettings: () => void
}

const defaultSettings: Settings = {
  courseName: "Python Programming Fundamentals",
  currentModule: "Variables to Conditionals",
  nextModule: "Loops (while/for) and Functions",
  instructorName: "Rillcod Technologies",
  duration: "Termly",
  nextTermFee: "₦15,000",
  bankDetails: "PROVIDUS | ACCOUNT NUMBER: 7901178957",
  digitalSignature: null,
  showWatermark: true,
  showQRCode: true,
}

const SettingsContext = createContext<SettingsContextType>({
  settings: defaultSettings,
  updateSettings: () => false,
  resetSettings: () => {},
})

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(defaultSettings)

  // Load settings from localStorage on component mount
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem("rillcodReportSettings")
      if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings)
        // Validate settings structure
        if (parsedSettings && typeof parsedSettings === 'object') {
          setSettings({ ...defaultSettings, ...parsedSettings })
        }
      }
    } catch (error) {
      console.error("Failed to load settings from localStorage:", error)
      // Reset to default settings if parsing fails
      setSettings(defaultSettings)
      localStorage.removeItem("rillcodReportSettings")
    }
  }, [])

  const updateSettings = (newSettings: Partial<Settings>) => {
    try {
      // Merge new settings with current settings
      const updatedSettings = { ...settings, ...newSettings }

      // Validate required fields
      if (!updatedSettings.courseName || !updatedSettings.instructorName) {
        console.error("Missing required settings fields")
        return false
      }

      // Update state
      setSettings(updatedSettings)

      // Save to localStorage
      localStorage.setItem("rillcodReportSettings", JSON.stringify(updatedSettings))

      // Settings saved to localStorage successfully
      return true
    } catch (error) {
      console.error("Failed to update settings:", error)
      return false
    }
  }

  const resetSettings = () => {
    try {
      setSettings(defaultSettings)
      localStorage.setItem("rillcodReportSettings", JSON.stringify(defaultSettings))
      // Settings reset to defaults
    } catch (error) {
      console.error("Failed to reset settings:", error)
    }
  }

  return <SettingsContext.Provider value={{ settings, updateSettings, resetSettings }}>{children}</SettingsContext.Provider>
}

export function useSettings() {
  return useContext(SettingsContext)
}
