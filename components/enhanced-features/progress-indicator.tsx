"use client"

import { useEffect, useState } from "react"

interface ProgressIndicatorProps {
  current: number
  total: number
  label?: string
  showPercentage?: boolean
  color?: string
}

export function ProgressIndicator({
  current,
  total,
  label,
  showPercentage = true,
  color = "bg-blue-500",
}: ProgressIndicatorProps) {
  const [animatedProgress, setAnimatedProgress] = useState(0)
  const percentage = Math.min((current / total) * 100, 100)

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedProgress(percentage)
    }, 100)

    return () => clearTimeout(timer)
  }, [percentage])

  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
          {showPercentage && (
            <span className="text-sm text-gray-500 dark:text-gray-400">{Math.round(percentage)}%</span>
          )}
        </div>
      )}
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-500 ease-out ${color}`}
          style={{ width: `${animatedProgress}%` }}
        />
      </div>
      <div className="flex justify-between items-center mt-1">
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {current} of {total}
        </span>
      </div>
    </div>
  )
}
