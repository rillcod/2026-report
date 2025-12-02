"use client"

import React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg"
  text?: string
  className?: string
}

export function LoadingSpinner({ size = "md", text, className = "" }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6", 
    lg: "h-8 w-8"
  }

  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      <Loader2 className={`${sizeClasses[size]} animate-spin text-blue-600`} />
      {text && <span className="text-sm text-gray-600 dark:text-gray-400">{text}</span>}
    </div>
  )
}

interface LoadingCardProps {
  title?: string
  description?: string
  className?: string
}

export function LoadingCard({ title = "Loading...", description, className = "" }: LoadingCardProps) {
  return (
    <Card className={`w-full ${className}`}>
      <CardContent className="flex flex-col items-center justify-center py-8">
        <LoadingSpinner size="lg" />
        <h3 className="mt-4 font-medium text-gray-900 dark:text-white">{title}</h3>
        {description && (
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 text-center">{description}</p>
        )}
      </CardContent>
    </Card>
  )
}

interface LoadingOverlayProps {
  isVisible: boolean
  text?: string
  className?: string
}

export function LoadingOverlay({ isVisible, text = "Loading...", className = "" }: LoadingOverlayProps) {
  if (!isVisible) return null

  return (
    <div className={`absolute inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm flex items-center justify-center z-50 ${className}`}>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
        <LoadingSpinner size="lg" text={text} />
      </div>
    </div>
  )
}

// Skeleton components for better loading states
export function SkeletonLine({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded h-4 ${className}`} />
}

export function SkeletonCard({ className = "" }: { className?: string }) {
  return (
    <Card className={className}>
      <CardContent className="p-6 space-y-4">
        <SkeletonLine className="h-6 w-3/4" />
        <SkeletonLine className="h-4 w-full" />
        <SkeletonLine className="h-4 w-2/3" />
        <div className="flex gap-2 pt-2">
          <SkeletonLine className="h-8 w-20" />
          <SkeletonLine className="h-8 w-16" />
        </div>
      </CardContent>
    </Card>
  )
}
