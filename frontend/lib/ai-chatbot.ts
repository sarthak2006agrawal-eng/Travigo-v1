interface ChatMessage {
  id: string
  type: "user" | "assistant"
  content: string
  timestamp: Date
  suggestions?: string[]
}

interface ItineraryModification {
  type: "add" | "remove" | "replace" | "reschedule"
  day: number
  activity?: any
  targetActivity?: string
  newTime?: string
}

interface ChatContext {
  userPreferences?: any
  currentLocation?: string
  weather?: any
  budget?: { total: number; used: number; remaining: number }
}

export class AIChatbot {
  private messages: ChatMessage[] = []
  private itinerary: any[] = []
  private context: ChatContext = {}

  constructor(itinerary: any[], userPreferences?: any) {
    this.itinerary = itinerary
    this.context.userPreferences = userPreferences

    if (userPreferences) {
      this.context.budget = {
        total: userPreferences.budget || 25000,
        used: itinerary.reduce((sum, day) => sum + day.totalCost, 0),
        remaining: (userPreferences.budget || 25000) - itinerary.reduce((sum, day) => sum + day.totalCost, 0),
      }
    }

    this.messages = [
      {
        id: "1",
        type: "assistant",
        content: `Hi! I'm your AI travel assistant for your ${userPreferences?.toLocation || "travel"} adventure! I can help you:

• Modify your itinerary (add/remove activities)
• Find restaurants, cafes, and attractions
• Provide weather updates and travel tips
• Optimize your budget and timing
• Answer questions about your destination

Try asking me something like "Add a café near Mall Road" or "What should I pack?"`,
        timestamp: new Date(),
        suggestions: [
          "Add a local restaurant",
          "What's the weather like?",
          "Show me budget breakdown",
          "Suggest nearby attractions",
        ],
      },
    ]
  }

  async processMessage(userMessage: string): Promise<{ response: string; modification?: ItineraryModification }> {
    const message: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      content: userMessage,
      timestamp: new Date(),
    }

    this.messages.push(message)

    await new Promise((resolve) => setTimeout(resolve, 1200))

    const response = this.generateResponse(userMessage)
    const assistantMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      type: "assistant",
      content: response.content,
      timestamp: new Date(),
      suggestions: response.suggestions,
    }

    this.messages.push(assistantMessage)
    return { response: response.content, modification: response.modification }
  }

  private generateResponse(userMessage: string): {
    content: string
    modification?: ItineraryModification
    suggestions?: string[]
  } {
    const message = userMessage.toLowerCase()

    // Enhanced activity addition patterns
    if (message.includes("add") && (message.includes("café") || message.includes("coffee"))) {
      const cafes = [
        { name: "Café Simla Times", cost: 400, description: "Cozy café with mountain views and local coffee" },
        {
          name: "Indian Coffee House",
          cost: 300,
          description: "Historic café serving traditional South Indian coffee",
        },
        { name: "Honey Hut", cost: 350, description: "Famous for honey-based treats and beverages" },
      ]
      const selectedCafe = cafes[Math.floor(Math.random() * cafes.length)]

      const modification: ItineraryModification = {
        type: "add",
        day: 1,
        activity: {
          time: "15:30",
          name: `Coffee at ${selectedCafe.name}`,
          type: "food",
          cost: selectedCafe.cost,
          description: selectedCafe.description,
        },
      }
      return {
        content: `Perfect choice! I've added ${selectedCafe.name} to your Day 1 itinerary. ${selectedCafe.description} Cost: ₹${selectedCafe.cost}. This will be a great break between your sightseeing activities!`,
        modification,
        suggestions: ["Add a restaurant", "Remove an activity", "Check budget", "What's nearby?"],
      }
    }

    if (
      message.includes("add") &&
      (message.includes("restaurant") || message.includes("dinner") || message.includes("lunch"))
    ) {
      const restaurants = [
        {
          name: "The Restaurant",
          cost: 1200,
          description: "Fine dining with authentic Himachali cuisine",
          time: "20:00",
        },
        {
          name: "Ashiana Restaurant",
          cost: 800,
          description: "Multi-cuisine restaurant with valley views",
          time: "19:30",
        },
        {
          name: "Baljees Restaurant",
          cost: 600,
          description: "Local favorite serving North Indian dishes",
          time: "19:00",
        },
      ]
      const selectedRestaurant = restaurants[Math.floor(Math.random() * restaurants.length)]

      const modification: ItineraryModification = {
        type: "add",
        day: 2,
        activity: {
          time: selectedRestaurant.time,
          name: `Dinner at ${selectedRestaurant.name}`,
          type: "food",
          cost: selectedRestaurant.cost,
          description: selectedRestaurant.description,
        },
      }
      return {
        content: `Excellent! I've added ${selectedRestaurant.name} to your Day 2 evening. ${selectedRestaurant.description} Reservation for ${selectedRestaurant.time}, cost: ₹${selectedRestaurant.cost}. I recommend trying their local specialties!`,
        modification,
        suggestions: ["Add more activities", "Check weather", "Budget summary", "Transport options"],
      }
    }

    if (
      message.includes("add") &&
      (message.includes("temple") || message.includes("spiritual") || message.includes("religious"))
    ) {
      const temples = [
        { name: "Hanuman Temple", cost: 0, description: "Ancient temple with panoramic city views" },
        { name: "Kali Bari Temple", cost: 0, description: "Sacred temple dedicated to Goddess Kali" },
        { name: "Sankat Mochan Temple", cost: 0, description: "Peaceful temple in a serene forest setting" },
      ]
      const selectedTemple = temples[Math.floor(Math.random() * temples.length)]

      const modification: ItineraryModification = {
        type: "add",
        day: 1,
        activity: {
          time: "17:00",
          name: `Visit ${selectedTemple.name}`,
          type: "culture",
          cost: selectedTemple.cost,
          description: selectedTemple.description,
        },
      }
      return {
        content: `Wonderful spiritual addition! I've added ${selectedTemple.name} to your Day 1 evening itinerary. ${selectedTemple.description} It's free to visit and offers a peaceful end to your day.`,
        modification,
        suggestions: ["Add shopping", "Find viewpoints", "Local markets", "Evening activities"],
      }
    }

    if (
      message.includes("add") &&
      (message.includes("shopping") || message.includes("market") || message.includes("bazaar"))
    ) {
      const markets = [
        { name: "Lakkar Bazaar", cost: 500, description: "Famous wooden handicrafts and souvenirs market" },
        { name: "Mall Road Shopping", cost: 800, description: "Main shopping street with local and branded stores" },
        { name: "Lower Bazaar", cost: 300, description: "Local market for authentic Himachali products" },
      ]
      const selectedMarket = markets[Math.floor(Math.random() * markets.length)]

      const modification: ItineraryModification = {
        type: "add",
        day: 3,
        activity: {
          time: "14:00",
          name: `Shopping at ${selectedMarket.name}`,
          type: "shopping",
          cost: selectedMarket.cost,
          description: selectedMarket.description,
        },
      }
      return {
        content: `Great for souvenirs! I've added ${selectedMarket.name} to your Day 3 afternoon. ${selectedMarket.description} Budget ₹${selectedMarket.cost} for shopping. Don't forget to bargain!`,
        modification,
        suggestions: ["Add adventure activity", "Find restaurants", "Check transport", "Weather update"],
      }
    }

    // Enhanced removal patterns
    if (message.includes("remove") || message.includes("delete") || message.includes("cancel")) {
      const activities = ["museum visit", "temple visit", "shopping", "restaurant booking"]
      const activity = activities.find((act) => message.includes(act)) || "activity"

      return {
        content: `I've removed the ${activity} from your itinerary. This frees up time and budget for other experiences. Your remaining budget is now ₹${this.context.budget?.remaining || 0}. Would you like me to suggest alternative activities for that time slot?`,
        suggestions: ["Add new activity", "Extend other visits", "Find restaurants", "Budget optimization"],
      }
    }

    // Weather and planning queries
    if (message.includes("weather") || message.includes("rain") || message.includes("temperature")) {
      const weatherConditions = [
        "Clear skies with temperatures 15-22°C. Perfect for sightseeing!",
        "Partly cloudy with possible light showers. Carry an umbrella.",
        "Sunny and pleasant, ideal for outdoor activities. Don't forget sunscreen!",
        "Cool and misty mornings, warming up by afternoon. Layer your clothing.",
      ]
      const weather = weatherConditions[Math.floor(Math.random() * weatherConditions.length)]

      return {
        content: `Current weather forecast: ${weather} I recommend checking the weather each morning and adjusting your outdoor activities accordingly. Indoor alternatives are available if needed.`,
        suggestions: ["Indoor activities", "What to pack", "Best photo spots", "Transport tips"],
      }
    }

    // Budget and cost queries
    if (
      message.includes("budget") ||
      message.includes("cost") ||
      message.includes("money") ||
      message.includes("expensive")
    ) {
      const budget = this.context.budget
      const breakdown = `
**Budget Breakdown:**
• Total Budget: ₹${budget?.total.toLocaleString() || "25,000"}
• Used So Far: ₹${budget?.used.toLocaleString() || "0"}
• Remaining: ₹${budget?.remaining.toLocaleString() || "25,000"}

**Cost Categories:**
• Accommodation: ~40% of budget
• Food & Dining: ~25% of budget  
• Activities: ~20% of budget
• Transport: ~15% of budget`

      return {
        content:
          breakdown +
          "\n\nYour budget allocation looks healthy! Would you like me to suggest ways to optimize costs or find budget-friendly alternatives?",
        suggestions: ["Budget activities", "Expensive alternatives", "Cost optimization", "Free attractions"],
      }
    }

    // Transport and travel queries
    if (
      message.includes("transport") ||
      message.includes("travel") ||
      message.includes("taxi") ||
      message.includes("bus")
    ) {
      return {
        content: `**Transport Options:**
• Local taxis: ₹15-20 per km
• Private car rental: ₹2,500-3,500 per day
• Public buses: ₹10-50 per journey
• Walking: Free and great for nearby attractions!

For Kufri and distant locations, I recommend booking a private car. The mountain roads are scenic but can be winding. Book transport in advance during peak season.`,
        suggestions: ["Book transport", "Walking routes", "Taxi numbers", "Bus schedules"],
      }
    }

    // Packing and preparation queries
    if (
      message.includes("pack") ||
      message.includes("bring") ||
      message.includes("clothes") ||
      message.includes("essentials")
    ) {
      return {
        content: `**Essential Packing List for ${this.context.userPreferences?.toLocation || "your trip"}:**

**Clothing:**
• Warm jacket (evenings get cold!)
• Comfortable walking shoes
• Layered clothing for temperature changes
• Light rain jacket/umbrella

**Essentials:**
• Sunscreen & sunglasses
• Camera for stunning views
• Power bank for your phone
• Basic medicines
• Valid ID documents

**Pro Tips:** Pack light but warm. Mountain weather can change quickly!`,
        suggestions: ["Weather update", "Local customs", "Photography tips", "Health precautions"],
      }
    }

    // Local recommendations and tips
    if (
      message.includes("recommend") ||
      message.includes("suggest") ||
      message.includes("best") ||
      message.includes("famous")
    ) {
      const recommendations = [
        "Must-visit: The Ridge at sunset for panoramic views",
        "Hidden gem: Scandal Point for romantic views and local stories",
        "Food tip: Try the famous Himachali Dham (traditional feast)",
        "Photo spot: Christ Church - one of the oldest churches in North India",
        "Adventure: Toy train ride from Kalka to Shimla (UNESCO World Heritage)",
        "Shopping: Lakkar Bazaar for authentic wooden handicrafts",
      ]
      const randomRec = recommendations[Math.floor(Math.random() * recommendations.length)]

      return {
        content: `Here's a local recommendation: ${randomRec}

**Other top suggestions:**
• Visit during golden hour (6-7 PM) for best photos
• Try local street food at Mall Road
• Book advance tickets for popular attractions
• Interact with locals for hidden gems
• Check for local festivals during your visit`,
        suggestions: ["Add to itinerary", "More recommendations", "Local events", "Photography spots"],
      }
    }

    // Time and scheduling queries
    if (
      message.includes("time") ||
      message.includes("schedule") ||
      message.includes("when") ||
      message.includes("timing")
    ) {
      return {
        content: `**Optimal Timing Tips:**
• Morning (8-11 AM): Best for outdoor activities, clear views
• Afternoon (12-3 PM): Indoor attractions, shopping, lunch
• Evening (4-7 PM): Sunset points, leisurely walks
• Night (7+ PM): Dining, local markets, cultural shows

Your current itinerary is well-paced with good time allocation. Would you like me to adjust any timings or add buffer time between activities?`,
        suggestions: ["Reschedule activity", "Add buffer time", "Extend visits", "Rush alternatives"],
      }
    }

    // Emergency and safety queries
    if (
      message.includes("emergency") ||
      message.includes("help") ||
      message.includes("problem") ||
      message.includes("safety")
    ) {
      return {
        content: `**Emergency Information:**
• Tourist Helpline: 1363
• Police: 100
• Medical Emergency: 108
• Fire: 101

**Safety Tips:**
• Keep emergency contacts handy
• Inform someone about your daily plans
• Carry basic first aid
• Stay hydrated at high altitude
• Use registered taxis/guides

**Local Contacts:**
• Tourist Information Center: Mall Road
• Nearest Hospital: Indira Gandhi Medical College

Stay safe and enjoy your trip! I'm here if you need any assistance.`,
        suggestions: ["Medical facilities", "Police stations", "Tourist centers", "Safe transport"],
      }
    }

    // Default intelligent responses based on context
    const contextualResponses = [
      `I can help you enhance your ${this.context.userPreferences?.toLocation || "travel"} experience! Try asking me to add activities, check weather, or get local recommendations.`,
      `Your ${this.context.userPreferences?.duration || 3}-day itinerary looks great! I can add restaurants, suggest attractions, or help optimize your schedule.`,
      `I'm here to make your trip perfect! Ask me about local food, hidden gems, or budget optimization for your ${this.context.userPreferences?.toLocation || "destination"}.`,
      `Let me help customize your adventure! I can modify timings, add experiences, or provide insider tips about your destination.`,
    ]

    const suggestions = [
      "Add local restaurant",
      "Check weather forecast",
      "Budget breakdown",
      "Best photo spots",
      "Transport options",
      "What to pack",
    ]

    return {
      content: contextualResponses[Math.floor(Math.random() * contextualResponses.length)],
      suggestions: suggestions.slice(0, 4),
    }
  }

  getMessages(): ChatMessage[] {
    return this.messages
  }

  updateItinerary(newItinerary: any[]) {
    this.itinerary = newItinerary
    // Update budget context
    if (this.context.budget) {
      this.context.budget.used = newItinerary.reduce((sum, day) => sum + day.totalCost, 0)
      this.context.budget.remaining = this.context.budget.total - this.context.budget.used
    }
  }

  updateContext(context: Partial<ChatContext>) {
    this.context = { ...this.context, ...context }
  }
}
