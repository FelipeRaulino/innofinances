import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./_components/app-sidebar";
import ControlsClient from "./_components/controls-client";
import NetBalanceCard from "./_components/balance-card";
import TotalCard from "./_components/total-card";
import { accounts, industries, states } from "@/constants/constants";
import IncomeWithdrawsChart from "./_components/income-withdraws-chart";
import BalanceChart from "./_components/balance-chart";
import { connection } from "next/server";

export default async function DashboardPage() {
  await connection();
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex flex-col min-h-screen font-sans bg-background w-full relative px-5.5 py-6">
        <SidebarTrigger className="absolute top-4 left-4" />
        <div className="flex flex-col justify-between mt-14 lg:flex-row">
          <h1 className="font-bold text-xl text-[#68686E]">Dashboard</h1>
          <ControlsClient
            accounts={accounts}
            industries={industries}
            states={states}
          />
        </div>
        <div className="flex flex-wrap gap-6 mt-8 justify-center">
          <NetBalanceCard />
          <TotalCard type="income" />
          <TotalCard type="withdraws" />
        </div>
        <div className="w-full flex flex-col justify-center flex-wrap gap-6 mt-8 lg:flex-row">
          <BalanceChart />
          <IncomeWithdrawsChart />
        </div>
      </main>
    </SidebarProvider>
  );
}
