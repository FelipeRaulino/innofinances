import path from "path";
import fs from "fs/promises";
import { Transaction } from "@/types/transaction";

export async function loadAccounts(): Promise<string[]> {
  const pathTransactions = path.join(
    process.cwd(),
    "data",
    "transactions.json"
  );
  const transactionsRaw = await fs.readFile(pathTransactions, "utf-8");
  const transactions: Transaction[] = JSON.parse(transactionsRaw);
  const accounts = Array.from(
    new Set(
      transactions.map((transaction) => transaction.account).filter(Boolean)
    )
  ).sort();
  return accounts;
}
