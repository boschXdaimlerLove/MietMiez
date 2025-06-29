import Advertisement from "@/app/objects/advertisement";
import PetCard from "@/app/components/cards/Petcard";

export default function PetGrid({advertisements}: { advertisements: Advertisement[] }) {
    return (
        <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {advertisements.map((ad, index) => (
                    <PetCard
                        key={ad.id ?? index}
                        advertisementJSON={JSON.stringify(ad)}
                    />
                ))}
            </div>
        </div>
    );
}
