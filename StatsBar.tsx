import { Shield, Star, Zap, Trophy } from "lucide-react";
import { warriorStats } from "@/data/mockData";

const stats = [
  {
    label: "Credit Points",
    value: warriorStats.creditPoints.toLocaleString(),
    icon: Star,
    accent: "text-warning",
    bgAccent: "bg-warning/10",
  },
  {
    label: "Missions Done",
    value: warriorStats.missionsCompleted,
    icon: Shield,
    accent: "text-accent",
    bgAccent: "bg-accent/10",
  },
  {
    label: "Active Now",
    value: warriorStats.activeMissions,
    icon: Zap,
    accent: "text-primary",
    bgAccent: "bg-primary/10",
  },
  {
    label: "Rank",
    value: warriorStats.rank,
    icon: Trophy,
    accent: "text-warning",
    bgAccent: "bg-warning/10",
  },
];

const StatsBar = () => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-card rounded-xl p-5 border border-border shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className={`${stat.bgAccent} p-2.5 rounded-lg`}>
              <stat.icon className={`w-5 h-5 ${stat.accent}`} />
            </div>
          </div>
          <p className="text-2xl font-heading font-bold text-foreground">{stat.value}</p>
          <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
        </div>
      ))}
    </div>
  );
};

export default StatsBar;
