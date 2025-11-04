"use client";

import { useRouter, useSearchParams } from "next/navigation";
import DatePickerInput from "./date-picker-input";
import CustomSelect from "./custom-select";
import { Button } from "@/components/ui/button";
import React from "react";
import { DateRange } from "react-day-picker";
import { stateNames } from "@/constants/constants";

interface IControlsClientProps {
  accounts: string[];
  industries: string[];
  states: string[];
}

export default function ControlsClient({
  accounts,
  industries,
  states,
}: IControlsClientProps) {
  const router = useRouter();
  const search = useSearchParams();

  const initDateFrom = search.get("dateFrom")
    ? new Date(Number(search.get("dateFrom")))
    : undefined;
  const initDateTo = search.get("dateTo")
    ? new Date(Number(search.get("dateTo")))
    : undefined;
  const initAccount = search.get("account") ?? "";
  const initIndustry = search.get("industry") ?? "";
  const initState = search.get("state") ?? "";

  const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
    from: initDateFrom ?? new Date(2021, 0, 1),
    to: initDateTo ?? new Date(2023, 11, 31),
  });

  const [account, setAccount] = React.useState<string>(
    initAccount || "default"
  );

  const [industry, setIndustry] = React.useState<string>(
    initIndustry || "default"
  );

  const [state, setState] = React.useState<string>(initState || "default");

  const handleApply = () => {
    const params = new URLSearchParams();
    if (dateRange?.from)
      params.set("dateFrom", String(dateRange.from.getTime()));
    if (dateRange?.to) params.set("dateTo", String(dateRange.to.getTime()));
    if (account) params.set("account", account);
    if (industry) params.set("industry", industry);
    if (state) params.set("state", state);

    router.push(`/dashboard?${params.toString()}`);
  };

  return (
    <div className="flex flex-col gap-4 mt-4 lg:flex-row lg:gap-2 lg:mt-0 xl:gap-4">
      <DatePickerInput value={dateRange} onChange={setDateRange} />
      <CustomSelect
        selectItems={accounts}
        value={account}
        onValueChange={(v) => setAccount(v)}
        label="Accounts"
      />
      <CustomSelect
        selectItems={industries}
        value={industry}
        onValueChange={(v) => setIndustry(v)}
        label="Industries"
      />
      <CustomSelect
        selectItems={states}
        value={state}
        onValueChange={(v) => setState(v)}
        label="States"
        formatItem={(abbr) => stateNames[abbr] || abbr}
      />
      <Button onClick={handleApply} className="w-fit cursor-pointer">
        Apply
      </Button>
    </div>
  );
}
