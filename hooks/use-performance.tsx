"use client"

import { useCallback, useRef, useState } from "react"

export function usePerformance() {
  const [isOptimizing, setIsOptimizing] = useState(false)
  const performanceCache = useRef(new Map())
  const debounceTimers = useRef(new Map())

  // Debounce function for performance optimization
  const debounce = useCallback((key: string, func: Function, delay = 300) => {
    if (debounceTimers.current.has(key)) {
      clearTimeout(debounceTimers.current.get(key))
    }

    const timer = setTimeout(() => {
      func()
      debounceTimers.current.delete(key)
    }, delay)

    debounceTimers.current.set(key, timer)
  }, [])

  // Cache expensive operations
  const memoize = useCallback((key: string, computation: () => any) => {
    if (performanceCache.current.has(key)) {
      return performanceCache.current.get(key)
    }

    const result = computation()
    performanceCache.current.set(key, result)
    return result
  }, [])

  // Clear cache when needed
  const clearCache = useCallback((key?: string) => {
    if (key) {
      performanceCache.current.delete(key)
    } else {
      performanceCache.current.clear()
    }
  }, [])

  // Optimize heavy operations
  const optimizeOperation = useCallback(async (operation: () => Promise<any>) => {
    setIsOptimizing(true)
    try {
      const result = await operation()
      return result
    } finally {
      setIsOptimizing(false)
    }
  }, [])

  return {
    debounce,
    memoize,
    clearCache,
    optimizeOperation,
    isOptimizing,
  }
}
