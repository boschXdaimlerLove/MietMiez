"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Button from "../components/button";
import ClientUserCommunication from "@/app/server_communication/client/ClientUserCommunication";
import { useLoginContext } from "@/app/login/LoginContext";
import AlreadyLoggedIn from "@/app/components/UserState/AlreadyLoggedIn";

/**
 * the login page
 * This is a client component
 * @constructor
 */
const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const isLoggedIn = useLoginContext();

  // If the user is already logged in, state that and provide the link to logout
  if (isLoggedIn) {
    return <AlreadyLoggedIn />;
  }

  /**
   * handles the login submit
   * @param e - the HTML form event
   */
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const success = await ClientUserCommunication.login(email, password);
    if (!success) {
      setError("Login failed. Please check your credentials.");
    } else {
      router.push("/home");
      router.refresh();
    }
  }

  return (
    <div className="bg-[#fefaf0] min-h-screen flex flex-col items-center">
      {/* Logo oben, zentriert */}
      <div className="mt-10 mb-8">
        <Image
          src="/images/logo.png"
          alt="Logo"
          width={120}
          height={120}
          style={{ objectFit: "contain" }}
          priority
        />
      </div>
      {/* Spacer, damit die Form vertikal zentriert wird */}
      <div className="absolute inset-x-0 top-1/2 transform -translate-y-1/2 px-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-6 mx-auto">
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

            <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
              <Button
                title="Register"
                onClick={() => router.push("/register")}
                isPrimary={false}
                type="button"
                className="w-full"
              />
              <Button
                title="Login"
                onClick={() => {}}
                isPrimary={true}
                type="submit"
                className="w-full"
              />
            </div>

            <Button
              title="Reset password"
              className="w-full"
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
