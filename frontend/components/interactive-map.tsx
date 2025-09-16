"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  MapPin,
  Navigation,
  Mountain,
  Camera,
  Utensils,
  Hotel,
  Zap,
  Route,
  Clock,
  Car,
  Train,
  Plane,
} from "lucide-react"

interface POI {
  id: string
  name: string
  type: string
  position: { x: number; y: number }
  day: number
  active: boolean
  time?: string
  status?: "visited" | "current" | "upcoming"
}

interface RouteSegment {
  from: { x: number; y: number }
  to: { x: number; y: number }
  day: number
  active: boolean
  transport: "walking" | "car" | "train" | "plane"
  duration: string
  distance: string
}

const mockPOIs: POI[] = [
  {
    id: "shimla-hotel",
    name: "Hotel Willow Banks",
    type: "hotel",
    position: { x: 45, y: 60 },
    day: 1,
    active: true,
    time: "Check-in",
    status: "visited",
  },
  {
    id: "mall-road",
    name: "Mall Road",
    type: "activity",
    position: { x: 50, y: 65 },
    day: 1,
    active: true,
    time: "10:00 AM",
    status: "visited",
  },
  {
    id: "christ-church",
    name: "Christ Church",
    type: "culture",
    position: { x: 48, y: 62 },
    day: 1,
    active: true,
    time: "11:30 AM",
    status: "current",
  },
  {
    id: "ridge",
    name: "The Ridge",
    type: "nature",
    position: { x: 52, y: 68 },
    day: 1,
    active: true,
    time: "2:00 PM",
    status: "upcoming",
  },
  {
    id: "kufri",
    name: "Kufri",
    type: "nature",
    position: { x: 70, y: 40 },
    day: 2,
    active: false,
    time: "9:00 AM",
    status: "upcoming",
  },
  {
    id: "nature-park",
    name: "Himalayan Nature Park",
    type: "nature",
    position: { x: 72, y: 38 },
    day: 2,
    active: false,
    time: "11:00 AM",
    status: "upcoming",
  },
  {
    id: "jakhu-temple",
    name: "Jakhu Temple",
    type: "culture",
    position: { x: 55, y: 55 },
    day: 3,
    active: false,
    time: "9:30 AM",
    status: "upcoming",
  },
  {
    id: "lakkar-bazaar",
    name: "Lakkar Bazaar",
    type: "shopping",
    position: { x: 47, y: 70 },
    day: 3,
    active: false,
    time: "2:00 PM",
    status: "upcoming",
  },
]

const mockRoutes: RouteSegment[] = [
  {
    from: { x: 45, y: 60 },
    to: { x: 50, y: 65 },
    day: 1,
    active: true,
    transport: "walking",
    duration: "5 min",
    distance: "400m",
  },
  {
    from: { x: 50, y: 65 },
    to: { x: 48, y: 62 },
    day: 1,
    active: true,
    transport: "walking",
    duration: "3 min",
    distance: "250m",
  },
  {
    from: { x: 48, y: 62 },
    to: { x: 52, y: 68 },
    day: 1,
    active: true,
    transport: "walking",
    duration: "8 min",
    distance: "600m",
  },
  {
    from: { x: 52, y: 68 },
    to: { x: 70, y: 40 },
    day: 2,
    active: false,
    transport: "car",
    duration: "45 min",
    distance: "13 km",
  },
  {
    from: { x: 70, y: 40 },
    to: { x: 72, y: 38 },
    day: 2,
    active: false,
    transport: "walking",
    duration: "10 min",
    distance: "800m",
  },
  {
    from: { x: 72, y: 38 },
    to: { x: 70, y: 40 },
    day: 2,
    active: false,
    transport: "walking",
    duration: "10 min",
    distance: "800m",
  },
  {
    from: { x: 70, y: 40 },
    to: { x: 55, y: 55 },
    day: 3,
    active: false,
    transport: "car",
    duration: "30 min",
    distance: "8 km",
  },
  {
    from: { x: 55, y: 55 },
    to: { x: 47, y: 70 },
    day: 3,
    active: false,
    transport: "walking",
    duration: "15 min",
    distance: "1.2 km",
  },
]

const getPoiIcon = (type: string) => {
  switch (type) {
    case "hotel":
      return <Hotel className="h-3 w-3" />
    case "culture":
      return <Camera className="h-3 w-3" />
    case "nature":
      return <Mountain className="h-3 w-3" />
    case "food":
      return <Utensils className="h-3 w-3" />
    case "shopping":
      return <MapPin className="h-3 w-3" />
    default:
      return <MapPin className="h-3 w-3" />
  }
}

const getTransportIcon = (transport: string) => {
  switch (transport) {
    case "car":
      return <Car className="h-3 w-3" />
    case "train":
      return <Train className="h-3 w-3" />
    case "plane":
      return <Plane className="h-3 w-3" />
    default:
      return <Navigation className="h-3 w-3" />
  }
}

const getPoiColor = (type: string, active: boolean, status?: string) => {
  if (status === "visited") {
    return "bg-gray-400 border-gray-500"
  }
  if (status === "current") {
    return "bg-red-500 border-red-600 animate-pulse"
  }

  const baseColors = {
    hotel: active ? "bg-blue-500 border-blue-600" : "bg-blue-200 border-blue-300",
    culture: active ? "bg-purple-500 border-purple-600" : "bg-purple-200 border-purple-300",
    nature: active ? "bg-green-500 border-green-600" : "bg-green-200 border-green-300",
    food: active ? "bg-orange-500 border-orange-600" : "bg-orange-200 border-orange-300",
    shopping: active ? "bg-pink-500 border-pink-600" : "bg-pink-200 border-pink-300",
    activity: active ? "bg-primary border-primary" : "bg-muted border-border",
  }
  return (
    baseColors[type as keyof typeof baseColors] || (active ? "bg-primary border-primary" : "bg-muted border-border")
  )
}

export default function InteractiveMap() {
  const [selectedDay, setSelectedDay] = useState(1)
  const [hoveredPOI, setHoveredPOI] = useState<string | null>(null)
  const [hoveredRoute, setHoveredRoute] = useState<number | null>(null)
  const [animatedRoutes, setAnimatedRoutes] = useState<string[]>([])
  const [currentTime, setCurrentTime] = useState(new Date())
  const [isTracking, setIsTracking] = useState(true)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const dayRoutes = mockRoutes.filter((route) => route.day === selectedDay)
    const routeIds = dayRoutes.map((_, index) => `route-${selectedDay}-${index}`)

    setAnimatedRoutes([])
    routeIds.forEach((routeId, index) => {
      setTimeout(() => {
        setAnimatedRoutes((prev) => [...prev, routeId])
      }, index * 300)
    })
  }, [selectedDay])

  const activePOIs = mockPOIs.map((poi) => ({
    ...poi,
    active: poi.day === selectedDay,
  }))

  const activeRoutes = mockRoutes.map((route, index) => ({
    ...route,
    active: route.day === selectedDay,
    index,
  }))

  const totalDistance = mockRoutes
    .filter((route) => route.day === selectedDay)
    .reduce((total, route) => {
      const distance = Number.parseFloat(route.distance.replace(/[^\d.]/g, ""))
      return total + distance
    }, 0)

  const totalDuration = mockRoutes
    .filter((route) => route.day === selectedDay)
    .reduce((total, route) => {
      const duration = Number.parseInt(route.duration.replace(/[^\d]/g, ""))
      return total + duration
    }, 0)

  return (
    <Card className="h-80 sm:h-96 w-full">
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-2 sm:space-y-0">
          <div>
            <CardTitle className="text-base sm:text-lg flex items-center space-x-2">
              <Route className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              <span>Live Route Tracking</span>
            </CardTitle>
            <CardDescription className="text-sm">Real-time location and route progress</CardDescription>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
            <Button
              variant={isTracking ? "default" : "outline"}
              size="sm"
              onClick={() => setIsTracking(!isTracking)}
              className="text-xs w-full sm:w-auto"
            >
              <Zap className="h-3 w-3 mr-1" />
              {isTracking ? "Live" : "Paused"}
            </Button>
            <div className="flex space-x-1 w-full sm:w-auto">
              {[1, 2, 3].map((day) => (
                <Button
                  key={day}
                  variant={selectedDay === day ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedDay(day)}
                  className="text-xs flex-1 sm:flex-none"
                >
                  Day {day}
                </Button>
              ))}
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-1 sm:space-y-0 text-xs sm:text-sm text-muted-foreground">
          <div className="flex items-center space-x-1">
            <Navigation className="h-3 w-3 sm:h-4 sm:w-4" />
            <span>{totalDistance.toFixed(1)} km total</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
            <span>
              {Math.floor(totalDuration / 60)}h {totalDuration % 60}m travel time
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="relative h-48 sm:h-64 bg-gradient-to-br from-green-50 via-blue-50 to-green-100 rounded-b-lg overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-4 left-4 w-12 h-8 sm:w-16 sm:h-12 bg-green-200 rounded-full opacity-60 shadow-sm"></div>
            <div className="absolute top-8 right-8 w-16 h-12 sm:w-20 sm:h-16 bg-green-300 rounded-full opacity-40 shadow-sm"></div>
            <div className="absolute bottom-6 left-8 w-8 h-6 sm:w-12 sm:h-8 bg-blue-200 rounded-full opacity-50 shadow-sm"></div>
            <div className="absolute bottom-4 right-4 w-18 h-14 sm:w-24 sm:h-18 bg-green-200 rounded-full opacity-30 shadow-sm"></div>
            <div className="absolute top-1/2 left-1/3 w-6 h-4 sm:w-8 sm:h-6 bg-brown-200 rounded opacity-25"></div>
          </div>

          <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }}>
            {activeRoutes.map((route, index) => {
              const routeId = `route-${selectedDay}-${index}`
              const isAnimated = animatedRoutes.includes(routeId)
              const isHovered = hoveredRoute === index

              return (
                <g key={routeId}>
                  <line
                    x1={`${route.from.x}%`}
                    y1={`${route.from.y}%`}
                    x2={`${route.to.x}%`}
                    y2={`${route.to.y}%`}
                    stroke={
                      route.active
                        ? route.transport === "car"
                          ? "#dc2626"
                          : route.transport === "train"
                            ? "#2563eb"
                            : "#059669"
                        : "#d1d5db"
                    }
                    strokeWidth={isHovered ? "4" : "2"}
                    strokeDasharray={
                      route.transport === "walking" ? "5,5" : route.transport === "car" ? "10,2" : "none"
                    }
                    className={isAnimated ? "animate-pulse" : ""}
                    opacity={route.active ? 0.8 : 0.3}
                    onMouseEnter={() => setHoveredRoute(index)}
                    onMouseLeave={() => setHoveredRoute(null)}
                    style={{ cursor: "pointer" }}
                  />
                  {route.active && (
                    <foreignObject
                      x={`${(route.from.x + route.to.x) / 2 - 1.5}%`}
                      y={`${(route.from.y + route.to.y) / 2 - 1.5}%`}
                      width="3%"
                      height="3%"
                    >
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="bg-white rounded-full p-0.5 sm:p-1 shadow-sm border">
                          {getTransportIcon(route.transport)}
                        </div>
                      </div>
                    </foreignObject>
                  )}
                </g>
              )
            })}
          </svg>

          {hoveredRoute !== null && activeRoutes[hoveredRoute] && (
            <div
              className="absolute z-30 bg-background border border-border rounded-lg px-2 py-1 sm:px-3 sm:py-2 shadow-lg pointer-events-none max-w-xs"
              style={{
                left: `${Math.min(Math.max((activeRoutes[hoveredRoute].from.x + activeRoutes[hoveredRoute].to.x) / 2, 10), 90)}%`,
                top: `${Math.max((activeRoutes[hoveredRoute].from.y + activeRoutes[hoveredRoute].to.y) / 2 - 15, 5)}%`,
                transform: "translate(-50%, -100%)",
              }}
            >
              <div className="text-xs sm:text-sm font-medium flex items-center space-x-1">
                {getTransportIcon(activeRoutes[hoveredRoute].transport)}
                <span className="capitalize">{activeRoutes[hoveredRoute].transport}</span>
              </div>
              <div className="text-xs text-muted-foreground whitespace-nowrap">
                {activeRoutes[hoveredRoute].duration} • {activeRoutes[hoveredRoute].distance}
              </div>
            </div>
          )}

          {activePOIs.map((poi) => (
            <div
              key={poi.id}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 ${
                poi.active ? "scale-110 z-20" : "scale-90 z-10"
              }`}
              style={{
                left: `${poi.position.x}%`,
                top: `${poi.position.y}%`,
              }}
              onMouseEnter={() => setHoveredPOI(poi.id)}
              onMouseLeave={() => setHoveredPOI(null)}
            >
              <div
                className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 flex items-center justify-center text-white shadow-lg ${getPoiColor(
                  poi.type,
                  poi.active,
                  poi.status,
                )} ${poi.status === "current" ? "animate-bounce" : ""}`}
              >
                {getPoiIcon(poi.type)}
              </div>

              {poi.status === "visited" && (
                <div className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full border border-white flex items-center justify-center">
                  <div className="w-0.5 h-0.5 sm:w-1 sm:h-1 bg-white rounded-full"></div>
                </div>
              )}

              {hoveredPOI === poi.id && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 sm:mb-2 z-30">
                  <div className="bg-background border border-border rounded-lg px-2 py-1 sm:px-3 sm:py-2 shadow-lg min-w-max max-w-xs">
                    <div className="text-xs sm:text-sm font-medium truncate">{poi.name}</div>
                    <div className="flex flex-wrap items-center gap-1 mt-1">
                      <Badge variant="outline" className="text-xs">
                        Day {poi.day}
                      </Badge>
                      <Badge variant="outline" className="text-xs capitalize">
                        {poi.type}
                      </Badge>
                      {poi.time && (
                        <Badge variant="outline" className="text-xs">
                          {poi.time}
                        </Badge>
                      )}
                    </div>
                    {poi.status && (
                      <div className="text-xs text-muted-foreground mt-1 capitalize">Status: {poi.status}</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}

          <div className="absolute bottom-1 left-1 sm:bottom-2 sm:left-2 bg-background/90 backdrop-blur rounded-lg p-1.5 sm:p-2 text-xs max-w-[calc(100%-1rem)]">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 sm:w-3 sm:h-3 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-xs">Current</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 sm:w-3 sm:h-3 bg-gray-400 rounded-full"></div>
                  <span className="text-xs">Visited</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 sm:w-3 sm:h-3 bg-primary rounded-full"></div>
                  <span className="text-xs">Upcoming</span>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 pt-1 border-t border-border">
                <div className="flex items-center space-x-1">
                  <Navigation className="h-2 w-2 sm:h-3 sm:w-3" />
                  <span className="text-xs">Walk</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Car className="h-2 w-2 sm:h-3 sm:w-3" />
                  <span className="text-xs">Drive</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Train className="h-2 w-2 sm:h-3 sm:w-3" />
                  <span className="text-xs">Train</span>
                </div>
              </div>
            </div>
          </div>

          {selectedDay === 1 && isTracking && (
            <div className="absolute" style={{ left: "48%", top: "62%" }}>
              <div className="w-4 h-4 sm:w-6 sm:h-6 bg-blue-500/20 rounded-full animate-ping"></div>
              <div className="absolute top-0.5 left-0.5 sm:top-1 sm:left-1 w-3 h-3 sm:w-4 sm:h-4 bg-blue-600 rounded-full flex items-center justify-center shadow-lg">
                <Navigation className="h-1.5 w-1.5 sm:h-2 sm:w-2 text-white" />
              </div>
            </div>
          )}

          <div className="absolute top-1 right-1 sm:top-2 sm:right-2">
            <div
              className={`flex items-center space-x-1 backdrop-blur rounded-full px-1.5 py-0.5 sm:px-2 sm:py-1 text-xs ${
                isTracking ? "bg-green-500/90 text-white" : "bg-background/90 text-muted-foreground"
              }`}
            >
              <Zap
                className={`h-2 w-2 sm:h-3 sm:w-3 ${isTracking ? "text-white animate-pulse" : "text-muted-foreground"}`}
              />
              <span className="hidden sm:inline">{isTracking ? "Live Tracking" : "Tracking Paused"}</span>
              <span className="sm:hidden">{isTracking ? "Live" : "Paused"}</span>
            </div>
          </div>

          <div className="absolute top-1 left-1 sm:top-2 sm:left-2 max-w-[60%] sm:max-w-none">
            <div className="bg-background/90 backdrop-blur rounded-lg px-1.5 py-0.5 sm:px-2 sm:py-1 text-xs">
              <div className="flex items-center space-x-1">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full"></div>
                <span className="truncate">
                  Day {selectedDay}:{" "}
                  {Math.round(
                    (activePOIs.filter((poi) => poi.status === "visited").length /
                      activePOIs.filter((poi) => poi.active).length) *
                      100,
                  ) || 0}
                  %
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
