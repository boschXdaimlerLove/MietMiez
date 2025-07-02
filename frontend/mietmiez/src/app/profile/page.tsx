import React from "react";
import UserCommunication from "@/app/server_communication/UserCommunication";
import User from "@/app/objects/user";
import HeaderWrapper from "@/app/components/HeaderWrapper";
import Footer from "@/app/components/footer";

export default async function ProfilePage() {
  let user: User | null = null;
  let error: string | null = null;
  try {
    user = await UserCommunication.fetchSelfUser();
  } catch (e) {
    error = "Fehler beim Laden des Profils. Bitte einloggen.";
    console.error(e);
  }

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)]">
      <HeaderWrapper />
      <main className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="w-full max-w-xl bg-white rounded-xl shadow-lg p-8 mt-8">
          <h1 className="text-3xl text-center text-[#47702d] font-bold mb-8">
            Mein Profil
          </h1>
          {error && (
            <div className="bg-red-100 text-red-700 p-4 rounded mb-6 text-center">
              {error}
            </div>
          )}
          {user && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="mb-4">
                    <span className="block text-gray-500 text-sm mb-1">
                      Vorname
                    </span>
                    <span className="block text-lg font-semibold text-gray-800">
                      {user.firstName}
                    </span>
                  </div>
                  <div className="mb-4">
                    <span className="block text-gray-500 text-sm mb-1">
                      Nachname
                    </span>
                    <span className="block text-lg font-semibold text-gray-800">
                      {user.lastName}
                    </span>
                  </div>
                  <div className="mb-4">
                    <span className="block text-gray-500 text-sm mb-1">
                      E-Mail
                    </span>
                    <span className="block text-lg font-semibold text-gray-800">
                      {user.email}
                    </span>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="mb-4">
                    <span className="block text-gray-500 text-sm mb-1">
                      Stadt
                    </span>
                    <span className="block text-lg font-semibold text-gray-800">
                      {user.city}
                    </span>
                  </div>
                  <div className="mb-4">
                    <span className="block text-gray-500 text-sm mb-1">
                      PLZ
                    </span>
                    <span className="block text-lg font-semibold text-gray-800">
                      {user.zipCode}
                    </span>
                  </div>
                </div>
              </div>
              {/* Favoriten */}
              {user.favorites && user.favorites.length > 0 && (
                <div className="mt-6">
                  <span className="block text-gray-500 text-sm mb-2">
                    Favoriten
                  </span>
                  <ul className="list-disc list-inside text-gray-700">
                    {user.favorites.map((fav, idx) => (
                      <li key={idx}>{fav}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
          {!user && !error && (
            <div className="text-gray-500 text-center">Lade Benutzerdaten...</div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
