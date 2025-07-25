// Next.js API Route for user alert subscription.

import type { NextApiRequest, NextApiResponse } from "next"

// In a real application, this would save to a database or an on-chain registry.
const subscriptions: any[] = []

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { walletAddress, alertType, channel, eventId } = req.body

    if (!walletAddress || !alertType || !channel) {
      return res.status(400).json({ error: "Missing required parameters." })
    }

    const newSubscription = {
      id: `sub-${subscriptions.length + 1}`,
      walletAddress,
      alertType,
      channel,
      eventId: eventId || null, // Optional for general alerts
      timestamp: new Date().toISOString(),
    }

    subscriptions.push(newSubscription)
    console.log("New subscription:", newSubscription)

    return res.status(200).json({
      success: true,
      message: "Subscription successful!",
      subscription: newSubscription,
    })
  } else {
    res.setHeader("Allow", ["POST"])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
