import UserCommunication from "@/app/server_communication/server/UserCommunication";
import { NextResponse } from "next/server";

/**
 * POST handler for changing the user's password
 * Works as passthrough to the server communication layer
 * @param req
 * @constructor
 */
export async function POST(req: Request) {
  const { oldPassword, newPassword } = JSON.parse(await req.text());
  const changeSuccessful = await UserCommunication.changePassword(
    oldPassword,
    newPassword,
  );
  if (!changeSuccessful) {
    return NextResponse.error();
  }
  return NextResponse.json({ success: true });
}
