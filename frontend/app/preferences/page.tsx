"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  MapPin,
  DollarSign,
  Brain,
  ArrowRight,
  ArrowLeft,
  Calendar,
  Users,
  Heart,
  Building,
  Car,
  Plane,
  Train,
  Bus,
  Bike,
  Mountain,
  Camera,
  Utensils,
  TreePine,
  Waves,
  Music,
  ShoppingBag,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

const TOTAL_STEPS = 15

const interests = [
  {
    id: "nature",
    label: "Nature & Wildlife",
    icon: TreePine,
    description: "Hiking, national parks, wildlife watching",
  },
  {
    id: "culture",
    label: "Culture & History",
    icon: Building,
    description: "Museums, historical sites, local traditions",
  },
  {
    id: "food",
    label: "Food & Cuisine",
    icon: Utensils,
    description: "Local restaurants, street food, cooking classes",
  },
  {
    id: "adventure",
    label: "Adventure Sports",
    icon: Mountain,
    description: "Trekking, water sports, extreme activities",
  },
  {
    id: "relaxation",
    label: "Relaxation & Wellness",
    icon: Waves,
    description: "Spas, beaches, peaceful environments",
  },
  { id: "nightlife", label: "Nightlife & Entertainment", icon: Music, description: "Bars, clubs, live music, shows" },
  { id: "shopping", label: "Shopping", icon: ShoppingBag, description: "Markets, malls, local crafts" },
  { id: "photography", label: "Photography", icon: Camera, description: "Scenic spots, architectural photography" },
]

const accommodationTypes = [
  { id: "budget", label: "Budget Hostels", description: "Shared rooms, basic amenities", price: "₹500-1500/night" },
  {
    id: "mid-range",
    label: "Mid-Range Hotels",
    description: "Private rooms, good amenities",
    price: "₹2000-5000/night",
  },
  { id: "luxury", label: "Luxury Hotels", description: "Premium service, top amenities", price: "₹8000+/night" },
  {
    id: "boutique",
    label: "Boutique Properties",
    description: "Unique, themed accommodations",
    price: "₹3000-8000/night",
  },
]

const transportTypes = [
  { id: "scooter", label: "Scooter Rental", icon: Bike, description: "Perfect for city exploration" },
  { id: "car", label: "Car Rental", icon: Car, description: "Comfortable for long distances" },
  { id: "bike", label: "Bike Rental", icon: Bike, description: "Eco-friendly city travel" },
  { id: "bus", label: "Bus/Coach", icon: Bus, description: "Budget-friendly group travel" },
  { id: "train", label: "Train", icon: Train, description: "Scenic and comfortable" },
  { id: "flight", label: "Domestic Flights", icon: Plane, description: "Quick long-distance travel" },
]

export default function PreferencesPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    fromLocation: "",
    toLocation: "",
    duration: [7],
    people: [2],
    budget: "",
    interests: [] as string[],
    accommodation: "",
    transport: [] as string[],
  })
  const [isLoading, setIsLoading] = useState(false)
  const [generationStep, setGenerationStep] = useState("")
  const router = useRouter()

  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleInterestToggle = (interestId: string) => {
    const newInterests = formData.interests.includes(interestId)
      ? formData.interests.filter((id) => id !== interestId)
      : [...formData.interests, interestId]
    updateFormData("interests", newInterests)
  }

  const handleTransportToggle = (transportId: string) => {
    const newTransport = formData.transport.includes(transportId)
      ? formData.transport.filter((id) => id !== transportId)
      : [...formData.transport, transportId]
    updateFormData("transport", newTransport)
  }

  const nextStep = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    const steps = [
      "Analyzing your preferences...",
      "Finding best destinations...",
      "Calculating optimal routes...",
      "Selecting accommodations...",
      "Planning daily activities...",
      "Optimizing your budget...",
      "Finalizing your itinerary...",
    ]

    for (let i = 0; i < steps.length; i++) {
      setGenerationStep(steps[i])
      await new Promise((resolve) => setTimeout(resolve, 400))
    }

    const preferences = {
      ...formData,
      duration: formData.duration[0],
      people: formData.people[0],
      budget: Number.parseInt(formData.budget),
    }

    if (typeof window !== "undefined") {
      localStorage.setItem("travelPreferences", JSON.stringify(preferences))
    }

    setIsLoading(false)
    router.push("/dashboard")
  }

  const handleAutoAdvance = (callback?: () => void) => {
    if (callback) callback()
    setTimeout(() => {
      if (currentStep < TOTAL_STEPS) {
        setCurrentStep(currentStep + 1)
      }
    }, 800) // Small delay for visual feedback
  }

  const handleInterestSelection = (interestId: string, isPositive: boolean) => {
    if (isPositive) {
      if (!formData.interests.includes(interestId)) {
        updateFormData("interests", [...formData.interests, interestId])
      }
    } else {
      if (formData.interests.includes(interestId)) {
        updateFormData(
          "interests",
          formData.interests.filter((id) => id !== interestId),
        )
      }
    }
    handleAutoAdvance()
  }

  const handleAccommodationSelect = (accommodationType: string) => {
    updateFormData("accommodation", accommodationType)
    handleAutoAdvance()
  }

  const handleTransportSelect = (transportId: string) => {
    const newTransport = formData.transport.includes(transportId)
      ? formData.transport.filter((id) => id !== transportId)
      : [...formData.transport, transportId]
    updateFormData("transport", newTransport)
    // Don't auto-advance for transport as users might want to select multiple
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <MapPin className="h-12 w-12 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Where are you traveling from?</h2>
              <p className="text-muted-foreground">Tell us your starting location</p>
            </div>
            <Input
              placeholder="e.g., Delhi, Mumbai, Bangalore"
              value={formData.fromLocation}
              onChange={(e) => updateFormData("fromLocation", e.target.value)}
              className="text-lg py-6"
            />
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <MapPin className="h-12 w-12 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Where would you like to go?</h2>
              <p className="text-muted-foreground">Your dream destination awaits</p>
            </div>
            <Input
              placeholder="e.g., Shimla, Goa, Kerala, Rajasthan"
              value={formData.toLocation}
              onChange={(e) => updateFormData("toLocation", e.target.value)}
              className="text-lg py-6"
            />
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Calendar className="h-12 w-12 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">How many days will you be traveling?</h2>
              <p className="text-muted-foreground">
                Duration: {formData.duration[0]} {formData.duration[0] === 1 ? "day" : "days"}
              </p>
            </div>
            <div className="px-6">
              <Slider
                value={formData.duration}
                onValueChange={(value) => updateFormData("duration", value)}
                max={30}
                min={1}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted-foreground mt-2">
                <span>1 day</span>
                <span>30 days</span>
              </div>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Users className="h-12 w-12 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">How many people are traveling?</h2>
              <p className="text-muted-foreground">
                Group size: {formData.people[0]} {formData.people[0] === 1 ? "person" : "people"}
              </p>
            </div>
            <div className="px-6">
              <Slider
                value={formData.people}
                onValueChange={(value) => updateFormData("people", value)}
                max={20}
                min={1}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted-foreground mt-2">
                <span>Solo</span>
                <span>Large Group</span>
              </div>
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <DollarSign className="h-12 w-12 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">What's your budget for this trip?</h2>
              <p className="text-muted-foreground">Include accommodation, food, transport, and activities</p>
            </div>
            <div className="relative">
              <DollarSign className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input
                type="number"
                placeholder="e.g., 25000"
                value={formData.budget}
                onChange={(e) => updateFormData("budget", e.target.value)}
                className="pl-12 text-lg py-6"
              />
            </div>
          </div>
        )

      case 6:
      case 7:
      case 8:
      case 9:
      case 10:
      case 11:
      case 12:
      case 13:
        const interestIndex = currentStep - 6
        const interest = interests[interestIndex]
        if (!interest) {
          return (
            <div className="space-y-6">
              <div className="text-center">
                <Building className="h-12 w-12 text-primary mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">What type of accommodation do you prefer?</h2>
                <p className="text-muted-foreground">Choose your comfort level</p>
              </div>
              <div className="grid gap-4">
                {accommodationTypes.map((type) => (
                  <Card
                    key={type.id}
                    className={`cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.02] ${
                      formData.accommodation === type.id ? "ring-2 ring-primary bg-primary/5" : ""
                    }`}
                    onClick={() => handleAccommodationSelect(type.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-lg">{type.label}</h3>
                          <p className="text-muted-foreground text-sm">{type.description}</p>
                        </div>
                        <Badge variant="outline">{type.price}</Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )
        }

        const IconComponent = interest.icon
        return (
          <div className="space-y-6">
            <div className="text-center">
              <IconComponent className="h-12 w-12 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Do you enjoy {interest.label.toLowerCase()}?</h2>
              <p className="text-muted-foreground">{interest.description}</p>
            </div>
            <div className="flex gap-4 justify-center">
              <Button
                variant="default"
                size="lg"
                onClick={() => handleInterestSelection(interest.id, true)}
                className="flex-1 max-w-xs py-6 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 transform hover:scale-105 transition-all duration-200"
              >
                <Heart className="h-5 w-5 mr-2" />
                Yes, I love it!
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => handleInterestSelection(interest.id, false)}
                className="flex-1 max-w-xs py-6 transform hover:scale-105 transition-all duration-200"
              >
                Not really
              </Button>
            </div>
          </div>
        )

      case 14:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Building className="h-12 w-12 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">What type of accommodation do you prefer?</h2>
              <p className="text-muted-foreground">Choose your comfort level</p>
            </div>
            <div className="grid gap-4">
              {accommodationTypes.map((type) => (
                <Card
                  key={type.id}
                  className={`cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.02] ${
                    formData.accommodation === type.id ? "ring-2 ring-primary bg-primary/5" : ""
                  }`}
                  onClick={() => handleAccommodationSelect(type.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg">{type.label}</h3>
                        <p className="text-muted-foreground text-sm">{type.description}</p>
                      </div>
                      <Badge variant="outline">{type.price}</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )

      case 15:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Car className="h-12 w-12 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">How would you like to get around?</h2>
              <p className="text-muted-foreground">Select all transport options you're comfortable with</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {transportTypes.map((transport) => {
                const IconComponent = transport.icon
                return (
                  <Card
                    key={transport.id}
                    className={`cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.02] ${
                      formData.transport.includes(transport.id) ? "ring-2 ring-primary bg-primary/5 scale-[1.02]" : ""
                    }`}
                    onClick={() => handleTransportSelect(transport.id)}
                  >
                    <CardContent className="p-4 text-center">
                      <IconComponent className="h-8 w-8 mx-auto mb-2 text-primary" />
                      <h3 className="font-semibold">{transport.label}</h3>
                      <p className="text-muted-foreground text-sm">{transport.description}</p>
                      {formData.transport.includes(transport.id) && (
                        <Badge className="mt-2 bg-primary text-primary-foreground">Selected</Badge>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        )

      default:
        return null
    }
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.fromLocation.trim() !== ""
      case 2:
        return formData.toLocation.trim() !== ""
      case 3:
        return formData.duration[0] > 0
      case 4:
        return formData.people[0] > 0
      case 5:
        return formData.budget.trim() !== ""
      case 14:
        return formData.accommodation !== ""
      case 15:
        return formData.transport.length > 0
      default:
        return true
    }
  }

  const isLastStep = currentStep === TOTAL_STEPS

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <MapPin className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold text-foreground">Travigo</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="px-3 py-1">
                Question {currentStep} of {TOTAL_STEPS}
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="max-w-2xl mx-auto">
          {/* Progress Bar */}
          <div className="mb-6 sm:mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-muted-foreground">Progress</span>
              <span className="text-sm font-medium text-muted-foreground">
                {Math.round((currentStep / TOTAL_STEPS) * 100)}%
              </span>
            </div>
            <Progress value={(currentStep / TOTAL_STEPS) * 100} className="h-2" />
          </div>

          {/* Question Card */}
          <Card className="border-0 shadow-xl mb-6 sm:mb-8">
            <CardContent className="p-4 sm:p-8">
              {isLoading ? (
                <div className="text-center space-y-6">
                  <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                    <Brain className="h-8 w-8 text-primary animate-pulse" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="text-lg font-medium">{generationStep}</p>
                  </div>
                </div>
              ) : (
                renderStep()
              )}
            </CardContent>
          </Card>

          {/* Navigation */}
          {!isLoading && (
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="flex items-center justify-center space-x-2 bg-transparent w-full sm:w-auto"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Previous</span>
              </Button>

              {isLastStep ? (
                <Button
                  onClick={handleSubmit}
                  disabled={!canProceed()}
                  className="flex items-center justify-center space-x-2 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 w-full sm:w-auto"
                >
                  <Brain className="h-4 w-4" />
                  <span>Generate My Itinerary</span>
                </Button>
              ) : (
                <Button
                  onClick={nextStep}
                  disabled={!canProceed()}
                  className="flex items-center justify-center space-x-2 w-full sm:w-auto"
                >
                  <span>Next</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
