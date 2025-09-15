// backend/src/ai/itineraryAI.js

export function generateItinerary(userPrefs, cityData) {
    const plan = [];
    let remainingBudget = userPrefs.budget;
  
    for (let day = 0; day < userPrefs.days; day++) {
      const dayData = cityData.plan[day] || cityData.plan[cityData.plan.length - 1]; // repeat last day if less data
  
      // Pick activities matching user interests & budget
      const activities = dayData.activities
        .filter(a => userPrefs.interests.includes(a.type))
        .sort((a, b) => (a.cost / 1) - (b.cost / 1)); // simple sort by cost
  
      const selectedActivities = [];
      let dayCost = 0;
  
      for (const act of activities) {
        if (dayCost + act.cost <= remainingBudget) {
          selectedActivities.push(act);
          dayCost += act.cost;
        }
      }
  
      // Pick hotel and transport
      const hotel = dayData.hotel;
      const transport = dayData.transport;
      dayCost += hotel.cost + transport.cost;
      remainingBudget -= dayCost;
  
      plan.push({
        day: day + 1,
        location: dayData.location,
        activities: selectedActivities,
        hotel,
        transport,
        totalDayCost: dayCost
      });
    }
  
    return plan;
  }
  
  // Example update function
  export function updateItinerary(currentPlan, editCommand) {
    // editCommand = { action: "replaceActivity", day: 2, newActivity: {...} }
    // implement logic to modify currentPlan accordingly
    return currentPlan;
  }
  