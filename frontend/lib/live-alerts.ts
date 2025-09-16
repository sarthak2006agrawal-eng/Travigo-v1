interface AlertData {
  id: string
  type: "weather" | "safety" | "traffic" | "event"
  severity: "low" | "medium" | "high"
  title: string
  message: string
  location: string
  timestamp: Date
  autoReplan: boolean
}

interface ReplanSuggestion {
  originalActivity: string
  newActivity: string
  reason: string
  day: number
  time: string
}

export class LiveAlertSystem {
  private alerts: AlertData[] = []
  private itinerary: any[] = []

  constructor(itinerary: any[]) {
    this.itinerary = itinerary
  }

  generateWeatherAlert(): { alert: AlertData; replanning: ReplanSuggestion[] } {
    const alert: AlertData = {
      id: Date.now().toString(),
      type: "weather",
      severity: "high",
      title: "Heavy Rain Warning",
      message: "Heavy rainfall expected in the region. Outdoor activities may be affected.",
      location: "Shimla & Kufri",
      timestamp: new Date(),
      autoReplan: true,
    }

    const replanning: ReplanSuggestion[] = [
      {
        originalActivity: "Ridge Sunset View",
        newActivity: "Gaiety Theatre Cultural Show",
        reason: "Indoor alternative due to heavy rain",
        day: 1,
        time: "19:00",
      },
      {
        originalActivity: "Himalayan Nature Park",
        newActivity: "Shimla State Museum Extended Tour",
        reason: "Covered indoor attraction during rainfall",
        day: 2,
        time: "10:00",
      },
      {
        originalActivity: "Horse Riding Adventure",
        newActivity: "Local Handicraft Workshop",
        reason: "Safe indoor activity during bad weather",
        day: 2,
        time: "15:00",
      },
    ]

    this.alerts.push(alert)
    return { alert, replanning }
  }

  generateTrafficAlert(): { alert: AlertData; replanning: ReplanSuggestion[] } {
    const alert: AlertData = {
      id: Date.now().toString(),
      type: "traffic",
      severity: "medium",
      title: "Road Closure Alert",
      message: "Main road to Kufri temporarily closed due to landslide. Alternative route available.",
      location: "Shimla-Kufri Highway",
      timestamp: new Date(),
      autoReplan: true,
    }

    const replanning: ReplanSuggestion[] = [
      {
        originalActivity: "Travel to Kufri",
        newActivity: "Travel to Kufri (Alternative Route)",
        reason: "Using safer alternative route, adds 30 minutes",
        day: 2,
        time: "07:30",
      },
    ]

    this.alerts.push(alert)
    return { alert, replanning }
  }

  generateSafetyAlert(): { alert: AlertData; replanning: ReplanSuggestion[] } {
    const alert: AlertData = {
      id: Date.now().toString(),
      type: "safety",
      severity: "low",
      title: "Tourist Advisory",
      message: "Increased tourist activity at Mall Road. Consider visiting during off-peak hours.",
      location: "Mall Road, Shimla",
      timestamp: new Date(),
      autoReplan: false,
    }

    const replanning: ReplanSuggestion[] = [
      {
        originalActivity: "Mall Road Walking Tour",
        newActivity: "Early Morning Mall Road Tour",
        reason: "Avoiding crowds by visiting earlier",
        day: 1,
        time: "08:00",
      },
    ]

    this.alerts.push(alert)
    return { alert, replanning }
  }

  generateEventAlert(): { alert: AlertData; replanning: ReplanSuggestion[] } {
    const alert: AlertData = {
      id: Date.now().toString(),
      type: "event",
      severity: "low",
      title: "Local Festival",
      message: "Winter Carnival happening at The Ridge. Great opportunity for cultural experience!",
      location: "The Ridge, Shimla",
      timestamp: new Date(),
      autoReplan: false,
    }

    const replanning: ReplanSuggestion[] = [
      {
        originalActivity: "Ridge Sunset View",
        newActivity: "Winter Carnival at The Ridge",
        reason: "Special cultural event opportunity",
        day: 1,
        time: "19:00",
      },
    ]

    this.alerts.push(alert)
    return { alert, replanning }
  }

  getAlerts(): AlertData[] {
    return this.alerts.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
  }

  clearAlert(alertId: string) {
    this.alerts = this.alerts.filter((alert) => alert.id !== alertId)
  }

  applyReplanning(suggestions: ReplanSuggestion[]): any[] {
    const updatedItinerary = [...this.itinerary]

    suggestions.forEach((suggestion) => {
      const dayIndex = suggestion.day - 1
      if (updatedItinerary[dayIndex]) {
        const activityIndex = updatedItinerary[dayIndex].activities.findIndex((activity: any) =>
          activity.name.includes(suggestion.originalActivity.split(" ")[0]),
        )

        if (activityIndex !== -1) {
          updatedItinerary[dayIndex].activities[activityIndex] = {
            ...updatedItinerary[dayIndex].activities[activityIndex],
            name: suggestion.newActivity,
            time: suggestion.time,
            description: suggestion.reason,
          }
        }
      }
    })

    this.itinerary = updatedItinerary
    return updatedItinerary
  }
}
