"use client";

import { Input } from "@/components/ui/input";
import { ChangeEvent } from "react";

interface ICustomInput {
  label: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const CustomInput = ({
  label,
  type,
  placeholder,
  value,
  onChange,
}: ICustomInput) => {
  return (
    <div className="flex flex-col gap-2 w-full">
      <label className="font-sans text-[#8E8E94] text-sm font-semibold">
        {label}
      </label>
      <Input
        placeholder={placeholder}
        className="border-[#bcbcc5] bg-[#F9F9F9] text-[#5d5d63] focus-visible:ring-primary font-sans text-xs placeholder:text-[#BBBBBE] font-bold"
        type={type}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default CustomInput;
