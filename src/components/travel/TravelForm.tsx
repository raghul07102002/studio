import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { indianStates } from "@/data/stateData";
import { TravelEntry } from "@/lib/types";

interface TravelFormProps {
  onAdd: (entry: Omit<TravelEntry, "id">) => void;
}

const TravelForm = ({ onAdd }: TravelFormProps) => {
  const [date, setDate] = useState("");
  const [fromState, setFromState] = useState("");
  const [toState, setToState] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !fromState || !toState) return;

    onAdd({
      date,
      fromState,
      toState,
      notes: notes || undefined,
    });

    // Reset form
    setDate("");
    setFromState("");
    setToState("");
    setNotes("");
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
            required
          />
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

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label className="text-xs font-medium">From State</Label>
          <Select value={fromState} onValueChange={setFromState}>
            <SelectTrigger className="h-9">
              <SelectValue placeholder="Select..." />
            </SelectTrigger>
            <SelectContent>
              {indianStates.map((state) => (
                <SelectItem key={state.code} value={state.code}>
                  {state.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-medium">To State</Label>
          <Select value={toState} onValueChange={setToState}>
            <SelectTrigger className="h-9">
              <SelectValue placeholder="Select..." />
            </SelectTrigger>
            <SelectContent>
              {indianStates.map((state) => (
                <SelectItem key={state.code} value={state.code}>
                  {state.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={!date || !fromState || !toState}
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Journey
      </Button>
    </form>
  );
};

export default TravelForm;
