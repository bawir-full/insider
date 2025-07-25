// Enhanced SDK for INSIDER - Sei Blockchain Analytics Platform

interface AIInsight {
  walletAddress: string
  summary: string
  riskScore: number
  recommendation: "Hold" | "Sell" | "Hedge" | "Buy More"
  reasoning: string
  confidence: number
  timestamp: string
}

interface BehaviorData {
  walletAddress: string
  behaviorPatterns: { pattern: string; confidence: number; description: string }[]
  tokenDistribution: { name: string; value: number; color: string }[]
  dailyActivityHeatmap: { day: string; [key: string]: number | string }[]
  whaleMovements: { id: string; amount: number; token: string; from: string; to: string; timestamp: string }[]
}

interface WalletInsights {
  walletAddress: string
  spendingPattern: {
    dailyAverage: number
    weeklyTrend: string
    topCategories: { category: string; percentage: number }[]
  }
  topTokens: { token: string; percentage: number; trend: string }[]
  whaleTransfers: {
    id: string
    amount: number
    token: string
    direction: "in" | "out"
    timestamp: string
    counterparty: string
  }[]
  activityHeatmap: {
    day: string
    hours: { hour: number; transactions: number; volume: number }[]
  }[]
  behaviorMetrics: {
    riskScore: number
    diversificationIndex: number
    activityConsistency: number
    whaleInfluence: number
    defiEngagement: number
  }
  recentActivity: {
    last24h: { transactions: number; volume: number; uniqueContracts: number }
    last7d: { transactions: number; volume: number; uniqueContracts: number }
  }
}

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

interface AlertSubscriptionResponse {
  success: boolean
  message: string
  subscription?: any
  error?: string
}

interface AIChatResponse {
  success: boolean
  response: string
  timestamp: string
}

/**
 * INSIDER SDK - Main class for interacting with Sei blockchain analytics
 */
export class InsiderSDK {
  private baseUrl: string
  private apiKey?: string

  constructor(baseUrl = "", apiKey?: string) {
    this.baseUrl = baseUrl
    this.apiKey = apiKey
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}): Promise<any> {
    const url = `${this.baseUrl}${endpoint}`
    const headers = {
      "Content-Type": "application/json",
      ...(this.apiKey && { Authorization: `Bearer ${this.apiKey}` }),
      ...options.headers,
    }

    try {
      const response = await fetch(url, { ...options, headers })
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      return await response.json()
    } catch (error) {
      console.error(`SDK Request Error (${endpoint}):`, error)
      throw error
    }
  }

  /**
   * Get AI-powered insights and recommendations for a wallet
   */
  async getAIInsight(walletAddress: string): Promise<AIInsight> {
    const data = await this.makeRequest("/api/ai/insight", {
      method: "POST",
      body: JSON.stringify({ walletAddress }),
    })

    if (!data.success) {
      throw new Error(data.error || "Failed to get AI insight")
    }

    return data.data
  }

  /**
   * Get comprehensive wallet behavior analysis
   */
  async getWalletInsights(walletAddress: string): Promise<WalletInsights> {
    return await this.makeRequest(`/api/insights/${walletAddress}`)
  }

  /**
   * Get wallet behavior patterns (legacy compatibility)
   */
  async getBehaviorInsights(walletAddress: string): Promise<BehaviorData> {
    const data = await this.makeRequest(`/api/wallet/behavior?walletAddress=${walletAddress}`)
    return data
  }

  /**
   * Get real-time anomaly alerts
   */
  async getAnomalyAlerts(
    options: {
      limit?: number
      severity?: "critical" | "warning" | "info"
      category?: string
    } = {},
  ): Promise<AnomalyAlert[]> {
    const params = new URLSearchParams()
    if (options.limit) params.append("limit", options.limit.toString())
    if (options.severity) params.append("severity", options.severity)
    if (options.category) params.append("type", options.category)

    const url = `/api/alerts/anomalies${params.toString() ? `?${params.toString()}` : ""}`
    return await this.makeRequest(url)
  }

  /**
   * Subscribe to alerts for specific events
   */
  async subscribeAlert(
    walletAddress: string,
    alertType: string,
    channel: string,
    eventId?: string,
  ): Promise<AlertSubscriptionResponse> {
    return await this.makeRequest("/api/subscribe", {
      method: "POST",
      body: JSON.stringify({ walletAddress, alertType, channel, eventId }),
    })
  }

  /**
   * Chat with AI assistant
   */
  async chatWithAI(message: string, context?: any): Promise<AIChatResponse> {
    return await this.makeRequest("/api/ai/chat", {
      method: "POST",
      body: JSON.stringify({ message, context }),
    })
  }

  /**
   * Get upcoming token unlocks
   */
  async getUpcomingUnlocks(range = "30d"): Promise<any[]> {
    return await this.makeRequest(`/api/unlocks/list?range=${range}`)
  }

  /**
   * Get next unlock for specific token
   */
  async getNextUnlock(token: string): Promise<any> {
    return await this.makeRequest(`/api/unlocks/next?token=${token}`)
  }

  /**
   * Get unlock impact analysis
   */
  async getUnlockImpact(walletAddress: string, eventId: string): Promise<any> {
    return await this.makeRequest(`/api/unlocks/impact?address=${walletAddress}&eventId=${eventId}`)
  }

  /**
   * Get system status
   */
  async getSystemStatus(): Promise<any> {
    return await this.makeRequest("/api/status")
  }

  /**
   * Get real-time wallet activity data
   */
  async getRealTimeWalletData(): Promise<any> {
    return await this.makeRequest("/api/realtime-wallet-data")
  }

  /**
   * Send test alert
   */
  async sendTestAlert(walletAddress: string, channels: string[]): Promise<any> {
    return await this.makeRequest("/api/send-test-alert", {
      method: "POST",
      body: JSON.stringify({ walletAddress, channels }),
    })
  }
}

// Legacy function exports for backward compatibility
export async function getBehaviorInsights(walletAddress: string): Promise<BehaviorData> {
  const sdk = new InsiderSDK()
  return sdk.getBehaviorInsights(walletAddress)
}

export async function getAIRecommendation(walletAddress: string): Promise<AIInsight> {
  const sdk = new InsiderSDK()
  return sdk.getAIInsight(walletAddress)
}

export async function subscribeAlert(
  walletAddress: string,
  alertType: string,
  channel: string,
  eventId?: string,
): Promise<AlertSubscriptionResponse> {
  const sdk = new InsiderSDK()
  return sdk.subscribeAlert(walletAddress, alertType, channel, eventId)
}

export async function getAnomalyAlerts(): Promise<AnomalyAlert[]> {
  const sdk = new InsiderSDK()
  return sdk.getAnomalyAlerts()
}

// Export the main SDK class as default
export default InsiderSDK

// Export types for TypeScript users
export type { AIInsight, BehaviorData, WalletInsights, AnomalyAlert, AlertSubscriptionResponse, AIChatResponse }
