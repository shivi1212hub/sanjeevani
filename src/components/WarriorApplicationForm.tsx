import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Shield, CheckCircle, Clock, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const WarriorApplicationForm = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  const [application, setApplication] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ full_name: "", phone: "", reason: "", experience: "" });

  useEffect(() => {
    if (user) fetchApplication();
  }, [user]);

  const fetchApplication = async () => {
    const { data } = await supabase
      .from("warrior_applications")
      .select("*")
      .eq("user_id", user!.id)
      .maybeSingle();
    setApplication(data);
    setLoading(false);
  };

  const submitApplication = async () => {
    if (!form.full_name || !form.phone) {
      toast({ title: t("apply.fillRequired"), variant: "destructive" });
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("warrior_applications").insert({
      user_id: user!.id,
      full_name: form.full_name,
      phone: form.phone,
      reason: form.reason,
      experience: form.experience,
    });
    if (error) {
      toast({ title: t("apply.error"), description: error.message, variant: "destructive" });
    } else {
      toast({ title: t("apply.submitted") });
      fetchApplication();
    }
    setSubmitting(false);
  };

  if (loading) return null;

  // Already applied
  if (application) {
    const statusConfig: Record<string, { icon: any; color: string; label: string }> = {
      pending: { icon: Clock, color: "text-warning", label: t("apply.statusPending") },
      approved: { icon: CheckCircle, color: "text-green-500", label: t("apply.statusApproved") },
      rejected: { icon: XCircle, color: "text-destructive", label: t("apply.statusRejected") },
    };
    const cfg = statusConfig[application.status] || statusConfig.pending;
    const Icon = cfg.icon;

    return (
      <Card className="border border-secondary/30 bg-secondary/5">
        <CardContent className="p-6">
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8 text-secondary" />
            <div className="flex-1">
              <p className="font-semibold text-foreground">{t("apply.applicationStatus")}</p>
              <div className="flex items-center gap-2 mt-1">
                <Icon className={`h-4 w-4 ${cfg.color}`} />
                <span className={`text-sm font-medium ${cfg.color}`}>{cfg.label}</span>
              </div>
              {application.admin_notes && (
                <p className="text-xs text-muted-foreground mt-2">{application.admin_notes}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Application form
  return (
    <Card className="border border-secondary/30 bg-secondary/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-secondary" /> {t("apply.title")}
        </CardTitle>
        <CardDescription>{t("apply.description")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-medium text-muted-foreground">{t("apply.fullName")} *</label>
            <Input value={form.full_name} onChange={(e) => setForm(f => ({ ...f, full_name: e.target.value }))} />
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">{t("apply.phone")} *</label>
            <Input value={form.phone} onChange={(e) => setForm(f => ({ ...f, phone: e.target.value }))} />
          </div>
        </div>
        <div>
          <label className="text-sm font-medium text-muted-foreground">{t("apply.reason")}</label>
          <Textarea value={form.reason} onChange={(e) => setForm(f => ({ ...f, reason: e.target.value }))} rows={2} />
        </div>
        <div>
          <label className="text-sm font-medium text-muted-foreground">{t("apply.experience")}</label>
          <Textarea value={form.experience} onChange={(e) => setForm(f => ({ ...f, experience: e.target.value }))} rows={2} />
        </div>
        <Button onClick={submitApplication} disabled={submitting} className="w-full gap-2">
          <Shield className="h-4 w-4" /> {submitting ? t("auth.loading") : t("apply.submit")}
        </Button>
      </CardContent>
    </Card>
  );
};

export default WarriorApplicationForm;
