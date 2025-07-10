"use client";

import PetGrid from "@/app/components/PetGrid";
import AdvertisementFetched, { AdvertisementFetchedJson } from "@/app/objects/advertisement/AdvertisementFetched";
import Button from "@/app/components/button";
import { useRouter } from "next/navigation";

/**
 * actual search apge displaying the results of the search
 * @param advertisements - the advertisements to display
 * @constructor
 */
export default function SearchPage({
  advertisements,
}: {
  advertisements: string;
}) {
  const arr: AdvertisementFetchedJson[] = JSON.parse(advertisements);
  const ads: AdvertisementFetched[] = arr.map((ad) =>
    AdvertisementFetched.fromJSON(ad),
  );
  const router = useRouter();
  if (ads.length === 0) {
    return (
      <main className="px-4 py-8">
        <h1 className="text-2xl font-bold text-center mt-8">
          No advertisements found
        </h1>
        <p className="text-center mt-4">
          try different search criteria or check back later.
        </p>
        <div className="flex justify-center mt-6">
          <Button
            isPrimary={true}
            onClick={() => router.replace("/home")}
            title={"Return to home"}
          />
        </div>
      </main>
    );
  }
  return (
    <main className="px-4 py-8">
      <div className="mb-8">
        <PetGrid advertisements={ads} />
      </div>
      <div className="flex justify-center">
        <Button
          isPrimary={true}
          onClick={() => router.replace("/home")}
          title={"Return to home"}
        />
      </div>
    </main>
  );
}
