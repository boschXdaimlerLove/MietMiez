import UserCommunication from "@/app/server_communication/server/UserCommunication";
import { NextResponse } from "next/server";

/**
 * Handler for user logout
 * Works as passthrough to the server communication layer
 * This also invalidates the authentication token by setting it to an empty string
 * @constructor
 */
export async function POST() {
  const logoutSuccessful = await UserCommunication.logout();
  if (!logoutSuccessful) {
    return NextResponse.error();
  }
  const res = NextResponse.json({ success: true });
  res.cookies.set("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0, // Token valid for 0 seconds => token invalidated
    sameSite: "lax",
  });
  return res;
}
