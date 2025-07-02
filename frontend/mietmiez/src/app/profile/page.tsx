import React from "react";
// import { redirect } from "next/navigation";
import Link from "next/link";
import { Settings } from "lucide-react";
// import UserCommunication from "@/app/server_communication/UserCommunication";
import User from "@/app/objects/user";

export default async function ProfilePage() {
  // Temporarily using example user instead of fetching from API
  const user = new User(
    "Max",
    "Mustermann", 
    "max.mustermann@example.com",
    "München",
    "80331",
    ["Hund", "Katze", "Maus"]
  );

  // TODO: Re-enable user fetching later
  /*
  let user: User | null = null;
  
  try {
    user = await UserCommunication.fetchSelfUser();
  } catch (e) {
    // Wenn das Laden der Benutzerdaten fehlschlägt, zur Login-Seite weiterleiten
    console.error("Fehler beim Laden der Benutzerdaten:", e);
    redirect("/login");
  }

  // Zusätzliche Prüfung: Wenn kein Benutzer zurückgegeben wurde, auch weiterleiten
  if (!user) {
    redirect("/login");
  }
  */

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)]">
      <main className="flex-1 flex flex-col items-center p-8 pt-16">
        <div className="w-full max-w-xl bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl text-center text-[#47702d] font-bold flex-1">
              Mein Profil
            </h1>
            <Link
              href="/profile/settings"
              className="flex items-center gap-2 px-4 py-2 bg-[#47702d] text-white rounded-lg hover:bg-[#3a5a25] transition-colors"
            >
              <Settings size={20} />
              <span>Einstellungen</span>
            </Link>
          </div>
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
        </div>
      </main>
    </div>
  );
}
