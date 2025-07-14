"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Play, Clock, Database, AlertCircle, Zap } from "lucide-react"
import QueryResults from "@/components/query-results"
import PerformanceChart from "@/components/performance-chart"

interface QueryConsoleProps {
  credentials: any
  dataSource: any
  pipelineStatus: string
}

export default function QueryConsole({ credentials, dataSource, pipelineStatus }: QueryConsoleProps) {
  const [query, setQuery] = useState(`SELECT COUNT(*) FROM transactions.daily_transactions`)

  const [isExecuting, setIsExecuting] = useState(false)
  const [queryResults, setQueryResults] = useState<any>(null)
  const [executionTime, setExecutionTime] = useState<number | null>(null)
  const [queryHistory, setQueryHistory] = useState<any[]>([])

  const sampleQueries = [
    {
      name: "Count Transactions",
      query: `SELECT COUNT(*) FROM transactions.daily_transactions`,
    },
    {
      name: "Transaction Summary",
      query: `SELECT 
  transaction_type,
  COUNT(*) as count,
  SUM(amount) as total_amount
FROM transactions.daily_transactions 
GROUP BY transaction_type
ORDER BY count DESC`,
    },
    {
      name: "Top Merchants",
      query: `SELECT 
  merchant_name,
  COUNT(*) as transaction_count,
  SUM(amount) as total_amount
FROM transactions.daily_transactions 
GROUP BY merchant_name
ORDER BY transaction_count DESC
LIMIT 10`,
    },
  ]

  const executeQuery = async () => {
    if (!query.trim()) {
      return
    }

    setIsExecuting(true)
    const startTime = Date.now()

    try {
      const response = await fetch('https://backend.awscloudclubs.com/calculation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: query.trim() })
      })

      const endTime = Date.now()
      const execTime = endTime - startTime

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      // Transform API response to expected format
      let columns: string[] = []
      let rows: any[][] = []

      if (data.data && Array.isArray(data.data) && data.data.length > 0) {
        // Extract columns from first object keys
        columns = Object.keys(data.data[0])
        // Convert objects to arrays of values
        rows = data.data.map((item: any) => columns.map(col => item[col]))
      }

      const results = {
        columns,
        rows,
        rowCount: data.rows || rows.length,
        executionTime: execTime,
        error: null
      }

      setQueryResults(results)
      setExecutionTime(execTime)

      // Add to history
      setQueryHistory((prev) => [
        {
          id: Date.now(),
          query: query.length > 100 ? query.substring(0, 100) + "..." : query,
          executionTime: execTime,
          timestamp: new Date().toISOString(),
          rowCount: results.rowCount,
        },
        ...prev.slice(0, 9),
      ])

    } catch (error) {
      const endTime = Date.now()
      const execTime = endTime - startTime

      setQueryResults({
        columns: [],
        rows: [],
        rowCount: 0,
        executionTime: execTime,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      })
      setExecutionTime(execTime)
    } finally {
      setIsExecuting(false)
    }
  }

  const canExecuteQuery = query.trim().length > 0

  return (
    <div className="space-y-6">
      {/* Query Input */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Database className="h-5 w-5" />
            <span>SQL Query Console</span>
          </CardTitle>
          <CardDescription>Execute SQL queries against your ClickHouse database</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium">SQL Query</label>
              <div className="flex space-x-2">
                {sampleQueries.map((sample, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => setQuery(sample.query)}
                    disabled={isExecuting}
                  >
                    {sample.name}
                  </Button>
                ))}
              </div>
            </div>
            <Textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter your SQL query here..."
              className="min-h-[200px] font-mono text-sm"
              disabled={isExecuting}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                onClick={executeQuery}
                disabled={!canExecuteQuery || isExecuting}
                className="flex items-center space-x-2"
              >
                {isExecuting ? (
                  <>
                    <Clock className="h-4 w-4 animate-spin" />
                    <span>Executing...</span>
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4" />
                    <span>Execute Query</span>
                  </>
                )}
              </Button>

              {executionTime && (
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Zap className="h-4 w-4" />
                  <span>Last execution: {executionTime}ms</span>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Badge variant={canExecuteQuery ? "default" : "secondary"}>
                {canExecuteQuery ? "Ready" : "Not Ready"}
              </Badge>
            </div>
          </div>

          {!canExecuteQuery && (
            <Alert className="border-yellow-200 bg-yellow-50">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              <AlertDescription className="text-yellow-800">
                Enter a SQL query to execute.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Results and Performance */}
      <Tabs defaultValue="results" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="results">Query Results</TabsTrigger>
          <TabsTrigger value="performance">Performance Metrics</TabsTrigger>
          <TabsTrigger value="history">Query History</TabsTrigger>
        </TabsList>

        <TabsContent value="results">
          <QueryResults results={queryResults} isLoading={isExecuting} />
        </TabsContent>

        <TabsContent value="performance">
          <PerformanceChart executionTime={executionTime} queryHistory={queryHistory} isLoading={isExecuting} />
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Query History</CardTitle>
              <CardDescription>Recent query executions and their performance</CardDescription>
            </CardHeader>
            <CardContent>
              {queryHistory.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No queries executed yet</div>
              ) : (
                <div className="space-y-3">
                  {queryHistory.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <p className="text-sm font-mono text-gray-800">{item.query}</p>
                        <p className="text-xs text-gray-500 mt-1">{new Date(item.timestamp).toLocaleString()}</p>
                      </div>
                      <div className="flex items-center space-x-4 text-sm">
                        <span className="text-gray-600">{item.rowCount} rows</span>
                        <Badge variant="outline">{item.executionTime}ms</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
