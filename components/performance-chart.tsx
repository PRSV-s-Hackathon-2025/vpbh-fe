"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart3, Clock, Zap, TrendingUp } from "lucide-react"

interface PerformanceChartProps {
  executionTime: number | null
  queryHistory: any[]
  isLoading: boolean
}

export default function PerformanceChart({ executionTime, queryHistory, isLoading }: PerformanceChartProps) {
  const avgExecutionTime =
    queryHistory.length > 0 ? queryHistory.reduce((sum, item) => sum + item.executionTime, 0) / queryHistory.length : 0

  const minExecutionTime = queryHistory.length > 0 ? Math.min(...queryHistory.map((item) => item.executionTime)) : 0

  const maxExecutionTime = queryHistory.length > 0 ? Math.max(...queryHistory.map((item) => item.executionTime)) : 0

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5" />
            <span>Performance Metrics</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Clock className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-500" />
              <p className="text-gray-600">Analyzing performance...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Performance Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Zap className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium text-gray-600">Last Query</p>
                <p className="text-2xl font-bold">{executionTime ? `${executionTime}ms` : "N/A"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium text-gray-600">Average</p>
                <p className="text-2xl font-bold">{avgExecutionTime ? `${Math.round(avgExecutionTime)}ms` : "N/A"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-sm font-medium text-gray-600">Min Time</p>
                <p className="text-2xl font-bold">{minExecutionTime ? `${minExecutionTime}ms` : "N/A"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-sm font-medium text-gray-600">Max Time</p>
                <p className="text-2xl font-bold">{maxExecutionTime ? `${maxExecutionTime}ms` : "N/A"}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Query Performance Timeline</CardTitle>
          <CardDescription>Execution time for recent queries</CardDescription>
        </CardHeader>
        <CardContent>
          {queryHistory.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <BarChart3 className="h-12 w-12 mx-auto mb-4" />
              <p>No performance data available</p>
              <p className="text-sm">Execute some queries to see performance metrics</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Simple bar chart visualization */}
              <div className="space-y-2">
                {queryHistory.slice(0, 10).map((item, index) => {
                  const percentage = (item.executionTime / maxExecutionTime) * 100
                  return (
                    <div key={item.id} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Query #{queryHistory.length - index}</span>
                        <span>{item.executionTime}ms</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Performance Insights */}
      {queryHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Performance Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <span className="text-sm font-medium">Total Queries Executed</span>
                <Badge variant="outline">{queryHistory.length}</Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <span className="text-sm font-medium">Performance Rating</span>
                <Badge
                  variant={avgExecutionTime < 1000 ? "default" : avgExecutionTime < 3000 ? "secondary" : "destructive"}
                >
                  {avgExecutionTime < 1000 ? "Excellent" : avgExecutionTime < 3000 ? "Good" : "Needs Optimization"}
                </Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                <span className="text-sm font-medium">Recommended Action</span>
                <span className="text-sm text-orange-800">
                  {avgExecutionTime < 1000
                    ? "Performance is optimal"
                    : avgExecutionTime < 3000
                      ? "Consider query optimization"
                      : "Review indexes and query structure"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
