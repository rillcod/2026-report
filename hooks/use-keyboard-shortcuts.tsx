"use client"

import { useEffect } from "react"

interface KeyboardShortcuts {
  [key: string]: () => void
}

export function useKeyboardShortcuts(shortcuts: KeyboardShortcuts) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = []

      if (event.ctrlKey) key.push("ctrl")
      if (event.shiftKey) key.push("shift")
      if (event.altKey) key.push("alt")
      if (event.metaKey) key.push("meta")

      key.push(event.key.toLowerCase())

      const shortcut = key.join("+")

      if (shortcuts[shortcut]) {
        event.preventDefault()
        shortcuts[shortcut]()
      }
    }

    document.addEventListener("keydown", handleKeyDown)

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [shortcuts])
}
