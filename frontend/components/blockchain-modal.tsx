"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Copy, ExternalLink, Shield, CheckCircle, Clock, AlertCircle } from "lucide-react"

interface BlockchainModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: () => Promise<{ snapshot: any; transaction: any }>
  itinerary: any[]
  userPreferences: any
}

export default function BlockchainModal({ isOpen, onClose, onSave, itinerary, userPreferences }: BlockchainModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [transaction, setTransaction] = useState<any>(null)
  const [snapshot, setSnapshot] = useState<any>(null)
  const [step, setStep] = useState<"confirm" | "processing" | "success">("confirm")

  const handleSave = async () => {
    setIsLoading(true)
    setStep("processing")

    try {
      const result = await onSave()
      setTransaction(result.transaction)
      setSnapshot(result.snapshot)
      setStep("success")
    } catch (error) {
      console.error("Failed to save to blockchain:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const formatHash = (hash: string) => {
    if (hash.length <= 16) return hash
    return `${hash.slice(0, 8)}...${hash.slice(-8)}`
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "pending":
        return <Clock className="h-4 w-4 text-orange-600" />
      case "failed":
        return <AlertCircle className="h-4 w-4 text-red-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800 border-green-200"
      case "pending":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "failed":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-primary" />
            <span>Blockchain Snapshot</span>
          </DialogTitle>
          <DialogDescription>
            Save your itinerary permanently on the Polygon blockchain for secure verification and backup.
          </DialogDescription>
        </DialogHeader>

        {step === "confirm" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Itinerary Summary</CardTitle>
                <CardDescription>This data will be stored on the blockchain</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Destination:</span>
                    <div className="font-medium">{userPreferences?.destination || "N/A"}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Duration:</span>
                    <div className="font-medium">{userPreferences?.duration || 0} days</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Total Activities:</span>
                    <div className="font-medium">{itinerary.reduce((sum, day) => sum + day.activities.length, 0)}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Total Cost:</span>
                    <div className="font-medium">
                      ₹{itinerary.reduce((sum, day) => sum + day.totalCost, 0).toLocaleString()}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Blockchain Details</CardTitle>
                <CardDescription>Transaction costs and network information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Network:</span>
                  <Badge variant="outline">Polygon Mumbai Testnet</Badge>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Estimated Gas:</span>
                  <span className="font-medium">~45,000</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Cost:</span>
                  <span className="font-medium">~0.001 MATIC ($0.0008)</span>
                </div>
              </CardContent>
            </Card>

            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                Your itinerary will be stored as an immutable record on the blockchain. This ensures permanent backup
                and verification of your travel plans.
              </AlertDescription>
            </Alert>

            <div className="flex space-x-3">
              <Button onClick={onClose} variant="outline" className="flex-1 bg-transparent">
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={isLoading} className="flex-1">
                {isLoading ? "Saving..." : "Save to Blockchain"}
              </Button>
            </div>
          </div>
        )}

        {step === "processing" && (
          <div className="space-y-6 text-center py-8">
            <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <Shield className="h-8 w-8 text-primary animate-pulse" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Processing Transaction</h3>
              <p className="text-muted-foreground">Your itinerary is being saved to the Polygon blockchain...</p>
            </div>
            <div className="space-y-2">
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full animate-pulse" style={{ width: "60%" }}></div>
              </div>
              <p className="text-sm text-muted-foreground">This may take a few moments</p>
            </div>
          </div>
        )}

        {step === "success" && transaction && snapshot && (
          <div className="space-y-6">
            <div className="text-center py-4">
              <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Successfully Saved!</h3>
              <p className="text-muted-foreground">Your itinerary has been permanently stored on the blockchain.</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Transaction Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Status:</span>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(transaction.status)}
                    <Badge className={getStatusColor(transaction.status)}>
                      {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-muted-foreground">Transaction Hash:</span>
                  <div className="flex items-center space-x-2 p-2 bg-muted rounded-lg">
                    <code className="text-sm flex-1 font-mono">{formatHash(transaction.hash)}</code>
                    <Button size="sm" variant="ghost" onClick={() => copyToClipboard(transaction.hash)}>
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-muted-foreground">Itinerary Hash:</span>
                  <div className="flex items-center space-x-2 p-2 bg-muted rounded-lg">
                    <code className="text-sm flex-1 font-mono">{snapshot.hash}</code>
                    <Button size="sm" variant="ghost" onClick={() => copyToClipboard(snapshot.hash)}>
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Block Number:</span>
                    <div className="font-medium">{transaction.blockNumber.toLocaleString()}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Gas Used:</span>
                    <div className="font-medium">{Number.parseInt(transaction.gasUsed).toLocaleString()}</div>
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="w-full bg-transparent"
                  onClick={() => window.open(transaction.explorerUrl, "_blank")}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View on Polygon Explorer
                </Button>
              </CardContent>
            </Card>

            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Your itinerary is now permanently stored on the blockchain. You can use the transaction hash to verify
                and retrieve your travel plans anytime.
              </AlertDescription>
            </Alert>

            <Button onClick={onClose} className="w-full">
              Done
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
