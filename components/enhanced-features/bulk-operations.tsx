"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { ProgressIndicator } from "./progress-indicator"
import { Edit, Trash2, Download, Copy, Archive } from "lucide-react"

interface BulkOperationsProps {
  selectedItems: any[]
  onUpdate: (updates: any) => void
  onDelete: (items: any[]) => void
  onExport: (items: any[]) => void
  onDuplicate: (items: any[]) => void
}

export function BulkOperations({ selectedItems, onUpdate, onDelete, onExport, onDuplicate }: BulkOperationsProps) {
  const { toast } = useToast()
  const [operation, setOperation] = useState<string>("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [bulkUpdateData, setBulkUpdateData] = useState({
    schoolName: "",
    studentSection: "",
    attendance: "",
    participation: "",
    projectCompletion: "",
    homeworkCompletion: "",
  })

  const handleBulkOperation = async () => {
    if (selectedItems.length === 0) {
      toast({
        title: "No Selection",
        description: "Please select items to perform bulk operations.",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)
    setProgress(0)

    try {
      switch (operation) {
        case "update":
          await performBulkUpdate()
          break
        case "delete":
          await performBulkDelete()
          break
        case "export":
          await performBulkExport()
          break
        case "duplicate":
          await performBulkDuplicate()
          break
        case "archive":
          await performBulkArchive()
          break
        default:
          throw new Error("Please select an operation")
      }

      toast({
        title: "Operation Completed",
        description: `Successfully processed ${selectedItems.length} items.`,
      })
    } catch (error) {
      console.error("Bulk operation failed:", error)
      toast({
        title: "Operation Failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
      setProgress(0)
    }
  }

  const performBulkUpdate = async () => {
    const updates = Object.entries(bulkUpdateData)
      .filter(([_, value]) => value.trim() !== "")
      .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {})

    if (Object.keys(updates).length === 0) {
      throw new Error("Please specify fields to update")
    }

    for (let i = 0; i < selectedItems.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 100)) // Simulate processing time
      setProgress(((i + 1) / selectedItems.length) * 100)
    }

    onUpdate(updates)
  }

  const performBulkDelete = async () => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${selectedItems.length} items? This action cannot be undone.`,
    )

    if (!confirmed) {
      throw new Error("Operation cancelled")
    }

    for (let i = 0; i < selectedItems.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 50))
      setProgress(((i + 1) / selectedItems.length) * 100)
    }

    onDelete(selectedItems)
  }

  const performBulkExport = async () => {
    for (let i = 0; i < selectedItems.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 100))
      setProgress(((i + 1) / selectedItems.length) * 100)
    }

    onExport(selectedItems)
  }

  const performBulkDuplicate = async () => {
    for (let i = 0; i < selectedItems.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 100))
      setProgress(((i + 1) / selectedItems.length) * 100)
    }

    onDuplicate(selectedItems)
  }

  const performBulkArchive = async () => {
    for (let i = 0; i < selectedItems.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 100))
      setProgress(((i + 1) / selectedItems.length) * 100)
    }

    // Archive logic would go here
    toast({
      title: "Items Archived",
      description: `${selectedItems.length} items have been archived.`,
    })
  }

  return (
    <Card className="p-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Bulk Operations</h3>
          <span className="text-sm text-gray-500">
            {selectedItems.length} item{selectedItems.length !== 1 ? "s" : ""} selected
          </span>
        </div>

        {isProcessing && <ProgressIndicator current={progress} total={100} label="Processing..." color="bg-blue-500" />}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="operation">Select Operation:</Label>
            <Select value={operation} onValueChange={setOperation}>
              <SelectTrigger>
                <SelectValue placeholder="Choose operation" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="update">
                  <div className="flex items-center">
                    <Edit className="h-4 w-4 mr-2" />
                    Bulk Update
                  </div>
                </SelectItem>
                <SelectItem value="delete">
                  <div className="flex items-center">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Bulk Delete
                  </div>
                </SelectItem>
                <SelectItem value="export">
                  <div className="flex items-center">
                    <Download className="h-4 w-4 mr-2" />
                    Bulk Export
                  </div>
                </SelectItem>
                <SelectItem value="duplicate">
                  <div className="flex items-center">
                    <Copy className="h-4 w-4 mr-2" />
                    Bulk Duplicate
                  </div>
                </SelectItem>
                <SelectItem value="archive">
                  <div className="flex items-center">
                    <Archive className="h-4 w-4 mr-2" />
                    Bulk Archive
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-end">
            <Button
              onClick={handleBulkOperation}
              disabled={!operation || selectedItems.length === 0 || isProcessing}
              className="w-full"
            >
              {isProcessing ? "Processing..." : "Execute Operation"}
            </Button>
          </div>
        </div>

        {operation === "update" && (
          <div className="border-t pt-4">
            <h4 className="font-medium mb-3">Update Fields (leave blank to skip):</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <Label htmlFor="bulkSchoolName">School Name:</Label>
                <Input
                  id="bulkSchoolName"
                  value={bulkUpdateData.schoolName}
                  onChange={(e) => setBulkUpdateData((prev) => ({ ...prev, schoolName: e.target.value }))}
                  placeholder="New school name"
                />
              </div>
              <div>
                <Label htmlFor="bulkStudentSection">Section/Class:</Label>
                <Input
                  id="bulkStudentSection"
                  value={bulkUpdateData.studentSection}
                  onChange={(e) => setBulkUpdateData((prev) => ({ ...prev, studentSection: e.target.value }))}
                  placeholder="New section/class"
                />
              </div>
              <div>
                <Label htmlFor="bulkAttendance">Attendance:</Label>
                <Input
                  id="bulkAttendance"
                  type="number"
                  min="0"
                  max="100"
                  value={bulkUpdateData.attendance}
                  onChange={(e) => setBulkUpdateData((prev) => ({ ...prev, attendance: e.target.value }))}
                  placeholder="New attendance %"
                />
              </div>
              <div>
                <Label htmlFor="bulkParticipation">Participation:</Label>
                <Select
                  value={bulkUpdateData.participation}
                  onValueChange={(value) => setBulkUpdateData((prev) => ({ ...prev, participation: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select participation level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="no_change">No change</SelectItem>
                    <SelectItem value="Excellent">Excellent</SelectItem>
                    <SelectItem value="Very Good">Very Good</SelectItem>
                    <SelectItem value="Good">Good</SelectItem>
                    <SelectItem value="Fair">Fair</SelectItem>
                    <SelectItem value="Needs Improvement">Needs Improvement</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}

        {operation === "delete" && (
          <div className="border-t pt-4">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
              <div className="flex items-center">
                <Trash2 className="h-5 w-5 text-red-500 mr-2" />
                <div>
                  <h4 className="font-medium text-red-800 dark:text-red-200">Warning: Permanent Deletion</h4>
                  <p className="text-sm text-red-600 dark:text-red-300">
                    This will permanently delete {selectedItems.length} selected items. This action cannot be undone.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {operation === "export" && (
          <div className="border-t pt-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
              <div className="flex items-center">
                <Download className="h-5 w-5 text-blue-500 mr-2" />
                <div>
                  <h4 className="font-medium text-blue-800 dark:text-blue-200">Export Selected Items</h4>
                  <p className="text-sm text-blue-600 dark:text-blue-300">
                    This will export {selectedItems.length} selected items to your preferred format.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
