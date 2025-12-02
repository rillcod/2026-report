"use client"

import { useState, useMemo, useCallback } from "react"

interface SearchFilterOptions {
  searchFields: string[]
  filterFields: Record<string, any[]>
  sortFields: string[]
}

export function useSearchFilter<T>(data: T[], options: SearchFilterOptions) {
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState<Record<string, any>>({})
  const [sortBy, setSortBy] = useState<string>("")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")

  // Filter and search data
  const filteredData = useMemo(() => {
    let result = [...data]

    // Apply search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result.filter((item) =>
        options.searchFields.some((field) => {
          const value = (item as any)[field]
          return value && String(value).toLowerCase().includes(query)
        }),
      )
    }

    // Apply filters
    Object.entries(filters).forEach(([field, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        result = result.filter((item) => {
          const itemValue = (item as any)[field]
          if (Array.isArray(value)) {
            return value.includes(itemValue)
          }
          return itemValue === value
        })
      }
    })

    // Apply sorting
    if (sortBy) {
      result.sort((a, b) => {
        const aValue = (a as any)[sortBy]
        const bValue = (b as any)[sortBy]

        let comparison = 0
        if (aValue < bValue) comparison = -1
        if (aValue > bValue) comparison = 1

        return sortOrder === "desc" ? -comparison : comparison
      })
    }

    return result
  }, [data, searchQuery, filters, sortBy, sortOrder, options.searchFields])

  // Update filter
  const updateFilter = useCallback((field: string, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }))
  }, [])

  // Clear all filters
  const clearFilters = useCallback(() => {
    setSearchQuery("")
    setFilters({})
    setSortBy("")
    setSortOrder("asc")
  }, [])

  // Get filter statistics
  const getFilterStats = useCallback(() => {
    const stats = {
      total: data.length,
      filtered: filteredData.length,
      searchActive: searchQuery.trim().length > 0,
      filtersActive: Object.keys(filters).length > 0,
      sortActive: sortBy.length > 0,
    }
    return stats
  }, [data.length, filteredData.length, searchQuery, filters, sortBy])

  return {
    searchQuery,
    setSearchQuery,
    filters,
    updateFilter,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    filteredData,
    clearFilters,
    getFilterStats,
  }
}
