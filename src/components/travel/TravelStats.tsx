import { TravelEntry } from "@/lib/types";
import { getStateByCode, calculateDistance } from "@/data/stateData";
import { Route, MapPin, Calendar } from "lucide-react";

interface TravelStatsProps {
  entries: TravelEntry[];
}

const TravelStats = ({ entries }: TravelStatsProps) => {
  const totalDistance = entries.reduce((sum, entry) => {
    const from = getStateByCode(entry.fromState);
    const to = getStateByCode(entry.toState);
    if (from && to) {
      return (
        sum +
        calculateDistance(from.center[0], from.center[1], to.center[0], to.center[1])
      );
    }
    return sum;
  }, 0);

  const uniqueStates = new Set<string>();
  entries.forEach((e) => {
    uniqueStates.add(e.fromState);
    uniqueStates.add(e.toState);
  });

  return (
    <div className="grid grid-cols-3 gap-2">
      <div className="rounded-lg bg-primary/10 p-3 text-center">
        <Route className="h-4 w-4 mx-auto mb-1 text-primary" />
        <p className="text-lg font-bold text-primary">{totalDistance.toLocaleString()}</p>
        <p className="text-[10px] text-muted-foreground uppercase tracking-wide">km traveled</p>
      </div>
      <div className="rounded-lg bg-secondary/10 p-3 text-center">
        <MapPin className="h-4 w-4 mx-auto mb-1 text-secondary-foreground" />
        <p className="text-lg font-bold">{uniqueStates.size}</p>
        <p className="text-[10px] text-muted-foreground uppercase tracking-wide">States</p>
      </div>
      <div className="rounded-lg bg-accent/10 p-3 text-center">
        <Calendar className="h-4 w-4 mx-auto mb-1 text-accent-foreground" />
        <p className="text-lg font-bold">{entries.length}</p>
        <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Journeys</p>
      </div>
    </div>
  );
};

export default TravelStats;
