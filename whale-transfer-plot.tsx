"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"
import { TrendingUp, ArrowUpRight, ArrowDownLeft, Filter, Waves } from "lucide-react"

interface WhaleTransfer {
  id: string
  amount: number
  token: string
  direction: "in" | "out"
  timestamp: string
  counterparty: string
  usdValue?: number
}

interface WhaleTransferPlotProps {
  walletAddress: string
}

export function WhaleTransferPlot({ walletAddress }: WhaleTransferPlotProps) {
  const [transfers, setTransfers] = useState<WhaleTransfer[]>([])
  const [filteredTransfers, setFilteredTransfers] = useState<WhaleTransfer[]>([])
  const [selectedToken, setSelectedToken] = useState<string>("all")
  const [selectedDirection, setSelectedDirection] = useState<string>("all")
  const [timeRange, setTimeRange] = useState<string>("7d")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchWhaleTransfers()
  }, [walletAddress, timeRange])

  useEffect(() => {
    applyFilters()
  }, [transfers, selectedToken, selectedDirection])

  const fetchWhaleTransfers = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/insights/${walletAddress}`)
      const data = await response.json()

      // Enrich whale transfers with additional data
      const enrichedTransfers =
        data.whaleTransfers?.map((transfer: any) => ({
          ...transfer,
          usdValue: transfer.amount * 0.7, // Simulated USD conversion
        })) || []

      setTransfers(enrichedTransfers)
    } catch (error) {
      console.error("Failed to fetch whale transfers:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = transfers

    if (selectedToken !== "all") {
      filtered = filtered.filter((t) => t.token === selectedToken)
    }

    if (selectedDirection !== "all") {
      filtered = filtered.filter((t) => t.direction === selectedDirection)
    }

    setFilteredTransfers(filtered)
  }

  // Prepare data for scatter plot
  const scatterData = filteredTransfers.map((transfer, index) => ({
    x: new Date(transfer.timestamp).getTime(),
    y: transfer.usdValue || transfer.amount * 0.7,
    amount: transfer.amount,
    token: transfer.token,
    direction: transfer.direction,
    counterparty: transfer.counterparty,
    timestamp: transfer.timestamp,
    size: Math.min(Math.max((transfer.usdValue || 0) / 10000, 5), 20), // Size based on USD value
  }))

  const getTransferColor = (direction: string) => {
    return direction === "in" ? "#10B981" : "#EF4444" // Green for in, Red for out
  }

  const uniqueTokens = [...new Set(transfers.map((t) => t.token))]
  const totalInflow = transfers.filter((t) => t.direction === "in").reduce((sum, t) => sum + (t.usdValue || 0), 0)
  const totalOutflow = transfers.filter((t) => t.direction === "out").reduce((sum, t) => sum + (t.usdValue || 0), 0)
  const netFlow = totalInflow - totalOutflow

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString()
  }

  const formatValue = (value: number) => {
    if (value > 1000000) return `$${(value / 1000000).toFixed(1)}M`
    if (value > 1000) return `$${(value / 1000).toFixed(1)}K`
    return `$${value.toFixed(0)}`
  }

  return (
    <Card className="bg-white border-slate-200 shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Waves className="h-5 w-5 text-purple-600" />
            <CardTitle className="text-slate-900">Whale Transfer Analysis</CardTitle>
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-slate-500" />
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1d">1D</SelectItem>
                <SelectItem value="7d">7D</SelectItem>
                <SelectItem value="30d">30D</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <CardDescription className="text-slate-500">
          Large transfer patterns for {walletAddress.substring(0, 10)}... (transfers &gt; $50k)
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
              <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center justify-center space-x-1 mb-1">
                  <ArrowDownLeft className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-700">Inflow</span>
                </div>
                <div className="text-2xl font-bold text-green-600">{formatValue(totalInflow)}</div>
              </div>
              <div className="text-center p-3 bg-red-50 rounded-lg border border-red-200">
                <div className="flex items-center justify-center space-x-1 mb-1">
                  <ArrowUpRight className="h-4 w-4 text-red-600" />
                  <span className="text-sm font-medium text-red-700">Outflow</span>
                </div>
                <div className="text-2xl font-bold text-red-600">{formatValue(totalOutflow)}</div>
              </div>
              <div className="text-center p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex items-center justify-center space-x-1 mb-1">
                  <TrendingUp className="h-4 w-4 text-slate-600" />
                  <span className="text-sm font-medium text-slate-700">Net Flow</span>
                </div>
                <div className={`text-2xl font-bold ${netFlow >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {netFlow >= 0 ? "+" : ""}
                  {formatValue(netFlow)}
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4">
              <Select value={selectedToken} onValueChange={setSelectedToken}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Token" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tokens</SelectItem>
                  {uniqueTokens.map((token) => (
                    <SelectItem key={token} value={token}>
                      {token}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedDirection} onValueChange={setSelectedDirection}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Direction" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Directions</SelectItem>
                  <SelectItem value="in">Inflow</SelectItem>
                  <SelectItem value="out">Outflow</SelectItem>
                </SelectContent>
              </Select>

              <Badge variant="outline" className="text-slate-600 border-slate-300">
                {filteredTransfers.length} transfers
              </Badge>
            </div>

            {/* Scatter Plot */}
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart data={scatterData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis
                    type="number"
                    dataKey="x"
                    domain={["dataMin", "dataMax"]}
                    tickFormatter={formatTimestamp}
                    stroke="#64748B"
                  />
                  <YAxis type="number" dataKey="y" tickFormatter={formatValue} stroke="#64748B" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#FFFFFF",
                      border: "1px solid #E2E8F0",
                      borderRadius: "8px",
                      color: "#1E293B",
                    }}
                    formatter={(value: any, name: any, props: any) => [
                      `${formatValue(value)}`,
                      `${props.payload.direction === "in" ? "Inflow" : "Outflow"}`,
                    ]}
                    labelFormatter={(value: any) => `Date: ${formatTimestamp(value)}`}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload
                        return (
                          <div className="bg-white p-3 border border-slate-200 rounded-lg shadow-lg">
                            <p className="font-medium text-slate-900">
                              {data.amount.toLocaleString()} {data.token}
                            </p>
                            <p className="text-sm text-slate-600">
                              {formatValue(data.y)} • {data.direction === "in" ? "Inflow" : "Outflow"}
                            </p>
                            <p className="text-xs text-slate-500">{new Date(data.timestamp).toLocaleString()}</p>
                            <p className="text-xs text-slate-500">
                              {data.direction === "in" ? "From" : "To"}: {data.counterparty}
                            </p>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Scatter dataKey="y" fill="#8B5CF6">
                    {scatterData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={getTransferColor(entry.direction)} />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>

            {/* Recent Transfers List */}
            <div className="space-y-3">
              <h4 className="font-semibold text-slate-900">Recent Large Transfers</h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {filteredTransfers.slice(0, 5).map((transfer) => (
                  <div key={transfer.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      {transfer.direction === "in" ? (
                        <ArrowDownLeft className="h-4 w-4 text-green-600" />
                      ) : (
                        <ArrowUpRight className="h-4 w-4 text-red-600" />
                      )}
                      <div>
                        <p className="font-medium text-slate-900">
                          {transfer.amount.toLocaleString()} {transfer.token}
                        </p>
                        <p className="text-sm text-slate-500">
                          {transfer.direction === "in" ? "From" : "To"}: {transfer.counterparty}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-slate-900">{formatValue(transfer.usdValue || 0)}</p>
                      <p className="text-xs text-slate-500">{new Date(transfer.timestamp).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
