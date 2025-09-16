"use client"
import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Home } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

export default function BookingConfirmationPage() {
  const [bookingDetails, setBookingDetails] = useState<any>(null)
  const searchParams = useSearchParams()
  const type = searchParams.get("type") // 'hotel' or 'transport'
  const name = searchParams.get("name")

  useEffect(() => {
    // Simulate booking confirmation
    setBookingDetails({
      type,
      name,
      confirmationId: `TRV${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      bookingDate: new Date().toLocaleDateString(),
    })
  }, [type, name])

  if (!bookingDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl border-0">
        <CardContent className="p-8 text-center space-y-6">
          {/* Success Icon */}
          <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>

          {/* Success Message */}
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-foreground">Booking Confirmed!</h1>
            <p className="text-muted-foreground">Your {bookingDetails.type} has been successfully booked</p>
          </div>

          {/* Booking Details */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Booking ID:</span>
              <span className="font-mono font-semibold">{bookingDetails.confirmationId}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {bookingDetails.type === "hotel" ? "Hotel:" : "Transport:"}
              </span>
              <span className="font-semibold">{bookingDetails.name}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Booked on:</span>
              <span className="font-semibold">{bookingDetails.bookingDate}</span>
            </div>
          </div>

          {/* Confirmation Message */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              📧 A confirmation email has been sent to your registered email address with all the details.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Link href="/dashboard" className="w-full">
              <Button className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90">
                <Home className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <Link href="/" className="w-full">
              <Button variant="outline" className="w-full bg-transparent">
                Plan Another Trip
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
