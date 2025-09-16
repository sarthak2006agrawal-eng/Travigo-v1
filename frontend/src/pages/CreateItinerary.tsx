import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { CalendarIcon, MapPin, DollarSign, Users, Sparkles, Plane, Plus, X } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const CreateItinerary = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [isGenerating, setIsGenerating] = useState(false);

  const [formData, setFormData] = useState({
    tripName: "",
    destination: "",
    travelers: 1,
    budget: [5000],
    travelType: "",
    accommodation: "",
    transportation: "",
    activities: [] as string[],
    customActivity: "",
    specialRequests: "",
    duration: 7
  });

  const travelTypes = [
    "Adventure & Outdoor",
    "Cultural & Historical", 
    "Relaxation & Wellness",
    "City & Urban",
    "Beach & Coastal",
    "Food & Culinary",
    "Business Travel",
    "Family Vacation",
    "Romantic Getaway",
    "Solo Travel"
  ];

  const accommodationTypes = [
    "Hotels (3-4 star)",
    "Luxury Hotels (5 star)",
    "Boutique Hotels",
    "Resorts",
    "Vacation Rentals",
    "Hostels",
    "Homestays",
    "Budget Hotels",
    "Mixed (Budget to Luxury)"
  ];

  const transportationTypes = [
    "Flight + Local Transport",
    "Flight Only",
    "Train",
    "Bus",
    "Car Rental",
    "Private Transport",
    "Mixed Transportation",
    "Public Transport"
  ];

  const activityOptions = [
    "Sightseeing", "Museums & Galleries", "Adventure Sports", "Food Tours",
    "Historical Sites", "Local Markets", "Nightlife", "Shopping",
    "Nature & Parks", "Beach Activities", "Water Sports", "Hiking",
    "Photography Tours", "Cultural Experiences", "Festivals & Events",
    "Wellness & Spa", "Music & Entertainment", "Day Trips"
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleActivityToggle = (activity: string) => {
    setFormData(prev => ({
      ...prev,
      activities: prev.activities.includes(activity)
        ? prev.activities.filter(a => a !== activity)
        : [...prev.activities, activity]
    }));
  };

  const addCustomActivity = () => {
    if (formData.customActivity.trim()) {
      setFormData(prev => ({
        ...prev,
        activities: [...prev.activities, prev.customActivity.trim()],
        customActivity: ""
      }));
    }
  };

  const removeActivity = (activity: string) => {
    setFormData(prev => ({
      ...prev,
      activities: prev.activities.filter(a => a !== activity)
    }));
  };

  const generateItinerary = async () => {
    setIsGenerating(true);
    
    // Simulate AI generation process
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // TODO: Implement actual AI integration when Supabase is connected
    console.log("Generating itinerary with data:", {
      ...formData,
      startDate: startDate?.toISOString(),
      endDate: endDate?.toISOString()
    });
    
    setIsGenerating(false);
    navigate("/itinerary-result");
  };

  const nextStep = () => {
    if (step < 3) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/10 to-primary/5 py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Create Your Perfect Trip</h1>
          <p className="text-muted-foreground">
            Let our AI craft a personalized itinerary just for you
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-smooth",
                  s <= step
                    ? "bg-primary text-white"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {s}
              </div>
              {s < 3 && (
                <div
                  className={cn(
                    "w-16 h-1 mx-2 transition-smooth",
                    s < step ? "bg-primary" : "bg-muted"
                  )}
                />
              )}
            </div>
          ))}
        </div>

        <Card className="travel-card shadow-travel">
          <CardHeader>
            <CardTitle className="flex items-center">
              {step === 1 && (
                <>
                  <MapPin className="h-5 w-5 mr-2 text-primary" />
                  Trip Basics
                </>
              )}
              {step === 2 && (
                <>
                  <DollarSign className="h-5 w-5 mr-2 text-primary" />
                  Preferences & Budget
                </>
              )}
              {step === 3 && (
                <>
                  <Sparkles className="h-5 w-5 mr-2 text-primary" />
                  Activities & Special Requests
                </>
              )}
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Step 1: Trip Basics */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="tripName">Trip Name</Label>
                  <Input
                    id="tripName"
                    value={formData.tripName}
                    onChange={(e) => handleInputChange("tripName", e.target.value)}
                    className="travel-input"
                    placeholder="My Amazing European Adventure"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="destination">Where do you want to go?</Label>
                  <Input
                    id="destination"
                    value={formData.destination}
                    onChange={(e) => handleInputChange("destination", e.target.value)}
                    className="travel-input"
                    placeholder="Paris, Tokyo, New York, or multiple cities..."
                  />
                  <p className="text-xs text-muted-foreground">
                    You can enter single destinations, multiple cities, or even entire regions
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Start Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal travel-input",
                            !startDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {startDate ? format(startDate, "PPP") : "Select start date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={startDate}
                          onSelect={setStartDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label>End Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal travel-input",
                            !endDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {endDate ? format(endDate, "PPP") : "Select end date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={endDate}
                          onSelect={setEndDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Number of Travelers</Label>
                  <div className="flex items-center space-x-4">
                    <Users className="h-5 w-5 text-primary" />
                    <Select
                      value={formData.travelers.toString()}
                      onValueChange={(value) => handleInputChange("travelers", parseInt(value))}
                    >
                      <SelectTrigger className="travel-input">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                          <SelectItem key={num} value={num.toString()}>
                            {num} {num === 1 ? "Traveler" : "Travelers"}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Preferences & Budget */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="space-y-3">
                  <Label>What type of trip is this?</Label>
                  <Select
                    value={formData.travelType}
                    onValueChange={(value) => handleInputChange("travelType", value)}
                  >
                    <SelectTrigger className="travel-input">
                      <SelectValue placeholder="Select your travel style" />
                    </SelectTrigger>
                    <SelectContent>
                      {travelTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label>Budget Range (USD)</Label>
                  <div className="px-4 py-6">
                    <Slider
                      value={formData.budget}
                      onValueChange={(value) => handleInputChange("budget", value)}
                      max={20000}
                      min={500}
                      step={250}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-muted-foreground mt-2">
                      <span>$500</span>
                      <span className="font-semibold text-primary">
                        ${formData.budget[0].toLocaleString()}
                      </span>
                      <span>$20,000+</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Accommodation Preference</Label>
                  <Select
                    value={formData.accommodation}
                    onValueChange={(value) => handleInputChange("accommodation", value)}
                  >
                    <SelectTrigger className="travel-input">
                      <SelectValue placeholder="Select accommodation type" />
                    </SelectTrigger>
                    <SelectContent>
                      {accommodationTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label>Transportation Preference</Label>
                  <Select
                    value={formData.transportation}
                    onValueChange={(value) => handleInputChange("transportation", value)}
                  >
                    <SelectTrigger className="travel-input">
                      <SelectValue placeholder="Select transportation type" />
                    </SelectTrigger>
                    <SelectContent>
                      {transportationTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Step 3: Activities & Special Requests */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="space-y-3">
                  <Label>What activities interest you? (Select all that apply)</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-60 overflow-y-auto p-2 border rounded-lg">
                    {activityOptions.map((activity) => (
                      <div key={activity} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={activity}
                          checked={formData.activities.includes(activity)}
                          onChange={() => handleActivityToggle(activity)}
                          className="rounded border-border"
                        />
                        <Label
                          htmlFor={activity}
                          className="text-sm cursor-pointer hover:text-primary transition-smooth"
                        >
                          {activity}
                        </Label>
                      </div>
                    ))}
                  </div>

                  {/* Custom Activity Input */}
                  <div className="space-y-2">
                    <Label>Add custom activity</Label>
                    <div className="flex gap-2">
                      <Input
                        value={formData.customActivity}
                        onChange={(e) => handleInputChange("customActivity", e.target.value)}
                        className="travel-input"
                        placeholder="Enter activity..."
                        onKeyPress={(e) => e.key === 'Enter' && addCustomActivity()}
                      />
                      <Button onClick={addCustomActivity} variant="outline">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Selected Activities */}
                  {formData.activities.length > 0 && (
                    <div className="space-y-2">
                      <Label>Selected activities:</Label>
                      <div className="flex flex-wrap gap-2">
                        {formData.activities.map((activity) => (
                          <Badge
                            key={activity}
                            variant="secondary"
                            className="flex items-center gap-1"
                          >
                            {activity}
                            <X
                              className="h-3 w-3 cursor-pointer hover:text-destructive"
                              onClick={() => removeActivity(activity)}
                            />
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="specialRequests">Special Requests or Notes</Label>
                  <Textarea
                    id="specialRequests"
                    value={formData.specialRequests}
                    onChange={(e) => handleInputChange("specialRequests", e.target.value)}
                    className="travel-input min-h-[100px]"
                    placeholder="Any dietary restrictions, accessibility needs, special occasions, or other requirements..."
                  />
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={step === 1}
              >
                Previous
              </Button>
              {step < 3 ? (
                <Button onClick={nextStep} className="travel-button">
                  Continue
                </Button>
              ) : (
                <Button 
                  onClick={generateItinerary} 
                  className="travel-button"
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <>
                      <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                      Generating Your Trip...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Generate My Itinerary
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Loading State */}
        {isGenerating && (
          <Card className="travel-card mt-6">
            <CardContent className="p-8 text-center">
              <div className="animate-pulse space-y-4">
                <Plane className="h-12 w-12 text-primary mx-auto animate-bounce" />
                <h3 className="text-xl font-semibold">Creating Your Perfect Itinerary</h3>
                <p className="text-muted-foreground">
                  Our AI is analyzing your preferences and finding the best recommendations...
                </p>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CreateItinerary;