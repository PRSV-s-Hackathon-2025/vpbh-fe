"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Database, Settings, Activity, Play } from "lucide-react"
import CredentialsForm from "@/components/credentials-form"
import DataSourceConfig from "@/components/data-source-config"
import PipelineConsole from "@/components/pipeline-console"
import QueryConsole from "@/components/query-console"

export default function DatabaseBenchmark() {
  const [activeTab, setActiveTab] = useState("credentials")
  const [credentials, setCredentials] = useState(null)
  const [dataSource, setDataSource] = useState(null)
  const [pipelineStatus, setPipelineStatus] = useState("idle")

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Database className="h-8 w-8 text-orange-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Database Benchmark Console</h1>
                <p className="text-sm text-gray-600">ClickHouse Performance Testing Platform</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge
                variant={credentials ? "default" : "secondary"}
                className={credentials ? "bg-blue-100 text-blue-800 border-blue-200" : ""}
              >
                {credentials ? "Connected" : "Not Connected"}
              </Badge>
              <Badge
                variant={pipelineStatus === "running" ? "default" : "secondary"}
                className={pipelineStatus === "running" ? "bg-orange-100 text-orange-800 border-orange-200" : ""}
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
          <TabsList className="grid w-full grid-cols-4 bg-white border border-gray-200 shadow-sm">
            <TabsTrigger
              value="credentials"
              className="flex items-center space-x-2 data-[state=active]:bg-orange-50 data-[state=active]:text-orange-700"
            >
              <Settings className="h-4 w-4" />
              <span>AWS Credentials</span>
            </TabsTrigger>
            <TabsTrigger
              value="datasource"
              className="flex items-center space-x-2 data-[state=active]:bg-orange-50 data-[state=active]:text-orange-700"
            >
              <Database className="h-4 w-4" />
              <span>Data Source</span>
            </TabsTrigger>
            <TabsTrigger
              value="pipeline"
              className="flex items-center space-x-2 data-[state=active]:bg-orange-50 data-[state=active]:text-orange-700"
            >
              <Activity className="h-4 w-4" />
              <span>Pipeline Console</span>
            </TabsTrigger>
            <TabsTrigger
              value="query"
              className="flex items-center space-x-2 data-[state=active]:bg-orange-50 data-[state=active]:text-orange-700"
            >
              <Play className="h-4 w-4" />
              <span>Query Console</span>
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

          <TabsContent value="datasource" className="space-y-6">
            <Card className="bg-white border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-gray-900">S3 Data Source Configuration</CardTitle>
                <CardDescription className="text-gray-600">
                  Configure your S3 data sources for ClickHouse integration
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DataSourceConfig credentials={credentials} onDataSourceSet={setDataSource} dataSource={dataSource} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pipeline" className="space-y-6">
            <PipelineConsole
              credentials={credentials}
              dataSource={dataSource}
              onStatusChange={setPipelineStatus}
              status={pipelineStatus}
            />
          </TabsContent>

          <TabsContent value="query" className="space-y-6">
            <QueryConsole credentials={credentials} dataSource={dataSource} pipelineStatus={pipelineStatus} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
