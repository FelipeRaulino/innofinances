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

const makeNextServerMock = () => {
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

describe("POST /app/api/logout/route", () => {
  beforeEach(() => {
    jest.resetModules();
    Object.assign(process.env, { NODE_ENV: "test" });
  });

  test("return ok true and clears cookie (non-production)", async () => {
    const nextMock = makeNextServerMock();
    jest.doMock("next/server", () => nextMock);

    const { POST } = await import("../route");

    const res = (await POST()) as unknown as MockedNextResponse;

    expect(nextMock.NextResponse.json).toHaveBeenCalledTimes(1);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ok: true });

    const setCookie = res.headers.get("set-cookie");
    expect(setCookie).toBeDefined();
    expect(setCookie).toContain("token=");
    expect(setCookie).toContain("MaxAge=0");
    expect(setCookie).toContain("HttpOnly");
    expect(setCookie).toContain("SameSite=Lax");
    expect(setCookie).not.toContain("; Secure");
  });

  test("adds Secure Flag in production", async () => {
    const nextMock = makeNextServerMock();
    jest.doMock("next/server", () => nextMock);

    Object.assign(process.env, { NODE_ENV: "production" });

    const { POST } = await import("../route");
    const res = (await POST()) as unknown as MockedNextResponse;

    const setCookie = res.headers.get("set-cookie");
    expect(setCookie).toBeDefined();
    expect(setCookie).toContain("; Secure");
  });
});
