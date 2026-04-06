import { Star, TrendingUp } from "lucide-react";
import { creditHistory, warriorStats } from "@/data/mockData";

const CreditPoints = () => {
  return (
    <div className="bg-card rounded-xl border border-border shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-heading font-bold text-foreground">Credit Points</h2>
        <div className="flex items-center gap-1.5 text-accent text-sm font-medium">
          <TrendingUp className="w-4 h-4" />
          +215 this week
        </div>
      </div>

      <div className="bg-primary/5 rounded-xl p-5 mb-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-1">
          <Star className="w-6 h-6 text-warning fill-warning" />
          <span className="text-4xl font-heading font-bold text-foreground">
            {warriorStats.creditPoints.toLocaleString()}
          </span>
        </div>
        <p className="text-sm text-muted-foreground">Total Points Earned</p>
        <div className="mt-3 flex items-center justify-center gap-2">
          <span className="text-xs bg-warning/10 text-warning font-semibold px-3 py-1 rounded-full">
            🔥 {warriorStats.streak} day streak
          </span>
        </div>
      </div>

      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
        Recent Activity
      </h3>
      <div className="space-y-3">
        {creditHistory.map((entry) => (
          <div key={entry.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
            <div>
              <p className="text-sm font-medium text-foreground">{entry.description}</p>
              <p className="text-xs text-muted-foreground">{entry.date}</p>
            </div>
            <span
              className={`text-sm font-bold ${entry.type === "bonus" ? "text-warning" : "text-accent"}`}
            >
              +{entry.points}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CreditPoints;
