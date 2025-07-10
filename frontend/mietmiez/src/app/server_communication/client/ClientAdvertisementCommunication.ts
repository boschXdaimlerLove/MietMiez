"use client";

import AdvertisementUpload from "@/app/objects/advertisement/AdvertisementUpload";

/**
 * client class for communication with the internal API
 */
export default class ClientAdvertisementCommunication {
  /**
   * Uploads images for an advertisement.
   * @param advertisement - the advertisement to upload
   * @param images - the images to upload
   * @returns the advertisement with the image ids added
   */
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

  /**
   * creates a new advertisement. Communicates with the internal api
   * @param ad - the advertisement to create
   */
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

  /**
   * updates an existing advertisement. Communicates with the internal api
   * @param ad - the advertisement to update
   */
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

  /**
   * Deletes an advertisement. Communicates with the internal api
   * @param ad
   */
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
