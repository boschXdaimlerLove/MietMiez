import AdvertisementCommunication from "@/app/server_communication/server/AdvertisementCommunication";
import { NewAdvertisementProvider } from "@/app/advertisement/new/NewAdvertisementContext";
import NewAdvertisementPage from "@/app/advertisement/new/NewAdvertisementPage";
import UserCommunication from "@/app/server_communication/server/UserCommunication";
import NotLoggedIn from "@/app/components/UserState/NotLoggedIn";

/**
 * server wrapper for new advertisement page
 * @constructor
 */
export default async function NewAdvertisementWrapper() {
  const categoriesJSON: Promise<string> =
    AdvertisementCommunication.fetchCategories().then((cats) =>
      JSON.stringify(cats),
    );
  let isLoggedIn = false;
  try {
    await UserCommunication.fetchSelfUser();
    isLoggedIn = true;
  } catch {
    isLoggedIn = false;
  }

  if (!isLoggedIn) {
    return <NotLoggedIn />;
  }

  return (
    <NewAdvertisementProvider categoriesStringPromise={categoriesJSON}>
      <NewAdvertisementPage />
    </NewAdvertisementProvider>
  );
}
