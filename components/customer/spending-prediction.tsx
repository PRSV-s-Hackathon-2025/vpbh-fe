"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Slider } from "@/components/ui/slider"
import { TrendingUp, Target, AlertTriangle, CheckCircle, Brain, Calendar } from "lucide-react"

interface SpendingPredictionProps {
  userData: any
  dateRange: { from: Date; to: Date }
}

export default function SpendingPrediction({ userData }: SpendingPredictionProps) {
  const [predictionPeriod, setPredictionPeriod] = useState("3months")
  const [confidenceLevel, setConfidenceLevel] = useState([85])
  const [scenarioType, setScenarioType] = useState("realistic")

  // Mock prediction data
  const predictions = {
    "1month": {
      totalSpending: 3850,
      categories: {
        "Food & Dining": 1200,
        Transportation: 650,
        Shopping: 800,
        Entertainment: 400,
        Utilities: 550,
        Other: 250,
      },
      confidence: 92,
      trend: "stable",
    },
    "3months": {
      totalSpending: 11550,
      categories: {
        "Food & Dining": 3600,
        Transportation: 1950,
        Shopping: 2400,
        Entertainment: 1200,
        Utilities: 1650,
        Other: 750,
      },
      confidence: 85,
      trend: "increasing",
    },
    "6months": {
      totalSpending: 23100,
      categories: {
        "Food & Dining": 7200,
        Transportation: 3900,
        Shopping: 4800,
        Entertainment: 2400,
        Utilities: 3300,
        Other: 1500,
      },
      confidence: 78,
      trend: "increasing",
    },
    "1year": {
      totalSpending: 46200,
      categories: {
        "Food & Dining": 14400,
        Transportation: 7800,
        Shopping: 9600,
        Entertainment: 4800,
        Utilities: 6600,
        Other: 3000,
      },
      confidence: 72,
      trend: "increasing",
    },
  }

  const currentPrediction = predictions[predictionPeriod as keyof typeof predictions]

  const scenarios = {
    conservative: { multiplier: 0.85, label: "Conservative", color: "text-blue-600" },
    realistic: { multiplier: 1.0, label: "Realistic", color: "text-orange-600" },
    optimistic: { multiplier: 1.15, label: "Optimistic", color: "text-red-600" },
  }

  const monthlyProjections = [
    { month: "Jul", predicted: 3850, actual: null, confidence: 92 },
    { month: "Aug", predicted: 3920, actual: null, confidence: 89 },
    { month: "Sep", predicted: 3780, actual: null, confidence: 86 },
    { month: "Oct", predicted: 4100, actual: null, confidence: 83 },
    { month: "Nov", predicted: 4250, actual: null, confidence: 80 },
    { month: "Dec", predicted: 4600, actual: null, confidence: 77 },
  ]

  const savingsGoals = [
    { name: "Emergency Fund", target: 15000, current: 8500, monthly: 500 },
    { name: "Vacation", target: 5000, current: 2200, monthly: 300 },
    { name: "New Car", target: 25000, current: 12000, monthly: 800 },
  ]

  return (
    <div className="space-y-6">
      {/* Prediction Controls */}
      <Card className="bg-white border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-gray-900">
            <Brain className="h-5 w-5 text-orange-600" />
            <span>AI-Powered Spending Predictions</span>
          </CardTitle>
          <CardDescription className="text-gray-600">
            Get insights into your future spending patterns based on historical data and trends
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Prediction Period</label>
              <Select value={predictionPeriod} onValueChange={setPredictionPeriod}>
                <SelectTrigger className="bg-white border-gray-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-200">
                  <SelectItem value="1month">Next Month</SelectItem>
                  <SelectItem value="3months">Next 3 Months</SelectItem>
                  <SelectItem value="6months">Next 6 Months</SelectItem>
                  <SelectItem value="1year">Next Year</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Scenario Type</label>
              <Select value={scenarioType} onValueChange={setScenarioType}>
                <SelectTrigger className="bg-white border-gray-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-200">
                  <SelectItem value="conservative">Conservative</SelectItem>
                  <SelectItem value="realistic">Realistic</SelectItem>
                  <SelectItem value="optimistic">Optimistic</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Confidence Level: {confidenceLevel[0]}%</label>
              <Slider
                value={confidenceLevel}
                onValueChange={setConfidenceLevel}
                max={95}
                min={60}
                step={5}
                className="w-full"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Prediction Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white border-gray-200 shadow-sm bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm font-medium">Predicted Spending</p>
                <p className="text-2xl font-bold">
                  $
                  {(
                    currentPrediction.totalSpending * scenarios[scenarioType as keyof typeof scenarios].multiplier
                  ).toLocaleString()}
                </p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span className="text-sm">{currentPrediction.trend} trend</span>
                </div>
              </div>
              <Target className="h-8 w-8 text-orange-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200 shadow-sm bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Confidence Level</p>
                <p className="text-2xl font-bold">{currentPrediction.confidence}%</p>
                <div className="flex items-center mt-2">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  <span className="text-sm">High accuracy</span>
                </div>
              </div>
              <Brain className="h-8 w-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200 shadow-sm bg-gradient-to-r from-blue-400 to-orange-500 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Avg Monthly</p>
                <p className="text-2xl font-bold">
                  $
                  {(
                    (currentPrediction.totalSpending * scenarios[scenarioType as keyof typeof scenarios].multiplier) /
                    (predictionPeriod === "1month"
                      ? 1
                      : predictionPeriod === "3months"
                        ? 3
                        : predictionPeriod === "6months"
                          ? 6
                          : 12)
                  ).toLocaleString()}
                </p>
                <div className="flex items-center mt-2">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span className="text-sm">per month</span>
                </div>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Predictions */}
      <Card className="bg-white border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-gray-900">Category-wise Predictions</CardTitle>
          <CardDescription className="text-gray-600">Breakdown of predicted spending by category</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(currentPrediction.categories).map(([category, amount]) => {
              const adjustedAmount = amount * scenarios[scenarioType as keyof typeof scenarios].multiplier
              const percentage =
                (adjustedAmount /
                  (currentPrediction.totalSpending * scenarios[scenarioType as keyof typeof scenarios].multiplier)) *
                100

              return (
                <div key={category} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-900">{category}</span>
                    <div className="text-right">
                      <span className="font-bold text-gray-900">${adjustedAmount.toLocaleString()}</span>
                      <span className="text-sm text-gray-500 ml-2">({percentage.toFixed(1)}%)</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Monthly Projections */}
      <Card className="bg-white border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-gray-900">Monthly Spending Projections</CardTitle>
          <CardDescription className="text-gray-600">Month-by-month spending forecast</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {monthlyProjections.map((projection) => (
              <div key={projection.month} className="p-3 border border-gray-200 rounded-lg bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <span className="font-medium w-12 text-gray-900">{projection.month}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-bold text-gray-900">${projection.predicted.toLocaleString()}</span>
                      <Badge variant="outline" className="text-xs bg-white border-gray-300">
                        {projection.confidence}% confidence
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div className="bg-orange-500 h-2 rounded-full" style={{ width: `${projection.confidence}%` }} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Savings Goals Impact */}
      <Card className="bg-white border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-gray-900">Impact on Savings Goals</CardTitle>
          <CardDescription className="text-gray-600">
            How predicted spending affects your savings targets
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {savingsGoals.map((goal) => {
              const monthsToGoal = Math.ceil((goal.target - goal.current) / goal.monthly)
              const impactedMonthly = goal.monthly * 0.9 // Assuming 10% impact from increased spending
              const impactedMonthsToGoal = Math.ceil((goal.target - goal.current) / impactedMonthly)

              return (
                <div key={goal.name} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-medium text-gray-900">{goal.name}</h4>
                      <p className="text-sm text-gray-600">
                        ${goal.current.toLocaleString()} / ${goal.target.toLocaleString()}
                      </p>
                    </div>
                    <Badge
                      variant={impactedMonthsToGoal > monthsToGoal + 2 ? "destructive" : "default"}
                      className={
                        impactedMonthsToGoal > monthsToGoal + 2
                          ? "bg-red-100 text-red-800 border-red-200"
                          : "bg-blue-100 text-blue-800 border-blue-200"
                      }
                    >
                      {impactedMonthsToGoal} months
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${(goal.current / goal.target) * 100}%` }}
                      />
                    </div>

                    {impactedMonthsToGoal > monthsToGoal + 2 && (
                      <Alert className="border-orange-200 bg-orange-50">
                        <AlertTriangle className="h-4 w-4 text-orange-600" />
                        <AlertDescription className="text-orange-800">
                          Predicted spending may delay this goal by {impactedMonthsToGoal - monthsToGoal} months
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
