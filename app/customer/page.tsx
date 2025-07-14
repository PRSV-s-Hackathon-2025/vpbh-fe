"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, DollarSign, PieChart, BarChart3, Target } from "lucide-react"
import TransactionOverview from "@/components/customer/transaction-overview"
import TransactionAnalytics from "@/components/customer/transaction-analytics"
import SpendingPrediction from "@/components/customer/spending-prediction"
import CustomAnalysis from "@/components/customer/custom-analysis"

export default function CustomerDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [dateRange, setDateRange] = useState({
    from: new Date(new Date().getFullYear(), new Date().getMonth() - 11, 1),
    to: new Date(),
  })

  // Mock user data
  const userData = {
    name: "John Doe",
    accountType: "Premium",
    totalBalance: 15420.5,
    monthlyIncome: 5200.0,
    monthlyExpenses: 3850.75,
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-orange-100 rounded-lg">
                <DollarSign className="h-8 w-8 text-orange-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Financial Analytics</h1>
                <p className="text-sm text-gray-600">Welcome back, {userData.name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                {userData.accountType}
              </Badge>
              <div className="text-right">
                <p className="text-sm text-gray-600">Current Balance</p>
                <p className="text-xl font-bold text-blue-600">${userData.totalBalance.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white shadow-sm border border-gray-200">
            <TabsTrigger
              value="overview"
              className="flex items-center space-x-2 data-[state=active]:bg-orange-50 data-[state=active]:text-orange-700"
            >
              <BarChart3 className="h-4 w-4" />
              <span>Overview</span>
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="flex items-center space-x-2 data-[state=active]:bg-orange-50 data-[state=active]:text-orange-700"
            >
              <PieChart className="h-4 w-4" />
              <span>Analytics</span>
            </TabsTrigger>
            <TabsTrigger
              value="prediction"
              className="flex items-center space-x-2 data-[state=active]:bg-orange-50 data-[state=active]:text-orange-700"
            >
              <TrendingUp className="h-4 w-4" />
              <span>Predictions</span>
            </TabsTrigger>
            <TabsTrigger
              value="custom"
              className="flex items-center space-x-2 data-[state=active]:bg-orange-50 data-[state=active]:text-orange-700"
            >
              <Target className="h-4 w-4" />
              <span>Custom Analysis</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <TransactionOverview userData={userData} dateRange={dateRange} onDateRangeChange={setDateRange} />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <TransactionAnalytics dateRange={dateRange} onDateRangeChange={setDateRange} />
          </TabsContent>

          <TabsContent value="prediction" className="space-y-6">
            <SpendingPrediction userData={userData} dateRange={dateRange} />
          </TabsContent>

          <TabsContent value="custom" className="space-y-6">
            <CustomAnalysis dateRange={dateRange} onDateRangeChange={setDateRange} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
