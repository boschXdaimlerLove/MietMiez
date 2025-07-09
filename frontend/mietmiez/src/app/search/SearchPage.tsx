"use client";

import PetGrid from "@/app/components/PetGrid";
import AdvertisementFetched, {
  AdvertisementFetchedJson,
} from "@/app/objects/advertisement/AdvertisementFetched";
import Button from "@/app/components/button";
import { useRouter } from "next/navigation";

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
      <main>
        <h1 className="text-2xl font-bold text-center mt-8">
          No advertisements found
        </h1>
        <p className="text-center mt-4">
          try different search criteria or check back later.
        </p>
        <Button
          isPrimary={true}
          onClick={() => router.replace("/home")}
          title={"Return to home"}
        />
      </main>
    );
  }
  return (
    <main>
      <PetGrid advertisements={ads} />
      <Button
        isPrimary={true}
        onClick={() => router.replace("/home")}
        title={"Return to home"}
      />
    </main>
  );
}
