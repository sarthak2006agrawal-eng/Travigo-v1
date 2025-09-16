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
  Navigation,
  Star,
  Calendar,
  Users,
  CreditCard,
  CheckCircle,
  ArrowLeft,
  Car,
  Bike,
  Train,
  Plane,
  Bus,
  Fuel,
  MapIcon,
  Shield,
} from "lucide-react"
import Link from "next/link"

const getTransportIcon = (type: string) => {
  switch (type) {
    case "car":
      return <Car className="h-6 w-6" />
    case "scooter":
      return <Bike className="h-6 w-6" />
    case "bike":
      return <Bike className="h-6 w-6" />
    case "train":
      return <Train className="h-6 w-6" />
    case "bus":
      return <Bus className="h-6 w-6" />
    case "flight":
      return <Plane className="h-6 w-6" />
    default:
      return <Navigation className="h-6 w-6" />
  }
}

export default function TransportBookingPage() {
  const [selectedTransport, setSelectedTransport] = useState<any>(null)
  const [bookingDetails, setBookingDetails] = useState<any>(null)
  const [isBooked, setIsBooked] = useState(false)
  const [bookingForm, setBookingForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    licenseNumber: "",
    specialRequests: "",
  })

  useEffect(() => {
    const transport = localStorage.getItem("selectedTransport")
    const details = localStorage.getItem("transportBookingDetails")

    if (transport) setSelectedTransport(JSON.parse(transport))
    if (details) setBookingDetails(JSON.parse(details))
  }, [])

  const handleInputChange = (field: string, value: string) => {
    setBookingForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleBooking = () => {
    setTimeout(() => {
      setIsBooked(true)
    }, 1500)
  }

  const calculateDuration = () => {
    if (!bookingDetails) return 1
    const pickupDate = new Date(bookingDetails.pickupDate)
    const returnDate = new Date(bookingDetails.returnDate)
    return Math.ceil((returnDate.getTime() - pickupDate.getTime()) / (1000 * 60 * 60 * 24)) || 1
  }

  const totalCost = selectedTransport
    ? selectedTransport.price *
      (selectedTransport.type === "car" || selectedTransport.type === "scooter" || selectedTransport.type === "bike"
        ? calculateDuration()
        : 1)
    : 0

  if (isBooked) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center">
          <CardContent className="p-8">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-green-800 mb-2">Booking Confirmed!</h1>
            <p className="text-green-600 mb-4">
              Your <strong>{selectedTransport?.name}</strong> booking has been successfully confirmed.
            </p>
            <div className="bg-green-50 p-4 rounded-lg mb-6">
              <p className="text-sm text-green-700">
                <strong>Booking Reference:</strong> TRV{Math.random().toString(36).substr(2, 9).toUpperCase()}
              </p>
              <p className="text-sm text-green-700">
                <strong>Pickup:</strong> {bookingDetails?.pickupDate}
              </p>
              {selectedTransport?.type !== "train" &&
                selectedTransport?.type !== "bus" &&
                selectedTransport?.type !== "flight" && (
                  <p className="text-sm text-green-700">
                    <strong>Return:</strong> {bookingDetails?.returnDate}
                  </p>
                )}
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

  if (!selectedTransport || !bookingDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-primary/5 flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center">
          <CardContent className="p-8">
            <Navigation className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h1 className="text-xl font-semibold mb-2">No Transport Selected</h1>
            <p className="text-muted-foreground mb-4">
              Please select a transport option from the dashboard to proceed with booking.
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
              Transport Booking
            </Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto grid lg:grid-cols-2 gap-8">
          {/* Transport Details */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  {getTransportIcon(selectedTransport.type)}
                  <span>Transport Details</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                    <img
                      src={selectedTransport.image || "/placeholder.svg"}
                      alt={selectedTransport.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-xl font-semibold">{selectedTransport.name}</h3>
                      <Badge variant="outline" className="text-xs">
                        {selectedTransport.category}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground mt-1">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="ml-1">{selectedTransport.rating}</span>
                      </div>
                      <span>•</span>
                      <span>{selectedTransport.provider}</span>
                    </div>
                  </div>

                  <p className="text-muted-foreground">{selectedTransport.description}</p>

                  <div>
                    <h4 className="font-medium mb-2">Features</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedTransport.features.map((feature: string, index: number) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {feature === "GPS Navigation" && <MapIcon className="h-3 w-3 mr-1" />}
                          {feature === "Fuel Included" && <Fuel className="h-3 w-3 mr-1" />}
                          {feature === "24/7 Support" && <Shield className="h-3 w-3 mr-1" />}
                          {feature}
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
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">From</span>
                  </div>
                  <span className="font-medium">{bookingDetails.from}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">To</span>
                  </div>
                  <span className="font-medium">{bookingDetails.to}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Pickup Date</span>
                  </div>
                  <span className="font-medium">{bookingDetails.pickupDate}</span>
                </div>

                {(selectedTransport.type === "car" ||
                  selectedTransport.type === "scooter" ||
                  selectedTransport.type === "bike") && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Return Date</span>
                    </div>
                    <span className="font-medium">{bookingDetails.returnDate}</span>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Passengers</span>
                  </div>
                  <span className="font-medium">
                    {bookingDetails.passengers} {bookingDetails.passengers === 1 ? "person" : "people"}
                  </span>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <span className="text-sm">
                    ₹{selectedTransport.price.toLocaleString()} ×{" "}
                    {selectedTransport.type === "car" ||
                    selectedTransport.type === "scooter" ||
                    selectedTransport.type === "bike"
                      ? `${calculateDuration()} days`
                      : "1 trip"}
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
                  <span>Booking Information</span>
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

                {(selectedTransport.type === "car" || selectedTransport.type === "scooter") && (
                  <div>
                    <Label htmlFor="licenseNumber">Driving License Number</Label>
                    <Input
                      id="licenseNumber"
                      value={bookingForm.licenseNumber}
                      onChange={(e) => handleInputChange("licenseNumber", e.target.value)}
                      placeholder="DL1420110012345"
                    />
                  </div>
                )}

                <div>
                  <Label htmlFor="specialRequests">Special Requests (Optional)</Label>
                  <Input
                    id="specialRequests"
                    value={bookingForm.specialRequests}
                    onChange={(e) => handleInputChange("specialRequests", e.target.value)}
                    placeholder="Child seat, GPS device, etc."
                  />
                </div>

                <Separator />

                <div className="bg-muted/30 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Booking Terms</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Valid ID and license required for pickup</li>
                    <li>• Free cancellation up to 2 hours before pickup</li>
                    <li>• Fuel charges included for rentals</li>
                    <li>• 24/7 customer support available</li>
                  </ul>
                </div>

                <Button
                  onClick={handleBooking}
                  className="w-full bg-gradient-to-r from-accent to-primary hover:from-accent/90 hover:to-primary/90 transform hover:scale-105 transition-all duration-200"
                  size="lg"
                  disabled={
                    !bookingForm.firstName ||
                    !bookingForm.lastName ||
                    !bookingForm.email ||
                    !bookingForm.phone ||
                    ((selectedTransport.type === "car" || selectedTransport.type === "scooter") &&
                      !bookingForm.licenseNumber)
                  }
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
