// This file simulates the cron job for fetching off-chain unlock data.
// In a real scenario, this would be triggered by GitHub Actions or Vercel Cron.

import { db, type UnlockEvent } from "../lib/db"

const TOKENS = ["SEI", "ATOM", "OSMO", "ETH"] // Example tokens to fetch

export async function runUnlockFetchCron() {
  console.log("Running unlock-fetch cron job...")

  for (const token of TOKENS) {
    // Simulate fetching data from an external API (e.g., CryptoRank/Messari)
    // For dummy purposes, we'll just add/update some mock data.
    const mockData = {
      token: token,
      amount: Math.floor(Math.random() * 10000000) + 100000,
      usdValue: Math.floor(Math.random() * 5000000) + 100000,
      type: Math.random() > 0.5 ? "cliff" : "linear",
      status: "PENDING",
    } as Partial<UnlockEvent>

    // Simulate an unlock date in the near future
    const unlockDate = new Date()
    unlockDate.setDate(unlockDate.getDate() + Math.floor(Math.random() * 30) + 1) // 1-30 days from now
    unlockDate.setHours(Math.floor(Math.random() * 24))
    unlockDate.setMinutes(Math.floor(Math.random() * 60))
    unlockDate.setSeconds(0)
    unlockDate.setMilliseconds(0)

    // Simulate upsert logic
    const existingEvent = db.unlocks.findOne(
      (u) => u.token === token && u.date.toDateString() === unlockDate.toDateString(),
    )

    if (existingEvent) {
      db.unlocks.updateOne((u) => u.id === existingEvent.id, { ...mockData, date: unlockDate })
      console.log(`Updated unlock for ${token} on ${unlockDate.toDateString()}`)
    } else {
      const newId = `event-${db.unlocks.find().length + 1}`
      db.unlocks.updateOne(
        (u) => false, // Always false to trigger upsert
        { id: newId, ...mockData, date: unlockDate } as UnlockEvent,
        true, // upsert = true
      )
      console.log(`Added new unlock for ${token} on ${unlockDate.toDateString()}`)
    }
  }
  console.log("Unlock-fetch cron job finished.")
}

// In a real setup, this would be called by a cron scheduler.
// For this demo, we'll just export it to be potentially called manually or by a test.
