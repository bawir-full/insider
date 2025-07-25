import type { NextApiRequest, NextApiResponse } from "next"
import { anomalyDetector } from "../../workers/ws-anomaly-listener"

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  try {
    const { limit = "20", severity, type } = req.query

    let anomalies = anomalyDetector.getRecentAnomalies(Number.parseInt(limit as string))

    // Filter by severity if specified
    if (severity && typeof severity === "string") {
      anomalies = anomalies.filter((a) => a.severity === severity)
    }

    // Filter by type if specified
    if (type && typeof type === "string") {
      anomalies = anomalies.filter((a) => a.type === type)
    }

    // Format for frontend consumption
    const formattedAnomalies = anomalies.map((anomaly) => ({
      id: anomaly.id,
      type: anomaly.severity,
      title: anomaly.title,
      description: anomaly.description,
      time: getRelativeTime(anomaly.timestamp),
      category: anomaly.type,
      walletAddress: anomaly.walletAddress,
      amount: anomaly.amount,
      token: anomaly.token,
      metadata: anomaly.metadata,
    }))

    return res.status(200).json(formattedAnomalies)
  } catch (error) {
    console.error("Anomaly Alerts API Error:", error)
    return res.status(500).json({
      error: "Failed to fetch anomaly alerts",
      message: error instanceof Error ? error.message : "Unknown error",
    })
  }
}

function getRelativeTime(timestamp: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - timestamp.getTime()
  const diffMins = Math.floor(diffMs / (1000 * 60))

  if (diffMins < 1) return "Just now"
  if (diffMins < 60) return `${diffMins} minutes ago`

  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) return `${diffHours} hours ago`

  const diffDays = Math.floor(diffHours / 24)
  return `${diffDays} days ago`
}
