import AdvertisementCommunication from "@/app/server_communication/server/AdvertisementCommunication";
import PetGrid from "@/app/components/PetGrid";
import SearchParams from "@/app/objects/SearchParams";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ animal?: string; zipCode?: string }>;
}) {
  const extractedParams = await searchParams;
  const { animal, zipCode } = extractedParams;
  const searchObject = new SearchParams(animal, zipCode);
  const advertisements =
    await AdvertisementCommunication.fetchAdvertisementsFor(searchObject);
  if (advertisements.length === 0) {
    return (
      <main>
        <h1 className="text-2xl font-bold text-center mt-8">
          No advertisements found
        </h1>
        <p className="text-center mt-4">
          try different search criteria or check back later.
        </p>
      </main>
    );
  }
  return (
    <main>
      <PetGrid advertisements={advertisements} />
    </main>
  );
}
