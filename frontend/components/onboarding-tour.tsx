"use client"

import { useState, useEffect } from "react"
import { X, ArrowRight, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

const tourSteps = [
  {
    target: '[data-tour="itinerary"]',
    title: "Your AI-Generated Itinerary",
    description: "Here's your personalized day-by-day travel plan created by our AI based on your preferences.",
    position: "right",
  },
  {
    target: '[data-tour="budget"]',
    title: "Budget Tracking",
    description:
      "Monitor your spending in real-time with our smart budget tracker that updates as you modify your itinerary.",
    position: "bottom",
  },
  {
    target: '[data-tour="map"]',
    title: "Interactive Map",
    description: "Visualize your journey with our interactive map showing routes, POIs, and daily activities.",
    position: "left",
  },
  {
    target: '[data-tour="chatbot"]',
    title: "AI Assistant",
    description: "Chat with our AI to modify your itinerary, get recommendations, or ask travel questions.",
    position: "top",
  },
  {
    target: '[data-tour="alerts"]',
    title: "Live Alerts",
    description: "Get real-time updates about weather, traffic, and events with automatic itinerary adjustments.",
    position: "top",
  },
]

export function OnboardingTour() {
  const [isOpen, setIsOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)

  useEffect(() => {
    const hasSeenTour = localStorage.getItem("travigo-tour-completed")
    if (!hasSeenTour) {
      const timer = setTimeout(() => setIsOpen(true), 1000)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleComplete()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleComplete = () => {
    localStorage.setItem("travigo-tour-completed", "true")
    setIsOpen(false)
  }

  const handleSkip = () => {
    localStorage.setItem("travigo-tour-completed", "true")
    setIsOpen(false)
  }

  if (!isOpen) return null

  const currentTourStep = tourSteps[currentStep]

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 z-50" />

      {/* Tour popup */}
      <div
        className="fixed z-50 bg-card border rounded-lg shadow-xl p-6 max-w-sm animate-in fade-in-0 zoom-in-95"
        style={{
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-semibold text-lg">{currentTourStep.title}</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Step {currentStep + 1} of {tourSteps.length}
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={handleSkip}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <p className="text-sm mb-6">{currentTourStep.description}</p>

        <div className="flex justify-between items-center">
          <Button variant="outline" size="sm" onClick={handlePrevious} disabled={currentStep === 0}>
            <ArrowLeft className="w-4 h-4 mr-1" />
            Previous
          </Button>

          <div className="flex space-x-1">
            {tourSteps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentStep ? "bg-primary" : "bg-muted"
                }`}
              />
            ))}
          </div>

          <Button size="sm" onClick={handleNext}>
            {currentStep === tourSteps.length - 1 ? "Finish" : "Next"}
            {currentStep < tourSteps.length - 1 && <ArrowRight className="w-4 h-4 ml-1" />}
          </Button>
        </div>
      </div>
    </>
  )
}
