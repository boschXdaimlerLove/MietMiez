"use client";

import AdvertisementUpload from "@/app/objects/advertisement/AdvertisementUpload";

export default class ClientAdvertisementCommunication {
  static async uploadImagesForAdvertisement(
    advertisement: AdvertisementUpload,
    images: File[],
  ): Promise<AdvertisementUpload> {
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

  static async createAdvertisement(ad: AdvertisementUpload): Promise<boolean> {
    const res = await fetch(`/api/advertisement`, {
      method: "POST",
      body: JSON.stringify(ad),
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    return res.ok;
  }

  static async updateAdvertisement(ad: AdvertisementUpload): Promise<boolean> {
    const res = await fetch(`/api/advertisement`, {
      method: "PATCH",
      body: JSON.stringify(ad),
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    return res.ok;
  }

  static async deleteAdvertisement(ad: AdvertisementUpload): Promise<boolean> {
    const res = await fetch(`/api/advertisement`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(ad),
      credentials: "include",
    });

    return res.ok;
  }
}
