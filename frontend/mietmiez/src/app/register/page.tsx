import UserCommunication from "@/app/server_communication/server/UserCommunication";
import { RegisterProvider } from "@/app/register/RegisterContext";
import Register from "@/app/register/Register";

/**
 * RegisterWrapper component that checks if the user is logged in
 * @constructor
 */
export default async function RegisterWrapper() {
  let isLoggedIn: boolean;
  try {
    await UserCommunication.fetchSelfUser();
    isLoggedIn = true;
  } catch {
    isLoggedIn = false;
  }
  return (
    <RegisterProvider isLoggedIn={isLoggedIn}>
      <Register />
    </RegisterProvider>
  );
}
