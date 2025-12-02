"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface AdvancedFeatures {
  // Performance Features
  enableLazyLoading: boolean
  enableVirtualization: boolean
  enableCaching: boolean
  enableCompression: boolean

  // UI/UX Features
  enableAnimations: boolean
  enableSoundEffects: boolean
  enableHapticFeedback: boolean
  enableDarkMode: boolean
  enableHighContrast: boolean

  // Productivity Features
  enableKeyboardShortcuts: boolean
  enableAutoComplete: boolean
  enableSmartSuggestions: boolean
  enableBulkOperations: boolean
  enableQuickActions: boolean

  // AI Features
  enableAIAssistant: boolean
  enableVoiceInput: boolean
  enableAutoTranslation: boolean
  enableSentimentAnalysis: boolean
  enableContentGeneration: boolean

  // Collaboration Features
  enableRealTimeSync: boolean
  enableComments: boolean
  enableVersionHistory: boolean
  enableShareLinks: boolean
  enableTeamWorkspaces: boolean

  // Security Features
  enableEncryption: boolean
  enableTwoFactorAuth: boolean
  enableAuditLogs: boolean
  enablePermissions: boolean
  enableBackupRecovery: boolean

  // Analytics Features
  enableUsageTracking: boolean
  enablePerformanceMonitoring: boolean
  enableErrorReporting: boolean
  enableA11yTesting: boolean
  enableSEOOptimization: boolean
}

interface AdvancedFeaturesContextType {
  features: AdvancedFeatures
  updateFeature: (feature: keyof AdvancedFeatures, enabled: boolean) => void
  resetFeatures: () => void
  exportFeatures: () => string
  importFeatures: (featuresJson: string) => boolean
}

const defaultFeatures: AdvancedFeatures = {
  // Performance Features
  enableLazyLoading: true,
  enableVirtualization: false,
  enableCaching: true,
  enableCompression: true,

  // UI/UX Features
  enableAnimations: true,
  enableSoundEffects: false,
  enableHapticFeedback: false,
  enableDarkMode: true,
  enableHighContrast: false,

  // Productivity Features
  enableKeyboardShortcuts: true,
  enableAutoComplete: true,
  enableSmartSuggestions: true,
  enableBulkOperations: true,
  enableQuickActions: true,

  // AI Features
  enableAIAssistant: true,
  enableVoiceInput: true,
  enableAutoTranslation: false,
  enableSentimentAnalysis: false,
  enableContentGeneration: true,

  // Collaboration Features
  enableRealTimeSync: false,
  enableComments: false,
  enableVersionHistory: true,
  enableShareLinks: true,
  enableTeamWorkspaces: false,

  // Security Features
  enableEncryption: true,
  enableTwoFactorAuth: false,
  enableAuditLogs: true,
  enablePermissions: true,
  enableBackupRecovery: true,

  // Analytics Features
  enableUsageTracking: true,
  enablePerformanceMonitoring: true,
  enableErrorReporting: true,
  enableA11yTesting: false,
  enableSEOOptimization: false,
}

const AdvancedFeaturesContext = createContext<AdvancedFeaturesContextType>({
  features: defaultFeatures,
  updateFeature: () => {},
  resetFeatures: () => {},
  exportFeatures: () => "",
  importFeatures: () => false,
})

export function AdvancedFeaturesProvider({ children }: { children: ReactNode }) {
  const [features, setFeatures] = useState<AdvancedFeatures>(defaultFeatures)

  // Load features from localStorage on mount
  useEffect(() => {
    const savedFeatures = localStorage.getItem("advancedFeatures")
    if (savedFeatures) {
      try {
        const parsed = JSON.parse(savedFeatures)
        setFeatures({ ...defaultFeatures, ...parsed })
      } catch (error) {
        console.error("Failed to parse saved features:", error)
      }
    }
  }, [])

  // Save features to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("advancedFeatures", JSON.stringify(features))
  }, [features])

  const updateFeature = (feature: keyof AdvancedFeatures, enabled: boolean) => {
    setFeatures((prev) => ({
      ...prev,
      [feature]: enabled,
    }))
  }

  const resetFeatures = () => {
    setFeatures(defaultFeatures)
  }

  const exportFeatures = () => {
    return JSON.stringify(features, null, 2)
  }

  const importFeatures = (featuresJson: string): boolean => {
    try {
      const parsed = JSON.parse(featuresJson)
      setFeatures({ ...defaultFeatures, ...parsed })
      return true
    } catch (error) {
      console.error("Failed to import features:", error)
      return false
    }
  }

  return (
    <AdvancedFeaturesContext.Provider
      value={{
        features,
        updateFeature,
        resetFeatures,
        exportFeatures,
        importFeatures,
      }}
    >
      {children}
    </AdvancedFeaturesContext.Provider>
  )
}

export function useAdvancedFeatures() {
  return useContext(AdvancedFeaturesContext)
}
