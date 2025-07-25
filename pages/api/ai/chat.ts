import type { NextApiRequest, NextApiResponse } from "next"
import { getAIChatResponse } from "../../../lib/ai-engine"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  const { message, context } = req.body

  if (!message) {
    return res.status(400).json({ error: "Message is required" })
  }

  try {
    const response = await getAIChatResponse(message, context)

    return res.status(200).json({
      success: true,
      response,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("AI Chat API Error:", error)
    return res.status(500).json({
      success: false,
      error: "Failed to get AI response",
      message: error instanceof Error ? error.message : "Unknown error",
    })
  }
}
