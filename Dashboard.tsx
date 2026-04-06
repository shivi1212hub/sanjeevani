import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/components/language-provider";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Link, Navigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Heart, User, Shield, Bell, MapPin, Activity, LogOut,
  AlertTriangle, ArrowLeft, Save, Loader2, Camera, Sun, Maximize, ExternalLink, Navigation
} from "lucide-react";

const Dashboard = () => {
  const { user, profile, signOut } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [healthProfile, setHealthProfile] = useState<any>(null);
  const [sosAlerts, setSosAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // State for the incoming alert Pop-up Modal
  const [incomingAlert, setIncomingAlert] = useState<any>(null);
  
  // Reference to hold our audio alarm so we can stop it later
  const alarmAudio = useRef<HTMLAudioElement | null>(null);

  // Determine if the user is a Warrior
  const isWarrior = localStorage.getItem("warrior_medical_history_done") === "true";

  const [formData, setFormData] = useState({
    blood_group: "",
    emergency_contact_name: "",
    emergency_contact_phone: "",
    allergies: "",
    conditions: "",
    medications: "",
  });

  // Helper function to stop the alarm
  const stopAlarm = () => {
    if (alarmAudio.current) {
      alarmAudio.current.pause();
      alarmAudio.current.currentTime = 0; // Reset audio to the beginning
    }
  };

  // Cleanup audio if the component unmounts
  useEffect(() => {
    return () => {
      stopAlarm();
    };
  }, []);

  useEffect(() => {
    if (user) {
      fetchData();
      
      let channel: any;
      if (isWarrior) {
        channel = supabase
          .channel("sos-alerts")
          .on("postgres_changes", { event: "*", schema: "public", table: "sos_alerts" }, (payload) => {
            if (payload.eventType === "INSERT") {
              const newAlert = payload.new as any;
              
              // 1. PLAY THE BUZZER SOUND & MAKE IT LOOP
              if (!alarmAudio.current) {
                alarmAudio.current = new Audio('/alarm.mp3');
                alarmAudio.current.loop = true; // Loops until stopped
              }
              alarmAudio.current.play().catch(e => console.log("Audio play blocked by browser. User must interact with page first.", e));

              // 2. TRIGGER THE POP-UP MODAL & LIST
              setSosAlerts((prev) => [newAlert, ...prev]);
              setIncomingAlert(newAlert);

              // 3. SHOW TOAST BACKUP
              toast({
                title: "🚨 EMERGENCY SOS RECEIVED!",
                description: `A patient needs immediate assistance nearby!`,
                variant: "destructive",
                duration: 10000,
              });
            } else if (payload.eventType === "UPDATE") {
              setSosAlerts((prev) => prev.map((a) => (a.id === (payload.new as any).id ? payload.new as any : a)));
              // If the alert was responded to by someone else, close the modal and stop the alarm
              if (incomingAlert && incomingAlert.id === (payload.new as any).id && (payload.new as any).status !== 'active') {
                setIncomingAlert(null);
                stopAlarm();
              }
            }
          })
          .subscribe();
      }

      return () => { 
        if (channel) supabase.removeChannel(channel); 
      };
    } else {
      setLoading(false);
    }
  }, [user, isWarrior, incomingAlert]);

  const fetchData = async () => {
    setLoading(true);
    
    const healthReq = supabase.from("health_profiles").select("*").eq("user_id", user!.id).maybeSingle();
    const sosReq = isWarrior 
      ? supabase.from("sos_alerts").select("*").eq("status", "active").order("created_at", { ascending: false }).limit(10)
      : Promise.resolve({ data: [] });

    const [healthRes, sosRes] = await Promise.all([healthReq, sosReq]);

    if (healthRes.data) {
      setHealthProfile(healthRes.data);
      setFormData({
        blood_group: healthRes.data.blood_group || "",
        emergency_contact_name: healthRes.data.emergency_contact_name || "",
        emergency_contact_phone: healthRes.data.emergency_contact_phone || "",
        allergies: (healthRes.data.allergies || []).join(", "),
        conditions: (healthRes.data.conditions || []).join(", "),
        medications: (healthRes.data.medications || []).join(", "),
      });
    }
    
    if (isWarrior) {
      setSosAlerts(sosRes.data || []);
    }
    
    setLoading(false);
  };

  const saveHealthProfile = async () => {
    setSaving(true);
    const payload = {
      user_id: user!.id,
      blood_group: formData.blood_group || null,
      emergency_contact_name: formData.emergency_contact_name || null,
      emergency_contact_phone: formData.emergency_contact_phone || null,
      allergies: formData.allergies ? formData.allergies.split(",").map((s) => s.trim()) : null,
      conditions: formData.conditions ? formData.conditions.split(",").map((s) => s.trim()) : null,
      medications: formData.medications ? formData.medications.split(",").map((s) => s.trim()) : null,
    };

    const { error } = healthProfile
      ? await supabase.from("health_profiles").update(payload).eq("user_id", user!.id)
      : await supabase.from("health_profiles").insert(payload);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Saved!", description: "Health profile updated." });
      fetchData();
    }
    setSaving(false);
  };

  const triggerSOS = async () => {
    if (!navigator.geolocation) {
      toast({ title: "Error", description: "Geolocation not supported", variant: "destructive" });
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const patientName = profile?.full_name || "Unknown Patient";
        const patientBlood = formData.blood_group || "Unknown";
        const patientConditions = formData.conditions || "None listed";
        
        const alertDetails = `Patient: ${patientName} | Blood: ${patientBlood} | Conditions: ${patientConditions}`;

        const { error } = await supabase.from("sos_alerts").insert({
          user_id: user!.id,
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          description: alertDetails,
        });
        
        if (error) {
          toast({ title: "Error", description: error.message, variant: "destructive" });
        } else {
          toast({ title: "🚨 SOS Sent!", description: "Nearby warriors have been alerted." });
        }
      },
      () => toast({ title: "Error", description: "Could not get location", variant: "destructive" })
    );
  };

  const respondToAlert = async (alertId: string) => {
    stopAlarm(); // Stop the alarm when responding
    
    const { error } = await supabase
      .from("sos_alerts")
      .update({ status: "responded", responded_by: user!.id })
      .eq("id", alertId);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Responding!", description: "You are now responding to this alert. Please proceed to the location." });
      setIncomingAlert(null); // Close modal
      fetchData(); // Refresh list
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 bg-card/95 backdrop-blur-md shadow-soft border-b border-border">
        <div className="flex items-center justify-between h-14 px-4 max-w-6xl mx-auto">
          <Link to="/" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            <Heart className="h-5 w-5 text-primary" />
            <span className="font-bold text-foreground">Sanjeevani</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/ai-assistant">
              <Button variant="outline" size="sm" className="gap-2">
                <Activity className="h-4 w-4" /> AI Assistant
              </Button>
            </Link>
            <Button variant="sos" size="sm" className="gap-2 animate-pulse-emergency" onClick={triggerSOS}>
              <AlertTriangle className="h-4 w-4" /> SOS
            </Button>
            <Button variant="ghost" size="sm" onClick={() => {
              stopAlarm(); // Stop alarm if logging out
              localStorage.removeItem("warrior_medical_history_done");
              signOut();
            }}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            {isWarrior && <Shield className="h-6 w-6 text-primary" />}
            Welcome, {profile?.full_name || user?.email}
          </h1>
          <p className="text-muted-foreground">
            {isWarrior 
              ? "Manage your health profile and respond to nearby emergencies." 
              : "Manage your health profile and access vital monitoring tools."}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-foreground">
              <Heart className="h-5 w-5 text-primary" /> Health Profile
            </h2>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-foreground">Blood Group</label>
                <Input value={formData.blood_group} onChange={(e) => setFormData({ ...formData, blood_group: e.target.value })} placeholder="e.g. O+" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Emergency Contact Name</label>
                <Input value={formData.emergency_contact_name} onChange={(e) => setFormData({ ...formData, emergency_contact_name: e.target.value })} />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Emergency Contact Phone</label>
                <Input value={formData.emergency_contact_phone} onChange={(e) => setFormData({ ...formData, emergency_contact_phone: e.target.value })} />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Allergies (comma-separated)</label>
                <Input value={formData.allergies} onChange={(e) => setFormData({ ...formData, allergies: e.target.value })} placeholder="e.g. Penicillin, Peanuts" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Medical Conditions</label>
                <Input value={formData.conditions} onChange={(e) => setFormData({ ...formData, conditions: e.target.value })} placeholder="e.g. Diabetes, Asthma" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Current Medications</label>
                <Input value={formData.medications} onChange={(e) => setFormData({ ...formData, medications: e.target.value })} placeholder="e.g. Metformin 500mg" />
              </div>
              <Button onClick={saveHealthProfile} disabled={saving} className="w-full gap-2">
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Save Health Profile
              </Button>
            </div>
          </Card>

          {isWarrior ? (
            <Card className="p-6 border-destructive/20 shadow-lg shadow-destructive/5">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-foreground">
                <Bell className="h-5 w-5 text-destructive animate-pulse" /> Active SOS Alerts
                <span className="ml-auto text-xs bg-destructive text-destructive-foreground px-2 py-1 rounded-full font-bold">
                  {sosAlerts.length} active
                </span>
              </h2>
              {sosAlerts.length === 0 ? (
                <p className="text-muted-foreground text-sm">No active emergencies nearby.</p>
              ) : (
                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                  {sosAlerts.map((alert) => (
                    <div key={alert.id} className="p-4 bg-destructive/10 border-2 border-destructive/30 rounded-xl relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-1 h-full bg-destructive"></div>
                      
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold text-destructive flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" /> EMERGENCY
                        </span>
                        <span className="text-xs font-semibold text-muted-foreground bg-background/50 px-2 py-1 rounded">
                          {new Date(alert.created_at).toLocaleTimeString()}
                        </span>
                      </div>
                      
                      {alert.description && (
                        <div className="mb-4 bg-background/50 p-3 rounded-lg border border-border/50 text-sm font-medium text-foreground shadow-sm">
                          {alert.description.split(' | ').map((line: string, i: number) => (
                            <div key={i} className="mb-1 last:mb-0">{line}</div>
                          ))}
                        </div>
                      )}

                      <a 
                        href={`https://maps.google.com/maps?q=${alert.latitude},${alert.longitude}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-blue-500 hover:text-blue-600 hover:underline mb-4 bg-blue-500/10 p-2 rounded-lg transition-colors"
                      >
                        <MapPin className="h-4 w-4" />
                        Open in Google Maps <ExternalLink className="h-3 w-3" />
                      </a>
                      
                      {alert.status === "active" && alert.user_id !== user?.id && (
                        <Button size="lg" variant="destructive" className="w-full gap-2 font-bold text-md shadow-md hover:shadow-xl transition-all" onClick={() => respondToAlert(alert.id)}>
                          <Shield className="h-5 w-5" /> I AM RESPONDING
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </Card>
          ) : (
            <Card className="p-6 h-fit border-secondary/20 shadow-lg shadow-secondary/5">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-foreground">
                <Activity className="h-5 w-5 text-secondary" /> Vitals Monitoring (rPPG)
              </h2>
              
              <div className="space-y-5">
                <p className="text-sm text-muted-foreground">
                  Our AI-powered camera technology allows you to measure your vital signs (Heart Rate, Oxygen Levels, Stress) simply by looking at your device.
                </p>
                
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-secondary/5 rounded-lg border border-secondary/10">
                    <div className="bg-secondary/20 p-2 rounded-full mt-0.5"><Sun className="h-4 w-4 text-secondary" /></div>
                    <div>
                      <h3 className="text-sm font-semibold text-foreground">1. Good Lighting</h3>
                      <p className="text-xs text-muted-foreground mt-1">Ensure your face is well-lit by natural or bright room light. Avoid strong backlighting.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-secondary/5 rounded-lg border border-secondary/10">
                    <div className="bg-secondary/20 p-2 rounded-full mt-0.5"><User className="h-4 w-4 text-secondary" /></div>
                    <div>
                      <h3 className="text-sm font-semibold text-foreground">2. Keep Still</h3>
                      <p className="text-xs text-muted-foreground mt-1">Hold your device steady and minimize head movements during the 30-second scan.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-secondary/5 rounded-lg border border-secondary/10">
                    <div className="bg-secondary/20 p-2 rounded-full mt-0.5"><Maximize className="h-4 w-4 text-secondary" /></div>
                    <div>
                      <h3 className="text-sm font-semibold text-foreground">3. Proper Framing</h3>
                      <p className="text-xs text-muted-foreground mt-1">Center your face within the camera frame. Remove glasses or masks if possible for better accuracy.</p>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <Link to="/rppg" className="block w-full">
                    <Button className="w-full gap-2 bg-secondary hover:bg-secondary/90 text-secondary-foreground h-12 text-base font-semibold shadow-md">
                      <Camera className="h-5 w-5" />
                      Start Camera Scan
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          )}
        </div>
      </main>

      {/* --- EMERGENCY POP-UP MODAL FOR WARRIORS --- */}
      {incomingAlert && (
        <Dialog open={!!incomingAlert} onOpenChange={(open) => {
          if (!open) {
            setIncomingAlert(null);
            stopAlarm(); // Stop alarm if they click outside the modal to dismiss it
          }
        }}>
          <DialogContent className="sm:max-w-lg border-2 border-destructive shadow-2xl shadow-destructive/20 bg-card">
            <DialogHeader className="mb-2">
              <DialogTitle className="text-2xl font-bold text-destructive flex items-center gap-3 uppercase tracking-wider">
                <AlertTriangle className="h-8 w-8 animate-pulse text-destructive" />
                Critical Emergency!
              </DialogTitle>
              <DialogDescription className="text-foreground text-md mt-2">
                A patient nearby has triggered an SOS and requires immediate medical assistance.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="bg-destructive/10 p-4 rounded-xl border border-destructive/20 shadow-inner">
                <h4 className="font-bold text-destructive mb-2 flex items-center gap-2">
                  <Heart className="h-4 w-4" /> Patient Details
                </h4>
                <div className="text-sm text-foreground space-y-2 font-medium">
                  {incomingAlert.description ? (
                    incomingAlert.description.split(' | ').map((line: string, i: number) => (
                      <div key={i} className="flex bg-background/80 p-2 rounded">{line}</div>
                    ))
                  ) : (
                    <div>Details not provided.</div>
                  )}
                </div>
              </div>

              <div className="w-full h-48 rounded-xl overflow-hidden relative border border-border shadow-sm">
                <iframe 
                  width="100%" 
                  height="100%" 
                  frameBorder="0" 
                  style={{border:0}} 
                  src={`https://maps.google.com/maps?q=${incomingAlert.latitude},${incomingAlert.longitude}&z=16&output=embed`}
                  allowFullScreen
                />
              </div>
            </div>

            <DialogFooter className="mt-6 flex gap-3 sm:justify-between">
              <Button 
                variant="outline" 
                onClick={() => {
                  setIncomingAlert(null);
                  stopAlarm(); // Stop alarm when manually dismissed
                }}
                className="w-full sm:w-auto"
              >
                Dismiss
              </Button>
              <Button 
                variant="destructive" 
                size="lg"
                onClick={() => respondToAlert(incomingAlert.id)}
                className="w-full sm:w-auto gap-2 text-lg shadow-lg hover:shadow-destructive/50"
              >
                <Navigation className="h-5 w-5" />
                Respond & Go To Patient
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

    </div>
  );
};

export default Dashboard;