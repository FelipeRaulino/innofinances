import path from "path";
import fs from "fs/promises";
import { Transaction } from "@/types/transaction";

export async function loadIndustries(): Promise<string[]> {
  const pathTransactions = path.join(
    process.cwd(),
    "data",
    "transactions.json"
  );
  const transactionsRaw = await fs.readFile(pathTransactions, "utf-8");
  const transactions: Transaction[] = JSON.parse(transactionsRaw);
  const industries = Array.from(
    new Set(
      transactions.map((transaction) => transaction.industry).filter(Boolean)
    )
  ).sort();
  return industries;
}
