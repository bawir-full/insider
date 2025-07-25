export interface UnlockEvent {
  id: string
  date: Date
  token: string
  amount: number
  usdValue: number
  type: "cliff" | "linear"
  status: "PENDING" | "CONFIRMED"
  tx_hash?: string | null
}

export interface UnlockSeenEvent {
  txHash: string
  ts: Date
}

// Initial mock data for unlocks
export const unlocks: UnlockEvent[] = [
  {
    id: "event-1",
    date: new Date(2025, 7, 1, 10, 0, 0), // August 1, 2025, 10:00 AM
    token: "SEI",
    amount: 21500000,
    usdValue: 15000000,
    type: "cliff",
    status: "PENDING",
    tx_hash: null,
  },
  {
    id: "event-2",
    date: new Date(2025, 7, 5, 14, 30, 0), // August 5, 2025, 2:30 PM
    token: "ATOM",
    amount: 500000,
    usdValue: 4500000,
    type: "linear",
    status: "PENDING", // Will be confirmed by ws-unlock-listener
    tx_hash: null,
  },
  {
    id: "event-3",
    date: new Date(2025, 7, 10, 9, 0, 0), // August 10, 2025, 9:00 AM
    token: "OSMO",
    amount: 1200000,
    usdValue: 800000,
    type: "cliff",
    status: "PENDING",
    tx_hash: null,
  },
  {
    id: "event-4",
    date: new Date(2025, 7, 15, 11, 0, 0), // August 15, 2025, 11:00 AM
    token: "SEI",
    amount: 10000000,
    usdValue: 7000000,
    type: "linear",
    status: "PENDING",
    tx_hash: null,
  },
  {
    id: "event-5",
    date: new Date(2025, 8, 1, 16, 0, 0), // September 1, 2025, 4:00 PM
    token: "SEI",
    amount: 30000000,
    usdValue: 21000000,
    type: "cliff",
    status: "PENDING",
    tx_hash: null,
  },
  {
    id: "event-6",
    date: new Date(2025, 7, 25, 12, 0, 0), // Today, for testing live status
    token: "TEST",
    amount: 100000,
    usdValue: 50000,
    type: "linear",
    status: "PENDING",
    tx_hash: null,
  },
]

export const unlocksSeen: UnlockSeenEvent[] = []

// Simulate database operations
export const db = {
  unlocks: {
    find: (query?: (event: UnlockEvent) => boolean) => {
      if (query) {
        return unlocks.filter(query)
      }
      return unlocks
    },
    findOne: (query: (event: UnlockEvent) => boolean) => {
      return unlocks.find(query)
    },
    updateOne: (query: (event: UnlockEvent) => boolean, update: Partial<UnlockEvent>, upsert = false) => {
      const index = unlocks.findIndex(query)
      if (index !== -1) {
        unlocks[index] = { ...unlocks[index], ...update }
      } else if (upsert) {
        // Simulate upsert by adding a new item if not found
        const newId = `event-${unlocks.length + 1}`
        unlocks.push({
          id: newId,
          date: new Date(),
          token: "NEW",
          amount: 0,
          usdValue: 0,
          type: "linear",
          status: "PENDING",
          ...(update as UnlockEvent),
        })
      }
    },
    updateMany: (query: (event: UnlockEvent) => boolean, update: Partial<UnlockEvent>) => {
      unlocks.forEach((event, index) => {
        if (query(event)) {
          unlocks[index] = { ...event, ...update }
        }
      })
    },
  },
  unlocksSeen: {
    find: (query?: (event: UnlockSeenEvent) => boolean) => {
      if (query) {
        return unlocksSeen.filter(query)
      }
      return unlocksSeen
    },
    findOne: (query: (event: UnlockSeenEvent) => boolean) => {
      return unlocksSeen.find(query)
    },
    insertOne: (doc: UnlockSeenEvent) => {
      unlocksSeen.push(doc)
    },
  },
}

// Helper to convert Date objects to ISO strings for API output
export const serializeUnlockEvent = (event: UnlockEvent) => ({
  ...event,
  unlockDate: event.date.toISOString(),
  date: undefined, // Remove original Date object
})
