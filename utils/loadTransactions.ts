import path from "path";
import { Transaction } from "@/types/transaction";
import fs from "fs/promises";

export async function loadTransactions(): Promise<Transaction[]> {
  const pathTransactions = path.join(
    process.cwd(),
    "data",
    "transactions.json"
  );
  const rawTransactions = await fs.readFile(pathTransactions, "utf-8");
  return JSON.parse(rawTransactions);
}
