import { Filters } from "@/types/filters";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";

export function useFiltersFromUrl() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const getFilters = React.useCallback(() => {
    const dateFrom = searchParams.get("dateFrom")
      ? Number(searchParams.get("dateFrom"))
      : undefined;
    const dateTo = searchParams.get("dateTo")
      ? Number(searchParams.get("dateTo"))
      : undefined;
    const account = searchParams.get("account")
      ? searchParams.get("account")
      : undefined;
    return { dateFrom, dateTo, account };
  }, [searchParams]);

  const setFilters = (filters: Filters) => {
    const params = new URLSearchParams();
    if (filters.dateFrom) params.set("dateFrom", String(filters.dateFrom));
    if (filters.dateTo) params.set("dateTo", String(filters.dateTo));
    if (filters.account) params.set("account", String(filters.account));
    const query = params.toString();
    router.push(`/dashboard?${query}`);
  };

  return { getFilters, setFilters };
}
