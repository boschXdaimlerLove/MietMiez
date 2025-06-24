import PetGrid from "@/app/components/PetGrid";
import {fetchAdvertisementsFor} from "@/app/server_communication/ServerCommunication";
import SearchParams from "@/app/search/SearchParams";

export default async function SearchPage({searchParams}: { searchParams: SearchParams }) {
    const advertisements = await fetchAdvertisementsFor(searchParams);

    return (
        <main>
            <h1>Search with following params</h1>
            <p>Animal: {searchParams.animal}</p>
            <p>City: {searchParams.zipCode}</p>
            <PetGrid advertisements={advertisements}/>
        </main>
    );
}
