import UserCommunication from "@/app/server_communication/server/UserCommunication";

export default async function ResetPasswortPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const usableToken = decodeURIComponent(token);

  async function handleResetPassword(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await UserCommunication.resetPassword(token);
  }

  return <main></main>;
}
