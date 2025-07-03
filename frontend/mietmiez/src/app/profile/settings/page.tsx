"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  User, 
  Bell, 
  Shield, 
  Trash2, 
  LogOut,
  Edit,
  Save,
  Eye,
  EyeOff,
  Lock
} from "lucide-react";
//import UserCommunication from "@/app/server_communication/UserCommunication";
import UserClass from "@/app/objects/user";

export default function AccountSettingsPage() {
  const router = useRouter();
  
  // Temporarily using example user instead of fetching from API
  const fallbackUser = new UserClass(
    "Max",
    "Mustermann", 
    "max.mustermann@example.com",
    "Stuttgart",
    "70469",
    ["Hund", "Katze", "Maus"]
  );
  
  // User State
  const [user, setUser] = useState<UserClass | null>(fallbackUser);
  const [loading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Settings State (diese werden noch nicht vom Backend unterstützt, daher lokal)
  const [settings, setSettings] = useState({
    emailNotifications: true,
    profileVisible: true,
    showEmail: false,
    showPhone: false
  });

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
    // TODO: Re-enable user fetching later
    /*
    const loadUser = async () => {
      try {
        const userData = await UserCommunication.fetchSelfUser();
        setUser(userData);
      } catch (err) {
        console.error("Failed to load user:", err);
        setError("Fehler beim Laden der Benutzerdaten");
        // Redirect to login if user is not authenticated
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    loadUser();
    */
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

  const handleSettingToggle = (setting: string) => {
    setSettings(prev => ({ ...prev, [setting]: !prev[setting as keyof typeof prev] }));
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
      // TODO: Re-enable API call later
      // await UserCommunication.updateUser(user);
      console.log("Profil würde gespeichert werden:", user);
      setIsEditing(false);
      setError(null);
    } catch (err) {
      console.error("Failed to update user:", err);
      setError("Fehler beim Speichern der Daten");
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
      // TODO: Re-enable API call later
      // await UserCommunication.changePassword(user, passwords.currentPassword, passwords.newPassword);
      console.log("Passwort würde geändert werden");
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
      // TODO: Re-enable API call later
      // await UserCommunication.logout();
      console.log("Logout würde ausgeführt werden");
      router.push("/login");
    } catch (err) {
      console.error("Logout failed:", err);
      // Even if logout fails on server, redirect to login
      router.push("/login");
    }
  };

  const handleDeleteAccount = async () => {
    if (confirm("Sind Sie sicher, dass Sie Ihr Konto permanent löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.")) {
      try {
        // TODO: Re-enable API call later
        // await UserCommunication.deleteUser();
        console.log("Account würde gelöscht werden");
        router.push("/");
      } catch (err) {
        console.error("Failed to delete account:", err);
        setError("Fehler beim Löschen des Accounts");
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

  // Error state
  if (error && !user) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Link
            href="/login"
            className="px-4 py-2 bg-[#47702d] text-white rounded-lg hover:bg-[#3a5a25] transition-colors"
          >
            Zur Anmeldung
          </Link>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/profile"
              className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft size={20} className="text-[#47702d]" />
            </Link>
            <h1 className="text-2xl font-bold text-[#47702d]">Einstellungen</h1>
          </div>
        </div>
      </div>

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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#47702d] focus:border-transparent"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#47702d] focus:border-transparent"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#47702d] focus:border-transparent"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#47702d] focus:border-transparent"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#47702d] focus:border-transparent"
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
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#47702d] focus:border-transparent"
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
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#47702d] focus:border-transparent"
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
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#47702d] focus:border-transparent"
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

        {/* Benachrichtigungen */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
            <Bell size={20} className="text-[#47702d]" />
            Benachrichtigungen
          </h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-800">E-Mail Benachrichtigungen</h3>
                <p className="text-sm text-gray-600">Erhalten Sie Updates zu neuen Anzeigen und Nachrichten</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.emailNotifications}
                  onChange={() => handleSettingToggle("emailNotifications")}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#47702d]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#47702d]"></div>
              </label>
            </div>
          </div>
        </div>
        
        {/* Gefährliche Aktionen */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-red-600 mb-6 flex items-center gap-2">
            <Trash2 size={20} className="text-red-600" />
            Gefährliche Aktionen
          </h2>

          <div className="p-4 bg-red-50 rounded-lg border border-red-200">
            <h3 className="font-medium text-red-800 mb-2">Account permanent löschen</h3>
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
