"use client"

import { useState, useCallback, useRef } from "react"

export function useUndoRedo<T>(initialState: T, setState: (state: T) => void, maxHistory = 50) {
  const [history, setHistory] = useState<T[]>([initialState])
  const [currentIndex, setCurrentIndex] = useState(0)
  const isUndoRedoRef = useRef(false)

  const saveState = useCallback(
    (state?: T) => {
      if (isUndoRedoRef.current) return

      const newState = state || initialState
      setHistory((prev) => {
        const newHistory = prev.slice(0, currentIndex + 1)
        newHistory.push(newState)

        // Limit history size
        if (newHistory.length > maxHistory) {
          newHistory.shift()
          return newHistory
        }

        return newHistory
      })
      setCurrentIndex((prev) => Math.min(prev + 1, maxHistory - 1))
    },
    [currentIndex, initialState, maxHistory],
  )

  const undo = useCallback(() => {
    if (currentIndex > 0) {
      isUndoRedoRef.current = true
      const newIndex = currentIndex - 1
      setCurrentIndex(newIndex)
      setState(history[newIndex])
      setTimeout(() => {
        isUndoRedoRef.current = false
      }, 0)
    }
  }, [currentIndex, history, setState])

  const redo = useCallback(() => {
    if (currentIndex < history.length - 1) {
      isUndoRedoRef.current = true
      const newIndex = currentIndex + 1
      setCurrentIndex(newIndex)
      setState(history[newIndex])
      setTimeout(() => {
        isUndoRedoRef.current = false
      }, 0)
    }
  }, [currentIndex, history, setState])

  const canUndo = currentIndex > 0
  const canRedo = currentIndex < history.length - 1

  return {
    undo,
    redo,
    canUndo,
    canRedo,
    saveState,
    historyLength: history.length,
    currentIndex,
  }
}
