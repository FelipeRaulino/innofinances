"use client";

import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useTransactions } from "@/hooks/useTransactions";
import { ShieldAlert } from "lucide-react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Bar, BarChart, XAxis } from "recharts";

const IncomeWithdrawsChart = () => {
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

  const fromDate = new Date(filters.dateFrom);
  const toDate = new Date(filters.dateTo);

  const formatter = new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  });

  const dateRangeString = `${formatter.format(fromDate)} - ${formatter.format(
    toDate
  )}`;

  const { data, isLoading, error } = useTransactions(filters);

  const chartConfig = {
    deposits: {
      label: "Income",
      color: "var(--chart-1)",
    },
    withdraws: {
      label: "Withdraws",
      color: "var(--chart-2)",
    },
  } satisfies ChartConfig;

  return (
    <div className="flex flex-col min-h-[430px] max-w-[800px] flex-1 p-4 font-sans rounded-xl shadow bg-white border border-[#DFDFDF] select-none">
      <h3 className="font-sans font-bold text-lg text-[#86868F]">
        Income vs Withdraws
      </h3>
      <span className="font-sans text-base text-[#86868F] mt-1">
        {dateRangeString}
      </span>
      {isLoading ? (
        <Image
          src="./loading-alt.svg"
          width={42}
          height={42}
          alt="Loading"
          className="flex-1 self-center"
        />
      ) : error || data === undefined ? (
        <div className="flex flex-col items-center flex-1 justify-center my-8">
          <ShieldAlert size={36} color="#97595B" className="mb-2" />
          <span className="font-sm font-medium text-[#97595B] select-none">
            Error trying to fetch data
          </span>
          <span className="font-sm font-medium text-[#97595B] select-none">
            Try reset filters or reload the page
          </span>
        </div>
      ) : (
        <div className="flex-1 flex mt-4 w-full">
          <ChartContainer config={chartConfig} className="w-full">
            <BarChart
              accessibilityLayer
              style={{ width: "100%" }}
              data={data.aggByMonth}
            >
              <XAxis
                dataKey="monthKey"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => {
                  const [year, month] = value.split("-");
                  const date = new Date(year, month - 1);
                  return (
                    date
                      .toLocaleString("en-US", { month: "short" })
                      .replace(".", "") +
                    "/" +
                    year.slice(2)
                  );
                }}
              />
              <ChartTooltip content={<ChartTooltipContent hideLabel />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar dataKey="deposits" stackId="a" fill="#a1f7a4" />
              <Bar dataKey="withdraws" stackId="a" fill="#f89b9c" />
            </BarChart>
          </ChartContainer>
        </div>
      )}
    </div>
  );
};

export default IncomeWithdrawsChart;
