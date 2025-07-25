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
  await new Promise((resolve) => setTimeout(resolve, 500)) // Simulate network delay
  return {
    walletAddress,
    summary:
      "Wallet ini menunjukkan pola perdagangan yang aktif dengan fokus pada aset berkapitalisasi besar. Ada indikasi aktivitas arbitrase sesekali dan partisipasi dalam protokol DeFi.",
    riskScore: 0.45,
    riskExplanation:
      "Risiko sedang karena diversifikasi yang wajar dan aktivitas yang dapat diprediksi, namun ada paparan terhadap volatilitas pasar.",
    recommendations: ["Hold", "Hedge"],
    confidence: 0.85,
    timestamp: new Date().toISOString(),
  }
}

export async function getBehaviorInsights(walletAddress: string): Promise<BehaviorData> {
  await new Promise((resolve) => setTimeout(resolve, 700)) // Simulate network delay

  return {
    walletAddress,
    behaviorPatterns: [
      { pattern: "Active Trader", confidence: 90, description: "Sering melakukan transaksi jual beli." },
      {
        pattern: "DeFi Participant",
        confidence: 75,
        description: "Berinteraksi dengan berbagai protokol keuangan terdesentralisasi.",
      },
      {
        pattern: "Long-term Holder",
        confidence: 60,
        description: "Memegang beberapa aset untuk jangka waktu yang lebih lama.",
      },
    ],
    tokenDistribution: [
      { name: "ETH", value: 45, color: "#8B5CF6" },
      { name: "USDC", value: 25, color: "#10B981" },
      { name: "SEI", value: 15, color: "#F59E0B" },
      { name: "ATOM", value: 10, color: "#EF4444" },
      { name: "Other", value: 5, color: "#3B82F6" },
    ],
    dailyActivityHeatmap: [
      {
        day: "Mon",
        hours: Array.from({ length: 24 }, (_, hour) => ({
          hour,
          transactions: Math.floor(Math.random() * 50),
          volume: Math.floor(Math.random() * 10000),
        })),
      },
      {
        day: "Tue",
        hours: Array.from({ length: 24 }, (_, hour) => ({
          hour,
          transactions: Math.floor(Math.random() * 50),
          volume: Math.floor(Math.random() * 10000),
        })),
      },
      {
        day: "Wed",
        hours: Array.from({ length: 24 }, (_, hour) => ({
          hour,
          transactions: Math.floor(Math.random() * 50),
          volume: Math.floor(Math.random() * 10000),
        })),
      },
      {
        day: "Thu",
        hours: Array.from({ length: 24 }, (_, hour) => ({
          hour,
          transactions: Math.floor(Math.random() * 50),
          volume: Math.floor(Math.random() * 10000),
        })),
      },
      {
        day: "Fri",
        hours: Array.from({ length: 24 }, (_, hour) => ({
          hour,
          transactions: Math.floor(Math.random() * 50),
          volume: Math.floor(Math.random() * 10000),
        })),
      },
      {
        day: "Sat",
        hours: Array.from({ length: 24 }, (_, hour) => ({
          hour,
          transactions: Math.floor(Math.random() * 50),
          volume: Math.floor(Math.random() * 10000),
        })),
      },
      {
        day: "Sun",
        hours: Array.from({ length: 24 }, (_, hour) => ({
          hour,
          transactions: Math.floor(Math.random() * 50),
          volume: Math.floor(Math.random() * 10000),
        })),
      },
    ],
    whaleMovements: [
      {
        id: "wt-1",
        amount: 150000,
        token: "ETH",
        direction: "in",
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        counterparty: "0xabc...123",
        usdValue: 250000,
      },
      {
        id: "wt-2",
        amount: 200000,
        token: "USDC",
        direction: "out",
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        counterparty: "0xdef...456",
        usdValue: 200000,
      },
      {
        id: "wt-3",
        amount: 75000,
        token: "SEI",
        direction: "in",
        timestamp: new Date(Date.now() - 0.5 * 24 * 60 * 60 * 1000).toISOString(),
        counterparty: "0xghi...789",
        usdValue: 100000,
      },
      {
        id: "wt-4",
        amount: 300000,
        token: "ETH",
        direction: "out",
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        counterparty: "0xjkl...012",
        usdValue: 500000,
      },
      {
        id: "wt-5",
        amount: 100000,
        token: "ATOM",
        direction: "in",
        timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        counterparty: "0xmnp...345",
        usdValue: 120000,
      },
    ],
  }
}

export async function getAnomalyAlerts(): Promise<AnomalyAlert[]> {
  await new Promise((resolve) => setTimeout(resolve, 300)) // Simulate network delay
  return [
    {
      id: "alert-1",
      type: "critical",
      title: "Large Outflow Detected",
      description: "Penarikan 500 ETH yang tidak biasa ke alamat yang tidak dikenal.",
      time: "2024-07-24T10:30:00Z",
      category: "Security",
    },
    {
      id: "alert-2",
      type: "warning",
      title: "High Gas Fees",
      description: "Biaya gas yang lebih tinggi dari rata-rata terdeteksi pada transaksi terbaru.",
      time: "2024-07-24T09:15:00Z",
      category: "Cost",
    },
    {
      id: "alert-3",
      type: "info",
      title: "New Token Interaction",
      description: "Dompet berinteraksi dengan kontrak token baru: XYZ.",
      time: "2024-07-23T18:00:00Z",
      category: "Activity",
    },
  ]
}
