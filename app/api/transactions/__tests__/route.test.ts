import { Filters } from "@/types/filters";
import { Transaction } from "@/types/transaction";

interface MockedHeaders {
  _store: Record<string, string>;
  append: (k: string, v: string) => void;
  get: (k: string) => string | undefined;
}

interface MockedNextResponse {
  body: unknown;
  status: number;
  headers: MockedHeaders;
}

const makeNextServer = () => {
  const NextResponse = {
    json: jest.fn((body: unknown, init?: { status?: number }) => {
      const headers: MockedHeaders = {
        _store: {},
        append(k: string, v: string) {
          this._store[k.toLowerCase()] = v;
        },
        get(k: string) {
          return this._store[k.toLowerCase()];
        },
      };

      const resp: MockedNextResponse = {
        body,
        status: init?.status ?? 200,
        headers,
      };

      return resp;
    }),
  };

  return { NextResponse };
};

describe("POST /api/transactions/route", () => {
  beforeEach(() => {
    jest.resetModules();
  });

  test("returns 404 when no transactions match filters", async () => {
    const nextMock = makeNextServer();
    jest.doMock("next/server", () => nextMock);

    jest.doMock("@/utils/loadTransactions", () => ({
      loadTransactions: async () => [] as Transaction[],
    }));

    const { POST } = await import("../route");

    const fakeReq = {
      json: async () => ({}),
    } as unknown as Request;

    const res = (await POST(fakeReq)) as unknown as MockedNextResponse;

    expect(nextMock.NextResponse.json).toHaveBeenCalledTimes(1);
    expect(res.status).toBe(404);
    expect(res.body).toEqual({
      message: "No transactions found! Reset parameters.",
    });
  });

  test("return aggregated data when transactions exist", async () => {
    const nextMock = makeNextServer();
    jest.doMock("next/server", () => nextMock);

    const tsJAN15 = Date.UTC(2025, 0, 15);
    const tsFEB10 = Date.UTC(2025, 1, 10);

    const transactions: Transaction[] = [
      {
        amount: "100",
        transaction_type: "deposit",
        date: tsJAN15,
        industry: "Retail",
        account: "acc1",
        state: "NY",
      } as unknown as Transaction,
      {
        amount: "50",
        transaction_type: "withdraw",
        date: tsFEB10,
        industry: "Services",
        account: "acc2",
        state: "NY",
      } as unknown as Transaction,
    ];

    jest.doMock("@/utils/loadTransactions", () => ({
      loadTransactions: async () => transactions,
    }));

    // realistic helperDate implementations
    jest.doMock("@/utils/helperDate", () => ({
      addMonthsToYearMonth: (year: number, month: number, i: number) => {
        const total = month - 1 + i;
        const y = year + Math.floor(total / 12);
        const m = (total % 12) + 1;
        return { year: y, month: m };
      },
      monthKeyFromTimestamp: (ts: number) => {
        const d = new Date(ts);
        const y = d.getUTCFullYear();
        const m = String(d.getUTCMonth() + 1).padStart(2, "0");
        return `${y}-${m}`;
      },
    }));

    const { POST } = await import("../route");

    // no filters: should use full range from earliest to latest
    const fakeReq = {
      json: async () => ({}),
    } as unknown as Request;

    const res = (await POST(fakeReq)) as unknown as MockedNextResponse;

    expect(nextMock.NextResponse.json).toHaveBeenCalled();
    expect(res.status).toBe(200);

    // the returned body should include totals and arrays
    const body = res.body as {
      totals: { deposits: number; withdraws: number };
      topIndustry: unknown;
      aggByMonth: Array<{
        monthKey: string;
        deposits: number;
        withdraws: number;
        net: number;
      }>;
      balanceSeries: Array<{ monthKey: string; balance: number }>;
    };

    // totals: deposits 100, withdraws 50
    expect(body.totals.deposits).toBe(100);
    expect(body.totals.withdraws).toBe(50);

    // topIndustry should be the one with highest deposits (Retail)
    expect(body.topIndustry).toBeDefined();
    // aggByMonth should have two months: 2025-01 and 2025-02
    const months = body.aggByMonth.map((r) => r.monthKey);
    expect(months).toEqual(["2025-01", "2025-02"]);

    // check deposits/withdraws per month
    const jan = body.aggByMonth.find((r) => r.monthKey === "2025-01")!;
    const feb = body.aggByMonth.find((r) => r.monthKey === "2025-02")!;
    expect(jan.deposits).toBe(100);
    expect(jan.withdraws).toBe(0);
    expect(feb.deposits).toBe(0);
    expect(feb.withdraws).toBe(50);

    // balanceSeries running total: after Jan -> 100, after Feb -> 50
    expect(body.balanceSeries.map((b) => b.balance)).toEqual([100, 50]);
  });

  test("applies filters (account) correctly", async () => {
    const nextMock = makeNextServer();
    jest.doMock("next/server", () => nextMock);

    const tsJan15 = Date.UTC(2025, 0, 15); // 2025-01-15

    const transactions: Transaction[] = [
      {
        id: "t1",
        amount: 100,
        transaction_type: "deposit",
        date: String(tsJan15),
        industry: "Retail",
        account: "acc1",
        state: "NY",
      } as unknown as Transaction,
      {
        id: "t2",
        amount: 40,
        transaction_type: "deposit",
        date: String(tsJan15),
        industry: "Retail",
        account: "acc2",
        state: "NY",
      } as unknown as Transaction,
    ];

    jest.doMock("@/utils/loadTransactions", () => ({
      loadTransactions: async () => transactions,
    }));

    jest.doMock("@/utils/helperDate", () => ({
      addMonthsToYearMonth: (year: number, month: number, i: number) => {
        const total = month - 1 + i;
        const y = year + Math.floor(total / 12);
        const m = (total % 12) + 1;
        return { year: y, month: m };
      },
      monthKeyFromTimestamp: (ts: number) => {
        const d = new Date(ts);
        const y = d.getUTCFullYear();
        const m = String(d.getUTCMonth() + 1).padStart(2, "0");
        return `${y}-${m}`;
      },
    }));

    const { POST } = await import("../route");

    // filters: only account acc1
    const filters: Filters = { account: "acc1" } as Filters;

    const fakeReq = {
      json: async () => filters,
    } as unknown as Request;

    const res = (await POST(fakeReq)) as unknown as MockedNextResponse;

    expect(nextMock.NextResponse.json).toHaveBeenCalled();
    expect(res.status).toBe(200);

    const body = res.body as {
      totals: { deposits: number; withdraws: number };
      aggByMonth: Array<{
        monthKey: string;
        deposits: number;
        withdraws: number;
        net: number;
      }>;
    };

    // only acc1 (100) should be counted
    expect(body.totals.deposits).toBe(100);
    expect(body.aggByMonth[0].deposits).toBe(100);
  });
});
