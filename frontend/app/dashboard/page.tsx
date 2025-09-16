"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  MapPin,
  Calendar,
  DollarSign,
  CloudRain,
  Clock,
  Navigation,
  Hotel,
  Camera,
  Utensils,
  Mountain,
  X,
  Brain,
  Sparkles,
  Send,
  AlertTriangle,
  Shield,
  PartyPopper,
  Star,
  Wifi,
  Coffee,
  Dumbbell,
  CarIcon,
  ExternalLink,
  Car,
  Bike,
  Train,
  Plane,
  Bus,
  Fuel,
  MapIcon,
  Lightbulb,
  MessageCircle,
} from "lucide-react"
import Link from "next/link"
import InteractiveMap from "@/components/interactive-map"
import BlockchainModal from "@/components/blockchain-modal"
import { generateAIItinerary } from "@/lib/ai-itinerary-generator"
import { AIChatbot } from "@/lib/ai-chatbot"
import { LiveAlertSystem } from "@/lib/live-alerts"
import { blockchainService } from "@/lib/blockchain-snapshot"
import { OnboardingTour } from "@/components/onboarding-tour"
import { DashboardSkeleton } from "@/components/loading-skeleton"

const hotelData = [
  {
    id: 1,
    name: "Grand Palace Hotel",
    rating: 4.8,
    price: 3500,
    originalPrice: 4200,
    image: "/luxury-hotel-exterior.png",
    amenities: ["Free WiFi", "Pool", "Gym", "Restaurant"],
    location: "City Center",
    description: "Luxury hotel with stunning city views and world-class amenities",
    availability: "Available",
    reviews: 1247,
  },
  {
    id: 2,
    name: "Comfort Inn & Suites",
    rating: 4.2,
    price: 2100,
    originalPrice: 2500,
    image: "/modern-hotel-lobby.png",
    amenities: ["Free WiFi", "Breakfast", "Parking"],
    location: "Near Airport",
    description: "Modern hotel perfect for business and leisure travelers",
    availability: "Available",
    reviews: 892,
  },
  {
    id: 3,
    name: "Budget Stay Lodge",
    rating: 3.9,
    price: 1200,
    originalPrice: 1500,
    image: "/budget-hotel-room.jpg",
    amenities: ["Free WiFi", "24/7 Reception"],
    location: "Downtown",
    description: "Clean and comfortable accommodation at an affordable price",
    availability: "Available",
    reviews: 456,
  },
]

const transportData = [
  {
    id: 1,
    type: "car",
    name: "Premium Car Rental",
    provider: "Zoomcar",
    rating: 4.6,
    price: 2500,
    originalPrice: 3000,
    duration: "per day",
    image: "/luxury-car-rental.png",
    features: ["GPS Navigation", "Full Insurance", "24/7 Support", "Fuel Included"],
    description: "Comfortable sedan perfect for city and highway travel",
    availability: "Available",
    category: "Premium",
  },
  {
    id: 2,
    type: "scooter",
    name: "City Scooter Rental",
    provider: "Bounce",
    rating: 4.3,
    price: 400,
    originalPrice: 500,
    duration: "per day",
    image: "/scooter-rental.jpg",
    features: ["Helmet Included", "Easy Parking", "Fuel Efficient", "City Access"],
    description: "Perfect for navigating through city traffic and narrow lanes",
    availability: "Available",
    category: "Economy",
  },
  {
    id: 3,
    type: "bike",
    name: "Mountain Bike Rental",
    provider: "Yulu",
    rating: 4.1,
    price: 200,
    originalPrice: 300,
    duration: "per day",
    image: "/mountain-bike-rental.jpg",
    features: ["Eco-Friendly", "Exercise", "Flexible Routes", "No Traffic"],
    description: "Eco-friendly option for short distances and sightseeing",
    availability: "Available",
    category: "Eco",
  },
  {
    id: 4,
    type: "train",
    name: "Express Train Booking",
    provider: "IRCTC",
    rating: 4.0,
    price: 1200,
    originalPrice: 1200,
    duration: "one way",
    image: "/train-booking.jpg",
    features: ["Comfortable Seating", "Scenic Route", "Affordable", "Reliable"],
    description: "Comfortable train journey with beautiful scenic views",
    availability: "Available",
    category: "Public",
  },
  {
    id: 5,
    type: "bus",
    name: "Luxury Coach Service",
    provider: "RedBus",
    rating: 4.2,
    price: 800,
    originalPrice: 1000,
    duration: "one way",
    image: "/luxury-bus.jpg",
    features: ["AC Seating", "WiFi", "Entertainment", "Refreshments"],
    description: "Comfortable bus service with modern amenities",
    availability: "Available",
    category: "Comfort",
  },
  {
    id: 6,
    type: "flight",
    name: "Domestic Flight",
    provider: "IndiGo",
    rating: 4.4,
    price: 4500,
    originalPrice: 5500,
    duration: "one way",
    image: "/airplane-booking.jpg",
    features: ["Fast Travel", "Baggage Included", "In-flight Service", "Priority Boarding"],
    description: "Quick and convenient air travel for long distances",
    availability: "Available",
    category: "Premium",
  },
]

const getActivityIcon = (type: string) => {
  switch (type) {
    case "hotel":
      return <Hotel className="h-4 w-4" />
    case "food":
      return <Utensils className="h-4 w-4" />
    case "nature":
      return <Mountain className="h-4 w-4" />
    case "culture":
      return <Camera className="h-4 w-4" />
    case "transport":
      return <Navigation className="h-4 w-4" />
    default:
      return <MapPin className="h-4 w-4" />
  }
}

const getTransportIcon = (type: string) => {
  switch (type) {
    case "car":
      return <Car className="h-4 w-4" />
    case "scooter":
      return <Bike className="h-4 w-4" />
    case "bike":
      return <Bike className="h-4 w-4" />
    case "train":
      return <Train className="h-4 w-4" />
    case "bus":
      return <Bus className="h-4 w-4" />
    case "flight":
      return <Plane className="h-4 w-4" />
    default:
      return <Navigation className="h-4 w-4" />
  }
}

const getActivityColor = (type: string) => {
  switch (type) {
    case "hotel":
      return "bg-blue-100 text-blue-800"
    case "food":
      return "bg-orange-100 text-orange-800"
    case "nature":
      return "bg-green-100 text-green-800"
    case "culture":
      return "bg-purple-100 text-purple-800"
    case "transport":
      return "bg-gray-100 text-gray-800"
    case "adventure":
      return "bg-red-100 text-red-800"
    case "shopping":
      return "bg-pink-100 text-pink-800"
    case "relaxation":
      return "bg-indigo-100 text-indigo-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export default function DashboardPage() {
  const [showAlert, setShowAlert] = useState(false)
  const [chatOpen, setChatOpen] = useState(false)
  const [itinerary, setItinerary] = useState<any[]>([])
  const [isGenerating, setIsGenerating] = useState(true)
  const [userPreferences, setUserPreferences] = useState<any>(null)

  const [chatbot, setChatbot] = useState<AIChatbot | null>(null)
  const [alertSystem, setAlertSystem] = useState<LiveAlertSystem | null>(null)
  const [chatMessages, setChatMessages] = useState<any[]>([])
  const [currentMessage, setCurrentMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [activeAlerts, setActiveAlerts] = useState<any[]>([])
  const [replanningInProgress, setReplanningInProgress] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const [blockchainModalOpen, setBlockchainModalOpen] = useState(false)
  const [savedSnapshots, setSavedSnapshots] = useState<any[]>([])

  const [recommendedHotels, setRecommendedHotels] = useState(hotelData)
  const [selectedHotel, setSelectedHotel] = useState<any>(null)
  const [recommendedTransport, setRecommendedTransport] = useState(transportData)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [chatMessages])

  useEffect(() => {
    const generateItinerary = async () => {
      const storedPreferences = localStorage.getItem("travelPreferences")
      if (storedPreferences) {
        const preferences = JSON.parse(storedPreferences)
        setUserPreferences(preferences)

        await new Promise((resolve) => setTimeout(resolve, 1000))

        const { itinerary: generatedItinerary } = generateAIItinerary(preferences)
        setItinerary(generatedItinerary)

        const bot = new AIChatbot(generatedItinerary)
        const alerts = new LiveAlertSystem(generatedItinerary)
        setChatbot(bot)
        setAlertSystem(alerts)
        setChatMessages(bot.getMessages())

        const filteredHotels = hotelData.filter((hotel) => {
          if (preferences.accommodation === "budget") return hotel.price <= 1500
          if (preferences.accommodation === "mid-range") return hotel.price > 1500 && hotel.price <= 4000
          if (preferences.accommodation === "luxury") return hotel.price > 4000
          return true
        })
        setRecommendedHotels(filteredHotels.length > 0 ? filteredHotels : hotelData)

        const filteredTransport = transportData.filter((transport) => {
          if (preferences.transport && preferences.transport.length > 0) {
            return preferences.transport.some((pref: string) => {
              if (pref === "scooter" && transport.type === "scooter") return true
              if (pref === "car" && transport.type === "car") return true
              if (pref === "bike" && transport.type === "bike") return true
              if (pref === "bus" && transport.type === "bus") return true
              if (pref === "train" && transport.type === "train") return true
              if (pref === "flight" && transport.type === "flight") return true
              return false
            })
          }
          return true
        })
        setRecommendedTransport(filteredTransport.length > 0 ? filteredTransport : transportData.slice(0, 4))
      }
      setIsGenerating(false)
    }

    generateItinerary()
  }, [])

  const totalBudget = userPreferences?.budget || 25000
  const usedBudget = itinerary.reduce((sum, day) => sum + day.totalCost, 0)
  const budgetProgress = totalBudget > 0 ? (usedBudget / totalBudget) * 100 : 0

  const handleBookHotel = (hotel: any) => {
    setSelectedHotel(hotel)
    localStorage.setItem("selectedHotel", JSON.stringify(hotel))
    localStorage.setItem(
      "bookingDetails",
      JSON.stringify({
        checkIn: new Date().toISOString().split("T")[0],
        checkOut: new Date(Date.now() + (userPreferences?.duration || 3) * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
        guests: userPreferences?.people || 2,
        destination: userPreferences?.toLocation || "Your Destination",
      }),
    )
    const bookingUrl = `/booking-confirmation?type=hotel&name=${encodeURIComponent(hotel.name)}`
    window.location.href = bookingUrl
  }

  const handleBookTransport = (transport: any) => {
    localStorage.setItem("selectedTransport", JSON.stringify(transport))
    localStorage.setItem(
      "transportBookingDetails",
      JSON.stringify({
        pickupDate: new Date().toISOString().split("T")[0],
        returnDate: new Date(Date.now() + (userPreferences?.duration || 3) * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
        passengers: userPreferences?.people || 2,
        from: userPreferences?.fromLocation || "Your Location",
        to: userPreferences?.toLocation || "Your Destination",
      }),
    )
    const bookingUrl = `/booking-confirmation?type=transport&name=${encodeURIComponent(transport.name)}`
    window.location.href = bookingUrl
  }

  const triggerRandomAlert = () => {
    if (!alertSystem) return

    const alertTypes = ["weather", "traffic", "safety", "event"]
    const randomType = alertTypes[Math.floor(Math.random() * alertTypes.length)]

    let alertData
    switch (randomType) {
      case "weather":
        alertData = alertSystem.generateWeatherAlert()
        break
      case "traffic":
        alertData = alertSystem.generateTrafficAlert()
        break
      case "safety":
        alertData = alertSystem.generateSafetyAlert()
        break
      case "event":
        alertData = alertSystem.generateEventAlert()
        break
      default:
        alertData = alertSystem.generateWeatherAlert()
    }

    setActiveAlerts([alertData.alert])

    if (alertData.alert.autoReplan) {
      setReplanningInProgress(true)
      setTimeout(() => {
        const updatedItinerary = alertSystem.applyReplanning(alertData.replanning)
        setItinerary(updatedItinerary)
        setReplanningInProgress(false)
      }, 2000)
    }
  }

  const handleSendMessage = async () => {
    if (!currentMessage.trim() || !chatbot) return

    setIsTyping(true)
    const response = await chatbot.processMessage(currentMessage)

    if (response.modification) {
      const updatedItinerary = [...itinerary]
      if (response.modification.type === "add" && response.modification.activity) {
        const dayIndex = response.modification.day - 1
        if (updatedItinerary[dayIndex]) {
          updatedItinerary[dayIndex].activities.push(response.modification.activity)
          updatedItinerary[dayIndex].totalCost += response.modification.activity.cost
          setItinerary(updatedItinerary)
          chatbot.updateItinerary(updatedItinerary)
        }
      }
    }

    setChatMessages(chatbot.getMessages())
    setCurrentMessage("")
    setIsTyping(false)
  }

  const handleSuggestionClick = (suggestion: string) => {
    setCurrentMessage(suggestion)
    setTimeout(() => {
      handleSendMessage()
    }, 100)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "weather":
        return <CloudRain className="h-4 w-4" />
      case "traffic":
        return <CarIcon className="h-4 w-4" />
      case "safety":
        return <Shield className="h-4 w-4" />
      case "event":
        return <PartyPopper className="h-4 w-4" />
      default:
        return <AlertTriangle className="h-4 w-4" />
    }
  }

  const getAlertColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "border-red-200 bg-red-50 text-red-800"
      case "medium":
        return "border-orange-200 bg-orange-50 text-orange-800"
      case "low":
        return "border-blue-200 bg-blue-50 text-blue-800"
      default:
        return "border-gray-200 bg-gray-50 text-gray-800"
    }
  }

  const handleSaveToBlockchain = async () => {
    const result = await blockchainService.saveItineraryToBlockchain(userPreferences, itinerary)
    setSavedSnapshots([...savedSnapshots, result.snapshot])
    return result
  }

  if (isGenerating) {
    return <DashboardSkeleton />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <OnboardingTour />

      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur sticky top-0 z-40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <MapPin className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold text-foreground">Travigo</span>
            </Link>

            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-4">
                <div className="text-sm">
                  <span className="text-muted-foreground">Budget: </span>
                  <span className="font-medium">
                    ₹{usedBudget.toLocaleString()} / ₹{totalBudget.toLocaleString()}
                  </span>
                </div>
                <Progress value={budgetProgress} className="w-24" />
              </div>

              <Button onClick={triggerRandomAlert} variant="outline" size="sm" data-tour="alerts">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Trigger Live Alert
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Live Alerts */}
      {activeAlerts.map((alert) => (
        <Alert
          key={alert.id}
          className={`mx-4 mt-4 ${getAlertColor(alert.severity)} animate-in slide-in-from-top-2 duration-300`}
        >
          {getAlertIcon(alert.type)}
          <AlertDescription className="flex justify-between items-center">
            <div>
              <strong>{alert.title}:</strong> {alert.message}
              {alert.autoReplan && (
                <div className="mt-1 text-sm">
                  {replanningInProgress ? (
                    <span className="flex items-center space-x-2">
                      <div className="h-3 w-3 border border-current border-t-transparent rounded-full animate-spin"></div>
                      <span>AI is replanning your itinerary...</span>
                    </span>
                  ) : (
                    <span>✓ Itinerary automatically updated</span>
                  )}
                </div>
              )}
            </div>
            <Button variant="ghost" size="sm" onClick={() => setActiveAlerts([])}>
              <X className="h-4 w-4" />
            </Button>
          </AlertDescription>
        </Alert>
      ))}

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Panel - Itinerary */}
          <div className="lg:col-span-2 space-y-6" data-tour="itinerary">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  Your {userPreferences?.toLocation || "Travel"} Adventure
                </h1>
                <p className="text-muted-foreground">{userPreferences?.duration || 3} days • AI Generated Itinerary</p>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="bg-primary/10 text-primary">
                  <Brain className="h-3 w-3 mr-1" />
                  AI Generated
                </Badge>
                <Button
                  onClick={() => setBlockchainModalOpen(true)}
                  variant="outline"
                  size="sm"
                  className="bg-transparent hover:bg-primary/5 transition-colors"
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Save to Blockchain
                </Button>
              </div>
            </div>

            <Card className="hover:shadow-md transition-shadow" data-tour="hotels">
              <CardHeader>
                <CardTitle className="text-lg flex items-center space-x-2">
                  <Hotel className="h-5 w-5 text-primary" />
                  <span>Recommended Hotels for You</span>
                </CardTitle>
                <CardDescription>
                  Based on your {userPreferences?.accommodation || "mid-range"} preference in{" "}
                  {userPreferences?.toLocation || "your destination"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {recommendedHotels.slice(0, 3).map((hotel) => (
                    <Card
                      key={hotel.id}
                      className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
                    >
                      <div className="flex">
                        <div className="w-32 h-24 bg-muted flex-shrink-0">
                          <img
                            src={hotel.image || "/placeholder.svg"}
                            alt={hotel.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="font-semibold text-lg">{hotel.name}</h3>
                              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                <div className="flex items-center">
                                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                  <span className="ml-1">{hotel.rating}</span>
                                </div>
                                <span>•</span>
                                <span>{hotel.reviews} reviews</span>
                                <span>•</span>
                                <span>{hotel.location}</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-bold">₹{hotel.price.toLocaleString()}</div>
                              {hotel.originalPrice > hotel.price && (
                                <div className="text-sm text-muted-foreground line-through">
                                  ₹{hotel.originalPrice.toLocaleString()}
                                </div>
                              )}
                              <div className="text-xs text-muted-foreground">per night</div>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">{hotel.description}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex flex-wrap gap-1">
                              {hotel.amenities.slice(0, 3).map((amenity, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {amenity === "Free WiFi" && <Wifi className="h-3 w-3 mr-1" />}
                                  {amenity === "Gym" && <Dumbbell className="h-3 w-3 mr-1" />}
                                  {amenity === "Breakfast" && <Coffee className="h-3 w-3 mr-1" />}
                                  {amenity}
                                </Badge>
                              ))}
                            </div>
                            <Button
                              size="sm"
                              onClick={() => handleBookHotel(hotel)}
                              className="bg-primary hover:bg-primary/90 transform hover:scale-105 transition-all duration-200"
                            >
                              <ExternalLink className="h-4 w-4 mr-1" />
                              Book Now
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow" data-tour="transport">
              <CardHeader>
                <CardTitle className="text-lg flex items-center space-x-2">
                  <Navigation className="h-5 w-5 text-primary" />
                  <span>Recommended Transport Options</span>
                </CardTitle>
                <CardDescription>
                  Best transport options from {userPreferences?.fromLocation || "your location"} to{" "}
                  {userPreferences?.toLocation || "your destination"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {recommendedTransport.slice(0, 4).map((transport) => (
                    <Card
                      key={transport.id}
                      className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
                    >
                      <div className="flex">
                        <div className="w-32 h-24 bg-muted flex-shrink-0">
                          <img
                            src={transport.image || "/placeholder.svg"}
                            alt={transport.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <div className="flex items-center space-x-2 mb-1">
                                {getTransportIcon(transport.type)}
                                <h3 className="font-semibold text-lg">{transport.name}</h3>
                                <Badge variant="outline" className="text-xs">
                                  {transport.category}
                                </Badge>
                              </div>
                              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                <div className="flex items-center">
                                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                  <span className="ml-1">{transport.rating}</span>
                                </div>
                                <span>•</span>
                                <span>{transport.provider}</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-bold">₹{transport.price.toLocaleString()}</div>
                              {transport.originalPrice > transport.price && (
                                <div className="text-sm text-muted-foreground line-through">
                                  ₹{transport.originalPrice.toLocaleString()}
                                </div>
                              )}
                              <div className="text-xs text-muted-foreground">{transport.duration}</div>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">{transport.description}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex flex-wrap gap-1">
                              {transport.features.slice(0, 3).map((feature, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {feature === "GPS Navigation" && <MapIcon className="h-3 w-3 mr-1" />}
                                  {feature === "Fuel Included" && <Fuel className="h-3 w-3 mr-1" />}
                                  {feature === "24/7 Support" && <Shield className="h-3 w-3 mr-1" />}
                                  {feature}
                                </Badge>
                              ))}
                            </div>
                            <Button
                              size="sm"
                              onClick={() => handleBookTransport(transport)}
                              className="bg-accent hover:bg-accent/90 transform hover:scale-105 transition-all duration-200"
                            >
                              <ExternalLink className="h-4 w-4 mr-1" />
                              Book Now
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Budget Overview */}
            <Card className="hover:shadow-md transition-shadow" data-tour="budget">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <span>Smart Budget Overview</span>
                  </CardTitle>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-foreground">₹{usedBudget.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">of ₹{totalBudget.toLocaleString()}</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Progress value={budgetProgress} className="mb-2" />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{budgetProgress.toFixed(1)}% used</span>
                  <span>₹{(totalBudget - usedBudget).toLocaleString()} remaining</span>
                </div>
              </CardContent>
            </Card>

            {/* Daily Itinerary */}
            <div className="space-y-4">
              {itinerary.map((day, index) => (
                <Card
                  key={day.day}
                  className="overflow-hidden hover:shadow-md transition-all duration-300 animate-in fade-in-0 slide-in-from-bottom-4"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardHeader className="bg-muted/30">
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle className="text-lg">
                          Day {day.day} - {day.location}
                        </CardTitle>
                        <CardDescription>{day.date}</CardDescription>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold">₹{day.totalCost.toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground">daily cost</div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="space-y-0">
                      {day.activities.map((activity: any, activityIndex: number) => (
                        <div
                          key={activityIndex}
                          className="flex items-center justify-between p-4 border-b border-border last:border-b-0 hover:bg-muted/20 transition-colors duration-200"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="flex items-center space-x-2 text-sm text-muted-foreground min-w-[60px]">
                              <Clock className="h-3 w-3" />
                              {activity.time}
                            </div>
                            <div
                              className={`p-1 rounded-full ${getActivityColor(activity.type)} transition-transform hover:scale-110`}
                            >
                              {getActivityIcon(activity.type)}
                            </div>
                            <div>
                              <div className="font-medium">{activity.name}</div>
                              <div className="text-xs text-muted-foreground mt-1">{activity.description}</div>
                              <Badge variant="outline" className="text-xs mt-1">
                                {activity.type}
                              </Badge>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">
                              {activity.cost === 0 ? "Free" : `₹${activity.cost.toLocaleString()}`}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Blockchain Snapshots */}
            {savedSnapshots.length > 0 && (
              <Card className="animate-in fade-in-0 slide-in-from-bottom-4">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <Shield className="h-4 w-4 text-primary" />
                    <span>Blockchain Snapshots</span>
                  </CardTitle>
                  <CardDescription>Your itinerary backups stored on Polygon blockchain</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {savedSnapshots.slice(0, 3).map((snapshot) => (
                      <div
                        key={snapshot.id}
                        className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div>
                          <div className="text-sm font-medium">
                            {snapshot.timestamp.toLocaleDateString()} at {snapshot.timestamp.toLocaleTimeString()}
                          </div>
                          <div className="text-xs text-muted-foreground">Hash: {snapshot.hash}</div>
                        </div>
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          <Shield className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Panel - Map */}
          <div className="space-y-6">
            <div data-tour="map">
              <InteractiveMap />
            </div>

            {/* Quick Actions */}
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">AI Assistant Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start bg-transparent hover:bg-primary/5 transition-colors"
                >
                  <Brain className="h-4 w-4 mr-2" />
                  Regenerate Itinerary
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start bg-transparent hover:bg-primary/5 transition-colors"
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Modify Itinerary
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start bg-transparent hover:bg-primary/5 transition-colors"
                >
                  <DollarSign className="h-4 w-4 mr-2" />
                  Adjust Budget
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start bg-transparent hover:bg-primary/5 transition-colors"
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  Add Destinations
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Enhanced Floating Chatbot */}
      <div className="fixed bottom-4 right-4 z-50" data-tour="chatbot">
        {chatOpen ? (
          <Card className="w-80 sm:w-96 h-[400px] sm:h-[500px] shadow-2xl animate-in slide-in-from-bottom-4 duration-300 border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-primary/5 to-accent/5">
              <CardTitle className="text-sm flex items-center space-x-2">
                <Brain className="h-4 w-4 text-primary animate-pulse" />
                <span>AI Travel Assistant</span>
                <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></div>
                  Online
                </Badge>
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setChatOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="flex flex-col h-full p-0">
              <ScrollArea className="flex-1 p-3 max-h-[300px] sm:max-h-[380px] overflow-y-auto">
                <div className="space-y-3">
                  {chatMessages.map((message) => (
                    <div key={message.id} className="space-y-2">
                      <div
                        className={`flex ${message.type === "user" ? "justify-end" : "justify-start"} animate-in fade-in-0 slide-in-from-bottom-2`}
                      >
                        <div
                          className={`max-w-[85%] p-3 rounded-lg text-sm transition-all hover:scale-[1.02] break-words ${
                            message.type === "user"
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-foreground border border-border"
                          }`}
                        >
                          <div className="whitespace-pre-wrap break-words">{message.content}</div>
                          {message.type === "assistant" && (
                            <div className="text-xs text-muted-foreground mt-1 opacity-70">
                              {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Suggestion buttons */}
                      {message.type === "assistant" && message.suggestions && (
                        <div className="flex flex-wrap gap-1 ml-2">
                          {message.suggestions.map((suggestion, index) => (
                            <Button
                              key={index}
                              variant="outline"
                              size="sm"
                              className="text-xs h-7 bg-background hover:bg-primary/5 border-primary/20 break-words"
                              onClick={() => handleSuggestionClick(suggestion)}
                            >
                              <Lightbulb className="h-3 w-3 mr-1 flex-shrink-0" />
                              <span className="truncate">{suggestion}</span>
                            </Button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-muted text-muted-foreground p-3 rounded-lg text-sm border border-border">
                        <div className="flex items-center space-x-2">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
                            <div
                              className="w-2 h-2 bg-current rounded-full animate-bounce"
                              style={{ animationDelay: "0.1s" }}
                            ></div>
                            <div
                              className="w-2 h-2 bg-current rounded-full animate-bounce"
                              style={{ animationDelay: "0.2s" }}
                            ></div>
                          </div>
                          <span className="text-xs">AI is thinking...</span>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* Chat Input */}
              <div className="border-t p-3 bg-background">
                <form onSubmit={handleSendMessage} className="flex space-x-2">
                  <Input
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    placeholder="Ask me anything about your trip..."
                    className="flex-1 text-sm"
                    disabled={isTyping}
                  />
                  <Button type="submit" size="sm" disabled={isTyping || !currentMessage.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Button
            onClick={() => setChatOpen(true)}
            className="h-14 w-14 rounded-full shadow-lg bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 hover:scale-110 transition-all duration-300"
          >
            <MessageCircle className="h-6 w-6" />
          </Button>
        )}
      </div>

      {/* Blockchain Modal */}
      <BlockchainModal
        isOpen={blockchainModalOpen}
        onClose={() => setBlockchainModalOpen(false)}
        onSave={handleSaveToBlockchain}
        itinerary={itinerary}
        userPreferences={userPreferences}
      />
    </div>
  )
}
