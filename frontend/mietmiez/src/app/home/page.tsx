import AdvertisementCommunication from "@/app/server_communication/server/AdvertisementCommunication";
import { HomeProvider } from "@/app/home/HomeContext";
import Home from "@/app/home/Home";

/**
 * server component wrapper for the home page
 * This provides advertisements fetched from the server as string
 * @constructor
 */
export default function HomeWrapper() {
  const advertisements: Promise<string> =
    AdvertisementCommunication.fetchLatestAdvertisements().then((ads) =>
      JSON.stringify(ads),
    );
  return (
    <HomeProvider advertisements={advertisements}>
      <Home />
    </HomeProvider>
  );
}
