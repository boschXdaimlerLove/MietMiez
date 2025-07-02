"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Button from "../components/button";
import ClientUserCommunication from "@/app/server_communication/ClientUserCommunication";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    ClientUserCommunication.login(email, password).then((success) => {
      if (!success) {
        setError("Login fehlgeschlagen. Bitte überprüfe deine Anmeldedaten.");
      } else {
        router.push("/home");
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
            {/*
            
              <button
                type="submit"
                className="w-full sm:w-auto px-4 md:px-6 py-3 rounded-xl bg-gradient-to-r from-green-500 to-lime-400 text-white font-semibold shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 text-sm md:text-base"
              >
                Einloggen
              </button>
              <button
                type="button"
                onClick={() => router.push('register')}
                className="w-full sm:w-auto px-4 md:px-6 py-3 rounded-xl bg-gradient-to-r from-lime-400 to-green-500 text-white font-semibold shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 text-sm md:text-base"
              >
                Registrieren
              </button>
              
            */}
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <Button
                title="Register"
                onClick={() => router.push("register")}
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
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
