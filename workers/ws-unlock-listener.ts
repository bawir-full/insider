// This file simulates a real-time WebSocket listener for on-chain events.
// It periodically checks for PENDING unlocks that are due and marks them as CONFIRMED.

import { db } from "../lib/db"

const VESTING_ADDR = "0xVestingContractAddress" // Dummy vesting contract address

export async function startWsListener() {
  console.log("Starting WebSocket unlock listener...")

  // Simulate listening every 5 seconds
  setInterval(async () => {
    const now = new Date()
    const toleranceMs = 10 * 60 * 1000 // ±10 minutes tolerance

    // Find PENDING unlocks that are due within the tolerance window
    const pendingUnlocksDue = db.unlocks.find((u) => {
      return (
        u.status === "PENDING" &&
        u.date.getTime() <= now.getTime() + toleranceMs &&
        u.date.getTime() >= now.getTime() - toleranceMs
      )
    })

    if (pendingUnlocksDue.length > 0) {
      console.log(`Detected ${pendingUnlocksDue.length} unlocks due. Simulating on-chain confirmation...`)
      for (const unlock of pendingUnlocksDue) {
        const dummyTxHash = `0x${Math.random().toString(16).substring(2, 15)}${Math.random().toString(16).substring(2, 15)}`

        // Simulate checking if txHash has been seen (to prevent double processing)
        if (!db.unlocksSeen.findOne((s) => s.txHash === dummyTxHash)) {
          db.unlocksSeen.insertOne({ txHash: dummyTxHash, ts: new Date() })
          db.unlocks.updateOne((u) => u.id === unlock.id, { status: "CONFIRMED", tx_hash: dummyTxHash })
          console.log(`Confirmed unlock for ${unlock.token} (ID: ${unlock.id}) with tx: ${dummyTxHash}`)
        }
      }
    }
  }, 5000) // Check every 5 seconds
}

// In a real setup, this would connect to a Sei WebSocket RPC.
// For this demo, we'll just export it to be started.
startWsListener() // Start the listener immediately when the backend is "loaded"
