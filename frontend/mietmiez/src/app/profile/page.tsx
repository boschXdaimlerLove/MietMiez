import { ProfileProvider } from "@/app/profile/ProfileContext";
import Profile from "@/app/profile/Profile";
import UserCommunication from "@/app/server_communication/server/UserCommunication";

export default function ProfileWrapper() {
  const user: Promise<string> = UserCommunication.fetchSelfUser().then((user) =>
    JSON.stringify(user),
  );
  return (
    <ProfileProvider user={user}>
      <Profile />
    </ProfileProvider>
  );
}
