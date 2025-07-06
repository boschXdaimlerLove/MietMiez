"use client";

import "react";
import ImageCarousel from "../components/ImageCarousel";
import React, { useState } from "react";
import Button from "../components/button";
import ClientUserCommunication from "@/app/server_communication/client/ClientUserCommunication";
import User from "@/app/objects/user/user";
import { useRouter } from "next/navigation";

const Register: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [city, setCity] = useState("");
  const [zipCode, setZipCode] = useState("");

  const handleSubmit = async () => {
    setError("");

    if (password !== confirmPassword) {
      setError("Passwörter stimmen nicht überein");
      return;
    }
    if (zipCode.length < 5) {
      setError("Ungültige Postleitzahl");
      return;
    }
    const user = new User(firstName, lastName, email, city, zipCode);
    try {
      await ClientUserCommunication.register(user, password);
      router.push("/login");
    } catch (err) {
      console.error(err);
      setError("Registrierung fehlgeschlagen");
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row items-center justify-center bg-white p-4 sm:p-6 md:gap-16">
      {/* Abstand zwischen den beiden Komponenten über md:gap-16 */}
      <div className="w-full md:w-1/2 mb-8 md:mb-0">
        <ImageCarousel />
      </div>

      <div className="w-full md:w-1/2 max-w-lg bg-white rounded-xl shadow-lg p-6 sm:p-8">
        <form onSubmit={handleSubmit}>
          <h2 className="text-green-700 text-center mb-6 font-extrabold text-2xl sm:text-3xl">
            Willkommen bei Mietmiez
          </h2>

          {error && (
            <p className="text-red-600 text-center mb-4 text-sm">{error}</p>
          )}

          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              placeholder="Vorname"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              className="text-gray-700 w-full p-3 border border-gray-300 rounded-lg text-base mb-3 text-center"
            />

            <input
              type="text"
              placeholder="Nachname"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              className="text-gray-700 w-full p-3 border border-gray-300 rounded-lg text-base mb-3 text-center"
            />
          </div>

          <input
            type="email"
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
            className="text-gray-700 w-full p-3 border border-gray-300 rounded-lg text-base mb-3 text-center"
          />

          <input
            type="password"
            placeholder="Passwort bestätigen"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="text-gray-700 w-full p-3 border border-gray-300 rounded-lg text-base mb-3 text-center"
          />

          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="number"
              placeholder="Postleitzahl"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              required
              className="text-gray-700 w-full p-3 border border-gray-300 rounded-lg text-base mb-3 text-center"
            />

            <input
              type="text"
              placeholder="Stadt"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
              className="text-gray-700 w-full p-3 border border-gray-300 rounded-lg text-base mb-3 text-center"
            />
          </div>

          <div className="flex justify-end mt-4">
            {/* <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-green-500 to-lime-400 text-white font-semibold shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
            >
                Absenden
            </button> */}
            <Button
              title="Absenden"
              onClick={() => {}}
              isPrimary={true}
              className=""
              type="submit"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
