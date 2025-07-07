"use client";

import { useRouter } from "next/navigation";
import AdvertisementFetched from "@/app/objects/advertisement/AdvertisementFetched";
import Button from "@/app/components/button";
import Image from "next/image";

export default function PetCard({
  advertisementJSON,
}: {
  advertisementJSON: string;
}) {
  const advertisement: AdvertisementFetched = AdvertisementFetched.fromJSON(
    JSON.parse(advertisementJSON),
  );
  const router = useRouter();

  const hasImages: boolean =
    Array.isArray(advertisement.images) && advertisement.images.length > 0;
  return (
    <div className="max-w-sm bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
      <Image
        className="w-full h-48 object-cover rounded-t-xl"
        alt={advertisement.animal}
        src={
          hasImages
            ? `/api/advertisement/image?id=${encodeURIComponent(advertisement.images[0])}`
            : "/mietmiez_icon_256.png"
        }
        width={500}
        height={300}
      />
      <div className="p-4">
        <h2 className="text-lg font-bold text-gray-900">
          {advertisement.animal}
        </h2>
        <p className="text-sm text-gray-600 mt-1 flex items-center">
          <span className="mr-1">📍</span> {advertisement.user.city}
        </p>
        <Button
          isPrimary={true}
          onClick={() => {
            router.push(`/advertisement/${advertisement.id}`);
          }}
          title="Details ansehen"
          // className="mt-4 w-full bg-blue-100 text-blue-900 font-semibold py-2 rounded-lg hover:bg-blue-200 transition"
        />
      </div>
    </div>
  );
}
