import { MapPin, Clock, AlertTriangle, ChevronRight } from "lucide-react";
import { Notification } from "@/data/mockData";
import { Button } from "@/components/ui/button";

const urgencyStyles = {
  critical: "border-l-primary bg-primary/5",
  moderate: "border-l-warning bg-warning/5",
  low: "border-l-accent bg-accent/5",
};

const urgencyBadge = {
  critical: "bg-primary text-primary-foreground",
  moderate: "bg-warning text-warning-foreground",
  low: "bg-accent text-accent-foreground",
};

const NotificationCard = ({ notification }: { notification: Notification }) => {
  return (
    <div
      className={`relative bg-card rounded-xl border border-border shadow-sm p-5 border-l-4 ${urgencyStyles[notification.urgency]} hover:shadow-md transition-all`}
    >
      {notification.isNew && (
        <span className="absolute top-4 right-4 w-2.5 h-2.5 bg-primary rounded-full animate-pulse" />
      )}

      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wide ${urgencyBadge[notification.urgency]}`}>
              {notification.urgency}
            </span>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              {notification.timestamp}
            </span>
          </div>

          <h3 className="font-heading font-semibold text-foreground text-lg mb-1">
            {notification.patientName}
          </h3>

          <p className="text-sm text-muted-foreground mb-3 flex items-start gap-1">
            <AlertTriangle className="w-3.5 h-3.5 mt-0.5 shrink-0 text-primary" />
            {notification.issue}
          </p>

          <div className="flex items-start gap-1.5 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-accent" />
            <div>
              <p>{notification.address}</p>
              <p className="text-xs mt-0.5 font-medium text-foreground">{notification.distance} away</p>
            </div>
          </div>
        </div>

        <Button size="sm" className="shrink-0 mt-2">
          Respond <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  );
};

export default NotificationCard;
