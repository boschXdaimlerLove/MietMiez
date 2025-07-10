import { ProfileProvider } from "@/app/profile/ProfileContext";
import Profile from "@/app/profile/Profile";
import UserCommunication from "@/app/server_communication/server/UserCommunication";
import User from "@/app/objects/user/user";
import NotLoggedIn from "@/app/components/UserState/NotLoggedIn";

/**
 * wrapper for the profile page to fetch user data
 * @constructor
 */
export default async function ProfileWrapper() {
  let user: string;
  try {
    const localUser: User = await UserCommunication.fetchSelfUser();
    user = JSON.stringify(localUser);
  } catch {
    return <NotLoggedIn />;
  }
  return (
    <ProfileProvider user={user}>
      <Profile />
    </ProfileProvider>
  );
}
