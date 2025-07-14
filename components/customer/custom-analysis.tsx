"use client"

import { useState } from "react"

interface CustomAnalysisProps {
  dateRange: { from: Date; to: Date }
  onDateRangeChange: (range: { from: Date; to: Date }) => void
}

export default function CustomAnalysis({ dateRange }: CustomAnalysisProps) {
  const [analysisName, setAnalysisName] = useState("")
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(["total_amount", "transaction_count"])
  const [groupByFields, setGroupByFields] = useState<string[]>(["category"])
  const [filters, setFilters] = useState<any[]>([])
  const [customQuery, setCustomQuery] = useState("")
  const [results, setResults] = useState<any>(null)
  const [isRunning, setIsRunning] = useState(false)
  const [savedAnalyses, setSavedAnalyses] = useState([
    { id: 1, name: "Monthly Food Spending", lastRun: "2024-01-15" },
    { id: 2, name: "Platform Comparison", lastRun: "2024-01-14" },
    { id: 3, name: "Weekend vs Weekday", lastRun: "2024-01-13" },
  ])

  const availableMetrics = [
    { id: "total_amount", label: "Total Amount", description: "Sum of transaction amounts" },
    { id: "transaction_count", label: "Transaction Count", description: "Number of transactions" },
    { id: "avg_amount", label: "Average Amount", description: "Average transaction amount" },
    { id: "max_amount", label: "Maximum Amount", description: "Largest transaction" },
    { id: "min_amount", label: "Minimum Amount", description: "Smallest transaction" },
    { id: "median_amount", label: "Median Amount", description: "Middle transaction amount" },
  ]

  const availableGroupBy = [
    { id: "category", label: "Category" },
    { id: "platform", label: "Platform" },
    { id: "merchant", label: "Merchant" },
    { id: "day_of_week", label: "Day of Week" },
    { id: "month", label: "Month" },
    { id: "transaction_type", label: "Transaction Type" },
  ]

  const filterTypes = [
    { id: "amount_range", label: "Amount Range" },
    { id: "category", label: "Category" },
    { id: "platform", label: "Platform" },
    { id: "merchant", label: "Merchant" },
    { id: "date_range", label: "Date Range" },
  ]

  const addFilter = () => {
    setFilters([...filters, { id: Date.now(), type: "", field: "", operator: "equals", value: "" }])
  }

  const removeFilter = (id: number) => {
    setFilters(filters.filter((f) => f.id !== id))
  }

  const updateFilter = (id: number, updates: any) => {
    setFilters(filters.map((f) => (f.id === id ? { ...f, ...updates } : f)))
  }

  const runAnalysis = () => {
    setIsRunning(true)

    // Simulate analysis execution
    setTimeout(() => {
      const mockResults = {
        summary: {
          totalRecords: 1247,
          executionTime: "2.3s",
          dateRange: `${dateRange.from.toLocaleDateString()} - ${dateRange.to.toLocaleDateString()}`,
        },
        data: [
          { category: "Food & Dining", total_amount: 2340.5, transaction_count: 45, avg_amount: 52.01 },
          { category: "Transportation", total_amount: 1850.25, transaction_count: 28, avg_amount: 66.08 },
          { category: "Shopping", total_amount: 1420.75, transaction_count: 32, avg_amount: 44.40 },
          { category: "Entertainment", total_amount: 980.30, transaction_count: 18, avg_amount: 54.46 },
          { category: "Utilities", total_amount: 750.00, transaction_count: 12, avg_amount: 62.50 },
        ],
      }

      setResults(mockResults)
      setIsRunning(false)
    }, 2000)
  }

  const saveAnalysis = () => {
    if (analysisName.trim()) {
      setSavedAnalyses([
        ...savedAnalyses,
        {
          id: Date.now(),
          name: analysisName,
          lastRun: new Date().toISOString().split('T')[0],
        },
      ])
      setAnalysisName("")
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Custom Analysis Builder</h2>
        <p className="text-gray-600 mt-2">Create custom queries and analysis for your transaction data</p>
      </div>
    </div>
  )
}
