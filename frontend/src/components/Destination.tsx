import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import axios from "axios";

// Mock fallback data
const mockData = {
  city: {
    id: "C1",
    name: "Goa",
    state: "Goa",
    country: "India",
    coordinates: { lat: 15.2993, lon: 74.1240 },
    timezone: "Asia/Kolkata",
    description: { en: "Goa, India's smallest state, is famous for its golden beaches, Portuguese heritage, vibrant nightlife, and laid-back tropical vibe." },
    pois: [
      { id: "GO1", name: { en: "Baga Beach" }, category: "Leisure", description: { en: "Popular for beach parties." }, rating: 4.5, estimated_duration_minutes: 180 },
      { id: "GO2", name: { en: "Basilica of Bom Jesus" }, category: "Historical", description: { en: "UNESCO heritage church." }, rating: 4.7, estimated_duration_minutes: 90 }
    ],
    accommodations: [
      { id: "GH1", name: { en: "Taj Exotica Resort & Spa" }, rating: 4.8, cost_per_night: 18000, amenities: ["wifi", "spa", "pool"] }
    ],
    transport: {
      scooter_rental: { per_day: 300, currency: "INR" },
      car_rental: { average_fare: 3500, currency: "INR" }
    }
  }
};

type TransportDetail = {
  per_day?: number;
  average_fare?: number;
  currency: string;
};

const Destination = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("http://localhost:5000/api/destination/goa")
      .then(res => {
        setData(res.data || mockData);
        setLoading(false);
      })
      .catch(err => {
        console.warn("Failed to fetch dynamic data, using mock:", err);
        setData(mockData);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="text-center p-10">Loading destination data...</p>;
  if (!data) return <p className="text-center p-10 text-red-500">No data available.</p>;

  return (
    <section className="max-w-7xl mx-auto p-8 space-y-12">
      <h1 className="text-5xl font-extrabold text-center text-primary">{data.city.name} Packages</h1>
      
      <p className="text-muted-foreground text-center">{data.city.description.en}</p>

      {/* POIs Section */}
      <div className="grid md:grid-cols-2 gap-6">
        {data.city.pois.map(poi => (
          <Card key={poi.id} className="hover:shadow-lg">
            <CardContent>
              <h3 className="text-2xl font-semibold">{poi.name.en}</h3>
              <p className="text-muted-foreground mt-2">{poi.description.en}</p>
              <div className="flex items-center space-x-4 mt-2">
                <Star className="h-5 w-5 text-yellow-400" />
                <span>Rating: {poi.rating}</span>
                <span>Duration: {poi.estimated_duration_minutes} mins</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Accommodations Section */}
      <div className="grid md:grid-cols-2 gap-6">
        {data.city.accommodations.map(acc => (
          <Card key={acc.id} className="hover:shadow-lg">
            <CardContent>
              <h3 className="text-xl font-semibold">{acc.name.en}</h3>
              <p className="text-muted-foreground">Rating: {acc.rating} | ₹{acc.cost_per_night}/night</p>
              <div className="mt-2 space-x-2">
                {acc.amenities.map((amenity: string, idx: number) => (
                  <span key={idx} className="badge badge-primary">{amenity}</span>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Transport Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(data.city.transport).map(([type, details]) => {
          const transport = details as TransportDetail;
          return (
            <Card key={type} className="hover:shadow-lg">
              <CardContent>
                <h3 className="text-xl font-semibold capitalize">{type.replace(/_/g, ' ')}</h3>
                <p className="text-muted-foreground">
                  Cost: ₹{transport.per_day ?? transport.average_fare} {transport.currency}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
};

export default Destination;
