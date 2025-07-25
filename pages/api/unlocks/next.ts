// Next.js API Route for getting the nearest unlock event for a specific token.

import type { NextApiRequest, NextApiResponse } from "next"
import { db, serializeUnlockEvent } from "../../lib/db"

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const { token } = req.query

    if (!token || typeof token !== "string") {
      return res.status(400).json({ error: "Token parameter is required." })
    }

    const now = new Date()
    const nearestUnlock = db.unlocks
      .find((u) => u.token === token && u.date >= now)
      .sort((a, b) => a.date.getTime() - b.date.getTime())[0]

    if (nearestUnlock) {
      return res.status(200).json(serializeUnlockEvent(nearestUnlock))
    } else {
      return res.status(404).json({ message: `No upcoming unlock found for token: ${token}` })
    }
  } else {
    res.setHeader("Allow", ["GET"])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
