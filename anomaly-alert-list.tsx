"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertTriangle, Shield, Zap, TrendingUp, Waves, RefreshCw, Filter, Bell, Eye, X } from "lucide-react"

interface AnomalyAlert {
  id: string
  type: "critical" | "warning" | "info"
  title: string
  description: string
  time: string
  category: string
  walletAddress?: string
  amount?: number
  token?: string
  metadata?: any
}

export function AnomalyAlertList() {
  const [alerts, setAlerts] = useState<AnomalyAlert[]>([])
  const [filteredAlerts, setFilteredAlerts] = useState<AnomalyAlert[]>([])
  const [selectedSeverity, setSelectedSeverity] = useState<string>("all")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [isLoading, setIsLoading] = useState(false)
  const [dismissedAlerts, setDismissedAlerts] = useState<Set<string>>(new Set())

  useEffect(() => {
    fetchAlerts()
    const interval = setInterval(fetchAlerts, 15000) // Refresh every 15 seconds
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    applyFilters()
  }, [alerts, selectedSeverity, selectedCategory, dismissedAlerts])

  const fetchAlerts = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/alerts/anomalies")
      const data = await response.json()
      setAlerts(data)
    } catch (error) {
      console.error("Failed to fetch anomaly alerts:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = alerts.filter((alert) => !dismissedAlerts.has(alert.id))

    if (selectedSeverity !== "all") {
      filtered = filtered.filter((alert) => alert.type === selectedSeverity)
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter((alert) => alert.category === selectedCategory)
    }

    setFilteredAlerts(filtered)
  }

  const dismissAlert = (alertId: string) => {
    setDismissedAlerts((prev) => new Set([...prev, alertId]))
  }

  const getAlertIcon = (category: string) => {
    switch (category) {
      case "whale-movement":
        return <Waves className="h-4 w-4" />
      case "volume-spike":
        return <TrendingUp className="h-4 w-4" />
      case "risky-contract":
        return <Shield className="h-4 w-4" />
      case "flash_loan":
        return <Zap className="h-4 w-4" />
      case "liquidity":
        return <Waves className="h-4 w-4" />
      default:
        return <AlertTriangle className="h-4 w-4" />
    }
  }

  const getAlertColor = (type: string) => {
    switch (type) {
      case "critical":
        return "border-red-500 bg-red-50"
      case "warning":
        return "border-orange-500 bg-orange-50"
      case "info":
        return "border-blue-500 bg-blue-50"
      default:
        return "border-slate-300 bg-slate-50"
    }
  }

  const getAlertTextColor = (type: string) => {
    switch (type) {
      case "critical":
        return "text-red-800"
      case "warning":
        return "text-orange-800"
      case "info":
        return "text-blue-800"
      default:
        return "text-slate-700"
    }
  }

  const getBadgeColor = (type: string) => {
    switch (type) {
      case "critical":
        return "bg-red-600 text-white"
      case "warning":
        return "bg-orange-600 text-white"
      case "info":
        return "bg-blue-600 text-white"
      default:
        return "bg-slate-600 text-white"
    }
  }

  const uniqueCategories = [...new Set(alerts.map((alert) => alert.category))]
  const criticalCount = alerts.filter((alert) => alert.type === "critical" && !dismissedAlerts.has(alert.id)).length
  const warningCount = alerts.filter((alert) => alert.type === "warning" && !dismissedAlerts.has(alert.id)).length

  return (
    <Card className="bg-white border-slate-200 shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bell className="h-5 w-5 text-purple-600" />
            <CardTitle className="text-slate-900">Anomaly Alerts</CardTitle>
            {(criticalCount > 0 || warningCount > 0) && (
              <div className="flex space-x-1">
                {criticalCount > 0 && <Badge className="bg-red-600 text-white text-xs">{criticalCount} Critical</Badge>}
                {warningCount > 0 && <Badge className="bg-orange-600 text-white text-xs">{warningCount} Warning</Badge>}
              </div>
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchAlerts}
            disabled={isLoading}
            className="border-slate-300 text-slate-700 hover:bg-slate-100 bg-transparent"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
        <CardDescription className="text-slate-500">
          Real-time anomaly detection and security alerts across the Sei ecosystem
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Filters */}
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-slate-500" />
              <Select value={selectedSeverity} onValueChange={setSelectedSeverity}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="info">Info</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {uniqueCategories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category.replace(/[_-]/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Badge variant="outline" className="text-slate-600 border-slate-300">
              {filteredAlerts.length} alerts
            </Badge>
          </div>

          {/* Alert List */}
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {isLoading && alerts.length === 0 ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-20 bg-slate-200 rounded-lg"></div>
                  </div>
                ))}
              </div>
            ) : filteredAlerts.length > 0 ? (
              filteredAlerts.map((alert) => (
                <Alert key={alert.id} className={`${getAlertColor(alert.type)} relative`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <div className={`${getAlertTextColor(alert.type)} mt-0.5`}>{getAlertIcon(alert.category)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <AlertTitle className={`${getAlertTextColor(alert.type)} text-sm font-medium`}>
                            {alert.title}
                          </AlertTitle>
                          <Badge className={`${getBadgeColor(alert.type)} text-xs`}>{alert.type.toUpperCase()}</Badge>
                        </div>
                        <AlertDescription className={`${getAlertTextColor(alert.type)} text-sm`}>
                          {alert.description}
                          {alert.walletAddress && <div className="mt-1 text-xs">Wallet: {alert.walletAddress}</div>}
                          {alert.amount && alert.token && (
                            <div className="mt-1 text-xs">
                              Amount: {alert.amount.toLocaleString()} {alert.token}
                            </div>
                          )}
                        </AlertDescription>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-slate-500">{alert.time}</span>
                          <div className="flex space-x-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 px-2 text-xs text-slate-600 hover:text-slate-800"
                            >
                              <Eye className="h-3 w-3 mr-1" />
                              View Details
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => dismissAlert(alert.id)}
                      className="h-6 w-6 p-0 text-slate-400 hover:text-slate-600 ml-2"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </Alert>
              ))
            ) : (
              <div className="text-center py-8">
                <Bell className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500 mb-2">No anomaly alerts found</p>
                <p className="text-sm text-slate-400">
                  {alerts.length === 0
                    ? "The system is monitoring for suspicious activities"
                    : "Try adjusting your filters to see more alerts"}
                </p>
              </div>
            )}
          </div>

          {/* Summary Stats */}
          {alerts.length > 0 && (
            <div className="pt-4 border-t border-slate-200">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-lg font-bold text-red-600">
                    {alerts.filter((a) => a.type === "critical").length}
                  </div>
                  <p className="text-xs text-slate-500">Critical</p>
                </div>
                <div>
                  <div className="text-lg font-bold text-orange-600">
                    {alerts.filter((a) => a.type === "warning").length}
                  </div>
                  <p className="text-xs text-slate-500">Warning</p>
                </div>
                <div>
                  <div className="text-lg font-bold text-blue-600">
                    {alerts.filter((a) => a.type === "info").length}
                  </div>
                  <p className="text-xs text-slate-500">Info</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
