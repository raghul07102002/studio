
import { useState } from "react";
import { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { format, parseISO } from "date-fns";

interface DateRangeFilterProps {
  dateRange: DateRange | undefined;
  onDateRangeChange: (dateRange: DateRange | undefined) => void;
  onClear: () => void;
}

const DateRangeFilter = ({
  dateRange,
  onDateRangeChange,
  onClear,
}: DateRangeFilterProps) => {
  const [start, setStart] = useState(dateRange?.from ? format(dateRange.from, 'yyyy-MM-dd') : '');
  const [end, setEnd] = useState(dateRange?.to ? format(dateRange.to, 'yyyy-MM-dd') : '');
  
  const hasFilter = dateRange?.from || dateRange?.to;

  const handleApply = () => {
    const from = start ? parseISO(start) : undefined;
    const to = end ? parseISO(end) : undefined;
    onDateRangeChange({ from, to });
  };

  return (
    <div className="space-y-4">
        <div className="flex items-center justify-between">
            <Label className="text-xs font-medium text-muted-foreground">
            Filter by Date Range
            </Label>
            {hasFilter && (
            <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-xs"
                onClick={() => { setStart(''); setEnd(''); onClear(); }}
            >
                <X className="h-3 w-3 mr-1" />
                Clear
            </Button>
            )}
        </div>
        <div className="space-y-2">
            <div>
                <Label htmlFor="start-date" className="text-xs">From</Label>
                <Input id="start-date" type="date" value={start} onChange={e => setStart(e.target.value)} className="h-9"/>
            </div>
            <div>
                <Label htmlFor="end-date" className="text-xs">To</Label>
                <Input id="end-date" type="date" value={end} onChange={e => setEnd(e.target.value)} className="h-9"/>
            </div>
        </div>
      <Button onClick={handleApply} className="w-full h-9">Apply Filter</Button>
    </div>
  );
};

export default DateRangeFilter;
