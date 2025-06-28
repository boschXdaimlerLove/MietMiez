import AdvertisementCommunication from "@/app/server_communication/AdvertisementCommunication";
import Advertisement from "@/app/objects/advertisement";
import {HomeProvider} from "@/app/HomeContext";
import Home from "@/app/Home";

export default async function HomeWrapper() {
    const advertisements: Advertisement[] = await AdvertisementCommunication.fetchLatestAdvertisements();
    const advertisementsJSON: string = JSON.stringify(advertisements);
    return (
        <HomeProvider advertisements={advertisementsJSON}>
            <Home/>
        </HomeProvider>
    );
}
