import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  CalendarDays, CheckCircle, XCircle, Clock, ChevronLeft, ChevronRight,
  Pill, TrendingUp, SkipForward
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, isBefore, startOfDay } from "date-fns";

interface MedicationLog {
  id: string;
  medication_id: string;
  scheduled_time: string;
  scheduled_date: string;
  status: string;
  taken_at: string | null;
}

interface Medication {
  id: string;
  name: string;
  dosage: string | null;
  schedule_times: string[];
  active: boolean;
}

const MedicationAdherence = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [logs, setLogs] = useState<MedicationLog[]>([]);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchMedications();
    }
  }, [user]);

  useEffect(() => {
    if (user) fetchLogs();
  }, [user, currentMonth]);

  const fetchMedications = async () => {
    const { data } = await supabase
      .from("medications")
      .select("*")
      .eq("user_id", user!.id)
      .eq("active", true);
    setMedications((data as Medication[]) || []);
  };

  const fetchLogs = async () => {
    const start = format(startOfMonth(currentMonth), "yyyy-MM-dd");
    const end = format(endOfMonth(currentMonth), "yyyy-MM-dd");
    const { data } = await supabase
      .from("medication_logs")
      .select("*")
      .eq("user_id", user!.id)
      .gte("scheduled_date", start)
      .lte("scheduled_date", end);
    setLogs((data as MedicationLog[]) || []);
    setLoading(false);
  };

  const logDose = async (medicationId: string, scheduledTime: string, date: Date, status: "taken" | "skipped") => {
    const dateStr = format(date, "yyyy-MM-dd");
    const existing = logs.find(
      (l) => l.medication_id === medicationId && l.scheduled_date === dateStr && l.scheduled_time === scheduledTime
    );

    if (existing) {
      await supabase
        .from("medication_logs")
        .update({ status, taken_at: status === "taken" ? new Date().toISOString() : null })
        .eq("id", existing.id);
    } else {
      await supabase.from("medication_logs").insert({
        user_id: user!.id,
        medication_id: medicationId,
        scheduled_time: scheduledTime,
        scheduled_date: dateStr,
        status,
        taken_at: status === "taken" ? new Date().toISOString() : null,
      });
    }

    toast({ title: status === "taken" ? t("adherence.markedTaken") : t("adherence.markedSkipped") });
    fetchLogs();
  };

  // Calculate day status for calendar coloring
  const dayStatusMap = useMemo(() => {
    const map: Record<string, "all-taken" | "partial" | "missed" | "none"> = {};
    const days = eachDayOfInterval({
      start: startOfMonth(currentMonth),
      end: endOfMonth(currentMonth),
    });

    for (const day of days) {
      const dateStr = format(day, "yyyy-MM-dd");
      const dayLogs = logs.filter((l) => l.scheduled_date === dateStr);

      // Calculate expected doses for this day
      const expectedDoses = medications.reduce((sum, med) => sum + (med.schedule_times?.length || 0), 0);

      if (expectedDoses === 0) {
        map[dateStr] = "none";
        continue;
      }

      const taken = dayLogs.filter((l) => l.status === "taken").length;
      const total = dayLogs.length;

      if (isBefore(startOfDay(day), startOfDay(new Date())) && total === 0) {
        map[dateStr] = "missed";
      } else if (taken === expectedDoses && taken > 0) {
        map[dateStr] = "all-taken";
      } else if (taken > 0) {
        map[dateStr] = "partial";
      } else if (dayLogs.some((l) => l.status === "missed" || l.status === "skipped")) {
        map[dateStr] = "missed";
      } else {
        map[dateStr] = "none";
      }
    }
    return map;
  }, [logs, medications, currentMonth]);

  // Doses for selected date
  const selectedDateStr = format(selectedDate, "yyyy-MM-dd");
  const selectedDayDoses = useMemo(() => {
    return medications.flatMap((med) =>
      (med.schedule_times || []).map((time) => {
        const log = logs.find(
          (l) => l.medication_id === med.id && l.scheduled_date === selectedDateStr && l.scheduled_time === time
        );
        return {
          medication: med,
          time,
          status: log?.status || (isBefore(startOfDay(selectedDate), startOfDay(new Date())) ? "missed" : "pending"),
          logId: log?.id,
        };
      })
    ).sort((a, b) => a.time.localeCompare(b.time));
  }, [medications, logs, selectedDateStr, selectedDate]);

  // Adherence stats for the month
  const stats = useMemo(() => {
    const totalExpected = Object.values(dayStatusMap).filter((s) => s !== "none").length;
    const taken = Object.values(dayStatusMap).filter((s) => s === "all-taken").length;
    const partial = Object.values(dayStatusMap).filter((s) => s === "partial").length;
    const rate = totalExpected > 0 ? Math.round(((taken + partial * 0.5) / totalExpected) * 100) : 0;
    return { taken, partial, rate };
  }, [dayStatusMap]);

  const prevMonth = () => setCurrentMonth((d) => new Date(d.getFullYear(), d.getMonth() - 1));
  const nextMonth = () => setCurrentMonth((d) => new Date(d.getFullYear(), d.getMonth() + 1));

  if (loading || medications.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-primary" /> {t("adherence.title")}
            </CardTitle>
            <CardDescription>{t("adherence.description")}</CardDescription>
          </div>
          <div className="flex items-center gap-1">
            <Badge variant="outline" className="gap-1 text-success border-success/30">
              <TrendingUp className="h-3 w-3" />
              {stats.rate}% {t("adherence.rate")}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Month navigation */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={prevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="font-medium text-foreground">
            {format(currentMonth, "MMMM yyyy")}
          </span>
          <Button variant="ghost" size="icon" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1 text-center">
          {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
            <div key={d} className="text-xs font-medium text-muted-foreground py-1">{d}</div>
          ))}
          {(() => {
            const monthStart = startOfMonth(currentMonth);
            const monthEnd = endOfMonth(currentMonth);
            const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
            const startPadding = monthStart.getDay();
            const cells = [];

            for (let i = 0; i < startPadding; i++) {
              cells.push(<div key={`pad-${i}`} />);
            }

            for (const day of days) {
              const dateStr = format(day, "yyyy-MM-dd");
              const status = dayStatusMap[dateStr] || "none";
              const isSelected = isSameDay(day, selectedDate);
              const isCurrentDay = isToday(day);

              cells.push(
                <button
                  key={dateStr}
                  onClick={() => setSelectedDate(day)}
                  className={cn(
                    "relative h-9 w-full rounded-md text-sm transition-all",
                    isSelected && "ring-2 ring-primary",
                    isCurrentDay && "font-bold",
                    status === "all-taken" && "bg-success/20 text-success hover:bg-success/30",
                    status === "partial" && "bg-warning/20 text-warning hover:bg-warning/30",
                    status === "missed" && "bg-destructive/15 text-destructive hover:bg-destructive/25",
                    status === "none" && "text-foreground hover:bg-muted",
                  )}
                >
                  {day.getDate()}
                  {status === "all-taken" && (
                    <CheckCircle className="h-2.5 w-2.5 absolute bottom-0.5 right-0.5 text-success" />
                  )}
                  {status === "missed" && !isSameDay(day, new Date()) && (
                    <XCircle className="h-2.5 w-2.5 absolute bottom-0.5 right-0.5 text-destructive" />
                  )}
                </button>
              );
            }

            return cells;
          })()}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded bg-success/20 border border-success/30" /> {t("adherence.taken")}
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded bg-warning/20 border border-warning/30" /> {t("adherence.partial")}
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded bg-destructive/15 border border-destructive/30" /> {t("adherence.missed")}
          </span>
        </div>

        {/* Selected day doses */}
        <div className="border-t border-border pt-3">
          <p className="text-sm font-medium text-foreground mb-2">
            {isToday(selectedDate)
              ? t("adherence.today")
              : format(selectedDate, "MMM d, yyyy")}
          </p>
          {selectedDayDoses.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-3">{t("adherence.noDoses")}</p>
          ) : (
            <div className="space-y-2">
              {selectedDayDoses.map((dose, i) => (
                <div
                  key={`${dose.medication.id}-${dose.time}-${i}`}
                  className={cn(
                    "flex items-center justify-between p-2.5 rounded-lg border",
                    dose.status === "taken" && "border-success/30 bg-success/5",
                    dose.status === "missed" && "border-destructive/30 bg-destructive/5",
                    dose.status === "skipped" && "border-muted bg-muted/50",
                    dose.status === "pending" && "border-border bg-card",
                  )}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <Pill className="h-3.5 w-3.5 text-primary shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {dose.medication.name}
                        {dose.medication.dosage && (
                          <span className="text-muted-foreground font-normal"> · {dose.medication.dosage}</span>
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-2.5 w-2.5" /> {dose.time}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    {dose.status === "taken" ? (
                      <Badge variant="outline" className="text-success border-success/30 text-xs gap-1">
                        <CheckCircle className="h-3 w-3" /> {t("adherence.taken")}
                      </Badge>
                    ) : dose.status === "skipped" ? (
                      <Badge variant="outline" className="text-muted-foreground text-xs gap-1">
                        <SkipForward className="h-3 w-3" /> {t("adherence.skipped")}
                      </Badge>
                    ) : dose.status === "missed" ? (
                      <Badge variant="outline" className="text-destructive border-destructive/30 text-xs gap-1">
                        <XCircle className="h-3 w-3" /> {t("adherence.missed")}
                      </Badge>
                    ) : (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs gap-1 text-success border-success/30 hover:bg-success/10"
                          onClick={() => logDose(dose.medication.id, dose.time, selectedDate, "taken")}
                        >
                          <CheckCircle className="h-3 w-3" /> {t("adherence.take")}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 text-xs gap-1 text-muted-foreground"
                          onClick={() => logDose(dose.medication.id, dose.time, selectedDate, "skipped")}
                        >
                          <SkipForward className="h-3 w-3" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MedicationAdherence;
