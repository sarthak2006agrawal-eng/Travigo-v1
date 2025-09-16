interface ItinerarySnapshot {
  id: string
  timestamp: Date
  userPreferences: any
  itinerary: any[]
  totalCost: number
  hash: string
}

interface BlockchainTransaction {
  hash: string
  blockNumber: number
  gasUsed: string
  gasPrice: string
  explorerUrl: string
  timestamp: Date
  status: "pending" | "confirmed" | "failed"
}

export class BlockchainSnapshotService {
  private readonly POLYGON_TESTNET_EXPLORER = "https://mumbai.polygonscan.com"
  private snapshots: ItinerarySnapshot[] = []

  async saveItineraryToBlockchain(
    userPreferences: any,
    itinerary: any[],
  ): Promise<{ snapshot: ItinerarySnapshot; transaction: BlockchainTransaction }> {
    // Create itinerary snapshot
    const totalCost = itinerary.reduce((sum, day) => sum + day.totalCost, 0)
    const snapshotData = {
      userPreferences,
      itinerary,
      totalCost,
      timestamp: new Date().toISOString(),
    }

    // Generate hash (simulate blockchain hash)
    const hash = this.generateHash(JSON.stringify(snapshotData))

    const snapshot: ItinerarySnapshot = {
      id: Date.now().toString(),
      timestamp: new Date(),
      userPreferences,
      itinerary,
      totalCost,
      hash,
    }

    // Simulate blockchain transaction
    const transaction: BlockchainTransaction = {
      hash: this.generateTransactionHash(),
      blockNumber: Math.floor(Math.random() * 1000000) + 40000000,
      gasUsed: (Math.random() * 50000 + 21000).toFixed(0),
      gasPrice: (Math.random() * 20 + 10).toFixed(2),
      explorerUrl: `${this.POLYGON_TESTNET_EXPLORER}/tx/${this.generateTransactionHash()}`,
      timestamp: new Date(),
      status: "pending",
    }

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Simulate transaction confirmation
    setTimeout(() => {
      transaction.status = "confirmed"
    }, 3000)

    this.snapshots.push(snapshot)
    return { snapshot, transaction }
  }

  private generateHash(data: string): string {
    // Simple hash simulation (in real implementation, use proper cryptographic hash)
    let hash = 0
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash = hash & hash // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(16).padStart(8, "0")
  }

  private generateTransactionHash(): string {
    const chars = "0123456789abcdef"
    let result = "0x"
    for (let i = 0; i < 64; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }

  getSnapshots(): ItinerarySnapshot[] {
    return this.snapshots.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
  }

  async verifySnapshot(hash: string): Promise<boolean> {
    // Simulate blockchain verification
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return this.snapshots.some((snapshot) => snapshot.hash === hash)
  }

  getSnapshotByHash(hash: string): ItinerarySnapshot | null {
    return this.snapshots.find((snapshot) => snapshot.hash === hash) || null
  }

  calculateStorageCost(itinerary: any[]): { gasEstimate: string; costInMatic: string; costInUSD: string } {
    const dataSize = JSON.stringify(itinerary).length
    const gasEstimate = Math.floor(dataSize * 68 + 21000) // Rough estimate
    const costInMatic = (gasEstimate * 0.00000002).toFixed(6) // ~20 gwei
    const costInUSD = (Number.parseFloat(costInMatic) * 0.85).toFixed(4) // Assuming MATIC ~$0.85

    return {
      gasEstimate: gasEstimate.toString(),
      costInMatic,
      costInUSD,
    }
  }
}

export const blockchainService = new BlockchainSnapshotService()
