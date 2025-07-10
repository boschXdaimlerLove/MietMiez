import AdvertisementCommunication from "@/app/server_communication/server/AdvertisementCommunication";
import SearchParams from "@/app/objects/SearchParams";
import SearchPage from "@/app/search/SearchPage";

/**
 * search page wrapper to extract params and fetch advertisements
 * @param searchParams - params with search criteria
 * @constructor
 */
export default async function SearchPageWrapper({
  searchParams,
}: {
  searchParams: Promise<{ animal?: string; zipCode?: string }>;
}) {
  const extractedParams = await searchParams;
  const { animal, zipCode } = extractedParams;
  const searchObject = new SearchParams(animal, zipCode);
  const advertisements =
    await AdvertisementCommunication.fetchAdvertisementsFor(searchObject);
  return <SearchPage advertisements={JSON.stringify(advertisements)} />;
}
