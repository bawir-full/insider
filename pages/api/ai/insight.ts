import type { NextApiRequest, NextApiResponse } from "next"
import { getAIInsight } from "../../../lib/ai-engine"
import { db } from "../../../lib/db"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  const { walletAddress } = req.body

  if (!walletAddress) {
    return res.status(400).json({ error: "Wallet address is required" })
  }

  try {
    // Simulate fetching comprehensive wallet data
    const walletData = {
      address: walletAddress,
      balance: Math.floor(Math.random() * 1000000) + 10000,
      transactionCount: Math.floor(Math.random() * 5000) + 100,
      lastActivity: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      topTokens: ["SEI", "USDC", "ATOM", "OSMO"].slice(0, Math.floor(Math.random() * 3) + 2),
      recentTransactions: [], // Would be populated from actual data
      upcomingUnlocks: db.unlocks.find((u) => u.date > new Date()),
      defiInteractions: Math.floor(Math.random() * 200) + 10,
      largestTransfer: Math.floor(Math.random() * 500000) + 50000,
      activeDaysLastMonth: Math.floor(Math.random() * 30) + 1,
    }

    const aiInsight = await getAIInsight(walletData)

    return res.status(200).json({
      success: true,
      data: {
        walletAddress,
        timestamp: new Date().toISOString(),
        ...aiInsight,
      },
    })
  } catch (error) {
    console.error("AI Insight API Error:", error)
    return res.status(500).json({
      error: "Failed to generate AI insight",
      message: error instanceof Error ? error.message : "Unknown error",
    })
  }
}
