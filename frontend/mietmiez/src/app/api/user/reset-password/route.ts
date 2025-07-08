import UserCommunication from "@/app/server_communication/server/UserCommunication";

export async function POST(request: Request) {
  const email = await request.text();
  const success = await UserCommunication.resetPasswordRequest(email);
  if (!success) {
    return new Response("Failed to send reset password email", {
      status: 400,
    });
  } else {
    return new Response(
      "An email to reset your password has been sent. Please check your inbox.",
      {
        status: 200,
      },
    );
  }
}
