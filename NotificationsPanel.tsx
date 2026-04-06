import { Bell } from "lucide-react";
import { notifications } from "@/data/mockData";
import NotificationCard from "./NotificationCard";

const NotificationsPanel = () => {
  const newCount = notifications.filter((n) => n.isNew).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-heading font-bold text-foreground">Patient Alerts</h2>
          {newCount > 0 && (
            <span className="bg-primary text-primary-foreground text-xs font-bold px-2.5 py-1 rounded-full">
              {newCount} new
            </span>
          )}
        </div>
        <Bell className="w-5 h-5 text-muted-foreground" />
      </div>
      <div className="space-y-4">
        {notifications.map((n) => (
          <NotificationCard key={n.id} notification={n} />
        ))}
      </div>
    </div>
  );
};

export default NotificationsPanel;
