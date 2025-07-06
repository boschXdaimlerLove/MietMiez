"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  User, 
  Trash2, 
  LogOut,
  Edit,
  Save,
  Eye,
  EyeOff,
  Lock
} from "lucide-react";
import UserCommunication from "@/app/server_communication/UserCommunication";
import UserClass from "@/app/objects/user";

export default function AccountSettingsPage() {
  const router = useRouter();
  
  // User State
  const [user, setUser] = useState<UserClass | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Password State
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Load user data on component mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Versuche echte Benutzerdaten vom Backend zu laden
        const userData = await UserCommunication.fetchSelfUser();
        setUser(userData);
      } catch (err) {
        console.error("Failed to load user - redirecting to login:", err);
        
        // Benutzer ist nicht angemeldet oder Session abgelaufen - zur Login-Seite weiterleiten
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [router]);

  const handleUserUpdate = (field: string, value: string) => {
    if (user) {
      setUser(prev => {
        if (!prev) return prev;
        return new UserClass(
          field === "firstName" ? value : prev.firstName,
          field === "lastName" ? value : prev.lastName,
          field === "email" ? value : prev.email,
          field === "city" ? value : prev.city,
          field === "zipCode" ? value : prev.zipCode,
          prev.favorites
        );
      });
    }
  };

  const handlePasswordChange = (field: string, value: string) => {
    setPasswords(prev => ({ ...prev, [field]: value }));
  };

  const togglePasswordVisibility = (field: string) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field as keyof typeof prev] }));
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    
    setIsSaving(true);
    try {
      await UserCommunication.updateUser(user);
      console.log("Profil erfolgreich gespeichert:", user);
      setIsEditing(false);
      setError(null);
      
      // Erfolgs-Feedback anzeigen
      alert("Profil erfolgreich gespeichert!");
    } catch (err) {
      console.error("Failed to update user:", err);
      setError("Fehler beim Speichern der Daten. Bitte versuchen Sie es erneut.");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordUpdate = async () => {
    if (!user || !passwords.currentPassword || !passwords.newPassword || passwords.newPassword !== passwords.confirmPassword) {
      setError("Bitte alle Passwort-Felder korrekt ausfüllen");
      return;
    }

    setIsChangingPassword(true);
    try {
      await UserCommunication.changePassword(user, passwords.currentPassword, passwords.newPassword);
      console.log("Passwort erfolgreich geändert");
      setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setError(null);
      alert("Passwort erfolgreich geändert!");
    } catch (err) {
      console.error("Failed to change password:", err);
      setError("Fehler beim Ändern des Passworts. Überprüfen Sie Ihr aktuelles Passwort.");
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleLogout = async () => {
    try {
      await UserCommunication.logout();
      console.log("Logout erfolgreich");
      router.push("/login");
    } catch (err) {
      console.error("Logout failed:", err);
      // Bei Fehler trotzdem zur Login-Seite weiterleiten
      router.push("/login");
    }
  };

  const handleDeleteAccount = async () => {
    if (confirm("Sind Sie sicher, dass Sie Ihr Konto permanent löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.")) {
      try {
        await UserCommunication.deleteUser();
        console.log("Account erfolgreich gelöscht");
        router.push("/");
      } catch (err) {
        console.error("Failed to delete account:", err);
        setError("Fehler beim Löschen des Accounts. Bitte versuchen Sie es erneut.");
      }
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#47702d] mx-auto"></div>
          <p className="mt-4 text-gray-600">Lade Benutzerdaten...</p>
        </div>
      </div>
    );
  }

  // Error state - falls Fehler auftritt und kein User geladen wurde
  if (error && !user && !loading) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Sitzung abgelaufen. Sie werden zur Anmeldung weitergeleitet...</p>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#47702d] mx-auto"></div>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[var(--background)]">

      <div className="max-w-4xl mx-auto px-6 py-8 space-y-8">
        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600">{error}</p>
            <button
              onClick={() => setError(null)}
              className="mt-2 text-sm text-red-500 hover:text-red-700"
            >
              Schließen
            </button>
          </div>
        )}

        {/* Benutzer-Info Karte */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <User size={20} className="text-[#47702d]" />
              Persönliche Daten
            </h2>
            <button
              onClick={() => setIsEditing(!isEditing)}
              disabled={isSaving}
              className="flex items-center gap-2 px-4 py-2 bg-[#47702d] text-white rounded-lg hover:bg-[#3a5a25] transition-colors disabled:bg-gray-400"
            >
              <Edit size={16} />
              {isEditing ? "Abbrechen" : "Bearbeiten"}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vorname
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={user.firstName}
                  onChange={(e) => handleUserUpdate("firstName", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#47702d] focus:border-transparent text-gray-900"
                />
              ) : (
                <p className="text-gray-800 font-medium">{user.firstName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nachname
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={user.lastName}
                  onChange={(e) => handleUserUpdate("lastName", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#47702d] focus:border-transparent text-gray-900"
                />
              ) : (
                <p className="text-gray-800 font-medium">{user.lastName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                E-Mail
              </label>
              {isEditing ? (
                <input
                  type="email"
                  value={user.email}
                  onChange={(e) => handleUserUpdate("email", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#47702d] focus:border-transparent text-gray-900"
                />
              ) : (
                <p className="text-gray-800 font-medium">{user.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stadt
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={user.city}
                  onChange={(e) => handleUserUpdate("city", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#47702d] focus:border-transparent text-gray-900"
                />
              ) : (
                <p className="text-gray-800 font-medium">{user.city}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                PLZ
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={user.zipCode}
                  onChange={(e) => handleUserUpdate("zipCode", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#47702d] focus:border-transparent text-gray-900"
                />
              ) : (
                <p className="text-gray-800 font-medium">{user.zipCode}</p>
              )}
            </div>
          </div>

          {isEditing && (
            <div className="mt-6 flex gap-3">
              <button
                onClick={handleSaveProfile}
                disabled={isSaving}
                className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400"
              >
                {isSaving ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <Save size={16} />
                )}
                {isSaving ? "Speichert..." : "Speichern"}
              </button>
            </div>
          )}
        </div>

        {/* Passwort ändern */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
            <Lock size={20} className="text-[#47702d]" />
            Passwort ändern
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Aktuelles Passwort
              </label>
              <div className="relative">
                <input
                  type={showPasswords.current ? "text" : "password"}
                  value={passwords.currentPassword}
                  onChange={(e) => handlePasswordChange("currentPassword", e.target.value)}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#47702d] focus:border-transparent text-gray-900"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("current")}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                >
                  {showPasswords.current ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Neues Passwort
              </label>
              <div className="relative">
                <input
                  type={showPasswords.new ? "text" : "password"}
                  value={passwords.newPassword}
                  onChange={(e) => handlePasswordChange("newPassword", e.target.value)}
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Passwort bestätigen
              </label>
              <div className="relative">
                <input
                  type={showPasswords.confirm ? "text" : "password"}
                  value={passwords.confirmPassword}
                  onChange={(e) => handlePasswordChange("confirmPassword", e.target.value)}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#47702d] focus:border-transparent text-gray-900"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("confirm")}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                >
                  {showPasswords.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          </div>

          {passwords.newPassword && passwords.confirmPassword && passwords.newPassword !== passwords.confirmPassword && (
            <div className="mt-2 text-red-600 text-sm">
              Die Passwörter stimmen nicht überein
            </div>
          )}

          <div className="mt-6">
            <button
              onClick={handlePasswordUpdate}
              disabled={!passwords.currentPassword || !passwords.newPassword || passwords.newPassword !== passwords.confirmPassword || isChangingPassword}
              className="flex items-center gap-2 px-6 py-2 bg-[#47702d] text-white rounded-lg hover:bg-[#3a5a25] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isChangingPassword ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Lock size={16} />
              )}
              {isChangingPassword ? "Aktualisiert..." : "Passwort aktualisieren"}
            </button>
          </div>
        </div>
        
        {/* Gefährliche Aktionen */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-red-600 mb-6 flex items-center gap-2">
            <Trash2 size={20} className="text-red-600" />
            Account löschen
          </h2>

          <div className="p-4 bg-red-50 rounded-lg border border-red-200">
            <p className="text-sm text-red-600 mb-4">
              Achtung: Diese Aktion kann nicht rückgängig gemacht werden. Alle Ihre Daten werden permanent gelöscht.
            </p>
            <button
              onClick={handleDeleteAccount}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <Trash2 size={16} />
              Account löschen
            </button>
          </div>
        </div>

        {/* Logout Button */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
          >
            <LogOut size={20} />
            Abmelden
          </button>
        </div>
      </div>
    </div>
  );
}