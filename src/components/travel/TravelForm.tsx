
import { useState } from "react";
import { Plus, Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LocationInput } from "./LocationInput";
import { TravelEntry, TravelLocation } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface TravelFormProps {
  onAdd: (entry: Omit<TravelEntry, "id">) => void;
}

const TravelForm = ({ onAdd }: TravelFormProps) => {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [from, setFrom] = useState<TravelLocation | null>(null);
  const [to, setTo] = useState<TravelLocation | null>(null);
  const [notes, setNotes] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !from || !to) {
      toast({
        title: "Missing Information",
        description: "Please select a date, a 'From' location, and a 'To' location.",
        variant: "destructive",
      });
      return;
    }

    onAdd({
      date: format(date, "yyyy-MM-dd"),
      from,
      to,
      notes: notes || undefined,
    });

    // Reset form
    setDate(undefined);
    setFrom(null);
    setTo(null);
    setNotes("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="date" className="text-xs font-medium">
            Travel Date
          </Label>
           <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full h-9 justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-medium">Notes (optional)</Label>
          <Input
            placeholder="e.g., Road trip"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="h-9"
          />
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
