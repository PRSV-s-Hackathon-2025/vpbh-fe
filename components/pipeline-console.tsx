"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Play, Square, Database, Zap, ArrowRight, CheckCircle, AlertCircle, Clock, Activity } from "lucide-react"

interface PipelineConsoleProps {
  credentials: any
  dataSource: any
  onStatusChange: (status: string) => void
  status: string
}

export default function PipelineConsole({ credentials, dataSource, onStatusChange, status }: PipelineConsoleProps) {
  const [pipelineConfig, setPipelineConfig] = useState({
    kafkaEndpoint: "",
    glueStreamingArn: "",
    glueSparkArn: "",
    s3ProcessedArn: "",
    albEndpoint: "",
  })
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)

  const pipelineSteps = [
    { name: "Raw Source", icon: Database, status: "completed" },
    { name: "Data Processing", icon: Zap, status: "running" },
    { name: "Data Ingestion", icon: Activity, status: "pending" },
    { name: "ClickHouse", icon: Database, status: "pending" },
  ]

  const startPipeline = () => {
    if (!credentials || !dataSource) {
      alert("Please configure credentials and data source first")
      return
    }

    onStatusChange("running")
    setProgress(0)
    setCurrentStep(0)

    // Simulate pipeline execution
    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + 2
        if (newProgress >= 100) {
          clearInterval(interval)
          onStatusChange("completed")
          setCurrentStep(3)
          return 100
        }

        // Update current step based on progress
        if (newProgress > 75) setCurrentStep(3)
        else if (newProgress > 50) setCurrentStep(2)
        else if (newProgress > 25) setCurrentStep(1)

        return newProgress
      })
    }, 100)
  }

  const stopPipeline = () => {
    onStatusChange("stopped")
    setProgress(0)
    setCurrentStep(0)
  }

  return (
    <div className="space-y-6">
      {/* Pipeline Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Pipeline Configuration</CardTitle>
          <CardDescription>Configure your data processing pipeline components</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="kafkaEndpoint">Kafka Endpoint</Label>
              <Input
                id="kafkaEndpoint"
                placeholder="kafka.us-east-1.amazonaws.com:9092"
                value={pipelineConfig.kafkaEndpoint}
                onChange={(e) => setPipelineConfig((prev) => ({ ...prev, kafkaEndpoint: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="glueStreamingArn">Glue Streaming ARN</Label>
              <Input
                id="glueStreamingArn"
                placeholder="arn:aws:glue:us-east-1:123456789012:job/streaming-job"
                value={pipelineConfig.glueStreamingArn}
                onChange={(e) => setPipelineConfig((prev) => ({ ...prev, glueStreamingArn: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="glueSparkArn">Glue Spark ARN</Label>
              <Input
                id="glueSparkArn"
                placeholder="arn:aws:glue:us-east-1:123456789012:job/spark-job"
                value={pipelineConfig.glueSparkArn}
                onChange={(e) => setPipelineConfig((prev) => ({ ...prev, glueSparkArn: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="s3ProcessedArn">S3 Processed Data ARN</Label>
              <Input
                id="s3ProcessedArn"
                placeholder="arn:aws:s3:::processed-data-bucket/*"
                value={pipelineConfig.s3ProcessedArn}
                onChange={(e) => setPipelineConfig((prev) => ({ ...prev, s3ProcessedArn: e.target.value }))}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="albEndpoint">ALB Ingestion Endpoint ARN</Label>
              <Input
                id="albEndpoint"
                placeholder="arn:aws:elasticloadbalancing:us-east-1:123456789012:loadbalancer/app/my-alb/50dc6c495c0c9188"
                value={pipelineConfig.albEndpoint}
                onChange={(e) => setPipelineConfig((prev) => ({ ...prev, albEndpoint: e.target.value }))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pipeline Visualization */}
      <Card>
        <CardHeader>
          <CardTitle>Pipeline Flow</CardTitle>
          <CardDescription>Real-time pipeline execution status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-6">
            {pipelineSteps.map((step, index) => {
              const Icon = step.icon
              const isActive = index <= currentStep
              const isCompleted = index < currentStep || (status === "completed" && index === currentStep)

              return (
                <div key={step.name} className="flex items-center">
                  <div
                    className={`flex flex-col items-center space-y-2 ${isActive ? "text-blue-600" : "text-gray-400"}`}
                  >
                    <div
                      className={`p-3 rounded-full border-2 ${
                        isCompleted
                          ? "bg-green-100 border-green-500 text-green-600"
                          : isActive
                            ? "bg-blue-100 border-blue-500 text-blue-600"
                            : "bg-gray-100 border-gray-300 text-gray-400"
                      }`}
                    >
                      {isCompleted ? <CheckCircle className="h-6 w-6" /> : <Icon className="h-6 w-6" />}
                    </div>
                    <span className="text-sm font-medium">{step.name}</span>
                    <Badge
                      variant={isCompleted ? "default" : isActive && status === "running" ? "secondary" : "outline"}
                    >
                      {isCompleted ? "Complete" : isActive && status === "running" ? "Running" : "Pending"}
                    </Badge>
                  </div>
                  {index < pipelineSteps.length - 1 && (
                    <ArrowRight className={`h-6 w-6 mx-4 ${isActive ? "text-blue-600" : "text-gray-400"}`} />
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
        </CardContent>
      </Card>

      {/* Pipeline Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Pipeline Controls</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <Button
              onClick={startPipeline}
              disabled={status === "running" || !credentials || !dataSource}
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
            <Alert className="mt-4 border-yellow-200 bg-yellow-50">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              <AlertDescription className="text-yellow-800">
                Configure AWS credentials to start the pipeline.
              </AlertDescription>
            </Alert>
          )}

          {!dataSource && credentials && (
            <Alert className="mt-4 border-yellow-200 bg-yellow-50">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              <AlertDescription className="text-yellow-800">
                Configure data source to start the pipeline.
              </AlertDescription>
            </Alert>
          )}
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
