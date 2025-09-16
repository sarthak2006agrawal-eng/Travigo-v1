import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, DollarSign, Users, Edit, Eye, Trash2 } from "lucide-react";

interface TripCardProps {
  trip: {
    id: number;
    title: string;
    destination: string;
    startDate: string;
    endDate: string;
    status: string;
    budget: number;
    travelers?: number;
    image?: string;
  };
  onEdit?: (id: number) => void;
  onView?: (id: number) => void;
  onDelete?: (id: number) => void;
}

const TripCard = ({ trip, onEdit, onView, onDelete }: TripCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed": return "bg-green-500/10 text-green-700 border-green-200";
      case "planning": return "bg-blue-500/10 text-blue-700 border-blue-200";
      case "draft": return "bg-gray-500/10 text-gray-700 border-gray-200";
      case "completed": return "bg-purple-500/10 text-purple-700 border-purple-200";
      default: return "bg-gray-500/10 text-gray-700 border-gray-200";
    }
  };

  return (
    <Card className="travel-card group hover:shadow-travel hover:scale-105 transition-smooth">
      <div className="aspect-video relative overflow-hidden rounded-t-xl bg-gradient-to-br from-primary/20 to-primary-glow/20 flex items-center justify-center">
        <MapPin className="h-16 w-16 text-white/40" />
        <Badge className={`absolute top-3 right-3 ${getStatusColor(trip.status)}`}>
          <span className="capitalize">{trip.status}</span>
        </Badge>
      </div>
      
      <CardContent className="p-6">
        <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-smooth">
          {trip.title}
        </h3>
        <p className="text-muted-foreground mb-4">{trip.destination}</p>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 mr-2" />
            {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center text-muted-foreground">
              <DollarSign className="h-4 w-4 mr-1" />
              ${trip.budget.toLocaleString()}
            </span>
            {trip.travelers && (
              <span className="flex items-center text-muted-foreground">
                <Users className="h-4 w-4 mr-1" />
                {trip.travelers} {trip.travelers === 1 ? 'traveler' : 'travelers'}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onView?.(trip.id)}
            className="flex-1"
          >
            <Eye className="h-4 w-4 mr-2" />
            View
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onEdit?.(trip.id)}
            className="flex-1"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onDelete?.(trip.id)}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TripCard;