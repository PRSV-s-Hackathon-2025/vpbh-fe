"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Play, Square, Database, Zap, ArrowRight, CheckCircle, AlertCircle, Clock, Activity, RefreshCw, RotateCw } from "lucide-react"

interface PipelineConsoleProps {
  credentials: any
  dataSource: any
  onStatusChange: (status: string) => void
  status: string
  awsSession?: any
}

export default function PipelineConsole({ credentials, dataSource, onStatusChange, status, awsSession }: PipelineConsoleProps) {
  const [pipelineConfig, setPipelineConfig] = useState({
    kafkaEndpoint: "",
    glueStreamingArn: "",
    glueSparkArn: "",
    s3ProcessedArn: "",
  })
  const [glueJobs, setGlueJobs] = useState<{streamingJobs: any[], sparkJobs: any[]}>({streamingJobs: [], sparkJobs: []})
  const [isLoadingJobs, setIsLoadingJobs] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)
  const [alertMessage, setAlertMessage] = useState<{type: 'error' | 'success', message: string} | null>(null)
  const [currentJobRunId, setCurrentJobRunId] = useState<string | null>(null)

  const pipelineSteps = [
    { name: "Raw Source", icon: Database, status: "pending" },
    { name: "Preparing Job", icon: Zap, status: "pending" },
    { name: "Glue Running", icon: Activity, status: "pending" },
    { name: "ClickHouse Ready", icon: Database, status: "pending" },
  ]

  const loadGlueJobs = async () => {
    if (!awsSession) return
    
    setIsLoadingJobs(true)
    try {
      const response = await fetch('/api/glue/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(awsSession)
      })
      
      const data = await response.json()
      if (response.ok) {
        setGlueJobs(data)
      }
    } catch (error) {
      console.error('Error loading Glue jobs:', error)
    } finally {
      setIsLoadingJobs(false)
    }
  }

  useEffect(() => {
    if (awsSession) {
      loadGlueJobs()
    }
  }, [awsSession])

  const isValidConfig = () => {
    const hasStreamingPair = pipelineConfig.kafkaEndpoint && pipelineConfig.glueStreamingArn
    const hasSparkPair = pipelineConfig.s3ProcessedArn && pipelineConfig.glueSparkArn
    return hasStreamingPair || hasSparkPair
  }

  const checkKafkaConnection = async (endpoint: string) => {
    // Simple validation - in real implementation, you'd ping Kafka
    return endpoint && endpoint.includes(':')
  }

  const checkClickHouseHealth = async () => {
    try {
      const response = await fetch('https://backend.awscloudclubs.com/health')
      return response.ok
    } catch {
      return false
    }
  }

  const startPipeline = async () => {
    if (!credentials) {
      setAlertMessage({type: 'error', message: 'Please configure credentials first'})
      return
    }
    
    if (!isValidConfig()) {
      setAlertMessage({type: 'error', message: 'Please configure either Kafka+Glue Streaming or S3+Glue Spark pair'})
      return
    }

    onStatusChange("running")
    setProgress(0)
    setCurrentStep(0)

    try {
      // Step 1: Raw Source
      const kafkaOk = await checkKafkaConnection(pipelineConfig.kafkaEndpoint)
      const jobName = glueJobs.streamingJobs.find(job => job.arn === pipelineConfig.glueStreamingArn)?.name
      
      if (!kafkaOk || !jobName) {
        throw new Error('Raw source validation failed')
      }
      
      setCurrentStep(0)
      setProgress(25)
      
      // Step 2: Preparing Job
      setCurrentStep(1)
      
      // Update job with new Kafka endpoint
      const updateResponse = await fetch('/api/glue/update-job', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...awsSession,
          jobName,
          kafkaEndpoint: pipelineConfig.kafkaEndpoint
        })
      })
      
      if (!updateResponse.ok) {
        const updateError = await updateResponse.json()
        throw new Error(`Failed to update job: ${updateError.error}`)
      }
      
      // Stop running jobs
      const stopResponse = await fetch('/api/glue/stop-jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(awsSession)
      })
      
      if (!stopResponse.ok) {
        const stopError = await stopResponse.json()
        throw new Error(`Failed to stop jobs: ${stopError.error}`)
      }
      
      // Wait for all jobs to fully stop
      let allStopped = false
      let attempts = 0
      const maxAttempts = 30 // 5 minutes max
      
      while (!allStopped && attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 10000)) // Wait 10 seconds
        
        const statusResponse = await fetch('/api/glue/check-status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(awsSession)
        })
        
        if (statusResponse.ok) {
          const statusData = await statusResponse.json()
          allStopped = statusData.allStopped
        }
        
        attempts++
      }
      
      if (!allStopped) {
        throw new Error('Timeout waiting for jobs to stop')
      }
      
      // Start new job
      const startResponse = await fetch('/api/glue/start-job', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...awsSession,
          jobName,
          kafkaEndpoint: pipelineConfig.kafkaEndpoint
        })
      })
      
      if (!startResponse.ok) {
        const startError = await startResponse.json()
        throw new Error(`Failed to start job: ${startError.error}`)
      }
      
      const startData = await startResponse.json()
      setCurrentJobRunId(startData.jobRunId)
      
      // Verify parameters were set
      if (startData.jobRunId) {
        const detailsResponse = await fetch('/api/glue/job-run-details', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...awsSession,
            jobName,
            jobRunId: startData.jobRunId
          })
        })
        
        if (detailsResponse.ok) {
          const details = await detailsResponse.json()
          console.log('Job run arguments:', details.arguments)
        }
      }
      
      setProgress(50)
      
      // Step 3: Glue Running
      setCurrentStep(2)
      await new Promise(resolve => setTimeout(resolve, 3000)) // Wait for Glue to start
      setProgress(75)
      
      // Step 4: ClickHouse Ready
      setCurrentStep(3)
      const clickHouseOk = await checkClickHouseHealth()
      if (!clickHouseOk) {
        throw new Error('ClickHouse health check failed')
      }
      
      setProgress(100)
      onStatusChange("completed")
      
    } catch (error) {
      console.error('Pipeline failed:', error)
      onStatusChange("error")
      setAlertMessage({type: 'error', message: `Pipeline failed: ${error instanceof Error ? error.message : error}`})
    }
  }

  const stopPipeline = () => {
    onStatusChange("stopped")
    setProgress(0)
    setCurrentStep(0)
  }

  return (
    <div className="space-y-6">
      {alertMessage && (
        <Alert className={`border-2 ${alertMessage.type === 'error' ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'}`}>
          <AlertCircle className={`h-4 w-4 ${alertMessage.type === 'error' ? 'text-red-600' : 'text-green-600'}`} />
          <AlertDescription className={alertMessage.type === 'error' ? 'text-red-800' : 'text-green-800'}>
            {alertMessage.message}
            <Button 
              variant="ghost" 
              size="sm" 
              className="ml-2 h-auto p-1" 
              onClick={() => setAlertMessage(null)}
            >
              ×
            </Button>
          </AlertDescription>
        </Alert>
      )}
      {/* Pipeline Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Pipeline Configuration</CardTitle>
          <CardDescription>Configure your data processing pipeline components</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {awsSession && (
            <Button onClick={loadGlueJobs} disabled={isLoadingJobs} className="mb-4">
              {isLoadingJobs ? <><RefreshCw className="h-4 w-4 mr-2 animate-spin" />Loading Jobs...</> : "Refresh Glue Jobs"}
            </Button>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="kafkaEndpoint">Kafka Endpoint</Label>
              <Input
                id="kafkaEndpoint"
                placeholder="kafka.us-east-1.amazonaws.com:9092"
                value={pipelineConfig.kafkaEndpoint}
                onChange={(e) => setPipelineConfig((prev) => ({ ...prev, kafkaEndpoint: e.target.value }))}
                disabled={!awsSession}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="glueStreamingArn">Glue Streaming ARN</Label>
              <Select
                value={pipelineConfig.glueStreamingArn}
                onValueChange={(value) => setPipelineConfig((prev) => ({ ...prev, glueStreamingArn: value }))}
                disabled={!awsSession}
              >
                <SelectTrigger>
                  <SelectValue placeholder={awsSession ? "Select streaming job" : "Configure AWS session first"} />
                </SelectTrigger>
                <SelectContent>
                  {glueJobs.streamingJobs.map((job) => (
                    <SelectItem key={job.arn} value={job.arn}>
                      {job.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="s3ProcessedArn">S3 Historical Data</Label>
              <Input
                id="s3ProcessedArn"
                placeholder="arn:aws:s3:::historical-data-bucket/*"
                value={pipelineConfig.s3ProcessedArn}
                onChange={(e) => setPipelineConfig((prev) => ({ ...prev, s3ProcessedArn: e.target.value }))}
                disabled={!awsSession}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="glueSparkArn">Glue Spark ARN</Label>
              <Select
                value={pipelineConfig.glueSparkArn}
                onValueChange={(value) => setPipelineConfig((prev) => ({ ...prev, glueSparkArn: value }))}
                disabled={!awsSession}
              >
                <SelectTrigger>
                  <SelectValue placeholder={awsSession ? "Select Spark job" : "Configure AWS session first"} />
                </SelectTrigger>
                <SelectContent>
                  {glueJobs.sparkJobs.map((job) => (
                    <SelectItem key={job.arn} value={job.arn}>
                      {job.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Alert className="border-blue-200 bg-blue-50">
            <AlertCircle className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              Configure either <strong>Kafka + Glue Streaming</strong> OR <strong>S3 Historical + Glue Spark</strong> pair to start pipeline.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Pipeline Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Pipeline Controls</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex space-x-4">
            <Button
              onClick={startPipeline}
              disabled={status === "running" || !credentials || !isValidConfig()}
              className="flex items-center space-x-2"
            >
              <Play className="h-4 w-4" />
              <span>Start Pipeline</span>
            </Button>

            <Button
              variant="outline"
              onClick={stopPipeline}
              disabled={status !== "running"}
              className="flex items-center space-x-2 bg-transparent"
            >
              <Square className="h-4 w-4" />
              <span>Stop Pipeline</span>
            </Button>
          </div>

          {!credentials && (
            <Alert className="border-yellow-200 bg-yellow-50">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              <AlertDescription className="text-yellow-800">
                Configure AWS credentials to start the pipeline.
              </AlertDescription>
            </Alert>
          )}

          {/* Pipeline Flow */}
          <div className="border-t pt-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold">Pipeline Flow</h3>
              <p className="text-sm text-gray-600">Real-time pipeline execution status</p>
            </div>
            
            <div className="flex items-center justify-between mb-6">
              {pipelineSteps.map((step, index) => {
                const Icon = step.icon
                const isActive = index === currentStep && status === "running"
                const isCompleted = index < currentStep || (status === "completed" && index <= currentStep)
                const isError = status === "error" && index === currentStep

                return (
                  <div key={step.name} className="flex items-center">
                    <div
                      className={`flex flex-col items-center space-y-2 ${
                        isError ? "text-red-600" : isCompleted ? "text-green-600" : isActive ? "text-blue-600" : "text-gray-400"
                      }`}
                    >
                      <div
                        className={`p-3 rounded-full border-2 ${
                          isError
                            ? "bg-red-100 border-red-500 text-red-600"
                            : isCompleted
                              ? "bg-green-100 border-green-500 text-green-600"
                              : isActive
                                ? "bg-blue-100 border-blue-500 text-blue-600"
                                : "bg-gray-100 border-gray-300 text-gray-400"
                        }`}
                      >
                        {isError ? (
                          <AlertCircle className="h-6 w-6" />
                        ) : isCompleted ? (
                          <CheckCircle className="h-6 w-6" />
                        ) : isActive ? (
                          <RotateCw className="h-6 w-6 animate-spin" />
                        ) : (
                          <Icon className="h-6 w-6" />
                        )}
                      </div>
                      <span className="text-sm font-medium">{step.name}</span>
                      <Badge
                        variant={isError ? "destructive" : isCompleted ? "default" : isActive ? "secondary" : "outline"}
                      >
                        {isError ? "Failed" : isCompleted ? "Complete" : isActive ? "Running" : "Pending"}
                      </Badge>
                    </div>
                    {index < pipelineSteps.length - 1 && (
                      <ArrowRight className={`h-6 w-6 mx-4 ${isCompleted || isActive ? "text-blue-600" : "text-gray-400"}`} />
                    )}
                  </div>
                )
              })}
            </div>

            {status === "running" && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Pipeline Progress</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} className="w-full" />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Pipeline Status */}
      {status !== "idle" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5" />
              <span>Pipeline Status</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Status:</span>
                <Badge
                  variant={
                    status === "completed"
                      ? "default"
                      : status === "running"
                        ? "secondary"
                        : status === "stopped"
                          ? "destructive"
                          : "outline"
                  }
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span>Current Step:</span>
                <span>{pipelineSteps[currentStep]?.name || "Initializing"}</span>
              </div>
              {status === "completed" && (
                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    Pipeline completed successfully! Ready for query execution.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
