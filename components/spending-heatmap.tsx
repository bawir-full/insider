"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Activity, TrendingUp } from "lucide-react"
import { getBehaviorInsights } from "@/sdk" // Import from SDK

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
  const [timeRange, setTimeRange] = useState<string>("7d") // Keep timeRange for UI, but data is static
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchHeatmapData()
  }, [walletAddress, timeRange])

  const fetchHeatmapData = async () => {
    setIsLoading(true)
    try {
      // Use the SDK function which now returns dummy data
      const behaviorData = await getBehaviorInsights(walletAddress)
      setHeatmapData(behaviorData.dailyActivityHeatmap || [])
    } catch (error) {
      console.error("Failed to fetch heatmap data:", error)
      setHeatmapData(generateMockHeatmapData()) // Fallback to local mock if SDK fails
    } finally {
      setIsLoading(false)
    }
  }

  const generateMockHeatmapData = (): HeatmapData[] => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    return days.map((day) => ({
      day,
      hours: Array.from({ length: 24 }, (_, hour) => ({
        hour,
        transactions: Math.floor(Math.random() * 50),
        volume: Math.floor(Math.random() * 10000),
      })),
    }))
  }

  const getIntensityColor = (value: number, maxValue: number) => {
    if (maxValue === 0) return "bg-slate-100"
    const intensity = value / maxValue
    if (intensity === 0) return "bg-slate-100"
    if (intensity < 0.2) return "bg-purple-200"
    if (intensity < 0.4) return "bg-purple-300"
    if (intensity < 0.6) return "bg-purple-400"
    if (intensity < 0.8) return "bg-purple-500"
    return "bg-purple-600"
  }

  const maxValue = Math.max(...heatmapData.flatMap((day) => day.hours.map((hour) => hour[selectedMetric])))

  const totalTransactions = heatmapData.reduce(
    (sum, day) => sum + day.hours.reduce((daySum, hour) => daySum + hour.transactions, 0),
    0,
  )

  const totalVolume = heatmapData.reduce(
    (sum, day) => sum + day.hours.reduce((daySum, hour) => daySum + hour.volume, 0),
    0,
  )

  const peakHour = heatmapData
    .flatMap((day) => day.hours.map((hour) => ({ ...hour, day: day.day })))
    .reduce((peak, current) => (current[selectedMetric] > peak[selectedMetric] ? current : peak), {
      hour: 0,
      transactions: 0,
      volume: 0,
      day: "Mon",
    })

  return (
    <Card className="bg-white border-slate-200 shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Activity className="h-5 w-5 text-purple-600" />
            <CardTitle className="text-slate-900">Activity Heatmap</CardTitle>
          </div>
          <div className="flex items-center space-x-2">
            <Select
              value={selectedMetric}
              onValueChange={(value: "transactions" | "volume") => setSelectedMetric(value)}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="transactions">Transactions</SelectItem>
                <SelectItem value="volume">Volume</SelectItem>
              </SelectContent>
            </Select>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">7D</SelectItem>
                <SelectItem value="30d">30D</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <CardDescription className="text-slate-500">
          {selectedMetric === "transactions" ? "Transaction" : "Volume"} activity patterns for{" "}
          {walletAddress.substring(0, 10)}... over the past {timeRange}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-64 bg-slate-200 rounded"></div>
            <div className="grid grid-cols-3 gap-4">
              <div className="h-16 bg-slate-200 rounded"></div>
              <div className="h-16 bg-slate-200 rounded"></div>
              <div className="h-16 bg-slate-200 rounded"></div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-3 bg-slate-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{totalTransactions.toLocaleString()}</div>
                <p className="text-sm text-slate-600">Total Transactions</p>
              </div>
              <div className="text-center p-3 bg-slate-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">${(totalVolume / 1000).toFixed(1)}K</div>
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
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-slate-900">Activity by Day & Hour</h4>
                <div className="flex items-center space-x-2 text-sm text-slate-600">
                  <span>Less</span>
                  <div className="flex space-x-1">
                    <div className="w-3 h-3 bg-slate-100 rounded-sm"></div>
                    <div className="w-3 h-3 bg-purple-200 rounded-sm"></div>
                    <div className="w-3 h-3 bg-purple-400 rounded-sm"></div>
                    <div className="w-3 h-3 bg-purple-600 rounded-sm"></div>
                  </div>
                  <span>More</span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <div className="min-w-full">
                  {/* Hour labels */}
                  <div className="flex mb-2">
                    <div className="w-12"></div>
                    {Array.from({ length: 24 }, (_, i) => (
                      <div key={i} className="w-4 text-xs text-slate-500 text-center">
                        {i % 6 === 0 ? i : ""}
                      </div>
                    ))}
                  </div>

                  {/* Heatmap grid */}
                  {heatmapData.map((dayData) => (
                    <div key={dayData.day} className="flex items-center mb-1">
                      <div className="w-12 text-xs text-slate-600 font-medium">{dayData.day}</div>
                      {dayData.hours.map((hourData) => (
                        <div
                          key={hourData.hour}
                          className={`w-4 h-4 rounded-sm mr-0.5 ${getIntensityColor(
                            hourData[selectedMetric],
                            maxValue,
                          )} cursor-pointer hover:ring-2 hover:ring-purple-300 transition-all`}
                          title={`${dayData.day} ${hourData.hour}:00 - ${
                            selectedMetric === "transactions"
                              ? `${hourData.transactions} transactions`
                              : `$${hourData.volume.toLocaleString()} volume`
                          }`}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Insights */}
            <div className="pt-4 border-t border-slate-200">
              <h4 className="font-semibold text-slate-900 mb-3">Activity Insights</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-slate-700">
                    Most active on {peakHour.day} at {peakHour.hour}:00
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-blue-600" />
                  <span className="text-sm text-slate-700">
                    Average {(totalTransactions / 7).toFixed(0)} transactions per day
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
