import PasswordResetInput from "@/app/components/UserState/PasswordResetInput";

/**
 * page to reset the password. This is the server side wrapper to extract the token
 * @param params
 * @constructor
 */
export default async function ResetPasswortPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const usableToken = decodeURIComponent(token);

  return <PasswordResetInput token={usableToken} />;
}
