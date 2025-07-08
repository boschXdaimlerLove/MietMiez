import UserCommunication from "@/app/server_communication/server/UserCommunication";
import { AlertTriangle, CheckCircle, Loader2 } from "lucide-react";

export default async function ActivateUserPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const usableToken = decodeURIComponent(token);
  let isLoading = true;
  let didSucceed: boolean = false;
  await UserCommunication.activateUser(usableToken).then((success) => {
    didSucceed = success;
    isLoading = false;
  });

  if (isLoading) {
    return (
      <main className="flex h-screen items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center space-y-4 text-gray-600">
          <Loader2 className="h-12 w-12 animate-spin" />
          <p className="text-lg">Activating your account...</p>
        </div>
      </main>
    );
  }

  if (!didSucceed) {
    return (
      <main className="flex h-screen items-center justify-center bg-red-50">
        <div className="max-w-md rounded-lg bg-white p-6 shadow-lg ring-1 ring-red-200">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="h-6 w-6 text-red-500" />
            <h2 className="text-xl font-semibold text-red-600">
              activation failed
            </h2>
          </div>
          <p className="mt-2 text-sm text-gray-700">
            Sadly your account could not be activated. Please try again later
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex h-screen items-center justify-center bg-green-50">
      <div className="max-w-md rounded-lg bg-white p-6 shadow-lg ring-1 ring-green-200">
        <div className="flex items-center space-x-3">
          <CheckCircle className="h-6 w-6 text-green-500" />
          <h2 className="text-xl font-semibold text-green-600">
            successfully activated
          </h2>
        </div>
        <p className="mt-2 text-sm text-gray-700">
          Your account has been successfully activated. You can now log in.
        </p>
      </div>
    </main>
  );
}
