"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, AlertCircle, Database, Folder } from "lucide-react"

interface DataSourceConfigProps {
  credentials: any
  onDataSourceSet: (dataSource: any) => void
  dataSource: any
}

export default function DataSourceConfig({ credentials, onDataSourceSet, dataSource }: DataSourceConfigProps) {
  const [formData, setFormData] = useState({
    s3Bucket: "",
    s3Prefix: "",
    s3Arn: "",
    clickhouseEndpoint: "",
    clickhouseDatabase: "default",
    clickhouseTable: "",
    dataFormat: "parquet",
  })
  const [isValidating, setIsValidating] = useState(false)
  const [validationStatus, setValidationStatus] = useState<"idle" | "success" | "error">("idle")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!credentials) {
      alert("Please configure AWS credentials first")
      return
    }

    setIsValidating(true)
    setValidationStatus("idle")

    // Simulate validation
    setTimeout(() => {
      if (formData.s3Bucket && formData.clickhouseEndpoint) {
        setValidationStatus("success")
        onDataSourceSet(formData)
      } else {
        setValidationStatus("error")
      }
      setIsValidating(false)
    }, 2000)
  }

  return (
    <div className="space-y-6">
      {!credentials && (
        <Alert className="border-yellow-200 bg-yellow-50">
          <AlertCircle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800">
            Please configure AWS credentials first before setting up data sources.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* S3 Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Folder className="h-5 w-5" />
              <span>S3 Data Source</span>
            </CardTitle>
            <CardDescription>Configure your S3 bucket and data location</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="s3Bucket">S3 Bucket Name *</Label>
              <Input
                id="s3Bucket"
                placeholder="my-data-bucket"
                value={formData.s3Bucket}
                onChange={(e) => setFormData((prev) => ({ ...prev, s3Bucket: e.target.value }))}
                disabled={!credentials}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="s3Prefix">S3 Prefix (Optional)</Label>
              <Input
                id="s3Prefix"
                placeholder="data/clickhouse/"
                value={formData.s3Prefix}
                onChange={(e) => setFormData((prev) => ({ ...prev, s3Prefix: e.target.value }))}
                disabled={!credentials}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="s3Arn">S3 ARN *</Label>
              <Textarea
                id="s3Arn"
                placeholder="arn:aws:s3:::my-data-bucket/data/clickhouse/*"
                value={formData.s3Arn}
                onChange={(e) => setFormData((prev) => ({ ...prev, s3Arn: e.target.value }))}
                disabled={!credentials}
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dataFormat">Data Format</Label>
              <Select
                value={formData.dataFormat}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, dataFormat: value }))}
                disabled={!credentials}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="parquet">Parquet</SelectItem>
                  <SelectItem value="csv">CSV</SelectItem>
                  <SelectItem value="json">JSON</SelectItem>
                  <SelectItem value="orc">ORC</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* ClickHouse Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Database className="h-5 w-5" />
              <span>ClickHouse Configuration</span>
            </CardTitle>
            <CardDescription>Configure your ClickHouse connection</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="clickhouseEndpoint">ClickHouse Endpoint *</Label>
              <Input
                id="clickhouseEndpoint"
                placeholder="tcp://default:@localhost:9000/default"
                value={formData.clickhouseEndpoint}
                onChange={(e) => setFormData((prev) => ({ ...prev, clickhouseEndpoint: e.target.value }))}
                disabled={!credentials}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="clickhouseDatabase">Database</Label>
              <Input
                id="clickhouseDatabase"
                placeholder="default"
                value={formData.clickhouseDatabase}
                onChange={(e) => setFormData((prev) => ({ ...prev, clickhouseDatabase: e.target.value }))}
                disabled={!credentials}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="clickhouseTable">Table Name *</Label>
              <Input
                id="clickhouseTable"
                placeholder="benchmark_data"
                value={formData.clickhouseTable}
                onChange={(e) => setFormData((prev) => ({ ...prev, clickhouseTable: e.target.value }))}
                disabled={!credentials}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <form onSubmit={handleSubmit}>
        <Button type="submit" disabled={isValidating || !credentials} className="w-full">
          {isValidating ? "Validating Configuration..." : "Validate & Save Configuration"}
        </Button>
      </form>

      {validationStatus === "success" && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Data source configuration validated successfully! Ready to set up pipeline.
          </AlertDescription>
        </Alert>
      )}

      {validationStatus === "error" && (
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            Failed to validate data source configuration. Please check your settings.
          </AlertDescription>
        </Alert>
      )}

      {dataSource && (
        <Card className="bg-green-50 border-green-200">
          <CardHeader>
            <CardTitle className="text-green-900 text-sm">Active Data Source</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-green-800">
              <div className="flex items-center justify-between">
                <span>
                  <strong>S3 Bucket:</strong> {dataSource.s3Bucket}
                </span>
                <Badge variant="outline" className="text-green-700 border-green-300">
                  Connected
                </Badge>
              </div>
              <p>
                <strong>ClickHouse:</strong> {dataSource.clickhouseDatabase}.{dataSource.clickhouseTable}
              </p>
              <p>
                <strong>Format:</strong> {dataSource.dataFormat.toUpperCase()}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
