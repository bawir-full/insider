import type { NextApiRequest, NextApiResponse } from "next"

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  const { walletAddress } = req.query

  if (!walletAddress || typeof walletAddress !== "string") {
    return res.status(400).json({ error: "Wallet address is required" })
  }

  try {
    // Simulate comprehensive behavior analysis
    const behaviorData = {
      walletAddress,

      // AI-detected behavior patterns
      behaviorPatterns: [
        {
          pattern: "DeFi Yield Farmer",
          confidence: Math.floor(Math.random() * 30) + 70,
          description: "Frequently interacts with liquidity pools and yield farming protocols",
        },
        {
          pattern: "Long-term Holder",
          confidence: Math.floor(Math.random() * 25) + 60,
          description: "Holds positions for extended periods with minimal trading activity",
        },
        {
          pattern: "Arbitrage Trader",
          confidence: Math.floor(Math.random() * 20) + 45,
          description: "Exploits price differences across different exchanges and protocols",
        },
        {
          pattern: "Risk-Averse Investor",
          confidence: Math.floor(Math.random() * 15) + 55,
          description: "Prefers stable assets and conservative investment strategies",
        },
      ],

      // Token distribution for pie chart
      tokenDistribution: [
        { name: "SEI", value: Math.floor(Math.random() * 20) + 40, color: "#8B5CF6" },
        { name: "USDC", value: Math.floor(Math.random() * 15) + 20, color: "#10B981" },
        { name: "ATOM", value: Math.floor(Math.random() * 10) + 15, color: "#F59E0B" },
        { name: "OSMO", value: Math.floor(Math.random() * 8) + 10, color: "#EF4444" },
        { name: "Others", value: Math.floor(Math.random() * 5) + 5, color: "#3B82F6" },
      ],

      // Daily activity heatmap (7 days x 24 hours)
      dailyActivityHeatmap: Array.from({ length: 7 }, (_, day) => ({
        day: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][day],
        ...Object.fromEntries(Array.from({ length: 24 }, (_, hour) => [`hour${hour}`, Math.floor(Math.random() * 20)])),
      })),

      // Whale movements
      whaleMovements: Array.from({ length: Math.floor(Math.random() * 3) + 2 }, (_, i) => ({
        id: `whale-${i}`,
        amount: Math.floor(Math.random() * 500000) + 100000,
        token: ["SEI", "USDC", "ATOM"][Math.floor(Math.random() * 3)],
        from: `0x${Math.random().toString(16).substring(2, 10)}...`,
        to: `0x${Math.random().toString(16).substring(2, 10)}...`,
        timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      })),

      // Analysis metadata
      analysisTimestamp: new Date().toISOString(),
      dataPoints: Math.floor(Math.random() * 10000) + 5000,
      confidenceScore: Math.random() * 0.3 + 0.7, // 70-100%
    }

    return res.status(200).json(behaviorData)
  } catch (error) {
    console.error("Wallet Behavior API Error:", error)
    return res.status(500).json({
      error: "Failed to analyze wallet behavior",
      message: error instanceof Error ? error.message : "Unknown error",
    })
  }
}
