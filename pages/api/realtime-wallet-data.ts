// Next.js API Route for simulating real-time wallet activity data.

import type { NextApiRequest, NextApiResponse } from "next"

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    // Simulate real-time data for a single point
    const newPoint = {
      time: new Date().toLocaleTimeString(),
      volume: Math.floor(Math.random() * 3000) + 500,
      transactions: Math.floor(Math.random() * 100) + 20,
      value: Math.floor(Math.random() * 60000) + 10000,
    }
    return res.status(200).json(newPoint)
  } else {
    res.setHeader("Allow", ["GET"])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
