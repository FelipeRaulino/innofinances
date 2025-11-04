"use client";

import { ChevronsDown, ChevronsUp } from "lucide-react";

interface Props {
  percentage: number;
}

const NetBalanceBadge = ({ percentage }: Props) => {
  const badgeColor = percentage > 0 ? "bg-[#BFFFC1]" : "bg-[#FFC1C2]";

  return (
    <div
      className={`w-auto p-2 flex justify-center items-center rounded-lg ${badgeColor}`}
    >
      {percentage > 0 ? (
        <ChevronsUp size={18} color="#336935" />
      ) : (
        <ChevronsDown size={18} color="#97595B" />
      )}

      <span
        className={`text-[14px] font-sans font-bold ${
          percentage > 0 ? "text-[#336935]" : "text-[#97595B]"
        }`}
      >
        {percentage.toString()}%
      </span>
    </div>
  );
};

export default NetBalanceBadge;
