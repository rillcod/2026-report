import type React from "react"
// Make sure the use-toast.ts file is properly set up
import type { ToastActionElement, ToastProps } from "@/components/ui/toast"
import { useToast as useToastOriginal, toast as toastOriginal } from "@/components/ui/use-toast"

export type ToasterToast = ToastProps & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
}

// Re-export the hook and function from the UI library
export const useToast = useToastOriginal
export const toast = toastOriginal
