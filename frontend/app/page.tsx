import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  MapPin,
  Calendar,
  DollarSign,
  MessageCircle,
  Shield,
  Sparkles,
  ArrowRight,
  Globe,
  Zap,
  Star,
} from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Navigation */}
      <nav className="border-b border-border/50 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2 animate-slide-up">
              <div className="relative">
                <MapPin className="h-8 w-8 text-primary animate-pulse-glow" />
                <div className="absolute inset-0 h-8 w-8 text-primary/30 animate-ping" />
              </div>
              <span className="text-2xl font-bold text-gradient">Travigo</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link
                href="#features"
                className="text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-105"
              >
                Features
              </Link>
              <Link
                href="#how-it-works"
                className="text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-105"
              >
                How it Works
              </Link>
              <Link
                href="#pricing"
                className="text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-105"
              >
                Pricing
              </Link>
            </div>
            <div className="flex items-center space-x-3">
              <ThemeToggle />
              <Button asChild className="btn-glow animate-scale-in">
                <Link href="/auth">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 hero-gradient animate-gradient" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(16,185,129,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(59,130,246,0.1),transparent_50%)]" />

        <div className="absolute top-20 left-10 w-20 h-20 bg-primary/10 rounded-full animate-float" />
        <div
          className="absolute top-40 right-20 w-16 h-16 bg-accent/10 rounded-full animate-float"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute bottom-20 left-1/4 w-12 h-12 bg-primary/20 rounded-full animate-float"
          style={{ animationDelay: "4s" }}
        />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-5xl mx-auto">
            <Badge
              variant="secondary"
              className="mb-8 animate-slide-up bg-primary text-primary-foreground border-primary"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              AI-Powered Travel Planning
            </Badge>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 text-balance animate-slide-up">
              Plan Your Perfect
              <span className="block text-gradient animate-float">Journey</span>
            </h1>

            <p
              className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto text-pretty animate-slide-up"
              style={{ animationDelay: "0.2s" }}
            >
              Create personalized itineraries with AI, track your budget in real-time, and adapt to live conditions.
              Your intelligent travel companion for unforgettable adventures.
            </p>

            <div
              className="flex flex-col sm:flex-row gap-6 justify-center animate-slide-up"
              style={{ animationDelay: "0.4s" }}
            >
              <Button size="lg" asChild className="text-lg px-10 py-4 btn-glow group">
                <Link href="/auth">
                  Start Planning Free
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-10 py-4 glass-effect hover:bg-primary/10 transition-all duration-300 bg-transparent"
              >
                <Globe className="mr-2 h-5 w-5" />
                Watch Demo
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-8 mt-16 animate-slide-up" style={{ animationDelay: "0.6s" }}>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">10K+</div>
                <div className="text-sm text-muted-foreground">Happy Travelers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">50+</div>
                <div className="text-sm text-muted-foreground">Destinations</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">99%</div>
                <div className="text-sm text-muted-foreground">Satisfaction</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-muted/20 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <Badge variant="outline" className="mb-4 bg-primary text-primary-foreground border-primary">
              <Zap className="h-4 w-4 mr-2" />
              Powerful Features
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 text-balance">
              Everything You Need for
              <span className="text-gradient block">Perfect Travel</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
              From AI-powered planning to blockchain security, we've revolutionized every aspect of your journey.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg card-hover bg-card/50 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="h-14 w-14 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center mb-6 animate-pulse-glow">
                  <Sparkles className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4">AI Itinerary Generator</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Input your preferences and let our advanced AI create detailed day-wise plans with destinations,
                  activities, and accommodations tailored just for you.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg card-hover bg-card/50 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="h-14 w-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-6">
                  <MapPin className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Interactive Maps</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Visualize your journey with stunning interactive maps showing POIs, routes, and real-time navigation
                  between all your destinations.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg card-hover bg-card/50 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="h-14 w-14 bg-gradient-to-br from-green-500 to-teal-600 rounded-xl flex items-center justify-center mb-6">
                  <DollarSign className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Smart Budget Tracking</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Track expenses in real-time with intelligent breakdowns for hotels, transport, and activities. Never
                  go over budget again.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg card-hover bg-card/50 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="h-14 w-14 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center mb-6">
                  <Calendar className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Live Alerts & Replanning</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Get instant weather and safety alerts with automatic itinerary adjustments to keep your trip perfectly
                  on track.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg card-hover bg-card/50 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="h-14 w-14 bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl flex items-center justify-center mb-6">
                  <MessageCircle className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4">AI Travel Assistant</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Chat with our intelligent AI to modify itineraries, add activities, or get personalized travel
                  recommendations instantly.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg card-hover bg-card/50 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="h-14 w-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mb-6">
                  <Shield className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Blockchain Security</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Save your itinerary snapshots on Polygon blockchain for secure, verifiable, and permanent travel
                  records.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-20">
            <Badge variant="outline" className="mb-4 bg-primary text-primary-foreground border-primary">
              <Star className="h-4 w-4 mr-2" />
              Simple Process
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">How Travigo Works</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              From planning to execution, here's your complete journey with Travigo's intelligent travel system.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
            <div className="space-y-8">
              <div className="flex items-start space-x-4 group">
                <div className="flex-shrink-0 h-12 w-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-110 transition-transform duration-300">
                  1
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 flex items-center">
                    <MapPin className="h-5 w-5 mr-2 text-primary" />
                    Enter Your Destinations
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Tell us where you're starting from and where you want to go. Our system supports multiple
                    destinations and complex routes.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 group">
                <div className="flex-shrink-0 h-12 w-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-110 transition-transform duration-300">
                  2
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-blue-500" />
                    Set Trip Details
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Specify how many people are traveling, your trip duration, and set your budget range for accurate
                    planning.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 group">
                <div className="flex-shrink-0 h-12 w-12 bg-gradient-to-br from-green-500 to-teal-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-110 transition-transform duration-300">
                  3
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 flex items-center">
                    <DollarSign className="h-5 w-5 mr-2 text-green-500" />
                    Choose Your Preferences
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Select your interests, accommodation style, transport preferences, and travel pace to personalize
                    your experience.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 group">
                <div className="flex-shrink-0 h-12 w-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-110 transition-transform duration-300">
                  4
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 flex items-center">
                    <Sparkles className="h-5 w-5 mr-2 text-orange-500" />
                    AI Creates Your Plan
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Our advanced AI analyzes your preferences and generates a detailed day-by-day itinerary with
                    activities, routes, and bookings.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 group">
                <div className="flex-shrink-0 h-12 w-12 bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-110 transition-transform duration-300">
                  5
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 flex items-center">
                    <Globe className="h-5 w-5 mr-2 text-pink-500" />
                    Track with Live Map
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Follow your journey on interactive maps with real-time updates, weather alerts, and instant
                    replanning capabilities.
                  </p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-3xl p-8 backdrop-blur-sm border border-primary/20">
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-card rounded-xl shadow-sm">
                    <span className="text-sm font-medium">Destination Planning</span>
                    <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-card rounded-xl shadow-sm">
                    <span className="text-sm font-medium">AI Processing</span>
                    <div className="h-2 w-2 bg-blue-500 rounded-full animate-pulse"></div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-card rounded-xl shadow-sm">
                    <span className="text-sm font-medium">Live Tracking</span>
                    <div className="h-2 w-2 bg-primary rounded-full animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-primary via-accent to-primary text-primary-foreground relative overflow-hidden animate-gradient">
        <div className="absolute inset-0 bg-black/10" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-balance">
            Ready to Transform Your Travel Experience?
          </h2>
          <p className="text-xl mb-10 opacity-90 max-w-3xl mx-auto text-pretty">
            Join thousands of travelers who trust Travigo for their perfect journeys. Start planning your next adventure
            today and discover the future of travel.
          </p>
          <Button size="lg" variant="secondary" asChild className="text-lg px-10 py-4 btn-glow group shadow-2xl">
            <Link href="/auth">
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-16 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-6 md:mb-0">
              <MapPin className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold text-gradient">Travigo</span>
            </div>
            <div className="flex space-x-8 text-muted-foreground">
              <Link href="#" className="hover:text-primary transition-colors duration-300">
                Privacy
              </Link>
              <Link href="#" className="hover:text-primary transition-colors duration-300">
                Terms
              </Link>
              <Link href="#" className="hover:text-primary transition-colors duration-300">
                Support
              </Link>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-border/50 text-center text-muted-foreground">
            <p>&copy; 2024 Travigo. All rights reserved. Built with AI for the modern traveler.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
