interface UserPreferences {
  destination: string
  duration: number
  budget: number
  interests: string[]
}

interface Activity {
  time: string
  name: string
  type: string
  cost: number
  description?: string
}

interface DayItinerary {
  day: number
  date: string
  location: string
  activities: Activity[]
  totalCost: number
}

interface POI {
  id: string
  name: string
  type: string
  position: { x: number; y: number }
  day: number
  active: boolean
}

// Activity templates based on interests and destinations
const activityTemplates = {
  shimla: {
    nature: [
      { name: "Jakhu Temple Trek", cost: 0, type: "nature", description: "Scenic trek to hilltop temple" },
      { name: "Ridge Sunset View", cost: 0, type: "nature", description: "Beautiful sunset views" },
      { name: "Green Valley Walk", cost: 200, type: "nature", description: "Peaceful nature walk" },
      { name: "Chadwick Falls Visit", cost: 100, type: "nature", description: "Waterfall exploration" },
    ],
    culture: [
      { name: "Christ Church Visit", cost: 0, type: "culture", description: "Historic church architecture" },
      { name: "Shimla State Museum", cost: 200, type: "culture", description: "Local history and artifacts" },
      { name: "Viceregal Lodge Tour", cost: 300, type: "culture", description: "Colonial heritage site" },
      { name: "Gaiety Theatre Show", cost: 500, type: "culture", description: "Historic theatre performance" },
    ],
    food: [
      { name: "Lunch at Cafe Simla Times", cost: 800, type: "food", description: "Local Himachali cuisine" },
      { name: "Indian Coffee House", cost: 600, type: "food", description: "Iconic coffee house experience" },
      { name: "Baljees Restaurant", cost: 1000, type: "food", description: "Traditional mountain food" },
      { name: "Street Food at Mall Road", cost: 400, type: "food", description: "Local street delicacies" },
    ],
    adventure: [
      { name: "Horse Riding at Kufri", cost: 500, type: "adventure", description: "Mountain horse riding" },
      { name: "Skiing at Kufri", cost: 1500, type: "adventure", description: "Winter skiing experience" },
      { name: "Paragliding", cost: 2000, type: "adventure", description: "Aerial valley views" },
      { name: "Mountain Biking", cost: 800, type: "adventure", description: "Scenic cycling routes" },
    ],
    shopping: [
      { name: "Shopping at Lakkar Bazaar", cost: 2000, type: "shopping", description: "Wooden crafts and souvenirs" },
      { name: "Mall Road Shopping", cost: 1500, type: "shopping", description: "Local handicrafts" },
      { name: "Tibetan Market", cost: 1000, type: "shopping", description: "Tibetan artifacts and clothing" },
    ],
    relaxation: [
      { name: "Spa at Hotel", cost: 2500, type: "relaxation", description: "Mountain spa treatment" },
      { name: "Meditation at Jakhu", cost: 0, type: "relaxation", description: "Peaceful meditation session" },
      { name: "Hot Springs Visit", cost: 300, type: "relaxation", description: "Natural hot water therapy" },
    ],
  },
}

const accommodationOptions = {
  budget: [
    { name: "Hotel Willow Banks", cost: 3500, rating: 4.2 },
    { name: "Hotel Combermere", cost: 4000, rating: 4.0 },
    { name: "Clarkes Hotel", cost: 5000, rating: 4.5 },
  ],
  luxury: [
    { name: "Oberoi Cecil", cost: 12000, rating: 4.8 },
    { name: "Radisson Jass", cost: 8000, rating: 4.6 },
    { name: "Marigold Sarovar", cost: 6500, rating: 4.4 },
  ],
}

const transportOptions = [
  { name: "Local Taxi", costPerKm: 15, type: "transport" },
  { name: "Private Car", costPerKm: 20, type: "transport" },
  { name: "Shared Cab", costPerKm: 8, type: "transport" },
]

export class AIItineraryGenerator {
  private preferences: UserPreferences
  private dailyBudget: number
  private selectedActivities: any[]

  constructor(preferences: UserPreferences) {
    this.preferences = preferences
    this.dailyBudget = preferences.budget / preferences.duration
    this.selectedActivities = []
  }

  generateItinerary(): { itinerary: DayItinerary[]; pois: POI[] } {
    const itinerary: DayItinerary[] = []
    const pois: POI[] = []

    // Select accommodation based on budget
    const accommodationType = this.dailyBudget > 8000 ? "luxury" : "budget"
    const selectedHotel = this.selectRandomItem(accommodationOptions[accommodationType])

    for (let day = 1; day <= this.preferences.duration; day++) {
      const dayItinerary = this.generateDayItinerary(day, selectedHotel)
      itinerary.push(dayItinerary)

      // Generate POIs for this day
      const dayPOIs = this.generatePOIsForDay(dayItinerary, day)
      pois.push(...dayPOIs)
    }

    return { itinerary, pois }
  }

  private generateDayItinerary(day: number, hotel: any): DayItinerary {
    const activities: Activity[] = []
    let remainingBudget = this.dailyBudget
    const date = this.getDateForDay(day)

    // Add accommodation (only on first day)
    if (day === 1) {
      activities.push({
        time: "09:00",
        name: `Check-in at ${hotel.name}`,
        type: "hotel",
        cost: hotel.cost,
        description: `${hotel.rating}★ rated accommodation`,
      })
      remainingBudget -= hotel.cost
    }

    // Generate activities based on interests
    const dayActivities = this.selectActivitiesForDay(remainingBudget, day)
    activities.push(...dayActivities)

    // Calculate total cost
    const totalCost = activities.reduce((sum, activity) => sum + activity.cost, 0)

    // Determine location based on day
    const location = day === 2 ? "Kufri" : "Shimla"

    return {
      day,
      date,
      location,
      activities: activities.sort((a, b) => a.time.localeCompare(b.time)),
      totalCost,
    }
  }

  private selectActivitiesForDay(budget: number, day: number): Activity[] {
    const activities: Activity[] = []
    let remainingBudget = budget
    const timeSlots = ["11:00", "14:00", "16:00", "19:00"]
    let timeIndex = 0

    // Always include meals
    const mealCost = Math.min(800, remainingBudget * 0.3)
    activities.push({
      time: "13:00",
      name: this.selectMealForDay(day),
      type: "food",
      cost: mealCost,
      description: "Delicious local cuisine",
    })
    remainingBudget -= mealCost

    // Add transport for day 2 (Kufri trip)
    if (day === 2) {
      const transportCost = 1200
      activities.push({
        time: "08:00",
        name: "Travel to Kufri",
        type: "transport",
        cost: transportCost,
        description: "Scenic mountain drive",
      })
      activities.push({
        time: "18:00",
        name: "Return to Shimla",
        type: "transport",
        cost: transportCost,
        description: "Return journey",
      })
      remainingBudget -= transportCost * 2
    }

    // Select activities based on interests
    const availableActivities = this.getActivitiesForLocation(day === 2 ? "kufri" : "shimla")
    const shuffledInterests = [...this.preferences.interests].sort(() => Math.random() - 0.5)

    for (const interest of shuffledInterests) {
      if (timeIndex >= timeSlots.length || remainingBudget <= 0) break

      const interestActivities = availableActivities[interest] || []
      const affordableActivities = interestActivities.filter((act) => act.cost <= remainingBudget)

      if (affordableActivities.length > 0) {
        const selectedActivity = this.selectRandomItem(affordableActivities)
        activities.push({
          time: timeSlots[timeIndex],
          name: selectedActivity.name,
          type: selectedActivity.type,
          cost: selectedActivity.cost,
          description: selectedActivity.description,
        })
        remainingBudget -= selectedActivity.cost
        timeIndex++
      }
    }

    // Fill remaining slots with free activities
    while (timeIndex < timeSlots.length && remainingBudget > 0) {
      const freeActivities = this.getFreeActivities(day === 2 ? "kufri" : "shimla")
      if (freeActivities.length > 0) {
        const selectedActivity = this.selectRandomItem(freeActivities)
        activities.push({
          time: timeSlots[timeIndex],
          name: selectedActivity.name,
          type: selectedActivity.type,
          cost: 0,
          description: selectedActivity.description,
        })
      }
      timeIndex++
    }

    return activities
  }

  private getActivitiesForLocation(location: string) {
    if (location === "kufri") {
      return {
        nature: [
          { name: "Himalayan Nature Park", cost: 300, type: "nature", description: "Wildlife sanctuary visit" },
          { name: "Mahasu Peak Trek", cost: 0, type: "nature", description: "Highest peak in Kufri" },
        ],
        adventure: [
          { name: "Horse Riding Adventure", cost: 500, type: "adventure", description: "Mountain horse riding" },
          { name: "Skiing (Winter)", cost: 1500, type: "adventure", description: "Snow skiing experience" },
        ],
        food: [{ name: "Lunch at Kufri Resort", cost: 1000, type: "food", description: "Mountain resort dining" }],
      }
    }
    return activityTemplates.shimla
  }

  private getFreeActivities(location: string) {
    const activities = this.getActivitiesForLocation(location)
    const freeActivities = []

    for (const category of Object.values(activities)) {
      freeActivities.push(...category.filter((act) => act.cost === 0))
    }

    return freeActivities
  }

  private selectMealForDay(day: number): string {
    const meals = [
      "Lunch at Cafe Simla Times",
      "Lunch at Indian Coffee House",
      "Lunch at Baljees Restaurant",
      "Lunch at Kufri Resort",
    ]
    return day === 2 ? "Lunch at Kufri Resort" : this.selectRandomItem(meals)
  }

  private selectRandomItem<T>(items: T[]): T {
    return items[Math.floor(Math.random() * items.length)]
  }

  private getDateForDay(day: number): string {
    const baseDate = new Date("2024-12-15")
    const targetDate = new Date(baseDate)
    targetDate.setDate(baseDate.getDate() + day - 1)

    return targetDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  private generatePOIsForDay(dayItinerary: DayItinerary, day: number): POI[] {
    const pois: POI[] = []
    const basePositions = {
      1: { x: 45, y: 60 }, // Shimla base
      2: { x: 70, y: 40 }, // Kufri
      3: { x: 50, y: 65 }, // Shimla center
    }

    dayItinerary.activities.forEach((activity, index) => {
      const basePos = basePositions[day as keyof typeof basePositions] || { x: 50, y: 60 }
      const poi: POI = {
        id: `${day}-${index}-${activity.name.toLowerCase().replace(/\s+/g, "-")}`,
        name: activity.name,
        type: activity.type,
        position: {
          x: basePos.x + (Math.random() - 0.5) * 10,
          y: basePos.y + (Math.random() - 0.5) * 10,
        },
        day,
        active: day === 1,
      }
      pois.push(poi)
    })

    return pois
  }
}

export function generateAIItinerary(preferences: UserPreferences) {
  const generator = new AIItineraryGenerator(preferences)
  return generator.generateItinerary()
}
