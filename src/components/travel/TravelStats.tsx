
import { TravelEntry } from "@/lib/types";
import { calculateDistance } from "@/lib/travelUtils";
import { Route, MapPin, Calendar } from "lucide-react";

interface TravelStatsProps {
  entries: TravelEntry[];
}

const TravelStats = ({ entries }: TravelStatsProps) => {
  const totalDistance = entries.reduce((sum, entry) => {
    return sum + calculateDistance(entry.from.coords, entry.to.coords);
  }, 0);

  const uniquePlaces = new Set<string>();
  entries.forEach((e) => {
    uniquePlaces.add(e.from.name);
    uniquePlaces.add(e.to.name);
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
        <p className="text-lg font-bold">{uniquePlaces.size}</p>
        <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Places</p>
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
