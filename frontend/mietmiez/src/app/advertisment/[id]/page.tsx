import Advertisement from "@/app/objects/advertisement";
import AdvertisementCommunication from "@/app/server_communication/AdvertisementCommunication";
import UserCard from "@/app/components/cards/UserCard";

export default async function AdvertisementPage({params}: { params: Promise<{ id: string }> }) {
    const {id} = await params;
    const advertisement: Advertisement = await AdvertisementCommunication.fetchAdvertisement(id);
    return (
        <main>
            {/* Main Row */}
            <div>
                {/* IMAGES */}
                <div>
                    {/*  TODO: add image slideshow  */}
                </div>

                {/* USER INFO */}
                <UserCard user={advertisement.user}/>
                {/*  Advertisement info  */}
                <div>
                    <h1>{advertisement.title}</h1>
                    <p>Pet: {advertisement.pet.name} ({advertisement.pet.type})</p>
                    <p>Location: {advertisement.user.city}</p>
                </div>
            </div>
            {/* More information */}
            <div>
                <h2>Description</h2>
                <p>{advertisement.description}</p>
            </div>
        </main>
    );
}
