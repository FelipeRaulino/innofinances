import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.headers.append(
    "Set-Cookie",
    `token=; HttpOnly; Path=/; MaxAge=0; SameSite=Lax` +
      (process.env.NODE_ENV === "production" ? "; Secure" : "")
  );
  return res;
}
