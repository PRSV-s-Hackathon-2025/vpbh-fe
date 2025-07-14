"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Filter, Download } from "lucide-react"

interface TransactionAnalyticsProps {
  dateRange: { from: Date; to: Date }
  onDateRangeChange: (range: { from: Date; to: Date }) => void
}

export default function TransactionAnalytics({ dateRange }: TransactionAnalyticsProps) {
  const [groupBy, setGroupBy] = useState("category")
  const [transactionType, setTransactionType] = useState("all")
  const [platform, setPlatform] = useState("all")

  // Mock analytics data
  const categoryData = [
    { name: "Food & Dining", amount: 2340.5, percentage: 32, transactions: 45, color: "bg-orange-500" },
    { name: "Transportation", amount: 1850.25, percentage: 25, transactions: 28, color: "bg-blue-500" },
    { name: "Shopping", amount: 1420.75, percentage: 19, transactions: 32, color: "bg-orange-400" },
    { name: "Entertainment", amount: 980.3, percentage: 13, transactions: 18, color: "bg-blue-400" },
    { name: "Utilities", amount: 650.0, percentage: 9, transactions: 8, color: "bg-orange-600" },
    { name: "Other", amount: 158.95, percentage: 2, transactions: 12, color: "bg-gray-500" },
  ]

  const platformData = [
    { name: "Credit Card", amount: 4850.75, percentage: 65, transactions: 89, color: "bg-blue-600" },
    { name: "Debit Card", amount: 1920.5, percentage: 26, transactions: 45, color: "bg-orange-600" },
    { name: "Bank Transfer", amount: 480.25, percentage: 6, transactions: 12, color: "bg-blue-500" },
    { name: "Cash", amount: 149.25, percentage: 2, transactions: 8, color: "bg-orange-500" },
    { name: "Digital Wallet", amount: 99.0, percentage: 1, transactions: 3, color: "bg-blue-400" },
  ]

  const monthlyTrends = [
    { month: "Jan", categories: { Food: 420, Transport: 380, Shopping: 250, Entertainment: 180 } },
    { month: "Feb", categories: { Food: 450, Transport: 320, Shopping: 380, Entertainment: 220 } },
    { month: "Mar", categories: { Food: 380, Transport: 420, Shopping: 180, Entertainment: 160 } },
    { month: "Apr", categories: { Food: 520, Transport: 350, Shopping: 420, Entertainment: 280 } },
    { month: "May", categories: { Food: 480, Transport: 390, Shopping: 320, Entertainment: 190 } },
    { month: "Jun", categories: { Food: 390, Transport: 310, Shopping: 280, Entertainment: 240 } },
  ]

  const currentData = groupBy === "category" ? categoryData : platformData

  return (
    <div className="space-y-6">
      {/* Controls */}
      <Card className="bg-white border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-gray-900">
            <span>Transaction Analytics</span>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" className="bg-white border-gray-300 hover:bg-gray-50">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm" className="bg-white border-gray-300 hover:bg-gray-50">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Group By</label>
              <Select value={groupBy} onValueChange={setGroupBy}>
                <SelectTrigger className="bg-white border-gray-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-200">
                  <SelectItem value="category">Category</SelectItem>
                  <SelectItem value="platform">Platform</SelectItem>
                  <SelectItem value="merchant">Merchant</SelectItem>
                  <SelectItem value="location">Location</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Transaction Type</label>
              <Select value={transactionType} onValueChange={setTransactionType}>
                <SelectTrigger className="bg-white border-gray-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-200">
                  <SelectItem value="all">All Transactions</SelectItem>
                  <SelectItem value="income">Income Only</SelectItem>
                  <SelectItem value="expenses">Expenses Only</SelectItem>
                  <SelectItem value="transfers">Transfers Only</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Platform</label>
              <Select value={platform} onValueChange={setPlatform}>
                <SelectTrigger className="bg-white border-gray-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-200">
                  <SelectItem value="all">All Platforms</SelectItem>
                  <SelectItem value="credit">Credit Cards</SelectItem>
                  <SelectItem value="debit">Debit Cards</SelectItem>
                  <SelectItem value="bank">Bank Transfers</SelectItem>
                  <SelectItem value="digital">Digital Wallets</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="breakdown" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 bg-white border border-gray-200">
          <TabsTrigger
            value="breakdown"
            className="data-[state=active]:bg-orange-50 data-[state=active]:text-orange-700"
          >
            Breakdown
          </TabsTrigger>
          <TabsTrigger value="trends" className="data-[state=active]:bg-orange-50 data-[state=active]:text-orange-700">
            Trends
          </TabsTrigger>
          <TabsTrigger
            value="comparison"
            className="data-[state=active]:bg-orange-50 data-[state=active]:text-orange-700"
          >
            Comparison
          </TabsTrigger>
        </TabsList>

        <TabsContent value="breakdown" className="space-y-6">
          {/* Pie Chart Visualization */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-white border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-gray-900">Spending Distribution</CardTitle>
                <CardDescription className="text-gray-600">
                  Breakdown by {groupBy === "category" ? "category" : "platform"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Simple pie chart representation */}
                  <div className="relative w-48 h-48 mx-auto">
                    <div className="w-full h-full rounded-full border-8 border-gray-200 relative overflow-hidden">
                      {currentData.map((item, index) => {
                        const rotation = currentData
                          .slice(0, index)
                          .reduce((sum, prev) => sum + prev.percentage * 3.6, 0)
                        return (
                          <div
                            key={item.name}
                            className={`absolute inset-0 ${item.color}`}
                            style={{
                              clipPath: `polygon(50% 50%, 50% 0%, ${50 + 50 * Math.cos(((rotation - 90) * Math.PI) / 180)}% ${50 + 50 * Math.sin(((rotation - 90) * Math.PI) / 180)}%, ${50 + 50 * Math.cos(((rotation + item.percentage * 3.6 - 90) * Math.PI) / 180)}% ${50 + 50 * Math.sin(((rotation + item.percentage * 3.6 - 90) * Math.PI) / 180)}%)`,
                            }}
                          />
                        )
                      })}
                    </div>
                  </div>

                  <div className="space-y-2">
                    {currentData.map((item) => (
                      <div key={item.name} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className={`w-3 h-3 rounded-full ${item.color}`} />
                          <span className="text-sm font-medium text-gray-700">{item.name}</span>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-gray-900">${item.amount.toLocaleString()}</p>
                          <p className="text-xs text-gray-500">{item.percentage}%</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-gray-900">Detailed Breakdown</CardTitle>
                <CardDescription className="text-gray-600">Transaction details and statistics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {currentData.map((item, index) => (
                    <div key={item.name} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-gray-900">{item.name}</h4>
                        <Badge variant="outline" className="bg-white border-gray-300">
                          {item.transactions} transactions
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Total Amount</span>
                          <span className="font-medium text-gray-900">${item.amount.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Average per Transaction</span>
                          <span className="font-medium text-gray-900">
                            ${(item.amount / item.transactions).toFixed(2)}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className={`h-2 rounded-full ${item.color}`} style={{ width: `${item.percentage}%` }} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card className="bg-white border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-gray-900">Monthly Spending Trends</CardTitle>
              <CardDescription className="text-gray-600">
                Track how your spending patterns change over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {monthlyTrends.map((month) => {
                  const maxAmount = Math.max(...Object.values(month.categories))
                  return (
                    <div key={month.month} className="space-y-3">
                      <h4 className="font-medium text-gray-900">{month.month}</h4>
                      <div className="space-y-2">
                        {Object.entries(month.categories).map(([category, amount]) => (
                          <div key={category} className="flex items-center space-x-3">
                            <span className="text-sm w-20 text-gray-700">{category}</span>
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${(amount / maxAmount) * 100}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium w-16 text-right text-gray-900">${amount}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comparison" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-white border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-gray-900">Month-over-Month Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {categoryData.slice(0, 4).map((category) => {
                    const change = Math.random() > 0.5 ? 1 : -1
                    const changePercent = (Math.random() * 20 + 5) * change
                    return (
                      <div
                        key={category.name}
                        className="flex items-center justify-between p-3 border border-gray-200 rounded-lg bg-gray-50"
                      >
                        <div>
                          <p className="font-medium text-gray-900">{category.name}</p>
                          <p className="text-sm text-gray-600">${category.amount.toLocaleString()}</p>
                        </div>
                        <div className="text-right">
                          <Badge
                            variant={changePercent > 0 ? "destructive" : "default"}
                            className={
                              changePercent > 0
                                ? "bg-red-100 text-red-800 border-red-200"
                                : "bg-blue-100 text-blue-800 border-blue-200"
                            }
                          >
                            {changePercent > 0 ? "+" : ""}
                            {changePercent.toFixed(1)}%
                          </Badge>
                          <p className="text-xs text-gray-500 mt-1">vs last month</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-gray-900">Budget vs Actual</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {categoryData.slice(0, 4).map((category) => {
                    const budget = category.amount * (1 + (Math.random() * 0.4 - 0.2))
                    const percentage = (category.amount / budget) * 100
                    return (
                      <div key={category.name} className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium text-gray-700">{category.name}</span>
                          <span className="text-sm text-gray-900">
                            ${category.amount.toLocaleString()} / ${budget.toFixed(0)}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${percentage > 100 ? "bg-red-500" : percentage > 80 ? "bg-orange-500" : "bg-blue-500"}`}
                            style={{ width: `${Math.min(percentage, 100)}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-xs text-gray-600">
                          <span>{percentage.toFixed(1)}% of budget</span>
                          <span className={percentage > 100 ? "text-red-600" : "text-blue-600"}>
                            {percentage > 100 ? "Over" : "Under"} budget
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
