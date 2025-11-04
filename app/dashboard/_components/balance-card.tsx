"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import { useTransactions } from "@/hooks/useTransactions";
import { Eye, EyeOff, ShieldAlert } from "lucide-react";
import NetBalanceBadge from "./net-balance-badge";
import Image from "next/image";

export default function NetBalanceCard() {
  const searchParams = useSearchParams();

  const filters = {
    dateFrom: searchParams.get("dateFrom")
      ? Number(searchParams.get("dateFrom"))
      : 1609470000000,
    dateTo: searchParams.get("dateTo")
      ? Number(searchParams.get("dateTo"))
      : 1703991600000,
    account: searchParams.get("account")
      ? searchParams.get("account")
      : "default",
    industry: searchParams.get("industry")
      ? searchParams.get("industry")
      : "default",
    state: searchParams.get("state") ? searchParams.get("state") : "default",
  };

  const { data, isLoading, error } = useTransactions(filters);

  const totals = data?.totals ?? { deposits: 0, withdraws: 0 };
  const net = (totals.deposits ?? 0) - (totals.withdraws ?? 0);
  const netBalanceFormatted = net.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
  const netPercentage = Number(((net / totals.deposits) * 100).toFixed(2));
  const netPercentageText = netPercentage > 0 ? "Surplus" : "Deficit";

  const [hideData, setHideData] = React.useState(false);

  return (
    <div className="flex flex-col justify-between h-[220px] w-[360px]  p-4 font-sans rounded-xl shadow bg-white border border-[#DFDFDF] select-none">
      <h3 className="text-xs text-[#A3A3B1] font-medium">Balance</h3>
      {isLoading ? (
        <Image
          src="./loading-alt.svg"
          width={42}
          height={42}
          alt="Loading"
          className="flex-1 self-center"
        />
      ) : error || data === undefined ? (
        <div className="flex flex-col items-center flex-1 justify-center">
          <ShieldAlert size={36} color="#97595B" className="mb-2" />
          <span className="font-sm font-medium text-[#97595B] select-none">
            Error trying to fetch data
          </span>
          <span className="font-sm font-medium text-[#97595B] select-none">
            Try reset filters or reload the page
          </span>
        </div>
      ) : (
        <>
          <div className="w-full flex justify-between items-center">
            {hideData ? (
              <div className="h-2 flex items-center">
                <span className="text-[#585858] text-5xl mb-6.5 tracking-wider">
                  ..........
                </span>
              </div>
            ) : (
              <span className="text-xl text-[#58586B] font-semibold">
                {netBalanceFormatted}
              </span>
            )}

            {hideData ? (
              <Eye
                size={16}
                color="#58586B"
                className="cursor-pointer"
                onClick={() => setHideData(false)}
              />
            ) : (
              <EyeOff
                size={16}
                color="#58586B"
                className="cursor-pointer"
                onClick={() => setHideData(true)}
              />
            )}
          </div>

          {hideData ? (
            <div className="h-2 flex items-center mb-10 ">
              <span className="text-[#585858] text-5xl mb-6.5 tracking-wider">
                ..........
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <NetBalanceBadge percentage={netPercentage} />
              <span className="text-sm font-sans text-[#ADADC7]">
                {netPercentageText}
              </span>
            </div>
          )}
        </>
      )}
    </div>
  );
}
