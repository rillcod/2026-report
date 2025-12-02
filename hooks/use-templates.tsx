"use client"

import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"

interface Template {
  id: string
  name: string
  description: string
  data: any
  createdAt: Date
  updatedAt: Date
}

export function useTemplates() {
  const { toast } = useToast()
  const [templates, setTemplates] = useState<Template[]>([])

  useEffect(() => {
    loadTemplates()
  }, [])

  const loadTemplates = () => {
    try {
      const saved = localStorage.getItem("report_templates")
      if (saved) {
        const parsed = JSON.parse(saved)
        setTemplates(
          parsed.map((t: any) => ({
            ...t,
            createdAt: new Date(t.createdAt),
            updatedAt: new Date(t.updatedAt),
          })),
        )
      }
    } catch (error) {
      console.error("Failed to load templates:", error)
    }
  }

  const saveTemplate = (name: string, description: string, data: any) => {
    try {
      const template: Template = {
        id: Date.now().toString(),
        name,
        description,
        data,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      const updatedTemplates = [...templates, template]
      setTemplates(updatedTemplates)
      localStorage.setItem("report_templates", JSON.stringify(updatedTemplates))

      toast({
        title: "Template Saved",
        description: `Template "${name}" has been saved successfully.`,
      })

      return template.id
    } catch (error) {
      console.error("Failed to save template:", error)
      toast({
        title: "Save Failed",
        description: "Failed to save template. Please try again.",
        variant: "destructive",
      })
      return null
    }
  }

  const loadTemplate = (id: string) => {
    const template = templates.find((t) => t.id === id)
    if (template) {
      toast({
        title: "Template Loaded",
        description: `Template "${template.name}" has been loaded.`,
      })
      return template.data
    }
    return null
  }

  const deleteTemplate = (id: string) => {
    try {
      const updatedTemplates = templates.filter((t) => t.id !== id)
      setTemplates(updatedTemplates)
      localStorage.setItem("report_templates", JSON.stringify(updatedTemplates))

      toast({
        title: "Template Deleted",
        description: "Template has been deleted successfully.",
      })
    } catch (error) {
      console.error("Failed to delete template:", error)
      toast({
        title: "Delete Failed",
        description: "Failed to delete template. Please try again.",
        variant: "destructive",
      })
    }
  }

  const updateTemplate = (id: string, updates: Partial<Template>) => {
    try {
      const updatedTemplates = templates.map((t) => (t.id === id ? { ...t, ...updates, updatedAt: new Date() } : t))
      setTemplates(updatedTemplates)
      localStorage.setItem("report_templates", JSON.stringify(updatedTemplates))

      toast({
        title: "Template Updated",
        description: "Template has been updated successfully.",
      })
    } catch (error) {
      console.error("Failed to update template:", error)
      toast({
        title: "Update Failed",
        description: "Failed to update template. Please try again.",
        variant: "destructive",
      })
    }
  }

  return {
    templates,
    saveTemplate,
    loadTemplate,
    deleteTemplate,
    updateTemplate,
    refreshTemplates: loadTemplates,
  }
}
