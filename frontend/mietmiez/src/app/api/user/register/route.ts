import UserCommunication from "@/app/server_communication/server/UserCommunication";
import User from "@/app/objects/user/user";
import { NextResponse } from "next/server";

/**
 * Handler for user registration
 * Works as passthrough to the server communication layer
 * This does not login the user after registration
 * @param req - the HTTP request containing user data
 * @constructor
 */
export async function POST(req: Request): Promise<Response> {
  console.log("Received POST request for user registration in next api");
  const body = await req.text();
  console.log("Received request body:", body);
  const { user, password } = JSON.parse(body);
  console.log("Received user data:", user);
  let registerSuccessful: boolean;
  try {
    registerSuccessful = await UserCommunication.register(
      User.fromJSON(user),
      password,
    );
  } catch (error) {
    console.log("Error in route.ts in api/user/register", error);
    registerSuccessful = false;
  }
  if (!registerSuccessful) {
    console.log("Registration failed");
    return NextResponse.json({ success: false });
  } else {
    console.log("Registration successful");
    const res = NextResponse.json({ success: true });
    console.log("Returning response:", res);
    return res;
  }
}
