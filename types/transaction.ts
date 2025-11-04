export type Transaction = {
  date: number;
  amount: string;
  transaction_type: "deposit" | "withdraw";
  account: string;
  industry: string;
  state: string;
};
