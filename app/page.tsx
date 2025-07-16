"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Database, Settings, Activity, Play } from "lucide-react"
import CredentialsForm from "@/components/credentials-form"
import PipelineConsole from "@/components/pipeline-console"
import QueryConsole from "@/components/query-console"

export default function DatabaseBenchmark() {
  const [activeTab, setActiveTab] = useState("credentials")
  const [credentials, setCredentials] = useState(null)
  const [pipelineStatus, setPipelineStatus] = useState("idle")
  const [dataSource, setDataSource] = useState(null)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-4 gap-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Database className="h-6 w-6 sm:h-8 sm:w-8 text-orange-600" />
              </div>
              <div>
                <h1 className="text-lg sm:text-2xl font-bold text-gray-900">Database Benchmark Console</h1>
                <p className="text-xs sm:text-sm text-gray-600">ClickHouse Performance Testing Platform</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge
                variant={credentials ? "default" : "secondary"}
                className={`text-xs ${credentials ? "bg-blue-100 text-blue-800 border-blue-200" : ""}`}
              >
                {credentials ? "Connected" : "Not Connected"}
              </Badge>
              <Badge
                variant={pipelineStatus === "running" ? "default" : "secondary"}
                className={`text-xs ${pipelineStatus === "running" ? "bg-orange-100 text-orange-800 border-orange-200" : ""}`}
              >
                Pipeline: {pipelineStatus}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="flex w-full sm:grid sm:grid-cols-3 bg-white border border-gray-200 shadow-sm overflow-x-auto">
            <TabsTrigger
              value="credentials"
              className="flex items-center space-x-1 sm:space-x-2 data-[state=active]:bg-orange-50 data-[state=active]:text-orange-700 text-xs sm:text-sm whitespace-nowrap flex-shrink-0"
            >
              <Settings className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">AWS Credentials</span>
              <span className="sm:hidden">AWS</span>
            </TabsTrigger>
            <TabsTrigger
              value="pipeline"
              className="flex items-center space-x-1 sm:space-x-2 data-[state=active]:bg-orange-50 data-[state=active]:text-orange-700 text-xs sm:text-sm whitespace-nowrap flex-shrink-0"
            >
              <Activity className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Pipeline Console</span>
              <span className="sm:hidden">Pipeline</span>
            </TabsTrigger>
            <TabsTrigger
              value="query"
              className="flex items-center space-x-1 sm:space-x-2 data-[state=active]:bg-orange-50 data-[state=active]:text-orange-700 text-xs sm:text-sm whitespace-nowrap flex-shrink-0"
            >
              <Play className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Query Console</span>
              <span className="sm:hidden">Query</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="credentials" className="space-y-6">
            <Card className="bg-white border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-gray-900">AWS Credentials Configuration</CardTitle>
                <CardDescription className="text-gray-600">
                  Configure your AWS credentials to connect to ClickHouse and S3 data sources
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CredentialsForm onCredentialsSet={setCredentials} credentials={credentials} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pipeline" className="space-y-6">
            <PipelineConsole
              credentials={credentials}
              dataSource={dataSource}
              onStatusChange={setPipelineStatus}
              status={pipelineStatus}
              awsSession={credentials}
            />
          </TabsContent>

          <TabsContent value="query" className="space-y-6">
            <QueryConsole credentials={credentials} pipelineStatus={pipelineStatus} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
