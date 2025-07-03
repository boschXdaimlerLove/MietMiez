import UserCommunication from "@/app/server_communication/server/UserCommunication";
import { NextResponse } from "next/server";

export async function POST() {
  const logoutSuccessful = await UserCommunication.logout();
  if (!logoutSuccessful) {
    return NextResponse.error();
  }
  const res = NextResponse.json({ success: true });
  res.cookies.set("token", "", {
    httpOnly: true,
    secure: true,
    path: "/",
    maxAge: 0, // Token valid for 0 seconds => token invalidated
  });
  return res;
}
