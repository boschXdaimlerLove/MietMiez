import {HomeProvider} from "@/app/home/HomeContext";
import DasHieristeineHomepage from "@/app/home/page";
import AdvertisementCommunication from "@/app/server_communication/AdvertisementCommunication";

export default function HomeWrapper() {
    const advertisements: Promise<string> = AdvertisementCommunication.fetchLatestAdvertisements().then((ads) => JSON.stringify(ads));
    return (
        <HomeProvider advertisements={advertisements}>
            <DasHieristeineHomepage/>
        </HomeProvider>
    );
}
