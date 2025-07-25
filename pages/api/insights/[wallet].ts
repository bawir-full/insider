import type { NextApiRequest, NextApiResponse } from "next"

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  const { wallet } = req.query

  if (!wallet || typeof wallet !== "string") {
    return res.status(400).json({ error: "Wallet address is required" })
  }

  try {
    // Simulate comprehensive wallet insights
    const insights = {
      walletAddress: wallet,

      // Spending Pattern Analysis
      spendingPattern: {
        dailyAverage: Math.floor(Math.random() * 10000) + 1000,
        weeklyTrend: Math.random() > 0.5 ? "increasing" : "decreasing",
        topCategories: [
          { category: "DeFi", percentage: Math.floor(Math.random() * 30) + 40 },
          { category: "Trading", percentage: Math.floor(Math.random() * 20) + 20 },
          { category: "Transfers", percentage: Math.floor(Math.random() * 15) + 10 },
          { category: "NFTs", percentage: Math.floor(Math.random() * 10) + 5 },
        ],
      },

      // Top Tokens Analysis
      topTokens: [
        { token: "SEI", percentage: Math.floor(Math.random() * 20) + 40, trend: "up" },
        { token: "USDC", percentage: Math.floor(Math.random() * 15) + 20, trend: "stable" },
        { token: "ATOM", percentage: Math.floor(Math.random() * 10) + 15, trend: "down" },
        { token: "OSMO", percentage: Math.floor(Math.random() * 8) + 10, trend: "up" },
        { token: "Others", percentage: Math.floor(Math.random() * 5) + 5, trend: "stable" },
      ],

      // Whale Transfer Analysis
      whaleTransfers: Array.from({ length: Math.floor(Math.random() * 5) + 2 }, (_, i) => ({
        id: `whale-${i}`,
        amount: Math.floor(Math.random() * 500000) + 100000,
        token: ["SEI", "USDC", "ATOM"][Math.floor(Math.random() * 3)],
        direction: Math.random() > 0.5 ? "in" : "out",
        timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        counterparty: `0x${Math.random().toString(16).substring(2, 10)}...`,
      })),

      // Activity Heatmap (24h x 7 days)
      activityHeatmap: Array.from({ length: 7 }, (_, day) => ({
        day: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][day],
        hours: Array.from({ length: 24 }, (_, hour) => ({
          hour,
          transactions: Math.floor(Math.random() * 20),
          volume: Math.floor(Math.random() * 50000),
        })),
      })),

      // Behavior Metrics
      behaviorMetrics: {
        riskScore: Math.random(),
        diversificationIndex: Math.random(),
        activityConsistency: Math.random(),
        whaleInfluence: Math.random(),
        defiEngagement: Math.random(),
      },

      // Recent Activity Summary
      recentActivity: {
        last24h: {
          transactions: Math.floor(Math.random() * 50) + 5,
          volume: Math.floor(Math.random() * 100000) + 10000,
          uniqueContracts: Math.floor(Math.random() * 10) + 1,
        },
        last7d: {
          transactions: Math.floor(Math.random() * 300) + 50,
          volume: Math.floor(Math.random() * 500000) + 50000,
          uniqueContracts: Math.floor(Math.random() * 25) + 5,
        },
      },
    }

    return res.status(200).json(insights)
  } catch (error) {
    console.error("Wallet Insights API Error:", error)
    return res.status(500).json({
      error: "Failed to fetch wallet insights",
      message: error instanceof Error ? error.message : "Unknown error",
    })
  }
}
