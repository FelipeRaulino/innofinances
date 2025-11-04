"use client";

import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { ChangeEvent } from "react";

interface IPasswordInput {
  label: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  showPassword: () => void;
}

const PasswordInput = ({
  label,
  type,
  placeholder,
  value,
  onChange,
  showPassword,
}: IPasswordInput) => {
  return (
    <div className="flex flex-col gap-2 w-full">
      <label className="font-sans text-[#8E8E94] text-sm font-semibold">
        {label}
      </label>
      <div className="flex items-center relative">
        <Input
          placeholder={placeholder}
          className="border-[#bcbcc5] bg-[#F9F9F9] text-[#5d5d63] focus-visible:ring-primary font-sans text-xs placeholder:text-[#BBBBBE] font-bold pr-8"
          type={type}
          value={value}
          onChange={onChange}
        />
        {type === "password" ? (
          <Eye
            size={16}
            color="#5d5d63"
            className="absolute right-2 cursor-pointer"
            onClick={showPassword}
          />
        ) : (
          <EyeOff
            size={16}
            color="#5d5d63"
            className="absolute right-2 cursor-pointer"
            onClick={showPassword}
          />
        )}
      </div>
    </div>
  );
};

export default PasswordInput;
