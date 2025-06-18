import Advertisement from "@/app/objects/advertisement";
import Image from "next/image";

export default function AdvertisementCard({advertisement}: { advertisement: Advertisement }) {
    return (
        <div>
            <Image alt={advertisement.images[0]} src={advertisement.images[0]}/>
            <h1>{advertisement.title}</h1>
            <p>{advertisement.description}</p>
        </div>
    );
}
