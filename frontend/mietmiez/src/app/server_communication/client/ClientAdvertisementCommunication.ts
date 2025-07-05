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

  static async fetchImage(id: string): Promise<File> {
    const res = await fetch(`/api/advertisement/image`, {
      method: "GET",
      credentials: "include",
      body: id,
    });
    if (!res.ok) {
      // const error = await res.json();
      // console.error("Error fetching image:", error);
      // throw new Error("Failed to fetch image");
    }
    const blob: Blob = await res.blob();
    const mimeType: string = blob.type;
    return new File([blob], id, { type: mimeType });
  }
}
