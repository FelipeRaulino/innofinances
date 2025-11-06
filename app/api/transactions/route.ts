// app/api/transactions/route.ts
import { Transaction } from "@/types/transaction";
import { Filters } from "@/types/filters";
import { NextResponse } from "next/server";
import { loadTransactions } from "@/utils/loadTransactions";
import {
  addMonthsToYearMonth,
  monthKeyFromTimestamp,
} from "@/utils/helperDate";

function applyFilters(data: Transaction[], filters: Filters) {
  return data.filter((transaction) => {
    if (filters.dateFrom && transaction.date < filters.dateFrom) return false;
    if (filters.dateTo && transaction.date > filters.dateTo) return false;
    if (
      filters.account &&
      filters.account !== "default" &&
      transaction.account !== filters.account
    )
      return false;
    if (
      filters.industry &&
      filters.industry !== "default" &&
      transaction.industry !== filters.industry
    )
      return false;
    if (
      filters.state &&
      filters.state !== "default" &&
      transaction.state !== filters.state
    )
      return false;
    return true;
  });
}

function summarize(transactions: Transaction[]) {
  const toNumber = (v: unknown) => Number(v || 0);

  const totals = { deposits: 0, withdraws: 0 };

  const byIndustry = new Map<string, { deposit: number; withdraw: number }>();
  const byAccount = new Map<string, { deposit: number; withdraw: number }>();

  for (const t of transactions) {
    const amt = toNumber(t.amount);
    if (t.transaction_type === "deposit") totals.deposits += amt;
    else if (t.transaction_type === "withdraw") totals.withdraws += amt;

    // industry
    const ind = t.industry || "Unknown";
    if (!byIndustry.has(ind)) byIndustry.set(ind, { deposit: 0, withdraw: 0 });
    byIndustry.get(ind)![
      t.transaction_type === "deposit" ? "deposit" : "withdraw"
    ] += amt;

    // account
    const acc = t.account || "Unknown";
    if (!byAccount.has(acc)) byAccount.set(acc, { deposit: 0, withdraw: 0 });
    byAccount.get(acc)![
      t.transaction_type === "deposit" ? "deposit" : "withdraw"
    ] += amt;
  }

  const industryArray = Array.from(byIndustry.entries())
    .map(([industry, v]) => ({
      industry,
      total_deposits: v.deposit,
      total_withdraws: v.withdraw,
      net: v.deposit - v.withdraw,
      pct_of_total_deposits: totals.deposits
        ? (v.deposit / totals.deposits) * 100
        : 0,
      pct_of_total_withdraws: totals.withdraws
        ? (v.withdraw / totals.withdraws) * 100
        : 0,
    }))
    .sort((a, b) => b.total_deposits - a.total_deposits);

  const accountArray = Array.from(byAccount.entries())
    .map(([account, v]) => ({
      account,
      total_deposits: v.deposit,
      total_withdraws: v.withdraw,
      net: v.deposit - v.withdraw,
      pct_of_total_deposits: totals.deposits
        ? (v.deposit / totals.deposits) * 100
        : 0,
    }))
    .sort((a, b) => b.total_deposits - a.total_deposits);

  return {
    totals,
    net_total: totals.deposits - totals.withdraws,
    topIndustry: industryArray[0] || null,
    topAccount: accountArray[0] || null,
    industryArray,
    accountArray,
  };
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const filters: Filters = body ?? {};
  const allTransactions = await loadTransactions();
  const filteredTransactions = applyFilters(allTransactions, filters);

  if (filteredTransactions.length === 0) {
    return NextResponse.json(
      {
        message: "No transactions found! Reset parameters.",
      },
      { status: 404 }
    );
  }

  const { totals, topIndustry } = summarize(filteredTransactions);

  let startTs = filters.dateFrom;
  let endTs = filters.dateTo;

  if (!startTs || !endTs) {
    if (filteredTransactions.length) {
      const dates = filteredTransactions
        .map((t) => Number(t.date))
        .sort((a, b) => a - b);
      startTs = startTs ?? dates[0];
      endTs = endTs ?? dates[dates.length - 1];
    } else {
      const now = new Date();
      startTs =
        startTs ??
        Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1, 0, 0, 0, 0);
      const next = new Date(
        Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1, 0, 0, 0, 0)
      );
      endTs = endTs ?? next.getTime() - 1;
    }
  }

  const startDate = new Date(Number(startTs));
  const endDate = new Date(Number(endTs));
  const startYear = startDate.getUTCFullYear();
  const startMonth = startDate.getUTCMonth() + 1;
  const endYear = endDate.getUTCFullYear();
  const endMonth = endDate.getUTCMonth() + 1;

  const monthsDiff = (endYear - startYear) * 12 + (endMonth - startMonth) + 1;

  const monthMap = new Map<string, { deposits: number; withdraws: number }>();

  for (let i = 0; i < monthsDiff; i++) {
    const { year, month } = addMonthsToYearMonth(startYear, startMonth, i);
    const key = `${year}-${String(month).padStart(2, "0")}`;
    monthMap.set(key, { deposits: 0, withdraws: 0 });
  }

  for (const t of filteredTransactions) {
    const key = monthKeyFromTimestamp(Number(t.date));
    if (!monthMap.has(key)) {
    }
    const entry = monthMap.get(key)!;
    const amt = Number(t.amount) || 0;
    if (t.transaction_type === "deposit") entry.deposits += amt;
    else if (t.transaction_type === "withdraw") entry.withdraws += amt;
  }

  const aggByMonth = Array.from(monthMap.entries())
    .sort((a, b) => (a[0] < b[0] ? -1 : 1))
    .map(([monthKey, v]) => {
      const [y, m] = monthKey.split("-");
      return {
        monthKey,
        year: Number(y),
        month: Number(m),
        deposits: v.deposits,
        withdraws: v.withdraws,
        net: v.deposits - v.withdraws,
      };
    });

  const balanceSeries: {
    monthKey: string;
    year: number;
    month: number;
    balance: number;
  }[] = [];
  let running = 0;
  for (const row of aggByMonth) {
    running += row.net;
    balanceSeries.push({
      monthKey: row.monthKey,
      year: row.year,
      month: row.month,
      balance: running,
    });
  }

  return NextResponse.json({
    totals,
    topIndustry,
    aggByMonth,
    balanceSeries,
  });
}
