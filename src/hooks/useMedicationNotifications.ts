import { useEffect, useRef, useCallback } from "react";

export function useMedicationNotifications(medications: any[]) {
  const notifiedRef = useRef<Set<string>>(new Set());

  const requestPermission = useCallback(async () => {
    if (!("Notification" in window)) return false;
    if (Notification.permission === "granted") return true;
    if (Notification.permission === "denied") return false;
    const result = await Notification.requestPermission();
    return result === "granted";
  }, []);

  const checkAndNotify = useCallback(() => {
    if (Notification.permission !== "granted") return;
    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    const today = now.toDateString();

    medications.filter(m => m.active).forEach((med) => {
      (med.schedule_times || []).forEach((time: string) => {
        const key = `${med.id}-${time}-${today}`;
        if (time === currentTime && !notifiedRef.current.has(key)) {
          notifiedRef.current.add(key);
          new Notification("💊 Medication Reminder", {
            body: `Time to take ${med.name}${med.dosage ? ` (${med.dosage})` : ""}`,
            icon: "/favicon.ico",
            tag: key,
          });
        }
      });
    });
  }, [medications]);

  useEffect(() => {
    if (medications.length === 0) return;
    requestPermission();
    const interval = setInterval(checkAndNotify, 30000); // check every 30s
    checkAndNotify();
    return () => clearInterval(interval);
  }, [medications, checkAndNotify, requestPermission]);

  return { requestPermission };
}
