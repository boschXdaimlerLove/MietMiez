"use client";

import React from "react";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import Button from "@/app/components/button";
import ClientUserCommunication from "@/app/server_communication/client/ClientUserCommunication";

/**
 * the input to reset the password as client component
 * @param token - the token to reset the user password
 * @constructor
 */
export default function PasswordResetInput({ token }: { token: string }) {
  const router = useRouter();

  type PasswordStruct = {
    newPassword: string;
    newPasswordConfirm: string;
  };

  const [showPasswords, setShowPasswords] = React.useState({
    new: false,
    confirm: false,
  });
  const [passwords, setPasswords] = React.useState<PasswordStruct>({
    newPassword: "",
    newPasswordConfirm: "",
  });

  /**
   * toggles the visibility of the password input fields
   * @param type
   */
  function togglePasswordVisibility(type: "new" | "confirm") {
    setShowPasswords((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  }

  /**
   * handles the password reset
   * @param event
   */
  async function handleResetPassword(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (passwords.newPassword !== passwords.newPasswordConfirm) {
      console.error("Passwords do not match");
    } else {
      const success = await ClientUserCommunication.resetPassword(
        token,
        passwords.newPassword,
      );
      if (success) {
        console.log("Password reset successful");
        router.push("/login");
      }
    }
  }

  return (
    <main>
      <form onSubmit={handleResetPassword}>
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
                  newPassword: e.target.value,
                  newPasswordConfirm: passwords.newPasswordConfirm,
                };
                setPasswords(struct);
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
                    newPassword: passwords.newPassword,
                    newPasswordConfirm: e.target.value,
                  };
                  setPasswords(struct);
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
        <Button
          title="Reset password"
          onClick={() => {}}
          isPrimary={true}
          type="submit"
        />
      </form>
    </main>
  );
}
