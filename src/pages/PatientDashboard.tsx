import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageToggle } from "@/components/LanguageToggle";
import {
  AlertTriangle, Heart, Activity, User, LogOut, MapPin, Phone,
  Droplets, Shield, Clock, CheckCircle, XCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const PatientDashboard = () => {
  const { t } = useLanguage();
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profile, setProfile] = useState<any>(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "", phone: "", blood_group: "", allergies: "",
    medical_conditions: "", emergency_contact: "",
  });
  const [activeAlert, setActiveAlert] = useState<any>(null);
  const [vitals, setVitals] = useState<any[]>([]);
  const [sosLoading, setSosLoading] = useState(false);

  useEffect(() => {
    if (!loading && !user) navigate("/auth");
  }, [user, loading]);

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchActiveAlert();
      fetchVitals();
    }
  }, [user]);

  // Realtime SOS updates
  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel("patient-sos")
      .on("postgres_changes", {
        event: "*", schema: "public", table: "sos_alerts",
        filter: `patient_id=eq.${user.id}`,
      }, (payload) => {
        setActiveAlert(payload.new);
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user]);

  const fetchProfile = async () => {
    const { data } = await supabase.from("profiles").select("*").eq("user_id", user!.id).single();
    if (data) {
      setProfile(data);
      setFormData({
        full_name: data.full_name || "",
        phone: data.phone || "",
        blood_group: data.blood_group || "",
        allergies: data.allergies || "",
        medical_conditions: data.medical_conditions || "",
        emergency_contact: data.emergency_contact || "",
      });
    }
  };

  const fetchActiveAlert = async () => {
    const { data } = await supabase
      .from("sos_alerts").select("*")
      .eq("patient_id", user!.id)
      .in("status", ["active", "assigned"])
      .order("created_at", { ascending: false }).limit(1).maybeSingle();
    setActiveAlert(data);
  };

  const fetchVitals = async () => {
    const { data } = await supabase
      .from("vitals_stream").select("*")
      .eq("user_id", user!.id)
      .order("created_at", { ascending: false }).limit(10);
    setVitals(data || []);
  };

  const updateProfile = async () => {
    const { error } = await supabase.from("profiles").update(formData).eq("user_id", user!.id);
    if (error) {
      toast({ title: t("patient.updateError"), variant: "destructive" });
    } else {
      toast({ title: t("patient.updateSuccess") });
      setEditing(false);
      fetchProfile();
    }
  };

  const triggerSOS = async () => {
    setSosLoading(true);
    try {
      let lat = 28.6139, lng = 77.2090; // Default Delhi
      try {
        const pos = await new Promise<GeolocationPosition>((resolve, reject) =>
          navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 })
        );
        lat = pos.coords.latitude;
        lng = pos.coords.longitude;
      } catch {}

      const { error } = await supabase.from("sos_alerts").insert({
        patient_id: user!.id, latitude: lat, longitude: lng, status: "active",
      });
      if (error) throw error;
      toast({ title: t("patient.sosTriggered"), description: t("patient.sosTriggeredDesc") });
      fetchActiveAlert();
    } catch (error: any) {
      toast({ title: t("patient.sosError"), description: error.message, variant: "destructive" });
    } finally { setSosLoading(false); }
  };

  const cancelSOS = async () => {
    if (!activeAlert) return;
    await supabase.from("sos_alerts").update({ status: "cancelled" }).eq("id", activeAlert.id);
    setActiveAlert(null);
    toast({ title: t("patient.sosCancelled") });
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-background"><div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" /></div>;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card/95 backdrop-blur-md shadow-soft border-b border-border">
        <div className="flex items-center justify-between h-14 px-4">
          <div className="flex items-center gap-3">
            <User className="h-6 w-6 text-primary" />
            <h1 className="font-bold text-foreground">{t("patient.dashboard")}</h1>
          </div>
          <div className="flex items-center gap-2">
            <LanguageToggle />
            <ThemeToggle />
            <Button variant="ghost" size="sm" onClick={() => navigate("/rppg")} className="gap-1">
              <Activity className="h-4 w-4" /> rPPG
            </Button>
            <Button variant="ghost" size="sm" onClick={() => { signOut(); navigate("/"); }} className="gap-1">
              <LogOut className="h-4 w-4" /> {t("patient.logout")}
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 space-y-6">
        {/* SOS Section */}
        <Card className={`border-2 ${activeAlert ? "border-destructive animate-pulse-emergency" : "border-destructive/30"}`}>
          <CardContent className="p-6 text-center space-y-4">
            {activeAlert ? (
              <>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-destructive/10 text-destructive font-bold">
                  <AlertTriangle className="h-5 w-5" />
                  {activeAlert.status === "assigned" ? t("patient.warriorAssigned") : t("patient.sosActive")}
                </div>
                <p className="text-muted-foreground">{t("patient.sosActiveDesc")}</p>
                <Button variant="outline" onClick={cancelSOS} className="gap-2">
                  <XCircle className="h-4 w-4" /> {t("patient.cancelSos")}
                </Button>
              </>
            ) : (
              <>
                <p className="text-muted-foreground font-medium">{t("patient.sosPrompt")}</p>
                <Button
                  variant="sos" size="sos"
                  onClick={triggerSOS} disabled={sosLoading}
                  className="mx-auto"
                >
                  <AlertTriangle className="h-8 w-8" />
                  SOS
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        {/* Profile Section */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" /> {t("patient.healthProfile")}
              </CardTitle>
              <CardDescription>{t("patient.healthProfileDesc")}</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={() => editing ? updateProfile() : setEditing(true)}>
              {editing ? t("patient.save") : t("patient.edit")}
            </Button>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { key: "full_name", icon: User, label: t("patient.name") },
              { key: "phone", icon: Phone, label: t("patient.phone") },
              { key: "blood_group", icon: Droplets, label: t("patient.bloodGroup") },
              { key: "allergies", icon: AlertTriangle, label: t("patient.allergies") },
              { key: "medical_conditions", icon: Heart, label: t("patient.conditions") },
              { key: "emergency_contact", icon: Shield, label: t("patient.emergencyContact") },
            ].map(({ key, icon: Icon, label }) => (
              <div key={key} className="space-y-1">
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                  <Icon className="h-3 w-3" /> {label}
                </label>
                {editing ? (
                  <Input
                    value={(formData as any)[key]}
                    onChange={(e) => setFormData((f) => ({ ...f, [key]: e.target.value }))}
                  />
                ) : (
                  <p className="text-sm text-foreground">{(profile as any)?.[key] || "—"}</p>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Vitals */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" /> {t("patient.recentVitals")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {vitals.length === 0 ? (
              <p className="text-muted-foreground text-sm text-center py-4">{t("patient.noVitals")}</p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {vitals.slice(0, 5).map((v) => (
                  <div key={v.id} className="p-3 rounded-lg bg-muted text-center">
                    <Heart className="h-4 w-4 mx-auto text-destructive mb-1" />
                    <p className="text-lg font-bold text-foreground">{v.heart_rate}</p>
                    <p className="text-xs text-muted-foreground">BPM</p>
                  </div>
                ))}
              </div>
            )}
            <Button variant="outline" size="sm" className="mt-4 w-full" onClick={() => navigate("/rppg")}>
              <Activity className="h-4 w-4 mr-2" /> {t("patient.measureNow")}
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default PatientDashboard;
