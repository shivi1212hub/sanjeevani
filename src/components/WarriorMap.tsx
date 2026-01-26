import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Phone, Star, Clock, MapPin, Navigation } from "lucide-react";

// Fix for default marker icons in Leaflet with Vite
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Custom warrior marker icon
const warriorIcon = new L.Icon({
  iconUrl: "data:image/svg+xml;base64," + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#1E3A5F" width="32" height="32">
      <circle cx="12" cy="12" r="10" fill="#1E3A5F" stroke="#F5841F" stroke-width="2"/>
      <path d="M12 6v12M6 12h12" stroke="white" stroke-width="2" stroke-linecap="round"/>
    </svg>
  `),
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const userIcon = new L.Icon({
  iconUrl: "data:image/svg+xml;base64," + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#F5841F" width="24" height="24">
      <circle cx="12" cy="12" r="8" fill="#F5841F" stroke="white" stroke-width="2"/>
    </svg>
  `),
  iconSize: [24, 24],
  iconAnchor: [12, 12],
  popupAnchor: [0, -12],
});

interface Warrior {
  id: number;
  name: string;
  position: [number, number];
  rating: number;
  missions: number;
  specialty: string;
  available: boolean;
  responseTime: string;
  phone: string;
}

// Mock warriors data around Varanasi
const mockWarriors: Warrior[] = [
  {
    id: 1,
    name: "Ravi Kumar",
    position: [25.3176, 82.9739],
    rating: 4.9,
    missions: 127,
    specialty: "CPR & First Aid",
    available: true,
    responseTime: "3 mins",
    phone: "+91 98765 43210",
  },
  {
    id: 2,
    name: "Priya Sharma",
    position: [25.3226, 82.9889],
    rating: 4.8,
    missions: 89,
    specialty: "Emergency Response",
    available: true,
    responseTime: "5 mins",
    phone: "+91 98765 43211",
  },
  {
    id: 3,
    name: "Amit Verma",
    position: [25.3116, 82.9639],
    rating: 4.7,
    missions: 56,
    specialty: "Trauma Care",
    available: false,
    responseTime: "8 mins",
    phone: "+91 98765 43212",
  },
  {
    id: 4,
    name: "Sunita Devi",
    position: [25.3256, 82.9559],
    rating: 4.9,
    missions: 203,
    specialty: "Cardiac Emergency",
    available: true,
    responseTime: "4 mins",
    phone: "+91 98765 43213",
  },
  {
    id: 5,
    name: "Rahul Singh",
    position: [25.3096, 82.9809],
    rating: 4.6,
    missions: 42,
    specialty: "First Aid",
    available: true,
    responseTime: "6 mins",
    phone: "+91 98765 43214",
  },
];

// Component to recenter map on user location
function LocationMarker({ position }: { position: [number, number] | null }) {
  const map = useMap();
  
  useEffect(() => {
    if (position) {
      map.flyTo(position, 14);
    }
  }, [map, position]);

  return position ? (
    <>
      <Marker position={position} icon={userIcon}>
        <Popup>You are here</Popup>
      </Marker>
      <Circle
        center={position}
        radius={1000}
        pathOptions={{
          color: "#F5841F",
          fillColor: "#F5841F",
          fillOpacity: 0.1,
        }}
      />
    </>
  ) : null;
}

const WarriorMap = () => {
  const [userPosition, setUserPosition] = useState<[number, number] | null>(null);
  const [selectedWarrior, setSelectedWarrior] = useState<Warrior | null>(null);
  const defaultCenter: [number, number] = [25.3176, 82.9739]; // Varanasi

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserPosition([position.coords.latitude, position.coords.longitude]);
        },
        () => {
          // If geolocation fails, use default center
          setUserPosition(defaultCenter);
        }
      );
    }
  }, []);

  const availableWarriors = mockWarriors.filter(w => w.available);

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Map */}
      <div className="lg:col-span-2">
        <Card className="overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">Nearby Health Warriors</CardTitle>
              <Badge variant="secondary" className="gap-1">
                <span className="w-2 h-2 bg-success rounded-full animate-pulse" />
                {availableWarriors.length} Available
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="h-[400px] md:h-[500px] w-full">
              <MapContainer
                center={userPosition || defaultCenter}
                zoom={14}
                scrollWheelZoom={true}
                className="h-full w-full"
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LocationMarker position={userPosition} />
                
                {mockWarriors.map((warrior) => (
                  <Marker
                    key={warrior.id}
                    position={warrior.position}
                    icon={warriorIcon}
                    eventHandlers={{
                      click: () => setSelectedWarrior(warrior),
                    }}
                  >
                    <Popup>
                      <div className="min-w-[200px]">
                        <h4 className="font-semibold">{warrior.name}</h4>
                        <p className="text-sm text-muted-foreground">{warrior.specialty}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant={warrior.available ? "default" : "secondary"}>
                            {warrior.available ? "Available" : "Busy"}
                          </Badge>
                          <span className="flex items-center text-sm">
                            <Star className="h-3 w-3 text-warning mr-1" />
                            {warrior.rating}
                          </span>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Warriors List */}
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Warriors Nearby</h3>
        <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
          {mockWarriors.map((warrior) => (
            <Card
              key={warrior.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedWarrior?.id === warrior.id ? "ring-2 ring-primary" : ""
              } ${!warrior.available ? "opacity-60" : ""}`}
              onClick={() => setSelectedWarrior(warrior)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-semibold">{warrior.name}</h4>
                    <p className="text-sm text-muted-foreground">{warrior.specialty}</p>
                  </div>
                  <Badge variant={warrior.available ? "default" : "secondary"}>
                    {warrior.available ? "Available" : "Busy"}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                  <span className="flex items-center gap-1">
                    <Star className="h-3 w-3 text-warning" />
                    {warrior.rating}
                  </span>
                  <span>{warrior.missions} missions</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-sm">
                    <Clock className="h-3 w-3 text-success" />
                    <span className="text-success font-medium">{warrior.responseTime}</span>
                  </div>
                  
                  {warrior.available && (
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="h-8 px-2">
                        <Navigation className="h-4 w-4" />
                      </Button>
                      <Button size="sm" className="h-8 px-2">
                        <Phone className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="bg-muted/50 rounded-lg p-4 text-center">
          <MapPin className="h-6 w-6 mx-auto text-primary mb-2" />
          <p className="text-sm text-muted-foreground">
            Warriors shown within 5km radius of your location
          </p>
        </div>
      </div>
    </div>
  );
};

export default WarriorMap;
