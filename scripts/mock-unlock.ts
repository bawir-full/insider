// This script simulates an on-chain unlock event for testing purposes.
// It directly updates an unlock event's status to CONFIRMED in the dummy DB.

import { db } from "../lib/db"

export async function mockOnChainUnlock(eventId: string) {
  const unlock = db.unlocks.findOne((u) => u.id === eventId)

  if (unlock) {
    if (unlock.status === "CONFIRMED") {
      console.log(`Unlock event ${eventId} is already CONFIRMED.`)
      return
    }
    const dummyTxHash = `0x${Math.random().toString(16).substring(2, 15)}${Math.random().toString(16).substring(2, 15)}`
    db.unlocks.updateOne((u) => u.id === eventId, { status: "CONFIRMED", tx_hash: dummyTxHash })
    db.unlocksSeen.insertOne({ txHash: dummyTxHash, ts: new Date() })
    console.log(`Mocked on-chain confirmation for unlock event ${eventId}. Status: CONFIRMED, Tx: ${dummyTxHash}`)
  } else {
    console.log(`Unlock event ${eventId} not found.`)
  }
}

// Example usage:
// mockOnChainUnlock("event-1");
