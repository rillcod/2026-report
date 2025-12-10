"use client"

import type React from "react"

import { ThemeProvider } from "next-themes"
import { useState, useEffect } from "react"
import { Toaster } from "@/components/ui/toaster"
import { SavedReportsProvider } from "@/hooks/use-saved-reports"
import { SettingsProvider } from "@/hooks/use-settings"

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={true}>
      <SettingsProvider>
        <SavedReportsProvider>
          {children}
          <Toaster />
        </SavedReportsProvider>
      </SettingsProvider>
    </ThemeProvider>
  )
}
