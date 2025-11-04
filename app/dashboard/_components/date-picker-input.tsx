// app/dashboard/_components/date-picker-input.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar1, ChevronDownIcon } from "lucide-react";
import React from "react";
import type { DateRange } from "react-day-picker";

interface Props {
  value?: DateRange | undefined;
  onChange?: (range?: DateRange) => void;
}

const DatePickerInput = ({ value, onChange }: Props) => {
  const [open, setOpen] = React.useState(false);
  // apenas usa `value` se passado (component controlled by parent)
  const [localRange, setLocalRange] = React.useState<DateRange | undefined>(
    value ?? {
      from: new Date(new Date().getFullYear(), 0, 1),
      to: new Date(new Date().getFullYear(), 11, 31),
    }
  );

  React.useEffect(() => {
    if (value) setLocalRange(value);
  }, [value]);

  const handleSelect = (r?: DateRange) => {
    setLocalRange(r);
    onChange?.(r);
  };

  const formatDateRange = (range?: { from?: Date; to?: Date }) => {
    if (!range?.from || !range.to) return "Select range";

    const formatDate = (date: Date) =>
      date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });

    return `${formatDate(range.from)} - ${formatDate(range.to)}`;
  };

  const formattedDate = formatDateRange(localRange);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          id="date"
          className="px-6 h-8 cursor-pointer flex items-cente w-fit"
        >
          <Calendar1 width={14} height={14} color="#5E5B5B" />
          <span className="font-sans text-xs text-[#A6A6A6] mt-0.5">
            {formattedDate}
          </span>
          <ChevronDownIcon width={14} height={14} color="#5E5B5B" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto overflow-hidden p-0" align="start">
        <Calendar
          mode="range"
          defaultMonth={localRange?.from}
          selected={localRange}
          onSelect={handleSelect}
          numberOfMonths={2}
          className="rounded-lg border shadow-sm"
        />
      </PopoverContent>
    </Popover>
  );
};

export default DatePickerInput;
