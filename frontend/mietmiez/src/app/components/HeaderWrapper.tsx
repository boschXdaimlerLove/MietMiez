import Header from "@/app/components/header";
import AdvertisementCommunication from "@/app/server_communication/server/AdvertisementCommunication";
import { HeaderProvider } from "@/app/components/HeaderContext";
import UserCommunication from "@/app/server_communication/server/UserCommunication";

export default async function HeaderWrapper() {
  const categoriesJSON: Promise<string> =
    AdvertisementCommunication.fetchCategories().then((cats) =>
      JSON.stringify(cats),
    );
  let isLoggedIn: boolean;
  try {
    await UserCommunication.fetchSelfUser();
    isLoggedIn = true;
  } catch {
    isLoggedIn = false;
  }
  return (
    <HeaderProvider
      categoriesStringPromise={categoriesJSON}
      isLoggedIn={isLoggedIn}
    >
      <Header />
    </HeaderProvider>
  );
}
