import { jwtVerify } from "jose";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const cookie = req.headers.get("cookie") || "";
  const match = cookie.match(/(?:^|; )token=([^;]+)/);
  const token = match?.[1];

  if (!token)
    return new Response(JSON.stringify({ authenticated: false }), {
      status: 401,
    });

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return new Response(
      JSON.stringify({ authenticated: true, user: { email: payload.email } }),
      { status: 200 }
    );
  } catch (err) {
    return new Response(JSON.stringify({ authenticated: false }), {
      status: 401,
    });
  }
}
