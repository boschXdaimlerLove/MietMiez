import AdvertisementFetched from "@/app/objects/advertisement/AdvertisementFetched";
import AdvertisementCommunication from "@/app/server_communication/server/AdvertisementCommunication";
import UserCard from "@/app/components/cards/UserCard";
import ImageSlider from "@/app/components/ImageSlider";

export default async function AdvertisementPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const advertisement: AdvertisementFetched =
    await AdvertisementCommunication.fetchAdvertisement(id);

  return (
    <main className="px-4 py-8 md:px-12 lg:px-24 max-w-6xl mx-auto">
      {/* Grid: Image + Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Images Section */}
        <div className="w-full aspect-video overflow-hidden rounded-2xl shadow-md">
          <ImageSlider images={advertisement.images} externalFetching={true} />
        </div>

        {/* Info Section */}
        <div className="space-y-6">
          {/* User Info */}
          <div className="rounded-xl shadow-md p-4 bg-white dark:bg-gray-900">
            <UserCard userJSON={JSON.stringify(advertisement.user.toJSON())} />
          </div>

          {/* Advertisement Text Info */}
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {advertisement.title}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              <strong>Animal:</strong> {advertisement.animal}
            </p>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              <strong>Location:</strong> {advertisement.user.city}
            </p>
          </div>
        </div>
      </div>

      {/* Description Section */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-2">
          Description
        </h2>
        <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
          {advertisement.description}
        </p>
      </div>
    </main>
  );
}
