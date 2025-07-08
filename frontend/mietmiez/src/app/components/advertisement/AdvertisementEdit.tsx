"use client";

import { Edit } from "lucide-react";
import ImageSlider from "@/app/components/ImageSlider";
import UserCard from "@/app/components/cards/UserCard";
import { useState } from "react";
import AdvertisementFetched from "@/app/objects/advertisement/AdvertisementFetched";

export default function AdvertisementEdit({
  isLoggedIn,
  advertisement,
}: {
  isLoggedIn: boolean;
  advertisement: string;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const ad: AdvertisementFetched = AdvertisementFetched.fromJSON(
    JSON.parse(advertisement),
  );

  return (
    <main className="px-4 py-8 md:px-12 lg:px-24 max-w-6xl mx-auto">
      {isLoggedIn ? (
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="flex items-center gap-2 px-4 py-2 bg-[#47702d] text-white rounded-lg hover:bg-[#3a5a25] transition-colors disabled:bg-gray-400"
        >
          <Edit size={16} />
          {isEditing ? "Abbrechen" : "Bearbeiten"}
        </button>
      ) : null}
      {/* Grid: Image + Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Images Section */}
        <div className="w-full aspect-video overflow-hidden rounded-2xl shadow-md">
          <ImageSlider images={ad.images} externalFetching={true} />
        </div>

        {/* Info Section */}
        <div className="space-y-6">
          {/* User Info */}
          <div className="rounded-xl shadow-md p-4 bg-white dark:bg-gray-900">
            <UserCard userJSON={JSON.stringify(ad.user.toJSON())} />
          </div>

          {/* Advertisement Text Info */}
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {ad.title}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              <strong>Animal:</strong> {ad.animal}
            </p>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              <strong>Location:</strong> {ad.user.city}
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
          {ad.description}
        </p>
      </div>
    </main>
  );
}
