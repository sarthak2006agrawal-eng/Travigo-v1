import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  MessageCircle, 
  X, 
  Send, 
  Bot, 
  User, 
  Sparkles,
  MapPin,
  Calendar,
  DollarSign,
  Plane,
  Hotel,
  Camera,
  Minimize2,
  Maximize2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: "Hi! I'm your AI travel assistant. I can help you modify your itinerary, find new destinations, answer travel questions, or assist with bookings. How can I help you today?",
      timestamp: new Date(),
      suggestions: [
        "Modify my current trip",
        "Find nearby restaurants", 
        "Check weather updates",
        "Help with bookings"
      ]
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, isMinimized]);

  const generateBotResponse = (userMessage: string): { content: string; suggestions?: string[] } => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('itinerary') || message.includes('trip') || message.includes('modify')) {
      return {
        content: "I can help you modify your itinerary! Here are some things I can do:\n\n• Add or remove activities\n• Change dates or times\n• Suggest alternative destinations\n• Optimize your route\n• Adjust budget allocations\n\nWhat specific changes would you like to make?",
        suggestions: ["Add new activity", "Change dates", "Optimize route", "Adjust budget"]
      };
    }
    
    if (message.includes('restaurant') || message.includes('food') || message.includes('dining')) {
      return {
        content: "I'd be happy to help you find great dining options! Based on your current location and preferences, I can suggest:\n\n• Local restaurants near your current activity\n• Cuisine-specific recommendations\n• Budget-friendly options\n• Fine dining experiences\n\nWhat type of cuisine are you in the mood for?",
        suggestions: ["Local cuisine", "Fine dining", "Budget options", "Quick bites"]
      };
    }
    
    if (message.includes('weather') || message.includes('forecast')) {
      return {
        content: "I'm monitoring weather conditions for your trip! Here's what I can provide:\n\n• Real-time weather updates\n• 7-day forecasts for your destinations\n• Weather-based activity suggestions\n• Alerts for severe weather\n\nWould you like me to check the weather for a specific location or date?",
        suggestions: ["Current weather", "7-day forecast", "Weather alerts", "Activity suggestions"]
      };
    }
    
    if (message.includes('booking') || message.includes('book') || message.includes('reservation')) {
      return {
        content: "I can assist with all your booking needs:\n\n• Hotel reservations\n• Flight bookings\n• Activity tickets\n• Restaurant reservations\n• Transportation bookings\n\nI'll find the best prices and handle the booking process for you. What would you like to book?",
        suggestions: ["Book hotel", "Book flights", "Book activities", "Restaurant reservations"]
      };
    }
    
    if (message.includes('budget') || message.includes('cost') || message.includes('price')) {
      return {
        content: "Let me help you manage your travel budget:\n\n• Track current expenses\n• Find cost-saving opportunities\n• Compare prices across providers\n• Suggest budget-friendly alternatives\n• Set spending alerts\n\nYour current trip budget is optimized, but I can help you adjust it. What would you like to know?",
        suggestions: ["Track expenses", "Find deals", "Budget alternatives", "Set alerts"]
      };
    }
    
    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
      return {
        content: "Hello! Great to see you again. I'm here to make your travel experience amazing. Whether you need help with your current trip or planning something new, I've got you covered!",
        suggestions: ["Plan new trip", "Modify current trip", "Travel tips", "Emergency help"]
      };
    }
    
    // Default response
    return {
      content: "I understand you're looking for travel assistance. I can help with:\n\n• Itinerary planning and modifications\n• Destination recommendations\n• Booking assistance\n• Travel tips and advice\n• Real-time updates and alerts\n\nCould you be more specific about what you need help with?",
      suggestions: ["Plan itinerary", "Find destinations", "Book travel", "Get travel tips"]
    };
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const botResponse = generateBotResponse(userMessage.content);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: botResponse.content,
        timestamp: new Date(),
        suggestions: botResponse.suggestions
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputMessage(suggestion);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setIsMinimized(false);
    }
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    <>
      {/* Chat Interface */}
      {isOpen && (
        <div className={cn(
          "fixed bottom-24 right-6 z-50 transition-all duration-300 ease-in-out",
          isMinimized ? "w-80 h-16" : "w-96 h-[600px]"
        )}>
          <Card className="travel-card shadow-travel border-primary/20 h-full flex flex-col">
            {/* Header */}
            <CardHeader className="pb-3 border-b border-border/50">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center text-lg">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                    <Bot className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <span>AI Travel Assistant</span>
                    <div className="flex items-center text-xs text-muted-foreground font-normal">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                      Online
                    </div>
                  </div>
                </CardTitle>
                <div className="flex items-center space-x-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleMinimize}
                    className="h-8 w-8 hover:bg-accent"
                  >
                    {isMinimized ? (
                      <Maximize2 className="h-4 w-4" />
                    ) : (
                      <Minimize2 className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleChat}
                    className="h-8 w-8 hover:bg-accent"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            {/* Messages Area */}
            {!isMinimized && (
              <>
                <CardContent className="flex-1 p-0">
                  <ScrollArea className="h-full p-4">
                    <div className="space-y-4">
                      {messages.map((message) => (
                        <div key={message.id} className="space-y-2">
                          <div
                            className={cn(
                              "flex items-start space-x-3",
                              message.type === 'user' ? "justify-end" : "justify-start"
                            )}
                          >
                            {message.type === 'bot' && (
                              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                                <Bot className="h-4 w-4 text-primary" />
                              </div>
                            )}
                            <div
                              className={cn(
                                "max-w-[80%] p-3 rounded-lg text-sm leading-relaxed",
                                message.type === 'user'
                                  ? "bg-primary text-primary-foreground ml-auto"
                                  : "bg-accent/50 text-foreground"
                              )}
                            >
                              <div className="whitespace-pre-wrap">{message.content}</div>
                              <div className="text-xs opacity-70 mt-2">
                                {message.timestamp.toLocaleTimeString([], { 
                                  hour: '2-digit', 
                                  minute: '2-digit' 
                                })}
                              </div>
                            </div>
                            {message.type === 'user' && (
                              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                                <User className="h-4 w-4 text-primary" />
                              </div>
                            )}
                          </div>
                          
                          {/* Suggestions */}
                          {message.type === 'bot' && message.suggestions && (
                            <div className="flex flex-wrap gap-2 ml-11">
                              {message.suggestions.map((suggestion, index) => (
                                <Button
                                  key={index}
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleSuggestionClick(suggestion)}
                                  className="text-xs h-7 px-3 hover:bg-primary/10 hover:text-primary hover:border-primary/30"
                                >
                                  {suggestion}
                                </Button>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                      
                      {/* Typing Indicator */}
                      {isTyping && (
                        <div className="flex items-start space-x-3">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                            <Bot className="h-4 w-4 text-primary" />
                          </div>
                          <div className="bg-accent/50 p-3 rounded-lg">
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce"></div>
                              <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                              <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            </div>
                          </div>
                        </div>
                      )}
                      <div ref={messagesEndRef} />
                    </div>
                  </ScrollArea>
                </CardContent>

                {/* Input Area */}
                <div className="p-4 border-t border-border/50">
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 relative">
                      <Input
                        ref={inputRef}
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Ask me anything about your trip..."
                        className="travel-input pr-12"
                        disabled={isTyping}
                      />
                      <Button
                        onClick={handleSendMessage}
                        disabled={!inputMessage.trim() || isTyping}
                        size="icon"
                        className="absolute right-1 top-1 h-8 w-8 travel-button"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground mt-2 text-center">
                    AI assistant powered by advanced travel intelligence
                  </div>
                </div>
              </>
            )}
          </Card>
        </div>
      )}

      {/* Floating Chat Icon */}
      <Button
        onClick={toggleChat}
        className={cn(
          "fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-travel hover:shadow-glow transition-smooth",
          "travel-button p-0 animate-float",
          isOpen && "rotate-180"
        )}
        style={{ animationDelay: '0.5s' }}
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <div className="relative">
            <MessageCircle className="h-6 w-6" />
            {/* Notification dot */}
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
          </div>
        )}
      </Button>

      {/* Welcome tooltip for first-time users */}
      {!isOpen && (
        <div className="fixed bottom-20 right-20 z-40 animate-fade-in">
          <div className="bg-primary text-primary-foreground px-4 py-2 rounded-lg shadow-travel text-sm font-medium relative">
            <Sparkles className="h-4 w-4 inline mr-2" />
            Need help? Chat with AI!
            <div className="absolute bottom-0 right-4 transform translate-y-1/2 rotate-45 w-2 h-2 bg-primary"></div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;