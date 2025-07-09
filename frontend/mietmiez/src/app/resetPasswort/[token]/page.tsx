import PasswordResetInput from "@/app/components/UserState/PasswordResetInput";

export default async function ResetPasswortPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const usableToken = decodeURIComponent(token);

  return <PasswordResetInput token={usableToken} />;
}
