import { NextResponse } from "next/server";
import UserCommunication from "@/app/server_communication/server/UserCommunication";
import User from "@/app/objects/user/user";

export function DELETE() {
  const deleteSuccessful = UserCommunication.deleteUser();
  if (!deleteSuccessful) {
    return NextResponse.error();
  }
  const res = NextResponse.json({ success: true });
  res.cookies.set("token", "", {
    httpOnly: true,
    secure: false,
    path: "/",
    maxAge: 0, // Token valid for 0 seconds => token invalidated
    sameSite: "lax",
  });
}

export async function PUT(req: Request) {
  const user = User.fromJSON(JSON.parse(await req.text()));
  const updateSuccessful = await UserCommunication.update(user);
  if (!updateSuccessful) {
    return NextResponse.error();
  }
  return NextResponse.json({ success: true });
}
