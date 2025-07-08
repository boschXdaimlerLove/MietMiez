import UserCommunication from "@/app/server_communication/server/UserCommunication";

export async function POST(request: Request) {
  const email = await request.text();
  await UserCommunication.resetPasswordRequest(email);
  // TODO: implement rest of method
}
