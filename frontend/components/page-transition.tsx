"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"

export function PageTransition({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setIsLoading(true)
    const timer = setTimeout(() => setIsLoading(false), 300)
    return () => clearTimeout(timer)
  }, [pathname])

  return (
    <div className="relative">
      {isLoading && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center">
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <div className="w-12 h-12 border-4 border-primary/20 rounded-full animate-spin border-t-primary"></div>
              <div className="absolute inset-0 w-12 h-12 border-4 border-transparent rounded-full animate-pulse border-t-primary/40"></div>
            </div>
            <p className="text-sm text-muted-foreground animate-pulse">Loading...</p>
          </div>
        </div>
      )}
      <div className={`transition-all duration-300 ${isLoading ? "opacity-0 scale-95" : "opacity-100 scale-100"}`}>
        {children}
      </div>
    </div>
  )
}
