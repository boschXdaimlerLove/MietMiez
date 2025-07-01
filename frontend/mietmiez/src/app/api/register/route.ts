import UserCommunication from "@/app/server_communication/UserCommunication";
import User from "@/app/objects/user";

export async function POST(req: Request) {
  const body = await req.text();
  const { user, password } = JSON.parse(body);

  try {
    await UserCommunication.register(User.fromJSON(user), password);
    return new Response("User registered successfully", { status: 201 });
  } catch (error) {
    console.error("Registration error:", error);
    return new Response("Registration failed", { status: 500 });
  }
}
