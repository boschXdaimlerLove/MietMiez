import UserCommunication from "@/app/server_communication/server/UserCommunication";
import User from "@/app/objects/user/user";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ mail: string }>;
}) {
  const { mail } = await params;
  const decodedMail = decodeURIComponent(mail);
  const user: User = await UserCommunication.fetchUser(decodedMail);
  return (
    <main className="max-w-2xl mx-auto p-8 font-sans">
      <h1 className="text-3xl font-bold mb-6">
        Profil von {user.firstName} {user.lastName}
      </h1>
      <div className="space-y-4 text-gray-800">
        <p>
          <span className="font-semibold">Vorname:</span> {user.firstName}
        </p>
        <p>
          <span className="font-semibold">Nachname:</span> {user.lastName}
        </p>
        <p>
          <span className="font-semibold">Email:</span> {user.email}
        </p>
        <p>
          <span className="font-semibold">Stadt:</span> {user.city}
        </p>
        <p>
          <span className="font-semibold">PLZ:</span> {user.zipCode}
        </p>
        <p>
          <span className="font-semibold">Favoriten:</span>{" "}
          {user.favorites.length > 0
            ? user.favorites.join(", ")
            : "Keine Favoriten vorhanden"}
        </p>
      </div>
    </main>
  );
}
