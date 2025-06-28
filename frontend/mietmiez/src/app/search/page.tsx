import SearchParams from "@/app/search/SearchParams";
import AdvertisementCommunication from "@/app/server_communication/AdvertisementCommunication";
import PetGrid from "@/app/components/PetGrid";

export default async function SearchPage({params}: { params: Promise<{ searchParams: SearchParams }> }) {
    if (params === undefined) {
        return (
            <div>
                <p>Compiled search page for build</p>
            </div>
        );
    }
    const {searchParams} = await params;
    const advertisements = await AdvertisementCommunication.fetchAdvertisementsFor(searchParams);
    return (
        <main>
            <h1>Search with following params</h1>
            <p>Animal: {searchParams.animal}</p>
            <p>City: {searchParams.zipCode}</p>
            <PetGrid advertisements={advertisements}/>
        </main>
    );
}
