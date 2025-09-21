"use client"

import { useState } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, X, Shield } from "lucide-react"

interface SecurityAlert {
  id: string
  type: "THREAT_DETECTED" | "SUSPICIOUS_ACTIVITY" | "POLICY_VIOLATION" | "SYSTEM_ALERT"
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"
  title: string
  description: string
  timestamp: Date
  actionRequired: boolean
  dismissed: boolean
}

export function SecurityAlertSystem() {
  const [alerts, setAlerts] = useState<SecurityAlert[]>([
    {
      id: "1",
      type: "THREAT_DETECTED",
      severity: "HIGH",
      title: "Multiple Failed Login Attempts",
      description: "IP address 45.123.45.67 has attempted to login 15 times in the last 10 minutes",
      timestamp: new Date(),
      actionRequired: true,
      dismissed: false,
    },
    {
      id: "2",
      type: "SUSPICIOUS_ACTIVITY",
      severity: "MEDIUM",
      title: "Unusual Bulk Operation",
      description: "User manager@company.com performed bulk deletion of 25 candidates",
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      actionRequired: false,
      dismissed: false,
    },
  ])

  const dismissAlert = (alertId: string) => {
    setAlerts((prev) => prev.map((alert) => (alert.id === alertId ? { ...alert, dismissed: true } : alert)))
  }

  const getSeverityVariant = (severity: string) => {
    switch (severity) {
      case "LOW":
        return "default"
      case "MEDIUM":
        return "secondary"
      case "HIGH":
        return "destructive"
      case "CRITICAL":
        return "destructive"
      default:
        return "outline"
    }
  }

  const activeAlerts = alerts.filter((alert) => !alert.dismissed)

  if (activeAlerts.length === 0) return null

  return (
    <div className="space-y-3">
      {activeAlerts.map((alert) => (
        <Alert
          key={alert.id}
          variant={alert.severity === "HIGH" || alert.severity === "CRITICAL" ? "destructive" : "default"}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-4 w-4 mt-0.5" />
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{alert.title}</span>
                  <Badge variant={getSeverityVariant(alert.severity)} className="text-xs">
                    {alert.severity}
                  </Badge>
                </div>
                <AlertDescription className="text-sm">{alert.description}</AlertDescription>
                <div className="text-xs text-muted-foreground">{alert.timestamp.toLocaleString()}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {alert.actionRequired && (
                <Button size="sm" variant="outline">
                  <Shield className="h-3 w-3 mr-1" />
                  Take Action
                </Button>
              )}
              <Button size="sm" variant="ghost" onClick={() => dismissAlert(alert.id)}>
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </Alert>
      ))}
    </div>
  )
}
