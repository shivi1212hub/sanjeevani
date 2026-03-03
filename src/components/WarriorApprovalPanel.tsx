import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { UserCheck, UserX, Clock, Users, Phone, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const WarriorApprovalPanel = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  const [applications, setApplications] = useState<any[]>([]);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [processing, setProcessing] = useState<string | null>(null);

  useEffect(() => {
    if (user) fetchApplications();
  }, [user]);

  // Realtime updates
  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel("warrior-applications-rt")
      .on("postgres_changes", { event: "*", schema: "public", table: "warrior_applications" }, () => {
        fetchApplications();
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user]);

  const fetchApplications = async () => {
    const { data } = await supabase
      .from("warrior_applications")
      .select("*")
      .order("created_at", { ascending: false });
    setApplications(data || []);
  };

  const handleApprove = async (app: any) => {
    setProcessing(app.id);
    // Update application status
    const { error: updateError } = await supabase
      .from("warrior_applications")
      .update({
        status: "approved",
        reviewed_by: user!.id,
        reviewed_at: new Date().toISOString(),
        admin_notes: notes[app.id] || null,
      })
      .eq("id", app.id);

    if (updateError) {
      toast({ title: t("approval.error"), variant: "destructive" });
      setProcessing(null);
      return;
    }

    // Grant warrior role
    const { error: roleError } = await supabase
      .from("user_roles")
      .insert({ user_id: app.user_id, role: "warrior" as any });

    if (roleError && !roleError.message.includes("duplicate")) {
      toast({ title: t("approval.roleError"), variant: "destructive" });
    } else {
      toast({ title: t("approval.approved") });
    }
    setProcessing(null);
    fetchApplications();
  };

  const handleReject = async (app: any) => {
    setProcessing(app.id);
    const { error } = await supabase
      .from("warrior_applications")
      .update({
        status: "rejected",
        reviewed_by: user!.id,
        reviewed_at: new Date().toISOString(),
        admin_notes: notes[app.id] || null,
      })
      .eq("id", app.id);

    if (error) {
      toast({ title: t("approval.error"), variant: "destructive" });
    } else {
      toast({ title: t("approval.rejected") });
    }
    setProcessing(null);
    fetchApplications();
  };

  const pending = applications.filter(a => a.status === "pending");
  const reviewed = applications.filter(a => a.status !== "pending");

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Users className="h-5 w-5 text-secondary" /> {t("approval.title")}
          {pending.length > 0 && (
            <Badge variant="destructive" className="ml-2">{pending.length} {t("approval.pending")}</Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 max-h-[400px] overflow-y-auto">
        {applications.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">{t("approval.noApplications")}</p>
        ) : (
          applications.map((app) => (
            <div key={app.id} className={`p-3 rounded-lg border ${app.status === "pending" ? "border-warning/50 bg-warning/5" : "border-border bg-muted/30"}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-sm text-foreground">{app.full_name}</span>
                <Badge variant={app.status === "pending" ? "outline" : app.status === "approved" ? "default" : "destructive"}>
                  {app.status === "pending" ? t("approval.statusPending") : app.status === "approved" ? t("approval.statusApproved") : t("approval.statusRejected")}
                </Badge>
              </div>
              <div className="text-xs text-muted-foreground space-y-1 mb-2">
                <p className="flex items-center gap-1"><Phone className="h-3 w-3" /> {app.phone}</p>
                {app.reason && <p className="flex items-center gap-1"><FileText className="h-3 w-3" /> {app.reason}</p>}
                {app.experience && <p className="text-xs">{t("approval.experience")}: {app.experience}</p>}
                <p className="flex items-center gap-1"><Clock className="h-3 w-3" /> {new Date(app.created_at).toLocaleDateString()}</p>
              </div>
              {app.status === "pending" && (
                <div className="space-y-2">
                  <Input
                    placeholder={t("approval.notesPlaceholder")}
                    value={notes[app.id] || ""}
                    onChange={(e) => setNotes(n => ({ ...n, [app.id]: e.target.value }))}
                    className="text-xs h-8"
                  />
                  <div className="flex gap-2">
                    <Button
                      size="sm" className="flex-1 gap-1"
                      onClick={() => handleApprove(app)}
                      disabled={processing === app.id}
                    >
                      <UserCheck className="h-3 w-3" /> {t("approval.approve")}
                    </Button>
                    <Button
                      size="sm" variant="destructive" className="flex-1 gap-1"
                      onClick={() => handleReject(app)}
                      disabled={processing === app.id}
                    >
                      <UserX className="h-3 w-3" /> {t("approval.reject")}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default WarriorApprovalPanel;
