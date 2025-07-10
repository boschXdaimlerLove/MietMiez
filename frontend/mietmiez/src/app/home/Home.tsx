"use client";

import { use } from "react";
import AdvertisementFetched from "@/app/objects/advertisement/AdvertisementFetched";
import PetGrid from "@/app/components/PetGrid";
import { useHomeContext } from "@/app/home/HomeContext";

/**
 * the client component to display the home page
 * @constructor
 */
export default function Home() {
  const advertisementsStringPromise = useHomeContext();
  const advertisementsString = use(advertisementsStringPromise);
  const advertisements: AdvertisementFetched[] =
    JSON.parse(advertisementsString);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Main Content */}
      <main className="flex-1 p-8">
        <h1 className="text-3xl text-center text-[#47702d] mb-8">
          Welcome to MietMiez!
        </h1>

        {/* Pet Cards Grid Example */}
        <PetGrid advertisements={advertisements} />
      </main>
    </div>
  );
}
