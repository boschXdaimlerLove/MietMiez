import Header from "@/app/components/header";
import AdvertisementCommunication from "@/app/server_communication/server/AdvertisementCommunication";
import { HeaderProvider } from "@/app/components/HeaderContext";

export default function HeaderWrapper() {
  const categoriesJSON: Promise<string> =
    AdvertisementCommunication.fetchCategories().then((cats) =>
      JSON.stringify(cats),
    );
  return (
    <HeaderProvider categories={categoriesJSON}>
      <Header />
    </HeaderProvider>
  );
}
