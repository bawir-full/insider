// Next.js API Route for reporting backend system status.

import type { NextApiRequest, NextApiResponse } from "next"

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    // Simulate various backend statuses
    const status = {
      seiRpcEndpoint: { status: "Connected", latency: `${Math.floor(Math.random() * 50) + 20}ms` },
      cryptoRankApi: { status: "Active", lastFetch: new Date(Date.now() - Math.random() * 3600000).toISOString() },
      messariApi: { status: "Active", lastFetch: new Date(Date.now() - Math.random() * 3600000).toISOString() },
      mongoDb: { status: "Connected", queryTime: `${Math.floor(Math.random() * 100) + 10}ms` },
      webSocketStream: { status: "Active", connectedClients: Math.floor(Math.random() * 100) + 5 },
      cronJobs: { status: "Running", lastRun: new Date(Date.now() - Math.random() * 3600000).toISOString() },
      alertEngine: { status: "Ready", pendingAlerts: Math.floor(Math.random() * 10) },
      apiEndpoints: {
        "/api/unlocks/list": { status: "200 OK", responseTime: `${Math.floor(Math.random() * 200) + 50}ms` },
        "/api/unlocks/next": { status: "200 OK", responseTime: `${Math.floor(Math.random() * 100) + 20}ms` },
        "/api/unlocks/impact": { status: "200 OK", responseTime: `${Math.floor(Math.random() * 300) + 100}ms` },
        "/api/subscribe": { status: "200 OK", responseTime: `${Math.floor(Math.random() * 80) + 10}ms` },
      },
    }

    return res.status(200).json(status)
  } else {
    res.setHeader("Allow", ["GET"])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
