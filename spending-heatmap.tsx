"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, TrendingUp, Activity } from "lucide-react"

interface HeatmapData {
  day: string
  hours: { hour: number; transactions: number; volume: number }[]
}

interface SpendingHeatmapProps {
  walletAddress: string
}

export function SpendingHeatmap({ walletAddress }: SpendingHeatmapProps) {
  const [heatmapData, setHeatmapData] = useState<HeatmapData[]>([])
  const [selectedMetric, setSelectedMetric] = useState<"transactions" | "volume">("transactions")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchHeatmapData()
  }, [walletAddress])

  const fetchHeatmapData = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/insights/${walletAddress}`)
      const data = await response.json()
      setHeatmapData(data.activityHeatmap || [])
    } catch (error) {
      console.error("Failed to fetch heatmap data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getIntensityColor = (value: number, maxValue: number) => {
    const intensity = maxValue > 0 ? value / maxValue : 0
    const opacity = Math.max(0.1, intensity)
    return `rgba(139, 92, 246, ${opacity})` // Purple with varying opacity
  }

  const maxTransactions = Math.max(...heatmapData.flatMap((day) => day.hours.map((hour) => hour.transactions)), 1)
  const maxVolume = Math.max(...heatmapData.flatMap((day) => day.hours.map((hour) => hour.volume)), 1)

  const getMaxValue = () => (selectedMetric === "transactions" ? maxTransactions : maxVolume)
  const getValue = (hour: { transactions: number; volume: number }) =>
    selectedMetric === "transactions" ? hour.transactions : hour.volume

  const formatValue = (value: number) => {
    if (selectedMetric === "volume") {
      return value > 1000 ? `$${(value / 1000).toFixed(1)}k` : `$${value}`
    }
    return value.toString()
  }

  const hours = Array.from({ length: 24 }, (_, i) => i)
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

  // Calculate statistics
  const totalTransactions = heatmapData.reduce(
    (sum, day) => sum + day.hours.reduce((daySum, hour) => daySum + hour.transactions, 0),
    0,
  )
  const totalVolume = heatmapData.reduce(
    (sum, day) => sum + day.hours.reduce((daySum, hour) => daySum + hour.volume, 0),
    0,
  )
  const avgTransactionsPerHour = totalTransactions / (7 * 24)
  const peakHour = heatmapData
    .flatMap((day, dayIndex) =>
      day.hours.map((hour) => ({
        day: days[dayIndex],
        hour: hour.hour,
        value: getValue(hour),
      })),
    )
    .reduce((max, current) => (current.value > max.value ? current : max), { day: "", hour: 0, value: 0 })

  return (
    <Card className="bg-white border-slate-200 shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Activity className="h-5 w-5 text-purple-600" />
            <CardTitle className="text-slate-900">Activity Heatmap</CardTitle>
          </div>
          <Select value={selectedMetric} onValueChange={(value: "transactions" | "volume") => setSelectedMetric(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="transactions">Transactions</SelectItem>
              <SelectItem value="volume">Volume</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <CardDescription className="text-slate-500">
          Weekly activity pattern for {walletAddress.substring(0, 10)}... showing {selectedMetric}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="animate-pulse">
            <div className="h-64 bg-slate-200 rounded mb-4"></div>
            <div className="grid grid-cols-3 gap-4">
              <div className="h-16 bg-slate-200 rounded"></div>
              <div className="h-16 bg-slate-200 rounded"></div>
              <div className="h-16 bg-slate-200 rounded"></div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-3 bg-slate-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{totalTransactions}</div>
                <p className="text-sm text-slate-600">Total Transactions</p>
              </div>
              <div className="text-center p-3 bg-slate-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">${(totalVolume / 1000).toFixed(1)}k</div>
                <p className="text-sm text-slate-600">Total Volume</p>
              </div>
              <div className="text-center p-3 bg-slate-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {peakHour.day} {peakHour.hour}:00
                </div>
                <p className="text-sm text-slate-600">Peak Activity</p>
              </div>
            </div>

            {/* Heatmap */}
            <div className="overflow-x-auto">
              <div className="min-w-[600px]">
                {/* Hour labels */}
                <div className="flex mb-2">
                  <div className="w-12"></div>
                  {hours.map((hour) => (
                    <div key={hour} className="w-6 text-xs text-center text-slate-500">
                      {hour % 6 === 0 ? `${hour}h` : ""}
                    </div>
                  ))}
                </div>

                {/* Heatmap grid */}
                {heatmapData.map((dayData, dayIndex) => (
                  <div key={dayData.day} className="flex items-center mb-1">
                    <div className="w-12 text-sm font-medium text-slate-700 text-right pr-2">{dayData.day}</div>
                    {hours.map((hour) => {
                      const hourData = dayData.hours.find((h) => h.hour === hour)
                      const value = hourData ? getValue(hourData) : 0
                      return (
                        <div
                          key={hour}
                          className="w-6 h-6 mx-0.5 rounded-sm border border-slate-200 cursor-pointer hover:border-purple-400 transition-colors"
                          style={{
                            backgroundColor: getIntensityColor(value, getMaxValue()),
                          }}
                          title={`${dayData.day} ${hour}:00 - ${formatValue(value)} ${selectedMetric}`}
                        />
                      )
                    })}
                  </div>
                ))}

                {/* Legend */}
                <div className="flex items-center justify-between mt-4 text-xs text-slate-500">
                  <span>Less</span>
                  <div className="flex space-x-1">
                    {[0.2, 0.4, 0.6, 0.8, 1.0].map((opacity) => (
                      <div
                        key={opacity}
                        className="w-3 h-3 rounded-sm border border-slate-200"
                        style={{ backgroundColor: `rgba(139, 92, 246, ${opacity})` }}
                      />
                    ))}
                  </div>
                  <span>More</span>
                </div>
              </div>
            </div>

            {/* Insights */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-200">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="text-sm text-slate-700">
                  Most active: {peakHour.day} at {peakHour.hour}:00
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-blue-600" />
                <span className="text-sm text-slate-700">
                  Avg: {avgTransactionsPerHour.toFixed(1)} transactions/hour
                </span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
