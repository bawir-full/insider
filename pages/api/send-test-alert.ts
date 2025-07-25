// Next.js API Route for sending a test alert.

import type { NextApiRequest, NextApiResponse } from "next"

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { walletAddress, channels } = req.body

    if (!walletAddress || !channels || !Array.isArray(channels)) {
      return res.status(400).json({ error: "Missing required parameters: walletAddress or channels." })
    }

    console.log(`Simulating sending test alert to wallet ${walletAddress} via channels: ${channels.join(", ")}`)

    // Simulate a delay for sending the alert
    setTimeout(() => {
      return res.status(200).json({
        success: true,
        message: `Test alert sent successfully to ${walletAddress} via ${channels.length} channels.`,
      })
    }, 1000) // Simulate 1 second delay
  } else {
    res.setHeader("Allow", ["POST"])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
