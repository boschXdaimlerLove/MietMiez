import { NextResponse } from "next/server";
import UserCommunication from "@/app/server_communication/server/UserCommunication";
import User from "@/app/objects/user/user";

/**
 * Server passthrough to delete the current user
 * @constructor
 */
export function DELETE() {
  const deleteSuccessful = UserCommunication.deleteUser();
  if (!deleteSuccessful) {
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
}

/**
 * Server passthrough to update the current user
 * @param req
 * @constructor
 */
export async function PUT(req: Request) {
  const user = User.fromJSON(JSON.parse(await req.text()));
  const updateSuccessful = await UserCommunication.update(user);
  if (!updateSuccessful) {
    return NextResponse.error();
  }
  return NextResponse.json({ success: true });
}

/**
 * Server passthrough to get the current user
 * @constructor
 */
export async function GET(): Promise<Response> {
  let res: Response;
  try {
    const user: User = await UserCommunication.fetchSelfUser();
    res = NextResponse.json({ success: true, email: user.email });
  } catch {
    res = NextResponse.json({ success: false });
  }
  return res;
}
