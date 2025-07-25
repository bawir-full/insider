import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

interface WalletData {
  address: string
  balance: number
  transactionCount: number
  lastActivity: string
  topTokens: string[]
  recentTransactions: any[]
  upcomingUnlocks: any[]
  defiInteractions: number
  largestTransfer: number
  activeDaysLastMonth: number
}

interface AIInsightResponse {
  summary: string
  riskScore: number
  recommendation: "Hold" | "Sell" | "Hedge" | "Buy More"
  reasoning: string
  confidence: number
}

export async function getAIInsight(walletData: WalletData): Promise<AIInsightResponse> {
  const prompt = `You are Insider AI, an expert Sei blockchain wallet analyst. 

Analyze the following wallet data and provide insights:

Wallet Address: ${walletData.address}
Current Balance: ${walletData.balance} SEI
Total Transactions: ${walletData.transactionCount}
Last Activity: ${walletData.lastActivity}
Top Tokens: ${walletData.topTokens.join(", ")}
DeFi Interactions: ${walletData.defiInteractions}
Largest Transfer: $${walletData.largestTransfer.toLocaleString()}
Active Days Last Month: ${walletData.activeDaysLastMonth}
Upcoming Unlocks: ${walletData.upcomingUnlocks.length} events

Based on this data, provide a JSON response with:
1. summary: A concise analysis of wallet behavior pattern (max 100 words)
2. riskScore: Risk level from 0.0 (very low) to 1.0 (very high)
3. recommendation: One of "Hold", "Sell", "Hedge", or "Buy More"
4. reasoning: Explanation for the recommendation (max 150 words)
5. confidence: Confidence level from 0.0 to 1.0

Format as valid JSON only, no additional text.`

  try {
    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt: prompt,
      temperature: 0.3,
    })

    // Try to parse the AI response as JSON
    const aiResponse = JSON.parse(text)

    // Validate the response structure
    if (!aiResponse.summary || typeof aiResponse.riskScore !== "number" || !aiResponse.recommendation) {
      throw new Error("Invalid AI response structure")
    }

    return {
      summary: aiResponse.summary,
      riskScore: Math.max(0, Math.min(1, aiResponse.riskScore)), // Clamp between 0-1
      recommendation: aiResponse.recommendation,
      reasoning: aiResponse.reasoning || "No reasoning provided",
      confidence: Math.max(0, Math.min(1, aiResponse.confidence || 0.7)),
    }
  } catch (error) {
    console.error("AI Engine Error:", error)

    // Fallback response based on simple heuristics
    const riskScore = calculateFallbackRiskScore(walletData)
    const recommendation = getFallbackRecommendation(riskScore, walletData)

    return {
      summary: `Wallet ${walletData.address.substring(0, 8)}... shows ${walletData.transactionCount > 100 ? "high" : "moderate"} activity with ${walletData.defiInteractions} DeFi interactions.`,
      riskScore,
      recommendation,
      reasoning:
        "AI analysis temporarily unavailable. Using fallback heuristics based on transaction patterns and upcoming unlock events.",
      confidence: 0.5,
    }
  }
}

function calculateFallbackRiskScore(walletData: WalletData): number {
  let risk = 0.3 // Base risk

  // High transaction count increases risk
  if (walletData.transactionCount > 1000) risk += 0.2

  // Large transfers increase risk
  if (walletData.largestTransfer > 100000) risk += 0.2

  // Upcoming unlocks increase risk
  if (walletData.upcomingUnlocks.length > 2) risk += 0.3

  // Low activity decreases risk
  if (walletData.activeDaysLastMonth < 5) risk -= 0.1

  return Math.max(0, Math.min(1, risk))
}

function getFallbackRecommendation(riskScore: number, walletData: WalletData): "Hold" | "Sell" | "Hedge" | "Buy More" {
  if (riskScore > 0.7) return "Sell"
  if (riskScore > 0.5) return "Hedge"
  if (riskScore < 0.3 && walletData.activeDaysLastMonth > 15) return "Buy More"
  return "Hold"
}

export async function getAIChatResponse(message: string, context?: any): Promise<string> {
  const prompt = `You are Insider AI, a helpful Sei blockchain analyst assistant. 

User question: "${message}"

${context ? `Context: ${JSON.stringify(context)}` : ""}

Provide a helpful, concise response about Sei blockchain, wallet analysis, or trading strategies. Keep responses under 200 words.`

  try {
    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt: prompt,
      temperature: 0.5,
    })

    return text
  } catch (error) {
    console.error("AI Chat Error:", error)
    return "I'm sorry, I'm having trouble processing your request right now. Please try again later or contact support."
  }
}
