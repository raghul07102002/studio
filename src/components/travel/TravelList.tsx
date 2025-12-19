
import { format, parseISO } from "date-fns";
import { Trash2, MapPin, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TravelEntry } from "@/lib/types";
import { calculateDistance } from "@/lib/travelUtils";
import { ScrollArea } from "../ui/scroll-area";

interface TravelListProps {
  entries: TravelEntry[];
  onDelete: (id: string) => void;
}

const TravelList = ({ entries, onDelete }: TravelListProps) => {
  if (entries.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <MapPin className="h-10 w-10 mx-auto mb-2 opacity-30" />
        <p className="text-sm">No travel entries yet</p>
        <p className="text-xs">Add your first journey above</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-72 w-full pr-4">
      <div className="space-y-2">
        {entries.map((entry) => {
          const distance = calculateDistance(entry.from.coords, entry.to.coords);

          return (
            <div
              key={entry.id}
              className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border border-border group hover:bg-muted transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 text-sm font-medium">
                  <span className="truncate">{entry.from.name}</span>
                  <ArrowRight className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                  <span className="truncate">{entry.to.name}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                  <span>{format(parseISO(entry.date), "MMM d, yyyy")}</span>
                  <span>•</span>
                  <span className="text-primary font-medium">{distance} km</span>
                  {entry.notes && (
                    <>
                      <span>•</span>
                      <span className="truncate">{entry.notes}</span>
                    </>
                  )}
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => onDelete(entry.id)}
              >
                <Trash2 className="h-3.5 w-3.5 text-destructive" />
              </Button>
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
};

export default TravelList;
