import SearchParams from "@/app/search/SearchParams";
import AdvertisementCommunication from "@/app/server_communication/AdvertisementCommunication";
import PetGrid from "@/app/components/PetGrid";

export default async function SearchPage({
  searchParams
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  // Await the searchParams in Next.js 15
  const resolvedSearchParams = await searchParams;
  
  // Convert to SearchParams format
  const animal = typeof resolvedSearchParams.animal === 'string' ? resolvedSearchParams.animal : '';
  const zipCode = typeof resolvedSearchParams['zip-code'] === 'string' ? resolvedSearchParams['zip-code'] : '';
  
  const searchParamsObject = new SearchParams(animal, zipCode);

  if (!searchParamsObject.animal && !searchParamsObject.zipCode) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Suche</h1>
          <p className="text-gray-600">Keine Suchparameter gefunden</p>
        </div>
      </div>
    );
  }

  try {
    const advertisements = await AdvertisementCommunication.fetchAdvertisementsFor(searchParamsObject);
    
    return (
      <main className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Suchergebnisse</h1>
          <div className="mb-6 text-gray-600">
            {searchParamsObject.animal && <p>Tier: {searchParamsObject.animal}</p>}
            {searchParamsObject.zipCode && <p>PLZ: {searchParamsObject.zipCode}</p>}
          </div>
          <PetGrid advertisements={advertisements}/>
        </div>
      </main>
    );
  } catch (error) {
    console.error("Error fetching advertisements:", error);
    
    return (
      <main className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Suchergebnisse</h1>
          <div className="mb-6 text-gray-600">
            {searchParamsObject.animal && <p>Tier: {searchParamsObject.animal}</p>}
            {searchParamsObject.zipCode && <p>PLZ: {searchParamsObject.zipCode}</p>}
          </div>
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">Keine Anzeigen gefunden oder Fehler beim Laden der Daten.</p>
            <p className="text-sm text-gray-500">Versuchen Sie es mit anderen Suchkriterien.</p>
          </div>
        </div>
      </main>
    );
  }
}
