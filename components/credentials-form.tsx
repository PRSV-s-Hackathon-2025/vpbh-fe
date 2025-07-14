"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Eye, EyeOff, CheckCircle, AlertCircle } from "lucide-react"

interface CredentialsFormProps {
  onCredentialsSet: (credentials: any) => void
  credentials: any
}

export default function CredentialsForm({ onCredentialsSet, credentials }: CredentialsFormProps) {
  const [formData, setFormData] = useState({
    accessKeyId: "",
    secretAccessKey: "",
    region: "us-east-1",
    sessionToken: "",
  })
  const [showSecrets, setShowSecrets] = useState({
    secretAccessKey: false,
    sessionToken: false,
  })
  const [isConnecting, setIsConnecting] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<"idle" | "success" | "error">("idle")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsConnecting(true)
    setConnectionStatus("idle")

    // Simulate connection test
    setTimeout(() => {
      if (formData.accessKeyId && formData.secretAccessKey) {
        setConnectionStatus("success")
        onCredentialsSet(formData)
      } else {
        setConnectionStatus("error")
      }
      setIsConnecting(false)
    }, 2000)
  }

  const toggleSecretVisibility = (field: string) => {
    setShowSecrets((prev) => ({
      ...prev,
      [field]: !prev[field as keyof typeof prev],
    }))
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="accessKeyId">Access Key ID *</Label>
            <Input
              id="accessKeyId"
              type="text"
              placeholder="AKIA..."
              value={formData.accessKeyId}
              onChange={(e) => setFormData((prev) => ({ ...prev, accessKeyId: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="region">AWS Region *</Label>
            <Select
              value={formData.region}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, region: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="us-east-1">US East (N. Virginia)</SelectItem>
                <SelectItem value="us-west-2">US West (Oregon)</SelectItem>
                <SelectItem value="eu-west-1">Europe (Ireland)</SelectItem>
                <SelectItem value="ap-southeast-1">Asia Pacific (Singapore)</SelectItem>
                <SelectItem value="ap-northeast-1">Asia Pacific (Tokyo)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="secretAccessKey">Secret Access Key *</Label>
          <div className="relative">
            <Input
              id="secretAccessKey"
              type={showSecrets.secretAccessKey ? "text" : "password"}
              placeholder="Enter your secret access key"
              value={formData.secretAccessKey}
              onChange={(e) => setFormData((prev) => ({ ...prev, secretAccessKey: e.target.value }))}
              required
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 transform -translate-y-1/2"
              onClick={() => toggleSecretVisibility("secretAccessKey")}
            >
              {showSecrets.secretAccessKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="sessionToken">Session Token (Optional)</Label>
          <div className="relative">
            <Input
              id="sessionToken"
              type={showSecrets.sessionToken ? "text" : "password"}
              placeholder="Enter session token if using temporary credentials"
              value={formData.sessionToken}
              onChange={(e) => setFormData((prev) => ({ ...prev, sessionToken: e.target.value }))}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 transform -translate-y-1/2"
              onClick={() => toggleSecretVisibility("sessionToken")}
            >
              {showSecrets.sessionToken ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        <Button type="submit" disabled={isConnecting} className="w-full">
          {isConnecting ? "Testing Connection..." : "Test Connection & Save"}
        </Button>
      </form>

      {connectionStatus === "success" && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Successfully connected to AWS! Credentials have been saved securely.
          </AlertDescription>
        </Alert>
      )}

      {connectionStatus === "error" && (
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            Failed to connect to AWS. Please check your credentials and try again.
          </AlertDescription>
        </Alert>
      )}

      {credentials && (
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-900 text-sm">Current Connection</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-blue-800">
              <p>
                <strong>Region:</strong> {credentials.region}
              </p>
              <p>
                <strong>Access Key:</strong> {credentials.accessKeyId.substring(0, 8)}...
              </p>
              <p>
                <strong>Status:</strong> Connected
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
