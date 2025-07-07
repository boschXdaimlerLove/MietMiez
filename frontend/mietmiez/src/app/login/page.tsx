import { LoginProvider } from "@/app/login/LoginContext";
import Login from "@/app/login/Login";
import UserCommunication from "@/app/server_communication/server/UserCommunication";

export default async function LoginWrapper() {
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
