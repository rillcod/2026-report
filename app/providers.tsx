"use client"

import type React from "react"

import { ThemeProvider } from "next-themes"
import { useState, useEffect } from "react"
import { Toaster } from "@/components/ui/toaster"
import { SavedReportsProvider } from "@/hooks/use-saved-reports"

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
      <SavedReportsProvider>
        {children}
        <Toaster />
      </SavedReportsProvider>
    </ThemeProvider>
  )
}
