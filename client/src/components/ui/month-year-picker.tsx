import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { CalendarDays } from "lucide-react";

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

interface MonthYearPickerProps {
  value: string;
  onChange: (value: string) => void;
  allowPresent?: boolean;
  placeholder?: string;
}

export function MonthYearPicker({ value, onChange, allowPresent = false, placeholder = "Select date" }: MonthYearPickerProps) {
  const [open, setOpen] = useState(false);
  const isPresent = value === "Present";

  // Parse existing value like "May 2024"
  const parsed = !isPresent && value ? value.match(/^(\w+)\s+(\d{4})$/) : null;
  const [selectedMonth, setSelectedMonth] = useState(parsed ? parsed[1] : "");
  const [selectedYear, setSelectedYear] = useState(parsed ? parsed[2] : "");

  // Sync internal state when value changes externally
  useEffect(() => {
    if (value === "Present") return;
    const match = value ? value.match(/^(\w+)\s+(\d{4})$/) : null;
    if (match) {
      setSelectedMonth(match[1]);
      setSelectedYear(match[2]);
    } else if (!value) {
      setSelectedMonth("");
      setSelectedYear("");
    }
  }, [value]);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 51 }, (_, i) => String(currentYear + 10 - i));

  const handleMonthChange = (month: string) => {
    setSelectedMonth(month);
    if (selectedYear) {
      onChange(`${month} ${selectedYear}`);
    }
  };

  const handleYearChange = (year: string) => {
    setSelectedYear(year);
    if (selectedMonth) {
      onChange(`${selectedMonth} ${year}`);
    }
  };

  const handlePresentToggle = (checked: boolean) => {
    if (checked) {
      onChange("Present");
    } else {
      if (selectedMonth && selectedYear) {
        onChange(`${selectedMonth} ${selectedYear}`);
      } else {
        onChange("");
      }
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={`w-full justify-start text-left font-normal ${!value ? "text-muted-foreground" : ""}`}
        >
          <CalendarDays className="mr-2 h-4 w-4" />
          {value || placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-4" align="start">
        <div className="space-y-3">
          {allowPresent && (
            <div className="flex items-center gap-2">
              <Checkbox
                id="present"
                checked={isPresent}
                onCheckedChange={handlePresentToggle}
              />
              <label htmlFor="present" className="text-sm font-medium cursor-pointer">
                Present / Ongoing
              </label>
            </div>
          )}

          {!isPresent && (
            <div className="grid grid-cols-2 gap-2">
              <Select value={selectedMonth} onValueChange={handleMonthChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Month" />
                </SelectTrigger>
                <SelectContent>
                  {MONTHS.map((m) => (
                    <SelectItem key={m} value={m}>{m}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedYear} onValueChange={handleYearChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
                  {years.map((y) => (
                    <SelectItem key={y} value={y}>{y}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
