import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Hospital, MapPin, Phone, Navigation, Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

// Hospital marker icon
const hospitalIcon = new L.Icon({
  iconUrl: "data:image/svg+xml;base64," + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32">
      <circle cx="16" cy="16" r="14" fill="#16a34a" stroke="white" stroke-width="2"/>
      <rect x="13" y="8" width="6" height="16" rx="1" fill="white"/>
      <rect x="8" y="13" width="16" height="6" rx="1" fill="white"/>
    </svg>
  `),
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const patientIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface HospitalData {
  id: number;
  name: string;
  lat: number;
  lon: number;
  phone?: string;
  emergency?: string;
  distance?: number;
}

function FlyToLocation({ position }: { position: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(position, 14);
  }, [position[0], position[1]]);
  return null;
}

function getDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

interface NearbyHospitalsProps {
  latitude: number;
  longitude: number;
}

const NearbyHospitals = ({ latitude, longitude }: NearbyHospitalsProps) => {
  const { t } = useLanguage();
  const [hospitals, setHospitals] = useState<HospitalData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchNearbyHospitals();
  }, [latitude, longitude]);

  const fetchNearbyHospitals = async () => {
    setLoading(true);
    setError(null);
    try {
      // Overpass API query for hospitals within 5km radius
      const radius = 5000;
      const query = `
        [out:json][timeout:10];
        (
          node["amenity"="hospital"](around:${radius},${latitude},${longitude});
          way["amenity"="hospital"](around:${radius},${latitude},${longitude});
          node["amenity"="clinic"](around:${radius},${latitude},${longitude});
        );
        out center body;
      `;
      const response = await fetch("https://overpass-api.de/api/interpreter", {
        method: "POST",
        body: `data=${encodeURIComponent(query)}`,
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });

      if (!response.ok) throw new Error("Failed to fetch hospitals");

      const data = await response.json();
      const results: HospitalData[] = data.elements
        .map((el: any) => {
          const lat = el.lat || el.center?.lat;
          const lon = el.lon || el.center?.lon;
          if (!lat || !lon) return null;
          return {
            id: el.id,
            name: el.tags?.name || t("hospitals.unnamed"),
            lat,
            lon,
            phone: el.tags?.phone || el.tags?.["contact:phone"],
            emergency: el.tags?.emergency,
            distance: getDistance(latitude, longitude, lat, lon),
          };
        })
        .filter(Boolean)
        .sort((a: HospitalData, b: HospitalData) => (a.distance || 0) - (b.distance || 0))
        .slice(0, 15);

      setHospitals(results);
    } catch (err: any) {
      console.error("Hospital fetch error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const openDirections = (lat: number, lon: number) => {
    window.open(`https://www.google.com/maps/dir/?api=1&origin=${latitude},${longitude}&destination=${lat},${lon}&travelmode=driving`, "_blank");
  };

  const center: [number, number] = [latitude, longitude];

  return (
    <Card className="border-2 border-success/30">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Hospital className="h-5 w-5 text-success" /> {t("hospitals.title")}
          </CardTitle>
          <Badge variant="secondary" className="gap-1">
            {loading ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <>
                <span className="w-2 h-2 bg-success rounded-full" />
                {hospitals.length} {t("hospitals.found")}
              </>
            )}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Map */}
        <div className="h-[300px] rounded-lg overflow-hidden">
          <MapContainer center={center} zoom={14} className="h-full w-full">
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; OpenStreetMap'
            />
            <FlyToLocation position={center} />
            <Marker position={center} icon={patientIcon}>
              <Popup><strong>{t("hospitals.yourLocation")}</strong></Popup>
            </Marker>
            <Circle
              center={center}
              radius={5000}
              pathOptions={{ color: "hsl(var(--success))", fillColor: "hsl(var(--success))", fillOpacity: 0.05, weight: 1 }}
            />
            {hospitals.map((h) => (
              <Marker key={h.id} position={[h.lat, h.lon]} icon={hospitalIcon}>
                <Popup>
                  <div className="min-w-[180px]">
                    <p className="font-bold text-sm">{h.name}</p>
                    {h.phone && <p className="text-xs mt-1">📞 {h.phone}</p>}
                    <p className="text-xs text-muted-foreground mt-1">
                      📍 {h.distance?.toFixed(1)} km {t("hospitals.away")}
                    </p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        {/* Hospital List */}
        {loading ? (
          <div className="flex items-center justify-center py-6 gap-2 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm">{t("hospitals.searching")}</span>
          </div>
        ) : error ? (
          <div className="text-center py-4">
            <p className="text-sm text-destructive mb-2">{t("hospitals.error")}</p>
            <Button variant="outline" size="sm" onClick={fetchNearbyHospitals}>
              {t("hospitals.retry")}
            </Button>
          </div>
        ) : (
          <div className="space-y-2 max-h-[250px] overflow-y-auto">
            {hospitals.map((h) => (
              <div key={h.id} className="flex items-center justify-between p-3 rounded-lg bg-muted">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-foreground truncate">{h.name}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {h.distance?.toFixed(1)} km {t("hospitals.away")}
                  </p>
                </div>
                <div className="flex gap-1 ml-2">
                  {h.phone && (
                    <Button size="sm" variant="outline" className="h-8 w-8 p-0" asChild>
                      <a href={`tel:${h.phone}`}><Phone className="h-3 w-3" /></a>
                    </Button>
                  )}
                  <Button size="sm" variant="outline" className="h-8 w-8 p-0" onClick={() => openDirections(h.lat, h.lon)}>
                    <Navigation className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
            {hospitals.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">{t("hospitals.none")}</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NearbyHospitals;
