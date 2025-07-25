// This file will contain dummy data for now, as per user request.
// Actual data fetching will be integrated later.

interface AIInsightData {
  walletAddress: string
  summary: string
  riskScore: number
  riskExplanation: string
  recommendations: string[]
  confidence: number
  timestamp: string
}

interface BehaviorData {
  walletAddress: string
  behaviorPatterns: { pattern: string; confidence: number; description: string }[]
  tokenDistribution: { name: string; value: number; color: string }[]
  dailyActivityHeatmap: { day: string; hours: { hour: number; transactions: number; volume: number }[] }[]
  whaleMovements: {
    id: string
    amount: number
    token: string
    direction: "in" | "out"
    timestamp: string
    counterparty: string
    usdValue?: number
  }[]
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

interface WhaleTransfer {
  id: string
  amount: number
  token: string
  direction: "in" | "out"
  timestamp: string
  counterparty: string
  usdValue?: number
}

export async function getAIRecommendation(walletAddress: string): Promise<AIInsightData> {
  await new Promise((resolve) => setTimeout(resolve, 500)) // Simulate API delay
  return {
    walletAddress,
    summary:
      "This wallet shows consistent activity in DeFi protocols, primarily engaging in liquidity provision and yield farming. There's a notable increase in stablecoin transactions, suggesting a cautious approach in volatile markets. The wallet has also recently interacted with a new NFT marketplace.",
    riskScore: 0.45,
    riskExplanation: "Medium risk due to exposure to new protocols and potential impermanent loss in liquidity pools.",
    recommendations: [
      "Monitor new DeFi protocols",
      "Diversify stablecoin holdings",
      "Consider taking profits from high-performing NFTs",
    ],
    confidence: 0.85,
    timestamp: new Date().toISOString(),
  }
}

export async function getBehaviorInsights(walletAddress: string): Promise<BehaviorData> {
  await new Promise((resolve) => setTimeout(resolve, 700)) // Simulate API delay

  const generateMockHeatmapData = () => {
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

  const generateMockWhaleTransfers = () => {
    const tokens = ["ETH", "USDC", "SEI", "ATOM", "SOL"]
    const directions = ["in", "out"]
    const counterparties = ["0xabc...123", "0xdef...456", "0xghi...789"]
    const transfers: WhaleTransfer[] = []
    for (let i = 0; i < 10; i++) {
      const amount = Math.floor(Math.random() * 500000) + 50000 // $50k to $550k
      const token = tokens[Math.floor(Math.random() * tokens.length)]
      const direction = directions[Math.floor(Math.random() * directions.length)]
      const timestamp = new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
      const counterparty = counterparties[Math.floor(Math.random() * counterparties.length)]
      transfers.push({
        id: `transfer-${i}`,
        amount,
        token,
        direction,
        timestamp,
        counterparty,
        usdValue: amount * (Math.random() * 0.5 + 0.5), // Simulate some USD value
      })
    }
    return transfers
  }

  return {
    walletAddress,
    behaviorPatterns: [
      {
        pattern: "DeFi Degen",
        confidence: 80,
        description: "Frequent interactions with various DeFi protocols, high risk tolerance.",
      },
      {
        pattern: "NFT Collector",
        confidence: 65,
        description: "Significant holdings and trading activity in non-fungible tokens.",
      },
      {
        pattern: "Long-Term HODLer",
        confidence: 50,
        description: "Holds a substantial portion of assets for extended periods.",
      },
    ],
    tokenDistribution: [
      { name: "ETH", value: 40, color: "#8B5CF6" },
      { name: "USDC", value: 25, color: "#10B981" },
      { name: "SEI", value: 15, color: "#F59E0B" },
      { name: "ATOM", value: 10, color: "#EF4444" },
      { name: "Other", value: 10, color: "#3B82F6" },
    ],
    dailyActivityHeatmap: generateMockHeatmapData(),
    whaleMovements: generateMockWhaleTransfers(),
  }
}

export async function getAnomalyAlerts(): Promise<AnomalyAlert[]> {
  await new Promise((resolve) => setTimeout(resolve, 300)) // Simulate API delay
  return [
    {
      id: "alert-1",
      type: "critical",
      title: "Large Outflow to Unknown Wallet",
      description: "A significant amount of SEI tokens transferred from a monitored wallet to an unverified address.",
      time: "2 minutes ago",
      category: "whale-movement",
      walletAddress: "sei1xyz...abc",
      amount: 150000,
      token: "SEI",
    },
    {
      id: "alert-2",
      type: "warning",
      title: "Unusual Volume Spike on DEX",
      description: "Detected an abnormal increase in trading volume for a low-cap token on a decentralized exchange.",
      time: "15 minutes ago",
      category: "volume-spike",
      metadata: { token: "XYZ", dex: "SeiSwap" },
    },
    {
      id: "alert-3",
      type: "info",
      title: "New Contract Interaction",
      description: "Wallet interacted with a newly deployed smart contract. Review for legitimacy.",
      time: "1 hour ago",
      category: "risky-contract",
      walletAddress: "sei1def...ghi",
      metadata: { contractAddress: "0x123...xyz" },
    },
    {
      id: "alert-4",
      type: "critical",
      title: "Potential Flash Loan Attack",
      description: "Detected a series of rapid transactions indicative of a flash loan exploit attempt.",
      time: "3 hours ago",
      category: "flash_loan",
    },
    {
      id: "alert-5",
      type: "warning",
      title: "Liquidity Pool Imbalance",
      description: "Significant imbalance detected in a liquidity pool where the wallet has active positions.",
      time: "Yesterday",
      category: "liquidity",
      walletAddress: "sei1jkl...mno",
      metadata: { pool: "SEI/USDC" },
    },
  ]
}
