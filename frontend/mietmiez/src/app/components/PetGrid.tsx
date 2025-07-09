import AdvertisementFetched from "@/app/objects/advertisement/AdvertisementFetched";
import PetCard from "@/app/components/cards/Petcard";

export default function PetGrid({
  advertisements,
}: {
  advertisements: AdvertisementFetched[];
}) {
  if (advertisements.length === 0) {
    return (
      <div className="max-w-6xl mx-auto text-center">
        <h1 className="text-2xl font-bold mt-8">No advertisements found</h1>
        <p className="mt-4">
          Try different search criteria or check back later.
        </p>
      </div>
    );
  }
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
