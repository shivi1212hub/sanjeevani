import { Heart, Menu } from "lucide-react";
import { warriorStats } from "@/data/mockData";

const DashboardHeader = () => {
  return (
    <header className="bg-card border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-primary p-2 rounded-lg">
            <Heart className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-heading font-bold text-foreground tracking-tight">
              Sanjeevani
            </h1>
            <p className="text-xs text-muted-foreground">Warrior Dashboard</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:block text-right">
            <p className="text-sm font-semibold text-foreground">{warriorStats.name}</p>
            <p className="text-xs text-accent font-medium">{warriorStats.rank}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-sm font-bold text-primary">
              {warriorStats.name.split(" ").map(n => n[0]).join("")}
            </span>
          </div>
          <button className="sm:hidden p-2 text-muted-foreground">
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
