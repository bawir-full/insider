"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Bell, Info, CheckCircle } from "lucide-react"
import { getAnomalyAlerts } from "@/sdk"

interface AnomalyAlert {
  id: string
  type: "critical" | "warning" | "info"
  title: string
  description: string
  time: string
  category: string
}

export function AnomalyAlertList() {
  const [anomalyAlerts, setAnomalyAlerts] = useState<AnomalyAlert[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchAlerts()
    const interval = setInterval(fetchAlerts, 15000) // Refresh anomaly alerts every 15 seconds
    return () => clearInterval(interval)
  }, [])

  const fetchAlerts = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const alerts = await getAnomalyAlerts()
      setAnomalyAlerts(alerts)
    } catch (err) {
      console.error("Failed to fetch anomaly alerts:", err)
      setError("Failed to load alerts. Please try again later.")
      setAnomalyAlerts([]) // Clear alerts on error
    } finally {
      setIsLoading(false)
    }
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "critical":
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-orange-600" />
      case "info":
        return <Info className="h-4 w-4 text-blue-600" />
      default:
        return <Bell className="h-4 w-4 text-slate-600" />
    }
  }

  const getAlertTypeColor = (type: string) => {
    switch (type) {
      case "critical":
        return "bg-red-500 text-white"
      case "warning":
        return "bg-orange-500 text-white"
      case "info":
        return "bg-blue-500 text-white"
      default:
        return "bg-slate-500 text-white"
    }
  }

  return (
    <Card className="bg-white border-slate-200 shadow-sm">
      <CardHeader>
        <CardTitle className="text-slate-900">Anomaly Alerts</CardTitle>
        <CardDescription className="text-slate-500">Real-time detection of unusual wallet activities.</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-16 bg-slate-200 rounded"></div>
            <div className="h-16 bg-slate-200 rounded"></div>
            <div className="h-16 bg-slate-200 rounded"></div>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <AlertTriangle className="h-12 w-12 text-red-400 mx-auto mb-4" />
            <p className="text-red-600">{error}</p>
          </div>
        ) : anomalyAlerts.length > 0 ? (
          <div className="space-y-4">
            {anomalyAlerts.map((alert) => (
              <div
                key={alert.id}
                className="flex items-start space-x-3 p-4 bg-slate-50 rounded-lg border border-slate-200"
              >
                <div
                  className={`flex-shrink-0 ${alert.type === "critical" ? "text-red-600" : alert.type === "warning" ? "text-orange-600" : "text-blue-600"}`}
                >
                  {getAlertIcon(alert.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold text-slate-900">{alert.title}</h4>
                    <Badge className={getAlertTypeColor(alert.type)}>{alert.type}</Badge>
                  </div>
                  <p className="text-sm text-slate-700 leading-relaxed">{alert.description}</p>
                  <div className="flex items-center justify-between mt-2 text-xs text-slate-500">
                    <span>Category: {alert.category}</span>
                    <span>{new Date(alert.time).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-4" />
            <p className="text-slate-500">No anomalies detected recently. All clear!</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
