
import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LocationInput } from "./LocationInput";
import { TravelEntry, TravelLocation, TravelMode } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bike, Bus, Car, Plane, Train, Footprints } from "lucide-react";

interface TravelFormProps {
  onAdd: (entry: Omit<TravelEntry, "id">) => void;
}

const travelModes: { value: TravelMode, label: string, icon: React.FC<any> }[] = [
    { value: 'bike', label: 'Bike', icon: Bike },
    { value: 'car', label: 'Car', icon: Car },
    { value: 'bus', label: 'Bus', icon: Bus },
    { value: 'train', label: 'Train', icon: Train },
    { value: 'flight', label: 'Flight', icon: Plane },
    { value: 'walk', label: 'Walk', icon: Footprints },
]

const TravelForm = ({ onAdd }: TravelFormProps) => {
  const [date, setDate] = useState<string>("");
  const [from, setFrom] = useState<TravelLocation | null>(null);
  const [to, setTo] = useState<TravelLocation | null>(null);
  const [mode, setMode] = useState<TravelMode | "">("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !from || !to || !mode) {
      toast({
        title: "Missing Information",
        description: "Please select a date, from/to locations, and a mode of transport.",
        variant: "destructive",
      });
      return;
    }

    onAdd({
      date: date,
      from,
      to,
      mode,
    });

    // Reset form
    setDate("");
    setFrom(null);
    setTo(null);
    setMode("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="date" className="text-xs font-medium">
            Travel Date
          </Label>
           <Input 
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="h-9"
            />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-medium">Mode of Transport</Label>
          <Select value={mode} onValueChange={(value) => setMode(value as TravelMode)}>
            <SelectTrigger className="h-9">
              <SelectValue placeholder="Select mode" />
            </SelectTrigger>
            <SelectContent>
              {travelModes.map(m => {
                const Icon = m.icon;
                return (
                  <SelectItem key={m.value} value={m.value}>
                    <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4 text-muted-foreground" />
                        <span>{m.label}</span>
                    </div>
                  </SelectItem>
                )
              })}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-1.5">
          <Label className="text-xs font-medium">From</Label>
          <LocationInput
            value={from}
            onValueChange={setFrom}
            placeholder="Search for a city or place..."
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-medium">To</Label>
          <LocationInput
            value={to}
            onValueChange={setTo}
            placeholder="Search for a city or place..."
          />
        </div>
      </div>

      <Button type="submit" className="w-full">
        <Plus className="h-4 w-4 mr-2" />
        Add Journey
      </Button>
    </form>
  );
};

export default TravelForm;
