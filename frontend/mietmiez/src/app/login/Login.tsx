"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Button from "../components/button";
import ClientUserCommunication from "@/app/server_communication/client/ClientUserCommunication";
import { useLoginContext } from "@/app/login/LoginContext";
import AlreadyLoggedIn from "@/app/components/UserState/AlreadyLoggedIn";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const isLoggedIn = useLoginContext();

  if (isLoggedIn) {
    return <AlreadyLoggedIn />;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    ClientUserCommunication.login(email, password).then((success) => {
      if (!success) {
        setError("Login failed. Please check your credentials.");
      } else {
        router.push("/home");
        router.refresh();
      }
    });
  }

  return (
    <div className="bg-[#B2E9CD] min-h-screen flex flex-col md:flex-row items-center justify-center">
      <div className="w-full md:w-1/2 flex-1 relative min-h-[250px] md:min-h-screen">
        <Image
          src="/mietmiez_icon_512.png"
          alt="Logo"
          fill
          style={{ objectFit: "contain" }}
          priority
        />
      </div>

      <div className="w-full md:w-1/2 p-6 sm:p-10 lg:p-20 flex flex-col justify-center">
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-6">
          <form onSubmit={handleSubmit} className="flex flex-col">
            <h2 className="text-green-700 text-center mb-4 font-extrabold text-2xl">
              Login
            </h2>

            {error && (
              <p className="text-red-500 mb-3 text-sm text-center">{error}</p>
            )}
            <input
              type="text"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="text-gray-700 w-full p-3 border border-gray-300 rounded-lg text-base mb-3 text-center"
            />
            <input
              type="password"
              placeholder="Passwort"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="text-gray-700 w-full p-3 border border-gray-300 rounded-lg text-base mb-5 text-center"
            />
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <Button
                title="Register"
                onClick={() => router.push("/register")}
                isPrimary={false}
                type="button"
              />
              <Button
                title="Login"
                onClick={() => {}}
                isPrimary={true}
                type="submit"
              />
            </div>
            <Button
              title="Reset password"
              onClick={async () => {
                const success =
                  await ClientUserCommunication.resetPasswordRequest(email);
                if (!success) {
                  setError(
                    "failed to send reset password email. Please check your email address.",
                  );
                } else {
                  setError(
                    "An email to reset your password has been sent. Please check your inbox.",
                  );
                }
              }}
              isPrimary={false}
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
