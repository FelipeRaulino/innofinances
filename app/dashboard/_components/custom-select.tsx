// app/dashboard/_components/custom-select.tsx
"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SelectItem, SelectLabel } from "@radix-ui/react-select";
import React from "react";

interface ICustomSelect {
  selectItems: string[];
  label: string;
  value?: string;
  onValueChange?: (v: string) => void;
  formatItem?: (item: string) => string;
}

const CustomSelect = ({
  selectItems,
  label,
  value = "default",
  onValueChange,
  formatItem,
}: ICustomSelect) => {
  const [internal, setInternal] = React.useState(value);

  React.useEffect(() => {
    setInternal(value);
  }, [value]);

  const handleChange = (v: string) => {
    setInternal(v);
    onValueChange?.(v);
  };

  const formattedValue = internal
    ? internal.charAt(0).toUpperCase() + internal.slice(1)
    : "Default";

  return (
    <Select value={internal} onValueChange={handleChange}>
      <SelectTrigger className="font-sans text-xs text-[#A6A6A6] cursor-pointer hover:text-accent-foreground hover:bg-accent">
        <SelectValue>{formattedValue}</SelectValue>
      </SelectTrigger>
      <SelectContent className="p-2">
        <SelectGroup className="flex flex-col gap-3 font-sans text-sm">
          <SelectLabel>{label}</SelectLabel>
          <SelectItem
            key="item-default"
            value="default"
            className="cursor-pointer hover:text-primary"
          >
            Default
          </SelectItem>
          {selectItems.map((item, index) => (
            <SelectItem
              key={`item-${index}`}
              value={item}
              className="cursor-pointer hover:text-primary"
            >
              {formatItem ? formatItem(item) : item}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default CustomSelect;
