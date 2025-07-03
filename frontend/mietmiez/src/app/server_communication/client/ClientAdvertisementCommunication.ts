"use client";

import Advertisement from "@/app/objects/advertisement";

export default class ClientAdvertisementCommunication {
  static async uploadImagesForAdvertisement(
    advertisement: Advertisement,
    images: File[],
  ): Promise<Advertisement> {
    for (const imageIndex in images) {
      const formData = new FormData();
      formData.append("document", images[imageIndex]);
      const uploadRes = await fetch(`/api/advertisement/image`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      if (!uploadRes.ok) {
        // const error = await uploadRes.json();
        // console.error("Error uploading image:", error);
        // throw new Error("Failed to upload image");
      } else {
        const json = await uploadRes.text();
        const imageID = JSON.parse(json).imageID;
        advertisement.images.push(imageID);
      }
    }
    return advertisement;
  }
}
