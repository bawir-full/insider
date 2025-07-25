// Next.js API Route for listing unlock events.

import type { NextApiRequest, NextApiResponse } from "next"
import { db, serializeUnlockEvent } from "../../lib/db"
import { addDays } from "date-fns"

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const { range } = req.query
    const now = new Date()
    let endDate = addDays(now, 30) // Default to 30 days

    if (typeof range === "string") {
      const days = Number.parseInt(range.replace("d", ""))
      if (!isNaN(days)) {
        endDate = addDays(now, days)
      }
    }

    const upcomingUnlocks = db.unlocks.find((u) => u.date >= now && u.date <= endDate).map(serializeUnlockEvent)

    return res.status(200).json(upcomingUnlocks)
  } else {
    res.setHeader("Allow", ["GET"])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
