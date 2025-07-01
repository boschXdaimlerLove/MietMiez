import UserCommunication from "@/app/server_communication/UserCommunication";
import { NextResponse } from "next/server";

export async function POST(req: Request): Promise<NextResponse> {
  const { email, password } = await req.json();
  const { token, expires_at } = await UserCommunication.login(email, password);
  const expirationDate = new Date(expires_at);
  const maxAge = Math.floor((expirationDate.getTime() - Date.now()) / 1000);
  const res = NextResponse.json({ success: true });
  res.cookies.set("token", token, {
    httpOnly: true,
    secure: true,
    path: "/",
    maxAge: maxAge,
  });
  return res;
}
