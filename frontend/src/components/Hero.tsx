import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Sparkles, MapPin, Calendar, Users } from "lucide-react";
import heroImage from "@/assets/hero-travel.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-travel-dark/70 via-travel-dark/50 to-primary/30"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto animate-fade-in">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-background/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-8">
            <Sparkles className="h-4 w-4 text-primary-glow" />
            <span className="text-white/90 text-sm font-medium">AI-Powered Travel Planning</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Your Perfect Trip,
            <br />
            <span className="bg-gradient-to-r from-primary-glow to-white bg-clip-text text-transparent">
              Planned by AI
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-white/80 mb-12 max-w-3xl mx-auto leading-relaxed">
            Discover personalized itineraries, real-time recommendations, and seamless booking experiences. 
            Let artificial intelligence craft your dream vacation.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link to="/signup">
              <Button 
                size="lg" 
                className="travel-button text-lg px-8 py-4 h-auto font-semibold shadow-glow hover:shadow-travel animate-glow"
              >
                Start Planning Now
              </Button>
            </Link>
            <Link to="/demo">
              <Button 
                variant="outline" 
                size="lg" 
                className="text-lg px-8 py-4 h-auto font-semibold bg-white/10 text-white border-white/30 hover:bg-white/20 backdrop-blur-sm"
              >
                Watch Demo
              </Button>
            </Link>
          </div>

          {/* Feature Icons */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto">
            <div className="text-center group animate-slide-up">
              <div className="w-16 h-16 mx-auto mb-4 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center group-hover:bg-white/20 transition-smooth">
                <MapPin className="h-8 w-8 text-primary-glow" />
              </div>
              <p className="text-white/80 text-sm font-medium">Smart Routes</p>
            </div>
            <div className="text-center group animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <div className="w-16 h-16 mx-auto mb-4 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center group-hover:bg-white/20 transition-smooth">
                <Calendar className="h-8 w-8 text-primary-glow" />
              </div>
              <p className="text-white/80 text-sm font-medium">Flexible Dates</p>
            </div>
            <div className="text-center group animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="w-16 h-16 mx-auto mb-4 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center group-hover:bg-white/20 transition-smooth">
                <Users className="h-8 w-8 text-primary-glow" />
              </div>
              <p className="text-white/80 text-sm font-medium">Group Travel</p>
            </div>
            <div className="text-center group animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <div className="w-16 h-16 mx-auto mb-4 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center group-hover:bg-white/20 transition-smooth">
                <Sparkles className="h-8 w-8 text-primary-glow" />
              </div>
              <p className="text-white/80 text-sm font-medium">AI Insights</p>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-1/4 left-10 w-20 h-20 bg-primary/20 rounded-full blur-xl animate-float"></div>
      <div className="absolute bottom-1/3 right-10 w-32 h-32 bg-primary-glow/20 rounded-full blur-xl animate-float" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white/10 rounded-full blur-lg animate-float" style={{ animationDelay: '2s' }}></div>
    </section>
  );
};

export default Hero;