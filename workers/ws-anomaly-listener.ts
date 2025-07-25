interface AnomalyEvent {
  id: string
  type: "whale_transfer" | "volume_spike" | "unusual_contract" | "flash_loan" | "liquidity_drain"
  severity: "low" | "medium" | "high" | "critical"
  title: string
  description: string
  walletAddress?: string
  amount?: number
  token?: string
  timestamp: Date
  metadata: any
}

const anomalyEvents: AnomalyEvent[] = []

export class AnomalyDetector {
  private isRunning = false
  private intervalId?: NodeJS.Timeout

  start() {
    if (this.isRunning) return

    console.log("Starting Anomaly Detection WebSocket Listener...")
    this.isRunning = true

    // Simulate real-time anomaly detection every 10 seconds
    this.intervalId = setInterval(() => {
      this.detectAnomalies()
    }, 10000)
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = undefined
    }
    this.isRunning = false
    console.log("Anomaly Detection WebSocket Listener stopped.")
  }

  private detectAnomalies() {
    // Simulate various types of anomaly detection
    const anomalyTypes = [
      this.detectWhaleTransfers,
      this.detectVolumeSpikes,
      this.detectUnusualContracts,
      this.detectFlashLoans,
      this.detectLiquidityDrains,
    ]

    // Randomly trigger anomaly detection (30% chance)
    if (Math.random() < 0.3) {
      const detector = anomalyTypes[Math.floor(Math.random() * anomalyTypes.length)]
      const anomaly = detector.call(this)

      if (anomaly) {
        this.processAnomaly(anomaly)
      }
    }
  }

  private detectWhaleTransfers(): AnomalyEvent | null {
    // Simulate whale transfer detection
    if (Math.random() < 0.4) {
      const amount = Math.floor(Math.random() * 1000000) + 500000
      const tokens = ["SEI", "USDC", "ATOM", "OSMO"]
      const token = tokens[Math.floor(Math.random() * tokens.length)]

      return {
        id: `whale-${Date.now()}`,
        type: "whale_transfer",
        severity: amount > 800000 ? "critical" : "high",
        title: "Large Whale Transfer Detected",
        description: `Whale transferred ${amount.toLocaleString()} ${token} (${(amount * 0.7).toLocaleString()} USD)`,
        walletAddress: `0x${Math.random().toString(16).substring(2, 10)}...`,
        amount,
        token,
        timestamp: new Date(),
        metadata: {
          usdValue: amount * 0.7,
          direction: Math.random() > 0.5 ? "in" : "out",
        },
      }
    }
    return null
  }

  private detectVolumeSpikes(): AnomalyEvent | null {
    if (Math.random() < 0.3) {
      const spikePercentage = Math.floor(Math.random() * 500) + 200
      const tokens = ["SEI", "USDC", "ATOM"]
      const token = tokens[Math.floor(Math.random() * tokens.length)]

      return {
        id: `volume-${Date.now()}`,
        type: "volume_spike",
        severity: spikePercentage > 400 ? "high" : "medium",
        title: "Unusual Volume Spike",
        description: `${token} trading volume increased by ${spikePercentage}% in the last 5 minutes`,
        token,
        timestamp: new Date(),
        metadata: {
          spikePercentage,
          timeframe: "5m",
        },
      }
    }
    return null
  }

  private detectUnusualContracts(): AnomalyEvent | null {
    if (Math.random() < 0.2) {
      return {
        id: `contract-${Date.now()}`,
        type: "unusual_contract",
        severity: "medium",
        title: "Risky Contract Interaction",
        description: "Multiple wallets interacting with newly deployed unverified contract",
        walletAddress: `0x${Math.random().toString(16).substring(2, 10)}...`,
        timestamp: new Date(),
        metadata: {
          contractAddress: `0x${Math.random().toString(16).substring(2, 10)}...`,
          interactionCount: Math.floor(Math.random() * 50) + 10,
        },
      }
    }
    return null
  }

  private detectFlashLoans(): AnomalyEvent | null {
    if (Math.random() < 0.1) {
      const amount = Math.floor(Math.random() * 2000000) + 1000000

      return {
        id: `flash-${Date.now()}`,
        type: "flash_loan",
        severity: "critical",
        title: "Potential Flash Loan Attack",
        description: `Flash loan of ${amount.toLocaleString()} USDC detected with suspicious arbitrage pattern`,
        walletAddress: `0x${Math.random().toString(16).substring(2, 10)}...`,
        amount,
        token: "USDC",
        timestamp: new Date(),
        metadata: {
          profit: Math.floor(Math.random() * 50000) + 10000,
          protocols: ["Astroport", "Osmosis"],
        },
      }
    }
    return null
  }

  private detectLiquidityDrains(): AnomalyEvent | null {
    if (Math.random() < 0.15) {
      const drainPercentage = Math.floor(Math.random() * 60) + 30

      return {
        id: `liquidity-${Date.now()}`,
        type: "liquidity_drain",
        severity: drainPercentage > 60 ? "high" : "medium",
        title: "Liquidity Pool Drain Alert",
        description: `SEI/USDC pool liquidity decreased by ${drainPercentage}% in 10 minutes`,
        timestamp: new Date(),
        metadata: {
          pool: "SEI/USDC",
          drainPercentage,
          timeframe: "10m",
        },
      }
    }
    return null
  }

  private processAnomaly(anomaly: AnomalyEvent) {
    // Add to in-memory storage
    anomalyEvents.unshift(anomaly)

    // Keep only last 50 anomalies
    if (anomalyEvents.length > 50) {
      anomalyEvents.splice(50)
    }

    console.log(`🚨 Anomaly Detected: ${anomaly.title}`)

    // In a real implementation, this would:
    // 1. Save to database
    // 2. Send notifications via Telegram/Discord
    // 3. Trigger webhooks
    // 4. Update real-time dashboard
  }

  getRecentAnomalies(limit = 20): AnomalyEvent[] {
    return anomalyEvents.slice(0, limit)
  }
}

// Global instance
export const anomalyDetector = new AnomalyDetector()

// Auto-start the detector
anomalyDetector.start()
