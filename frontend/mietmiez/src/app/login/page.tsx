import { LoginProvider } from "@/app/login/LoginContext";
import Login from "@/app/login/Login";
import UserCommunication from "@/app/server_communication/server/UserCommunication";

/**
 * server component wrapper for the login page
 * @constructor
 */
export default async function LoginWrapper() {
  // get user login state
  let isLoggedIn: boolean;
  try {
    await UserCommunication.fetchSelfUser();
    isLoggedIn = true;
  } catch {
    isLoggedIn = false;
  }
  return (
    <LoginProvider isLoggedIn={isLoggedIn}>
      <Login />
    </LoginProvider>
  );
}
