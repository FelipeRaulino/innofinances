import type { NextRequest } from "next/server";

const makeReq = (cookieHeader: string | null): NextRequest => {
  const req = {
    headers: {
      get: (k: string) => {
        if (k.toLowerCase() === "cookie") return cookieHeader;
        return null;
      },
    },
  } as unknown as NextRequest;

  return req;
};

describe("GET /api/me/route", () => {
  beforeEach(() => {
    jest.resetModules();
    Object.assign(process.env, { JWT_SECRET: "test-secret" });
  });

  test("returns 401 when token is invalid (jwtVerify throws)", async () => {
    jest.doMock("jose", () => ({
      jwtVerify: async () => {
        throw new Error("invalid token");
      },
    }));

    const { GET } = await import("../route");

    const req = makeReq("token=badtoken; other=1");
    const res = await GET(req);

    expect(res).toBeInstanceOf(Response);
    expect(res.status).toBe(401);

    const text = await res.text();
    expect(JSON.parse(text)).toEqual({ authenticated: false });
  });

  test("returns 200  and user email when token is valid", async () => {
    jest.doMock("jose", () => ({
      jwtVerify: async (_token: string, secret: Uint8Array) => ({
        payload: { email: "hello@example.com" },
      }),
    }));

    const { GET } = await import("../route");

    const req = makeReq("token=validtoken123");
    const res = await GET(req);

    expect(res).toBeInstanceOf(Response);
    expect(res.status).toBe(200);

    const text = await res.text();
    expect(JSON.parse(text)).toEqual({
      authenticated: true,
      user: { email: "hello@example.com" },
    });
  });
});
