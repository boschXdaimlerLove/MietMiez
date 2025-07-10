import UserCommunication from "@/app/server_communication/server/UserCommunication";
import { NextResponse } from "next/server";

/**
 * Handler for user login
 * Works as passthrough to the server communication layer
 * This also sets a cookie with the authentication token
 * @param req
 * @constructor
 */
export async function POST(req: Request): Promise<NextResponse> {
  const { email, password } = JSON.parse(await req.text());
  const { token, expires_at } = await UserCommunication.login(email, password);
  const expirationDate = new Date(expires_at);
  const maxAge = Math.floor((expirationDate.getTime() - Date.now()) / 1000);
  const res = NextResponse.json({ success: true });
  res.cookies.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: maxAge,
    sameSite: "lax",
  });
  return res;
}
