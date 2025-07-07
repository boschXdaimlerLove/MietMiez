import UserCommunication from "@/app/server_communication/server/UserCommunication";
import User from "@/app/objects/user/user";
import { NextResponse } from "next/server";

export async function POST(req: Request): Promise<Response> {
  console.log("Received POST request for user registration in next api");
  const body = await req.text();
  console.log("Received request body:", body);
  const { user, password } = JSON.parse(body);
  console.log("Received user data:", user);
  const registerSuccessful = await UserCommunication.register(
    User.fromJSON(user),
    password,
  );
  if (!registerSuccessful) {
    console.log("Registration failed");
    return NextResponse.error();
  } else {
    console.log("Registration successful");
    const res = NextResponse.json({ success: true });
    console.log("Returning response:", res);
    return res;
  }
}
