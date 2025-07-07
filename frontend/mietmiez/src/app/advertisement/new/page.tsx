import AdvertisementCommunication from "@/app/server_communication/server/AdvertisementCommunication";
import { NewAdvertisementProvider } from "@/app/advertisement/new/NewAdvertisementContext";
import NewAdvertisementPage from "@/app/advertisement/new/NewAdvertisementPage";

export default async function NewAdvertisementWrapper() {
  const categoriesJSON: Promise<string> =
    AdvertisementCommunication.fetchCategories().then((cats) =>
      JSON.stringify(cats),
    );
  return (
    <NewAdvertisementProvider categoriesStringPromise={categoriesJSON}>
      <NewAdvertisementPage />
    </NewAdvertisementProvider>
  );
}
