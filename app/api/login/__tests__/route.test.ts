import { NextRequest, NextResponse } from "next/server";

type MockedNextResponse = {
  body: unknown;
  status: number;
  headers: {
    append: (k: string, v: string) => void;
    get: (k: string) => string | undefined;
    _store: Record<string, string>;
  };
};

const makeNextServerMock = () => ({
  NextResponse: {
    json: jest.fn((body: unknown, init?: { status?: number }) => {
      const resp: MockedNextResponse = {
        body,
        status: init?.status ?? 200,
        headers: {
          _store: {},
          append(k: string, v: string) {
            this._store[k.toLowerCase()] = v;
          },
          get(k: string) {
            return this._store[k.toLowerCase()];
          },
        },
      };
      return resp;
    }),
  },

  NextRequest: jest.fn(),
});

class MockSignJWT {
  payload: unknown;

  constructor(payload: unknown) {
    this.payload = payload;
  }

  setProtectedHeader() {
    return this;
  }
  setIssuedAt() {
    return this;
  }
  setExpirationTime() {
    return this;
  }
  async sign() {
    return "signed-test-token";
  }
}

describe("POST /app/api/login/route", () => {
  beforeEach(() => {
    jest.resetModules();

    process.env.EMAIL = "hello@example.com";
    process.env.PASSWORD = "supersecret";
    process.env.JWT_SECRET = "a-very-secret-key";
    Object.assign(process.env, { NODE_ENV: "test" });
  });

  test("returns 401 when email is missing", async () => {
    const nextMock = makeNextServerMock();
    jest.doMock("next/server", () => nextMock);
    jest.doMock("jose", () => ({ SignJWT: MockSignJWT }));

    const { POST } = await import("../route");

    const fakeReq = {
      json: async () => ({ password: "anything" }),
    } as unknown as NextRequest;
    const res = (await POST(fakeReq)) as NextResponse;

    expect(nextMock.NextResponse.json).toHaveBeenCalledTimes(1);
    expect(res.status).toBe(401);
    expect(res.body).toEqual({ message: "Email is required." });
  });

  test("returns 401 when password is missing", async () => {
    const nextMock = makeNextServerMock();
    jest.doMock("next/server", () => nextMock);
    jest.doMock("jose", () => ({ SignJWT: MockSignJWT }));

    const { POST } = await import("../route");

    const fakeReq = {
      json: async () => ({ email: "hello@example.com" }),
    } as unknown as NextRequest;
    const res = (await POST(fakeReq)) as NextResponse;

    expect(nextMock.NextResponse.json).toHaveBeenCalledTimes(1);
    expect(res.status).toBe(401);
    expect(res.body).toEqual({ message: "Password is required." });
  });

  test("returns 401 when credentials are invalid", async () => {
    const nextMock = makeNextServerMock();
    jest.doMock("next/server", () => nextMock);
    jest.doMock("jose", () => ({ SignJWT: MockSignJWT }));

    const { POST } = await import("../route");

    const fakeReq = {
      json: async () => ({ email: "x@x.com", password: "anything" }),
    } as unknown as NextRequest;
    const res = (await POST(fakeReq)) as NextResponse;

    expect(nextMock.NextResponse.json).toHaveBeenCalledTimes(1);
    expect(res.status).toBe(401);
    expect(res.body).toEqual({ message: "Invalid credentials" });
  });

  test("returns ok true and sets cookie on success (non-production)", async () => {
    const nextMock = makeNextServerMock();
    jest.doMock("next/server", () => nextMock);
    jest.doMock("jose", () => ({ SignJWT: MockSignJWT }));

    const { POST } = await import("../route");

    const fakeReq = {
      json: async () => ({
        email: "hello@example.com",
        password: "supersecret",
      }),
    } as unknown as NextRequest;
    const res = (await POST(fakeReq)) as NextResponse;

    expect(nextMock.NextResponse.json).toHaveBeenCalled();

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ok: true });

    const setCookie = res.headers.get("set-cookie");
    expect(setCookie).toBeDefined();
    expect(setCookie).toMatch(/token=signed-test-token/);
    expect(setCookie).toMatch(/HttpOnly/);
    expect(setCookie).toMatch(/Max-Age=\d+/);
    expect(setCookie).toMatch(/SameSite=Lax/);
    expect(setCookie).not.toMatch(/; Secure/);
  });

  test("adds Secure Flag in production", async () => {
    const nextMock = makeNextServerMock();
    jest.doMock("next/server", () => nextMock);
    jest.doMock("jose", () => ({ SignJWT: MockSignJWT }));

    Object.assign(process.env, { NODE_ENV: "production" });

    const { POST } = await import("../route");

    const fakeReq = {
      json: async () => ({
        email: "hello@example.com",
        password: "supersecret",
      }),
    } as unknown as NextRequest;
    const res = (await POST(fakeReq)) as NextResponse;

    const setCookie = res.headers.get("set-cookie");
    expect(setCookie).toBeDefined();
    expect(setCookie).toMatch(/; Secure/);
  });
});
