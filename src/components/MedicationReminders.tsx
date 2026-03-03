import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import { useMedicationNotifications } from "@/hooks/useMedicationNotifications";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Pill, Plus, Trash2, Bell, BellOff, Clock, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const MedicationReminders = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  const [medications, setMedications] = useState<any[]>([]);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ name: "", dosage: "", notes: "" });
  const [times, setTimes] = useState<string[]>([""]);
  const [loading, setLoading] = useState(true);

  const { requestPermission } = useMedicationNotifications(medications);

  useEffect(() => {
    if (user) fetchMedications();
  }, [user]);

  const fetchMedications = async () => {
    const { data } = await supabase
      .from("medications")
      .select("*")
      .eq("user_id", user!.id)
      .order("created_at", { ascending: false });
    setMedications(data || []);
    setLoading(false);
  };

  const addMedication = async () => {
    if (!form.name.trim()) {
      toast({ title: t("meds.nameRequired"), variant: "destructive" });
      return;
    }
    const validTimes = times.filter(t => t.trim());
    if (validTimes.length === 0) {
      toast({ title: t("meds.timeRequired"), variant: "destructive" });
      return;
    }

    const { error } = await supabase.from("medications").insert({
      user_id: user!.id,
      name: form.name,
      dosage: form.dosage || null,
      schedule_times: validTimes,
      notes: form.notes || null,
    });

    if (error) {
      toast({ title: t("meds.addError"), variant: "destructive" });
    } else {
      toast({ title: t("meds.added") });
      setForm({ name: "", dosage: "", notes: "" });
      setTimes([""]);
      setAdding(false);
      fetchMedications();
      requestPermission();
    }
  };

  const toggleActive = async (med: any) => {
    await supabase.from("medications").update({ active: !med.active }).eq("id", med.id);
    fetchMedications();
  };

  const deleteMedication = async (id: string) => {
    await supabase.from("medications").delete().eq("id", id);
    toast({ title: t("meds.deleted") });
    fetchMedications();
  };

  const addTimeSlot = () => setTimes([...times, ""]);
  const removeTimeSlot = (i: number) => setTimes(times.filter((_, idx) => idx !== i));
  const updateTime = (i: number, val: string) => setTimes(times.map((t, idx) => idx === i ? val : t));

  const notificationsSupported = "Notification" in window;
  const notificationsEnabled = notificationsSupported && Notification.permission === "granted";

  if (loading) return null;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Pill className="h-5 w-5 text-primary" /> {t("meds.title")}
          </CardTitle>
          <CardDescription>{t("meds.description")}</CardDescription>
        </div>
        <div className="flex items-center gap-2">
          {notificationsSupported && (
            <Button
              variant="ghost" size="icon"
              onClick={requestPermission}
              title={notificationsEnabled ? t("meds.notificationsOn") : t("meds.enableNotifications")}
            >
              {notificationsEnabled
                ? <Bell className="h-4 w-4 text-green-500" />
                : <BellOff className="h-4 w-4 text-muted-foreground" />}
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={() => setAdding(!adding)} className="gap-1">
            <Plus className="h-3 w-3" /> {t("meds.add")}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Add Form */}
        {adding && (
          <div className="p-3 rounded-lg border border-primary/20 bg-primary/5 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-medium text-muted-foreground">{t("meds.medName")} *</label>
                <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Paracetamol" />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">{t("meds.dosage")}</label>
                <Input value={form.dosage} onChange={e => setForm(f => ({ ...f, dosage: e.target.value }))} placeholder="e.g. 500mg" />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">{t("meds.scheduleTimes")} *</label>
              <div className="space-y-2 mt-1">
                {times.map((time, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    <Input
                      type="time" value={time}
                      onChange={e => updateTime(i, e.target.value)}
                      className="w-32"
                    />
                    {times.length > 1 && (
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => removeTimeSlot(i)}>
                        <X className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button variant="ghost" size="sm" onClick={addTimeSlot} className="text-xs gap-1">
                  <Plus className="h-3 w-3" /> {t("meds.addTime")}
                </Button>
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">{t("meds.notes")}</label>
              <Input value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder={t("meds.notesPlaceholder")} />
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={addMedication} className="flex-1">{t("meds.save")}</Button>
              <Button size="sm" variant="ghost" onClick={() => setAdding(false)}>{t("meds.cancel")}</Button>
            </div>
          </div>
        )}

        {/* Medication List */}
        {medications.length === 0 && !adding ? (
          <p className="text-sm text-muted-foreground text-center py-4">{t("meds.empty")}</p>
        ) : (
          medications.map((med) => (
            <div key={med.id} className={`flex items-center gap-3 p-3 rounded-lg border ${med.active ? "border-border bg-card" : "border-border/50 bg-muted/30 opacity-60"}`}>
              <Switch checked={med.active} onCheckedChange={() => toggleActive(med)} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm text-foreground truncate">{med.name}</span>
                  {med.dosage && <Badge variant="outline" className="text-[10px]">{med.dosage}</Badge>}
                </div>
                <div className="flex items-center gap-1 mt-0.5 flex-wrap">
                  {(med.schedule_times || []).map((time: string, i: number) => (
                    <span key={i} className="text-xs text-muted-foreground flex items-center gap-0.5">
                      <Clock className="h-2.5 w-2.5" /> {time}
                    </span>
                  ))}
                </div>
                {med.notes && <p className="text-xs text-muted-foreground mt-0.5">{med.notes}</p>}
              </div>
              <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive/60 hover:text-destructive" onClick={() => deleteMedication(med.id)}>
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default MedicationReminders;
