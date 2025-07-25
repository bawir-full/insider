"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Brain, TrendingUp, TrendingDown, Shield, Target, Lightbulb, RefreshCw } from "lucide-react"

interface AIInsight {
  walletAddress: string
  summary: string
  riskScore: number
  recommendation: "Hold" | "Sell" | "Hedge" | "Buy More"
  reasoning: string
  confidence: number
  timestamp: string
}

interface AIRecommendationPanelProps {
  walletAddress: string
}

export function AIRecommendationPanel({ walletAddress }: AIRecommendationPanelProps) {
  const [aiInsight, setAiInsight] = useState<AIInsight | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (walletAddress) {
      fetchAIInsight()
    }
  }, [walletAddress])

  const fetchAIInsight = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/ai/insight", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ walletAddress }),
      })

      const data = await response.json()

      if (data.success) {
        setAiInsight(data.data)
      } else {
        throw new Error(data.error || "Failed to get AI insight")
      }
    } catch (error) {
      console.error("Failed to fetch AI insight:", error)
      setError(error instanceof Error ? error.message : "Failed to fetch AI insight")
    } finally {
      setIsLoading(false)
    }
  }

  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation) {
      case "Buy More":
        return "bg-green-600 text-white"
      case "Hold":
        return "bg-blue-600 text-white"
      case "Hedge":
        return "bg-orange-600 text-white"
      case "Sell":
        return "bg-red-600 text-white"
      default:
        return "bg-slate-600 text-white"
    }
  }

  const getRecommendationIcon = (recommendation: string) => {
    switch (recommendation) {
      case "Buy More":
        return <TrendingUp className="h-4 w-4" />
      case "Hold":
        return <Shield className="h-4 w-4" />
      case "Hedge":
        return <Target className="h-4 w-4" />
      case "Sell":
        return <TrendingDown className="h-4 w-4" />
      default:
        return <Lightbulb className="h-4 w-4" />
    }
  }

  const getRiskColor = (riskScore: number) => {
    if (riskScore < 0.3) return "text-green-600"
    if (riskScore < 0.6) return "text-orange-600"
    return "text-red-600"
  }

  const getRiskLabel = (riskScore: number) => {
    if (riskScore < 0.3) return "Low Risk"
    if (riskScore < 0.6) return "Medium Risk"
    return "High Risk"
  }

  return (
    <Card className="bg-white border-slate-200 shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Brain className="h-5 w-5 text-purple-600" />
            <CardTitle className="text-slate-900">AI Investment Strategy</CardTitle>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchAIInsight}
            disabled={isLoading}
            className="border-slate-300 text-slate-700 hover:bg-slate-100 bg-transparent"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
        <CardDescription className="text-slate-500">
          AI-powered investment recommendations for {walletAddress.substring(0, 10)}...
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-20 bg-slate-200 rounded"></div>
            <div className="h-16 bg-slate-200 rounded"></div>
            <div className="h-12 bg-slate-200 rounded"></div>
          </div>
        ) : error ? (
          <Alert className="border-red-200 bg-red-50">
            <AlertDescription className="text-red-800">
              {error}. AI insights require OPENAI_API_KEY to be configured.
            </AlertDescription>
          </Alert>
        ) : aiInsight ? (
          <div className="space-y-6">
            {/* Summary */}
            <div className="p-4 bg-slate-50 rounded-lg">
              <h4 className="font-semibold text-slate-900 mb-2">Wallet Analysis Summary</h4>
              <p className="text-slate-700 text-sm leading-relaxed">{aiInsight.summary}</p>
            </div>

            {/* Risk Score & Recommendation */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="text-center p-4 bg-slate-50 rounded-lg">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <Shield className="h-5 w-5 text-slate-600" />
                  <span className="font-medium text-slate-900">Risk Assessment</span>
                </div>
                <div className={`text-2xl font-bold ${getRiskColor(aiInsight.riskScore)}`}>
                  {(aiInsight.riskScore * 100).toFixed(0)}%
                </div>
                <p className={`text-sm ${getRiskColor(aiInsight.riskScore)}`}>{getRiskLabel(aiInsight.riskScore)}</p>
                <Progress value={aiInsight.riskScore * 100} className="mt-2" />
              </div>

              <div className="text-center p-4 bg-slate-50 rounded-lg">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <Target className="h-5 w-5 text-slate-600" />
                  <span className="font-medium text-slate-900">AI Recommendation</span>
                </div>
                <Badge className={`${getRecommendationColor(aiInsight.recommendation)} text-lg px-4 py-2`}>
                  <div className="flex items-center space-x-2">
                    {getRecommendationIcon(aiInsight.recommendation)}
                    <span>{aiInsight.recommendation}</span>
                  </div>
                </Badge>
                <div className="mt-2 flex items-center justify-center space-x-1">
                  <span className="text-xs text-slate-500">Confidence:</span>
                  <span className="text-xs font-medium text-slate-700">{(aiInsight.confidence * 100).toFixed(0)}%</span>
                </div>
              </div>
            </div>

            {/* Reasoning */}
            <div className="p-4 border border-slate-200 rounded-lg">
              <h4 className="font-semibold text-slate-900 mb-2 flex items-center space-x-2">
                <Lightbulb className="h-4 w-4 text-purple-600" />
                <span>Investment Strategy Reasoning</span>
              </h4>
              <p className="text-slate-700 text-sm leading-relaxed">{aiInsight.reasoning}</p>
            </div>

            {/* Timestamp */}
            <div className="text-center">
              <p className="text-xs text-slate-500">
                Analysis generated on {new Date(aiInsight.timestamp).toLocaleString()}
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <Brain className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 mb-4">No AI insights available</p>
            <Button onClick={fetchAIInsight} className="bg-purple-600 hover:bg-purple-700">
              Generate AI Analysis
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
