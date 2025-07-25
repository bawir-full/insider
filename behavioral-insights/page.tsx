"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Brain, Activity, TrendingUp, Users, Search } from "lucide-react"
import { SpendingHeatmap } from "@/components/spending-heatmap"
import { TopTokensChart } from "@/components/top-tokens-chart"
import { WhaleTransferPlot } from "@/components/whale-transfer-plot"
import { AIRecommendationPanel } from "@/components/ai-recommendation-panel"

interface BehaviorMetrics {
  riskScore: number
  diversificationIndex: number
  activityConsistency: number
  whaleInfluence: number
  defiEngagement: number
}

interface SpendingPattern {
  dailyAverage: number
  weeklyTrend: string
  topCategories: { category: string; percentage: number }[]
}

export default function BehavioralInsightsPage() {
  const [walletAddress, setWalletAddress] = useState("0x1234...5678")
  const [behaviorMetrics, setBehaviorMetrics] = useState<BehaviorMetrics | null>(null)
  const [spendingPattern, setSpendingPattern] = useState<SpendingPattern | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Load wallet from localStorage
    const savedWallet = localStorage.getItem("connectedWallet")
    if (savedWallet) {
      setWalletAddress(savedWallet)
    }
  }, [])

  useEffect(() => {
    if (walletAddress) {
      fetchBehaviorData()
    }
  }, [walletAddress])

  const fetchBehaviorData = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/insights/${walletAddress}`)
      const data = await response.json()
      setBehaviorMetrics(data.behaviorMetrics)
      setSpendingPattern(data.spendingPattern)
    } catch (error) {
      console.error("Failed to fetch behavior data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score < 0.3) return "text-red-600"
    if (score < 0.7) return "text-orange-600"
    return "text-green-600"
  }

  const getScoreLabel = (score: number) => {
    if (score < 0.3) return "Low"
    if (score < 0.7) return "Medium"
    return "High"
  }

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.history.back()}
                className="border-slate-300 text-slate-700 hover:bg-slate-100 bg-transparent"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Behavioral Insights</h1>
                <p className="text-slate-500">Advanced wallet behavior analysis and spending patterns</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Search className="h-4 w-4 text-slate-500" />
                <Input
                  placeholder="Enter wallet address..."
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  className="w-64 bg-slate-50 border-slate-300 text-slate-900"
                />
              </div>
              <Button onClick={fetchBehaviorData} disabled={isLoading} className="bg-purple-600 hover:bg-purple-700">
                {isLoading ? "Analyzing..." : "Analyze"}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Behavior Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          {behaviorMetrics ? (
            <>
              <Card className="bg-white border-slate-200 shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-slate-900">Risk Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold ${getScoreColor(behaviorMetrics.riskScore)}`}>
                    {(behaviorMetrics.riskScore * 100).toFixed(0)}%
                  </div>
                  <p className={`text-xs ${getScoreColor(behaviorMetrics.riskScore)}`}>
                    {getScoreLabel(behaviorMetrics.riskScore)} Risk
                  </p>
                  <Progress value={behaviorMetrics.riskScore * 100} className="mt-2" />
                </CardContent>
              </Card>

              <Card className="bg-white border-slate-200 shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-slate-900">Diversification</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold ${getScoreColor(behaviorMetrics.diversificationIndex)}`}>
                    {(behaviorMetrics.diversificationIndex * 100).toFixed(0)}%
                  </div>
                  <p className={`text-xs ${getScoreColor(behaviorMetrics.diversificationIndex)}`}>
                    {getScoreLabel(behaviorMetrics.diversificationIndex)} Diversity
                  </p>
                  <Progress value={behaviorMetrics.diversificationIndex * 100} className="mt-2" />
                </CardContent>
              </Card>

              <Card className="bg-white border-slate-200 shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-slate-900">Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold ${getScoreColor(behaviorMetrics.activityConsistency)}`}>
                    {(behaviorMetrics.activityConsistency * 100).toFixed(0)}%
                  </div>
                  <p className={`text-xs ${getScoreColor(behaviorMetrics.activityConsistency)}`}>
                    {getScoreLabel(behaviorMetrics.activityConsistency)} Consistency
                  </p>
                  <Progress value={behaviorMetrics.activityConsistency * 100} className="mt-2" />
                </CardContent>
              </Card>

              <Card className="bg-white border-slate-200 shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-slate-900">Whale Influence</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold ${getScoreColor(1 - behaviorMetrics.whaleInfluence)}`}>
                    {(behaviorMetrics.whaleInfluence * 100).toFixed(0)}%
                  </div>
                  <p className={`text-xs ${getScoreColor(1 - behaviorMetrics.whaleInfluence)}`}>
                    {getScoreLabel(1 - behaviorMetrics.whaleInfluence)} Independence
                  </p>
                  <Progress value={behaviorMetrics.whaleInfluence * 100} className="mt-2" />
                </CardContent>
              </Card>

              <Card className="bg-white border-slate-200 shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-slate-900">DeFi Engagement</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold ${getScoreColor(behaviorMetrics.defiEngagement)}`}>
                    {(behaviorMetrics.defiEngagement * 100).toFixed(0)}%
                  </div>
                  <p className={`text-xs ${getScoreColor(behaviorMetrics.defiEngagement)}`}>
                    {getScoreLabel(behaviorMetrics.defiEngagement)} Engagement
                  </p>
                  <Progress value={behaviorMetrics.defiEngagement * 100} className="mt-2" />
                </CardContent>
              </Card>
            </>
          ) : (
            Array.from({ length: 5 }).map((_, i) => (
              <Card key={i} className="bg-white border-slate-200 shadow-sm">
                <CardContent className="animate-pulse pt-6">
                  <div className="h-8 bg-slate-200 rounded mb-2"></div>
                  <div className="h-4 bg-slate-200 rounded mb-2"></div>
                  <div className="h-2 bg-slate-200 rounded"></div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Spending Pattern Analysis */}
        {spendingPattern && (
          <Card className="bg-white border-slate-200 shadow-sm mb-8">
            <CardHeader>
              <CardTitle className="text-slate-900 flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-purple-600" />
                <span>Spending Pattern Analysis</span>
              </CardTitle>
              <CardDescription className="text-slate-500">Daily spending habits and category breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-slate-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    ${spendingPattern.dailyAverage.toLocaleString()}
                  </div>
                  <p className="text-sm text-slate-600">Daily Average</p>
                  <Badge
                    className={`mt-2 ${
                      spendingPattern.weeklyTrend === "increasing" ? "bg-green-600" : "bg-red-600"
                    } text-white`}
                  >
                    {spendingPattern.weeklyTrend}
                  </Badge>
                </div>

                <div className="col-span-2">
                  <h4 className="font-semibold text-slate-900 mb-3">Top Spending Categories</h4>
                  <div className="space-y-3">
                    {spendingPattern.topCategories.map((category, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-slate-700 font-medium">{category.category}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-32">
                            <Progress value={category.percentage} />
                          </div>
                          <span className="text-slate-600 text-sm w-12">{category.percentage}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Detailed Analysis Tabs */}
        <Tabs defaultValue="heatmap" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-slate-100">
            <TabsTrigger value="heatmap" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              <Activity className="h-4 w-4 mr-2" />
              Activity Heatmap
            </TabsTrigger>
            <TabsTrigger value="tokens" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              <TrendingUp className="h-4 w-4 mr-2" />
              Token Analysis
            </TabsTrigger>
            <TabsTrigger value="whales" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              <Users className="h-4 w-4 mr-2" />
              Whale Transfers
            </TabsTrigger>
            <TabsTrigger value="ai" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              <Brain className="h-4 w-4 mr-2" />
              AI Insights
            </TabsTrigger>
          </TabsList>

          <TabsContent value="heatmap">
            <SpendingHeatmap walletAddress={walletAddress} />
          </TabsContent>

          <TabsContent value="tokens">
            <TopTokensChart walletAddress={walletAddress} />
          </TabsContent>

          <TabsContent value="whales">
            <WhaleTransferPlot walletAddress={walletAddress} />
          </TabsContent>

          <TabsContent value="ai">
            <AIRecommendationPanel walletAddress={walletAddress} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
