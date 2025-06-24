import UserCard from "@/app/components/cards/UserCard";
import {fetchAdvertisement} from "@/app/server_communication/ServerCommunication";

export default async function AdvertisementPage({params}: { params: { id: string } }) {
    const ad = await fetchAdvertisement(params.id)
    return (
        <main>
            {/* Main Row */}
            <div>
                {/* IMAGES */}
                <div>
                    {/*  TODO: add image slideshow  */}
                </div>

                {/* USER INFO */}
                <UserCard user={ad.user}/>
                {/*  Advertisement info  */}
                <div>
                    <h1>{ad.title}</h1>
                    <p>Pet: {ad.pet.name} ({ad.pet.type})</p>
                    <p>Location: {ad.user.city}</p>
                </div>
            </div>
            {/* More information */}
            <div>
                <h2>Description</h2>
                <p>{ad.description}</p>
            </div>
        </main>
    );
}
