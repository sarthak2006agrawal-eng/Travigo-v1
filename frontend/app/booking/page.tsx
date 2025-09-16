"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
  MapPin,
  Hotel,
  Star,
  Wifi,
  Coffee,
  Dumbbell,
  Car,
  Calendar,
  Users,
  CreditCard,
  CheckCircle,
  ArrowLeft,
} from "lucide-react"
import Link from "next/link"

export default function BookingPage() {
  const [selectedHotel, setSelectedHotel] = useState<any>(null)
  const [bookingDetails, setBookingDetails] = useState<any>(null)
  const [isBooked, setIsBooked] = useState(false)
  const [bookingForm, setBookingForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    specialRequests: "",
  })

  useEffect(() => {
    const hotel = localStorage.getItem("selectedHotel")
    const details = localStorage.getItem("bookingDetails")

    if (hotel) setSelectedHotel(JSON.parse(hotel))
    if (details) setBookingDetails(JSON.parse(details))
  }, [])

  const handleInputChange = (field: string, value: string) => {
    setBookingForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleBooking = () => {
    // Simulate booking process
    setTimeout(() => {
      setIsBooked(true)
    }, 1500)
  }

  const calculateNights = () => {
    if (!bookingDetails) return 1
    const checkIn = new Date(bookingDetails.checkIn)
    const checkOut = new Date(bookingDetails.checkOut)
    return Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))
  }

  const totalCost = selectedHotel ? selectedHotel.price * calculateNights() : 0

  if (isBooked) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center">
          <CardContent className="p-8">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-green-800 mb-2">Booking Confirmed!</h1>
            <p className="text-green-600 mb-4">
              Your stay at <strong>{selectedHotel?.name}</strong> has been successfully booked.
            </p>
            <div className="bg-green-50 p-4 rounded-lg mb-6">
              <p className="text-sm text-green-700">
                <strong>Booking Reference:</strong> TRV{Math.random().toString(36).substr(2, 9).toUpperCase()}
              </p>
              <p className="text-sm text-green-700">
                <strong>Check-in:</strong> {bookingDetails?.checkIn}
              </p>
              <p className="text-sm text-green-700">
                <strong>Check-out:</strong> {bookingDetails?.checkOut}
              </p>
            </div>
            <Button asChild className="w-full">
              <Link href="/dashboard">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!selectedHotel || !bookingDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-primary/5 flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center">
          <CardContent className="p-8">
            <Hotel className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h1 className="text-xl font-semibold mb-2">No Hotel Selected</h1>
            <p className="text-muted-foreground mb-4">
              Please select a hotel from the dashboard to proceed with booking.
            </p>
            <Button asChild>
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-primary/5">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <ArrowLeft className="h-5 w-5" />
              <MapPin className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold text-foreground">Travigo</span>
            </Link>
            <Badge variant="outline" className="px-3 py-1">
              Booking Confirmation
            </Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto grid lg:grid-cols-2 gap-8">
          {/* Hotel Details */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Hotel className="h-5 w-5 text-primary" />
                  <span>Hotel Details</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                    <img
                      src={selectedHotel.image || "/placeholder.svg"}
                      alt={selectedHotel.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold">{selectedHotel.name}</h3>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground mt-1">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="ml-1">{selectedHotel.rating}</span>
                      </div>
                      <span>•</span>
                      <span>{selectedHotel.reviews} reviews</span>
                      <span>•</span>
                      <span>{selectedHotel.location}</span>
                    </div>
                  </div>

                  <p className="text-muted-foreground">{selectedHotel.description}</p>

                  <div>
                    <h4 className="font-medium mb-2">Amenities</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedHotel.amenities.map((amenity: string, index: number) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {amenity === "Free WiFi" && <Wifi className="h-3 w-3 mr-1" />}
                          {amenity === "Gym" && <Dumbbell className="h-3 w-3 mr-1" />}
                          {amenity === "Breakfast" && <Coffee className="h-3 w-3 mr-1" />}
                          {amenity === "Parking" && <Car className="h-3 w-3 mr-1" />}
                          {amenity}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Booking Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Check-in</span>
                  </div>
                  <span className="font-medium">{bookingDetails.checkIn}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Check-out</span>
                  </div>
                  <span className="font-medium">{bookingDetails.checkOut}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Guests</span>
                  </div>
                  <span className="font-medium">
                    {bookingDetails.guests} {bookingDetails.guests === 1 ? "guest" : "guests"}
                  </span>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <span className="text-sm">
                    ₹{selectedHotel.price.toLocaleString()} × {calculateNights()} nights
                  </span>
                  <span className="font-medium">₹{totalCost.toLocaleString()}</span>
                </div>

                <div className="flex items-center justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>₹{totalCost.toLocaleString()}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking Form */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CreditCard className="h-5 w-5 text-primary" />
                  <span>Guest Information</span>
                </CardTitle>
                <CardDescription>Please provide your details to complete the booking</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={bookingForm.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={bookingForm.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={bookingForm.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="john.doe@example.com"
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={bookingForm.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="+91 98765 43210"
                  />
                </div>

                <div>
                  <Label htmlFor="specialRequests">Special Requests (Optional)</Label>
                  <Input
                    id="specialRequests"
                    value={bookingForm.specialRequests}
                    onChange={(e) => handleInputChange("specialRequests", e.target.value)}
                    placeholder="Early check-in, room preferences, etc."
                  />
                </div>

                <Separator />

                <div className="bg-muted/30 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Booking Policy</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Free cancellation up to 24 hours before check-in</li>
                    <li>• Valid ID required at check-in</li>
                    <li>• Payment will be processed securely</li>
                  </ul>
                </div>

                <Button
                  onClick={handleBooking}
                  className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 transform hover:scale-105 transition-all duration-200"
                  size="lg"
                  disabled={!bookingForm.firstName || !bookingForm.lastName || !bookingForm.email || !bookingForm.phone}
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  Confirm Booking - ₹{totalCost.toLocaleString()}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
