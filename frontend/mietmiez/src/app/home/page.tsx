import AdvertisementCommunication from "@/app/server_communication/AdvertisementCommunication";
import {HomeProvider} from "@/app/home/HomeContext";
import DasHieristeineHomepage from "@/app/home/Home";

export default function Home() {
    const advertisements: Promise<string> = AdvertisementCommunication.fetchLatestAdvertisements().then((ads) => JSON.stringify(ads));
    return (
        <HomeProvider advertisements={advertisements}>
            <DasHieristeineHomepage/>
        </HomeProvider>
    );
}
