"use client"

import { useEffect, useRef, useState } from "react"
import { useToast } from "@/hooks/use-toast"

export function useAutoSave(data: any, key: string, interval = 30000) {
  const { toast } = useToast()
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [isAutoSaving, setIsAutoSaving] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout>()
  const lastDataRef = useRef<string>("")

  const saveData = async () => {
    try {
      setIsAutoSaving(true)
      const dataString = JSON.stringify(data)

      // Only save if data has changed
      if (dataString !== lastDataRef.current) {
        localStorage.setItem(`autosave_${key}`, dataString)
        lastDataRef.current = dataString
        setLastSaved(new Date())
      }
    } catch (error) {
      console.error("Auto-save failed:", error)
      toast({
        title: "Auto-save Failed",
        description: "Failed to save your progress automatically.",
        variant: "destructive",
      })
    } finally {
      setIsAutoSaving(false)
    }
  }

  const loadData = () => {
    try {
      const saved = localStorage.getItem(`autosave_${key}`)
      if (saved) {
        return JSON.parse(saved)
      }
    } catch (error) {
      console.error("Failed to load auto-saved data:", error)
    }
    return null
  }

  useEffect(() => {
    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    // Set new timeout for auto-save
    timeoutRef.current = setTimeout(() => {
      saveData()
    }, interval)

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [data, interval])

  return {
    saveData,
    loadData,
    lastSaved,
    isAutoSaving,
  }
}
