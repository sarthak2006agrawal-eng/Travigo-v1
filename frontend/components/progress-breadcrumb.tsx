"use client"

import { usePathname } from "next/navigation"
import { CheckCircle, Circle, ArrowRight } from "lucide-react"

const steps = [
  { path: "/", label: "Welcome", description: "Get started" },
  { path: "/auth", label: "Sign In", description: "Create account" },
  { path: "/preferences", label: "Preferences", description: "Set travel details" },
  { path: "/dashboard", label: "Dashboard", description: "Your itinerary" },
]

export function ProgressBreadcrumb() {
  const pathname = usePathname()
  const currentStepIndex = steps.findIndex((step) => step.path === pathname)

  if (pathname === "/") return null

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-40 bg-background/95 backdrop-blur-sm border rounded-full px-6 py-3 shadow-lg">
      <div className="flex items-center space-x-4">
        {steps.slice(1).map((step, index) => {
          const stepIndex = index + 1
          const isCompleted = stepIndex < currentStepIndex
          const isCurrent = stepIndex === currentStepIndex

          return (
            <div key={step.path} className="flex items-center">
              <div className="flex items-center space-x-2">
                <div
                  className={`transition-all duration-300 ${
                    isCompleted ? "text-primary" : isCurrent ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <Circle className={`w-5 h-5 ${isCurrent ? "fill-primary" : ""}`} />
                  )}
                </div>
                <div className="flex flex-col">
                  <span
                    className={`text-sm font-medium transition-colors ${
                      isCompleted || isCurrent ? "text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {step.label}
                  </span>
                  <span className="text-xs text-muted-foreground hidden sm:block">{step.description}</span>
                </div>
              </div>
              {stepIndex < steps.length - 1 && <ArrowRight className="w-4 h-4 text-muted-foreground mx-3" />}
            </div>
          )
        })}
      </div>
    </div>
  )
}
