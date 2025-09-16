import Hero from "@/components/Hero";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Sparkles, 
  MapPin, 
  Calendar, 
  Users, 
  Shield, 
  Zap, 
  Globe, 
  Heart,
  Star,
  TrendingUp,
  User
} from "lucide-react";

const Index = () => {
  const features = [
    {
      icon: Sparkles,
      title: "AI-Powered Planning",
      description: "Our advanced AI analyzes your preferences to create personalized itineraries that match your style and budget.",
    },
    {
      icon: MapPin,
      title: "Smart Route Optimization",
      description: "Get the most efficient routes between destinations, saving you time and money on transportation.",
    },
    {
      icon: Calendar,
      title: "Flexible Scheduling",
      description: "Easily adjust dates, duration, and activities. Our AI adapts your entire itinerary in real-time.",
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Your personal data and travel documents are protected with blockchain technology and encrypted storage.",
    },
    {
      icon: Globe,
      title: "Real-time Updates",
      description: "Stay informed with live weather alerts, safety notifications, and travel advisories for your destinations.",
    },
    {
      icon: Zap,
      title: "Instant Booking",
      description: "Book flights, hotels, and activities directly through our platform with competitive prices and instant confirmation.",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      location: "San Francisco, CA",
      rating: 5,
      comment: "Travigo planned my entire European trip in minutes. The AI suggestions were spot-on and saved me hundreds of dollars!",
    },
    {
      name: "Michael Rodriguez",
      location: "New York, NY", 
      rating: 5,
      comment: "The real-time alerts saved my vacation when a storm hit. Travigo automatically rerouted my plans. Incredible!",
    },
    {
      name: "Emma Thompson",
      location: "London, UK",
      rating: 5,
      comment: "As a solo female traveler, the safety features and recommendations gave me confidence to explore new destinations.",
    },
  ];

  const stats = [
    { number: "100K+", label: "Happy Travelers" },
    { number: "50+", label: "Countries Covered" },
    { number: "99.9%", label: "Customer Satisfaction" },
    { number: "24/7", label: "AI Support" },
  ];

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <Hero />

      {/* Stats Section */}
      <section className="py-16 bg-accent/20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                  {stat.number}
                </div>
                <div className="text-muted-foreground text-sm md:text-base">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Why Choose{" "}
              <span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                Travigo?
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Experience the future of travel planning with our AI-powered platform that makes every journey unforgettable.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className="travel-card group hover:shadow-travel hover:scale-105 transition-smooth animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-smooth">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-accent/10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Loved by{" "}
              <span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                Travelers
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Join thousands of satisfied travelers who've discovered the joy of AI-powered trip planning.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card 
                key={index} 
                className="travel-card animate-slide-up"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4 italic">
                    "{testimonial.comment}"
                  </p>
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.location}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-primary-glow relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center text-white animate-fade-in">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Ready to Start Your Journey?
            </h2>
            <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
              Join thousands of travelers who trust Travigo to plan their perfect trips. 
              Your adventure awaits!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg" 
                className="bg-white text-primary hover:bg-white/90 font-semibold px-8 py-4 h-auto text-lg shadow-glow hover:shadow-travel"
              >
                Get Started Free
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-white/30 text-white hover:bg-white/10 font-semibold px-8 py-4 h-auto text-lg backdrop-blur-sm"
              >
                Watch Demo
              </Button>
            </div>
          </div>
        </div>
        
        {/* Background Elements */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl animate-float"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-white/10 rounded-full blur-xl animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-white/5 rounded-full blur-lg animate-float" style={{ animationDelay: '2s' }}></div>
      </section>
    </div>
  );
};

export default Index;
