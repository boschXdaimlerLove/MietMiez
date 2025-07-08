import React from "react";
import UserCommunication from "@/app/server_communication/server/UserCommunication";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";

export default function PasswordResetInput({ token }: { token: string }) {
  const router = useRouter();

  async function handleResetPassword(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // TODO: implement client method
    const success = await UserCommunication.resetPassword(token);
    console.log("Password reset success:", success);
    router.push("/login");
  }

  return (
    <main>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          New Password
        </label>
        <div className="relative">
          <input
            type={showPasswords.new ? "text" : "password"}
            value={passwords.newPassword}
            onChange={(e) => {
              const struct: PasswordStruct = {
                currentPassword: passwords.currentPassword,
                newPassword: e.target.value,
                newPasswordConfirm: passwords.newPasswordConfirm,
              };
              handlePasswordChange(struct);
            }}
            className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#47702d] focus:border-transparent text-gray-900"
          />
          <button
            type="button"
            onClick={() => togglePasswordVisibility("new")}
            className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
          >
            {showPasswords.new ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Confirm new Password
          </label>
          <div className="relative">
            <input
              type={showPasswords.new ? "text" : "password"}
              value={passwords.newPassword}
              onChange={(e) => {
                const struct: PasswordStruct = {
                  currentPassword: passwords.currentPassword,
                  newPassword: e.target.value,
                  newPasswordConfirm: passwords.newPasswordConfirm,
                };
                handlePasswordChange(struct);
              }}
              className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#47702d] focus:border-transparent text-gray-900"
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility("new")}
              className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
            >
              {showPasswords.new ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
