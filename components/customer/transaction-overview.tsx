"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  CreditCard,
  CalendarIcon,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"

interface TransactionOverviewProps {
  userData: any
  dateRange: { from: Date; to: Date }
  onDateRangeChange: (range: { from: Date; to: Date }) => void
}

export default function TransactionOverview({ userData, dateRange, onDateRangeChange }: TransactionOverviewProps) {
  const [selectedPeriod, setSelectedPeriod] = useState("month")
  const [showCalendar, setShowCalendar] = useState(false)

  // Mock transaction data
  const transactionSummary = {
    totalIncome: 15600.0,
    totalExpenses: 11550.75,
    netFlow: 4049.25,
    transactionCount: 247,
    avgTransactionSize: 46.76,
    topCategory: "Food & Dining",
    topCategoryAmount: 2340.5,
  }

  const monthlyData = [
    { month: "Jan", income: 5200, expenses: 3850, net: 1350 },
    { month: "Feb", income: 5200, expenses: 4120, net: 1080 },
    { month: "Mar", income: 5200, expenses: 3580, net: 1620 },
    { month: "Apr", income: 5400, expenses: 3920, net: 1480 },
    { month: "May", income: 5400, expenses: 4180, net: 1220 },
    { month: "Jun", income: 5600, expenses: 3750, net: 1850 },
  ]

  const quickPeriods = [
    { label: "Last 30 Days", value: "30d" },
    { label: "Last 3 Months", value: "3m" },
    { label: "Last 6 Months", value: "6m" },
    { label: "Last Year", value: "1y" },
    { label: "Year to Date", value: "ytd" },
  ]

  const handleQuickPeriod = (period: string) => {
    const now = new Date()
    let from: Date

    switch (period) {
      case "30d":
        from = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        break
      case "3m":
        from = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate())
        break
      case "6m":
        from = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate())
        break
      case "1y":
        from = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate())
        break
      case "ytd":
        from = new Date(now.getFullYear(), 0, 1)
        break
      default:
        from = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
    }

    onDateRangeChange({ from, to: now })
  }

  return (
    <div className="space-y-6">
      {/* Date Range Selector */}
      <Card className="bg-white border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-gray-900">
            <span>Transaction Overview</span>
            <div className="flex items-center space-x-2">
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-40 bg-white border-gray-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-200">
                  {quickPeriods.map((period) => (
                    <SelectItem key={period.value} value={period.value}>
                      {period.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Popover open={showCalendar} onOpenChange={setShowCalendar}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="flex items-center space-x-2 bg-white border-gray-300">
                    <CalendarIcon className="h-4 w-4" />
                    <span>
                      {format(dateRange.from, "MMM dd")} - {format(dateRange.to, "MMM dd, yyyy")}
                    </span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-white border-gray-200" align="end">
                  <Calendar
                    mode="range"
                    selected={{ from: dateRange.from, to: dateRange.to }}
                    onSelect={(range) => {
                      if (range?.from && range?.to) {
                        onDateRangeChange({ from: range.from, to: range.to })
                        setShowCalendar(false)
                      }
                    }}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white border-gray-200 shadow-sm bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Total Income</p>
                <p className="text-2xl font-bold">${transactionSummary.totalIncome.toLocaleString()}</p>
                <div className="flex items-center mt-2">
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                  <span className="text-sm">+12.5% from last period</span>
                </div>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200 shadow-sm bg-gradient-to-r from-red-500 to-red-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 text-sm font-medium">Total Expenses</p>
                <p className="text-2xl font-bold">${transactionSummary.totalExpenses.toLocaleString()}</p>
                <div className="flex items-center mt-2">
                  <ArrowDownRight className="h-4 w-4 mr-1" />
                  <span className="text-sm">+8.3% from last period</span>
                </div>
              </div>
              <TrendingDown className="h-8 w-8 text-red-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200 shadow-sm bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm font-medium">Net Flow</p>
                <p className="text-2xl font-bold">${transactionSummary.netFlow.toLocaleString()}</p>
                <div className="flex items-center mt-2">
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                  <span className="text-sm">+24.1% from last period</span>
                </div>
              </div>
              <DollarSign className="h-8 w-8 text-orange-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200 shadow-sm bg-gradient-to-r from-blue-400 to-blue-500 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Transactions</p>
                <p className="text-2xl font-bold">{transactionSummary.transactionCount}</p>
                <div className="flex items-center mt-2">
                  <span className="text-sm">Avg: ${transactionSummary.avgTransactionSize}</span>
                </div>
              </div>
              <CreditCard className="h-8 w-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Trend Chart */}
      <Card className="bg-white border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-gray-900">Monthly Cash Flow Trend</CardTitle>
          <CardDescription className="text-gray-600">Income vs Expenses over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {monthlyData.map((month, index) => {
              const maxValue = Math.max(...monthlyData.map((m) => Math.max(m.income, m.expenses)))
              const incomeWidth = (month.income / maxValue) * 100
              const expenseWidth = (month.expenses / maxValue) * 100

              return (
                <div key={month.month} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium w-12 text-gray-700">{month.month}</span>
                    <div className="flex space-x-4 text-sm">
                      <span className="text-blue-600">+${month.income.toLocaleString()}</span>
                      <span className="text-red-600">-${month.expenses.toLocaleString()}</span>
                      <span className="text-orange-600 font-medium">Net: ${month.net.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex space-x-1">
                      <div className="bg-blue-200 h-2 rounded-full" style={{ width: `${incomeWidth}%` }} />
                    </div>
                    <div className="flex space-x-1">
                      <div className="bg-red-200 h-2 rounded-full" style={{ width: `${expenseWidth}%` }} />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Quick Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-gray-900">Top Spending Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-red-600">{transactionSummary.topCategory}</p>
                <p className="text-gray-600">${transactionSummary.topCategoryAmount.toLocaleString()}</p>
              </div>
              <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                32% of expenses
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-gray-900">Savings Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-blue-600">26%</p>
                <p className="text-gray-600">of total income saved</p>
              </div>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                Above Average
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
