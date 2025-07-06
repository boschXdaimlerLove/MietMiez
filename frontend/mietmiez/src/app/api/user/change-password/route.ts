import UserCommunication from "@/app/server_communication/server/UserCommunication";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { password, newPassword } = JSON.parse(await req.text());
  const changeSuccessful = await UserCommunication.changePassword(
    password,
    newPassword,
  );
  if (!changeSuccessful) {
    return NextResponse.error();
  }
  return NextResponse.json({ success: true });
}
