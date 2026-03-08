import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageToggle } from "@/components/LanguageToggle";
import {
  Shield, AlertTriangle, MapPin, Heart, Activity, LogOut,
  User, Phone, Droplets, CheckCircle, Clock, Navigation,
  Volume2, VolumeX
} from "lucide-react";
import WarriorApprovalPanel from "@/components/WarriorApprovalPanel";
import NearbyHospitals from "@/components/NearbyHospitals";
import { useToast } from "@/hooks/use-toast";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix leaflet icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

const sosIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41], iconAnchor: [12, 41],
});

const WarriorDashboard = () => {
  const { t } = useLanguage();
  const { user, loading, isWarrior, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [alerts, setAlerts] = useState<any[]>([]);
  const [selectedAlert, setSelectedAlert] = useState<any>(null);
  const [patientProfile, setPatientProfile] = useState<any>(null);
  const [patientVitals, setPatientVitals] = useState<any[]>([]);
  const [myLocation, setMyLocation] = useState<[number, number]>([28.6139, 77.2090]);
  const [buzzerMuted, setBuzzerMuted] = useState(false);
  const prevAlertCountRef = useRef(0);
  const buzzerIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Play emergency buzzer sound using Web Audio API
  const playBuzzer = useCallback(() => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      const now = ctx.currentTime;

      // Two-tone siren effect
      for (let i = 0; i < 3; i++) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = "square";
        osc.frequency.setValueAtTime(880, now + i * 0.4);
        osc.frequency.setValueAtTime(660, now + i * 0.4 + 0.2);
        gain.gain.setValueAtTime(0.15, now + i * 0.4);
        gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.4 + 0.38);
        osc.start(now + i * 0.4);
        osc.stop(now + i * 0.4 + 0.4);
      }
    } catch (e) {
      console.warn("Buzzer audio failed:", e);
    }
  }, []);

  // Stop buzzer loop
  const stopBuzzer = useCallback(() => {
    if (buzzerIntervalRef.current) {
      clearInterval(buzzerIntervalRef.current);
      buzzerIntervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!loading && !user) navigate("/auth");
    if (!loading && user && !isWarrior) navigate("/patient-dashboard");
  }, [user, loading, isWarrior]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => setMyLocation([pos.coords.latitude, pos.coords.longitude]),
      () => {}
    );
  }, []);

  useEffect(() => {
    if (user) fetchAlerts();
  }, [user]);

  // Realtime alerts with buzzer
  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel("warrior-alerts")
      .on("postgres_changes", {
        event: "*", schema: "public", table: "sos_alerts",
      }, () => { fetchAlerts(); })
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
      stopBuzzer();
    };
  }, [user, stopBuzzer]);

  // Trigger buzzer when new active alerts appear
  useEffect(() => {
    const activeAlerts = alerts.filter((a) => a.status === "active");
    const activeCount = activeAlerts.length;

    if (activeCount > 0 && !buzzerMuted) {
      // Play immediately and repeat every 5 seconds while active alerts exist
      if (!buzzerIntervalRef.current) {
        playBuzzer();
        buzzerIntervalRef.current = setInterval(playBuzzer, 5000);
      }

      // Also send browser notification
      if ("Notification" in window && Notification.permission === "granted") {
        new Notification("🚨 Emergency SOS Alert!", {
          body: `${activeCount} active emergency alert${activeCount > 1 ? "s" : ""} need response`,
          tag: "sos-buzzer",
          requireInteraction: true,
        });
      } else if ("Notification" in window && Notification.permission === "default") {
        Notification.requestPermission();
      }
    } else {
      stopBuzzer();
    }

    prevAlertCountRef.current = activeCount;
  }, [alerts, buzzerMuted, playBuzzer, stopBuzzer]);

  const fetchAlerts = async () => {
    const { data } = await supabase
      .from("sos_alerts").select("*")
      .in("status", ["active", "assigned"])
      .order("created_at", { ascending: false });
    setAlerts(data || []);
  };

  const acceptAlert = async (alert: any) => {
    const { error } = await supabase.from("sos_alerts")
      .update({ status: "assigned", warrior_id: user!.id })
      .eq("id", alert.id).eq("status", "active");
    if (error) {
      toast({ title: t("warrior.acceptError"), variant: "destructive" });
      return;
    }
    toast({ title: t("warrior.accepted") });
    setSelectedAlert({ ...alert, status: "assigned", warrior_id: user!.id });
    fetchPatientData(alert.patient_id);
    fetchAlerts();
  };

  const resolveAlert = async (alertId: string) => {
    await supabase.from("sos_alerts").update({ status: "resolved", resolved_at: new Date().toISOString() }).eq("id", alertId);
    toast({ title: t("warrior.resolved") });
    setSelectedAlert(null);
    setPatientProfile(null);
    fetchAlerts();
  };

  const fetchPatientData = async (patientId: string) => {
    const { data: profile } = await supabase.from("profiles").select("*").eq("user_id", patientId).single();
    setPatientProfile(profile);
    const { data: vitals } = await supabase.from("vitals_stream").select("*")
      .eq("user_id", patientId).order("created_at", { ascending: false }).limit(5);
    setPatientVitals(vitals || []);
  };

  // Realtime patient vitals
  useEffect(() => {
    if (!selectedAlert) return;
    const channel = supabase
      .channel("patient-vitals")
      .on("postgres_changes", {
        event: "INSERT", schema: "public", table: "vitals_stream",
        filter: `user_id=eq.${selectedAlert.patient_id}`,
      }, (payload) => {
        setPatientVitals((prev) => [payload.new as any, ...prev.slice(0, 4)]);
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [selectedAlert]);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-background"><div className="animate-spin h-8 w-8 border-4 border-secondary border-t-transparent rounded-full" /></div>;

  const mapCenter: [number, number] = selectedAlert?.latitude
    ? [selectedAlert.latitude, selectedAlert.longitude]
    : myLocation;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 bg-card/95 backdrop-blur-md shadow-soft border-b border-border">
        <div className="flex items-center justify-between h-14 px-4">
          <div className="flex items-center gap-3">
            <Shield className="h-6 w-6 text-secondary" />
            <h1 className="font-bold text-foreground">{t("warrior.dashboard")}</h1>
            <span className="px-2 py-0.5 rounded-full bg-secondary/10 text-secondary text-xs font-bold">
              {alerts.length} {t("warrior.activeAlerts")}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost" size="icon"
              onClick={() => { setBuzzerMuted((m) => !m); stopBuzzer(); }}
              className={buzzerMuted ? "text-muted-foreground" : "text-destructive"}
              title={buzzerMuted ? "Unmute buzzer" : "Mute buzzer"}
            >
              {buzzerMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </Button>
            <LanguageToggle />
            <ThemeToggle />
            <Button variant="ghost" size="sm" onClick={() => { signOut(); navigate("/"); }} className="gap-1">
              <LogOut className="h-4 w-4" /> {t("warrior.logout")}
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Map */}
        <div className="lg:col-span-2">
          <Card className="overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <MapPin className="h-5 w-5 text-destructive" /> {t("warrior.liveMap")}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="h-[400px] lg:h-[500px]">
                <MapContainer center={mapCenter} zoom={13} className="h-full w-full" key={mapCenter.join(",")}>
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap' />
                  {alerts.map((a) => a.latitude && (
                    <Marker key={a.id} position={[a.latitude, a.longitude]} icon={sosIcon}>
                      <Popup>
                        <div className="text-sm">
                          <p className="font-bold text-destructive">🚨 SOS Alert</p>
                          <p>{new Date(a.created_at).toLocaleTimeString()}</p>
                          <p>Status: {a.status}</p>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                  <Marker position={myLocation}>
                    <Popup>{t("warrior.yourLocation")}</Popup>
                  </Marker>
                </MapContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Alerts & Patient Info */}
        <div className="space-y-4">
          {/* Active Alerts (Buzzer) */}
          <Card className="border-2 border-destructive/30">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <AlertTriangle className="h-5 w-5 text-destructive" /> {t("warrior.sosAlerts")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 max-h-[300px] overflow-y-auto">
              {alerts.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">{t("warrior.noAlerts")}</p>
              ) : (
                alerts.map((a) => (
                  <div key={a.id} className={`p-3 rounded-lg border ${a.status === "active" ? "border-destructive/50 bg-destructive/5 animate-pulse" : "border-secondary/30 bg-secondary/5"}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-destructive flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" />
                        {a.status === "active" ? t("warrior.newAlert") : t("warrior.assigned")}
                      </span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(a.created_at).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">
                      📍 {a.latitude?.toFixed(4)}, {a.longitude?.toFixed(4)}
                    </p>
                    {a.status === "active" && (
                      <Button size="sm" className="w-full gap-1" onClick={() => acceptAlert(a)}>
                        <Navigation className="h-3 w-3" /> {t("warrior.accept")}
                      </Button>
                    )}
                    {a.status === "assigned" && a.warrior_id === user?.id && (
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="flex-1" onClick={() => { setSelectedAlert(a); fetchPatientData(a.patient_id); }}>
                          {t("warrior.viewPatient")}
                        </Button>
                        <Button size="sm" variant="default" className="flex-1 gap-1" onClick={() => resolveAlert(a.id)}>
                          <CheckCircle className="h-3 w-3" /> {t("warrior.resolve")}
                        </Button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Warrior Applications */}
          <WarriorApprovalPanel />

          {/* Patient Details */}
          {patientProfile && (
            <Card className="border border-primary/30">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <User className="h-5 w-5 text-primary" /> {t("warrior.patientInfo")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex items-center gap-2"><User className="h-3 w-3 text-muted-foreground" /> {patientProfile.full_name || "—"}</div>
                <div className="flex items-center gap-2"><Phone className="h-3 w-3 text-muted-foreground" /> {patientProfile.phone || "—"}</div>
                <div className="flex items-center gap-2"><Droplets className="h-3 w-3 text-destructive" /> <span className="font-bold">{patientProfile.blood_group || "—"}</span></div>
                <div className="flex items-center gap-2"><AlertTriangle className="h-3 w-3 text-warning" /> {patientProfile.allergies || t("warrior.noAllergies")}</div>
                <div className="flex items-center gap-2"><Heart className="h-3 w-3 text-destructive" /> {patientProfile.medical_conditions || t("warrior.noConditions")}</div>
                <div className="flex items-center gap-2"><Shield className="h-3 w-3 text-secondary" /> {patientProfile.emergency_contact || "—"}</div>

                {/* Live Vitals */}
                {patientVitals.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-border">
                    <p className="text-xs font-bold text-muted-foreground mb-2 flex items-center gap-1">
                      <Activity className="h-3 w-3" /> {t("warrior.liveVitals")}
                    </p>
                    <div className="flex gap-2">
                      {patientVitals.slice(0, 3).map((v: any) => (
                        <div key={v.id} className="flex-1 p-2 rounded bg-muted text-center">
                          <Heart className="h-3 w-3 mx-auto text-destructive" />
                          <p className="text-sm font-bold text-foreground">{v.heart_rate}</p>
                          <p className="text-[10px] text-muted-foreground">BPM</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
          {/* Nearby Hospitals for assigned alert */}
          {selectedAlert?.latitude && (
            <NearbyHospitals latitude={selectedAlert.latitude} longitude={selectedAlert.longitude} />
          )}
        </div>
      </main>
    </div>
  );
};

export default WarriorDashboard;
