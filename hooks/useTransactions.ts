import { Filters } from "@/types/filters";
import { useQuery } from "@tanstack/react-query";

async function fetchFilteredTransactions(filters: Filters) {
  const response = await fetch("/api/transactions", {
    method: "POST",
    body: JSON.stringify(filters),
    headers: { "Content-Type": "application/json" },
  });
  if (!response.ok) throw new Error("Error on fetching transactions");
  return response.json();
}

export function useTransactions(filters: Filters) {
  return useQuery({
    queryKey: ["transactions", filters],
    queryFn: () => fetchFilteredTransactions(filters),
    staleTime: 1000 * 60 * 2,
  });
}
