"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis } from "recharts"
import { TrendingUp, TrendingDown, Minus, Coins } from "lucide-react"

interface TokenData {
  token: string
  percentage: number
  trend: "up" | "down" | "stable"
  value?: number
  change24h?: number
}

interface TopTokensChartProps {
  walletAddress: string
}

export function TopTokensChart({ walletAddress }: TopTokensChartProps) {
  const [tokenData, setTokenData] = useState<TokenData[]>([])
  const [viewMode, setViewMode] = useState<"pie" | "bar">("pie")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchTokenData()
  }, [walletAddress])

  const fetchTokenData = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/insights/${walletAddress}`)
      const data = await response.json()

      // Transform the data to include additional metrics
      const enrichedTokens =
        data.topTokens?.map((token: any) => ({
          ...token,
          value: Math.floor(Math.random() * 100000) + 10000, // Simulated USD value
          change24h: (Math.random() - 0.5) * 20, // -10% to +10% change
        })) || []

      setTokenData(enrichedTokens)
    } catch (error) {
      console.error("Failed to fetch token data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-green-600" />
      case "down":
        return <TrendingDown className="h-4 w-4 text-red-600" />
      default:
        return <Minus className="h-4 w-4 text-slate-600" />
    }
  }

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "up":
        return "text-green-600"
      case "down":
        return "text-red-600"
      default:
        return "text-slate-600"
    }
  }

  const getTokenColor = (index: number) => {
    const colors = [
      "#8B5CF6", // Purple
      "#10B981", // Green
      "#F59E0B", // Yellow
      "#EF4444", // Red
      "#3B82F6", // Blue
      "#8B5A2B", // Brown
    ]
    return colors[index % colors.length]
  }

  // Prepare data for charts
  const pieData = tokenData.map((token, index) => ({
    name: token.token,
    value: token.percentage,
    color: getTokenColor(index),
  }))

  const barData = tokenData.map((token) => ({
    token: token.token,
    percentage: token.percentage,
    value: token.value || 0,
  }))

  const totalValue = tokenData.reduce((sum, token) => sum + (token.value || 0), 0)
  const topToken = tokenData[0]
  const diversificationScore = tokenData.length > 0 ? (1 - (topToken?.percentage || 0) / 100) * 100 : 0

  return (
    <Card className="bg-white border-slate-200 shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Coins className="h-5 w-5 text-purple-600" />
            <CardTitle className="text-slate-900">Token Portfolio</CardTitle>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setViewMode("pie")}
              className={`px-3 py-1 text-sm rounded ${
                viewMode === "pie" ? "bg-purple-600 text-white" : "bg-slate-100 text-slate-700"
              }`}
            >
              Pie
            </button>
            <button
              onClick={() => setViewMode("bar")}
              className={`px-3 py-1 text-sm rounded ${
                viewMode === "bar" ? "bg-purple-600 text-white" : "bg-slate-100 text-slate-700"
              }`}
            >
              Bar
            </button>
          </div>
        </div>
        <CardDescription className="text-slate-500">
          Token distribution and performance for {walletAddress.substring(0, 10)}...
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-64 bg-slate-200 rounded"></div>
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-12 bg-slate-200 rounded"></div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Portfolio Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-3 bg-slate-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">${(totalValue / 1000).toFixed(1)}k</div>
                <p className="text-sm text-slate-600">Total Value</p>
              </div>
              <div className="text-center p-3 bg-slate-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{tokenData.length}</div>
                <p className="text-sm text-slate-600">Tokens Held</p>
              </div>
              <div className="text-center p-3 bg-slate-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{diversificationScore.toFixed(0)}%</div>
                <p className="text-sm text-slate-600">Diversification</p>
              </div>
            </div>

            {/* Chart */}
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                {viewMode === "pie" ? (
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#FFFFFF",
                        border: "1px solid #E2E8F0",
                        borderRadius: "8px",
                        color: "#1E293B",
                      }}
                      formatter={(value: any) => [`${value}%`, "Percentage"]}
                    />
                  </PieChart>
                ) : (
                  <BarChart data={barData}>
                    <XAxis dataKey="token" stroke="#64748B" />
                    <YAxis stroke="#64748B" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#FFFFFF",
                        border: "1px solid #E2E8F0",
                        borderRadius: "8px",
                        color: "#1E293B",
                      }}
                    />
                    <Bar dataKey="percentage" fill="#8B5CF6" />
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>

            {/* Token List */}
            <div className="space-y-3">
              <h4 className="font-semibold text-slate-900">Token Breakdown</h4>
              {tokenData.map((token, index) => (
                <div key={token.token} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: getTokenColor(index) }} />
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-slate-900">{token.token}</span>
                        {getTrendIcon(token.trend)}
                      </div>
                      <p className="text-sm text-slate-500">
                        ${(token.value || 0).toLocaleString()}
                        {token.change24h && (
                          <span className={`ml-2 ${token.change24h >= 0 ? "text-green-600" : "text-red-600"}`}>
                            {token.change24h >= 0 ? "+" : ""}
                            {token.change24h.toFixed(1)}%
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className="text-purple-600 border-purple-600">
                      {token.percentage}%
                    </Badge>
                    <div className="w-20 mt-1">
                      <Progress value={token.percentage} className="h-1" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Portfolio Insights */}
            <div className="pt-4 border-t border-slate-200">
              <h4 className="font-semibold text-slate-900 mb-3">Portfolio Insights</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Badge className="bg-purple-600 text-white">Dominant: {topToken?.token || "N/A"}</Badge>
                  <span className="text-sm text-slate-600">{topToken?.percentage || 0}% of portfolio</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge
                    className={`${
                      diversificationScore > 70
                        ? "bg-green-600"
                        : diversificationScore > 40
                          ? "bg-orange-600"
                          : "bg-red-600"
                    } text-white`}
                  >
                    {diversificationScore > 70
                      ? "Well Diversified"
                      : diversificationScore > 40
                        ? "Moderately Diversified"
                        : "Concentrated"}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
