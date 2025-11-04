import { SignJWT } from "jose";
import { NextRequest, NextResponse } from "next/server";

const USER_EMAIL = process.env.EMAIL;
const USER_PASSWORD = process.env.PASSWORD;
const EXP_SECONDS = 60 * 60 * 24;

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  if (!email) {
    return NextResponse.json(
      { message: "Email is required." },
      { status: 401 }
    );
  }

  if (!password) {
    return NextResponse.json(
      { message: "Password is required." },
      { status: 401 }
    );
  }

  if (email !== USER_EMAIL || password !== USER_PASSWORD) {
    return NextResponse.json(
      { message: "Invalid credentials" },
      { status: 401 }
    );
  }

  const secret = new TextEncoder().encode(process.env.JWT_SECRET);

  const token = await new SignJWT({ email })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${EXP_SECONDS}s`)
    .sign(secret);

  const res = NextResponse.json({ ok: true });

  res.headers.append(
    "Set-Cookie",
    `token=${token}; HttpOnly; Path=/; Max-Age=${EXP_SECONDS}; SameSite=Lax` +
      (process.env.NODE_ENV === "production" ? "; Secure" : "")
  );

  return res;
}
