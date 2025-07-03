import Advertisement, { AdvertisementJson } from "@/app/objects/advertisement";
import SearchParams from "@/app/search/SearchParams";
import GeneralServerCommunication from "@/app/server_communication/server/GeneralServerCommunication";
import Category, { CategoryJson } from "@/app/objects/category";

export default class AdvertisementCommunication {
  /* CATEGORIES */

  static async responseToAdvertisements(
    response: Response,
  ): Promise<Advertisement[]> {
    const json = await response.text();
    if (json == "null" || json == "{}") {
      return [];
    }
    return JSON.parse(json).map((advertisement: AdvertisementJson) =>
      Advertisement.fromJSON(advertisement),
    );
  }

  /* ADVERTISEMENTS */

  static async fetchCategories(): Promise<Category[]> {
    const categoriesRes = await fetch(
      `${GeneralServerCommunication.url}/categories/`,
      {
        cache: "no-cache",
        method: "GET",
        headers: await GeneralServerCommunication.getHeaders(),
        credentials: "include",
      },
    );
    const categoriesJSON: string = await categoriesRes.text();
    if (categoriesJSON == "null" || categoriesJSON == "{}") {
      return [];
    }
    return JSON.parse(categoriesJSON).map((category: CategoryJson) =>
      Category.fromJSON(category),
    );
  }

  static async fetchAdvertisementsFor(
    params: SearchParams,
  ): Promise<Advertisement[]> {
    if (params === undefined) {
      // set default params for build
      params = new SearchParams("katze", "12345");
    }
    const ads = await fetch(
      `${GeneralServerCommunication.url}/advertisement/search?animal=${encodeURIComponent(params.animal ?? "")}&zip-code=${encodeURIComponent(params.zipCode ?? "")}`,
      {
        cache: "no-cache",
        method: "GET",
        headers: await GeneralServerCommunication.getHeaders(),
        credentials: "include",
      },
    );
    return AdvertisementCommunication.responseToAdvertisements(ads);
  }

  static async fetchLatestAdvertisements(): Promise<Advertisement[]> {
    const ads = await fetch(
      `${GeneralServerCommunication.url}/advertisement?page=1`,
      {
        cache: "no-cache",
        method: "GET",
        headers: await GeneralServerCommunication.getHeaders(),
        credentials: "include",
      },
    );
    return AdvertisementCommunication.responseToAdvertisements(ads);
  }

  static async fetchAdvertisement(id: string): Promise<Advertisement> {
    const adRes = await fetch(
      `${GeneralServerCommunication.url}/advertisement/${id}`,
      {
        cache: "no-cache",
        method: "GET",
        headers: await GeneralServerCommunication.getHeaders(),
        credentials: "include",
      },
    );
    const adJson = await adRes.json();
    return Advertisement.fromJSON(adJson);
  }

  static async fetchUserFavorites(): Promise<Advertisement[]> {
    const favoritesRes = await fetch(
      `${GeneralServerCommunication.url}/user/favorites/`,
      {
        cache: "no-cache",
        method: "GET",
        headers: await GeneralServerCommunication.getHeaders(),
        credentials: "include",
      },
    );
    return AdvertisementCommunication.responseToAdvertisements(favoritesRes);
  }

  static async createAdvertisement(ad: Advertisement): Promise<void> {
    const adRes = await fetch(
      `${GeneralServerCommunication.url}/advertisement`,
      {
        method: "POST",
        headers: await GeneralServerCommunication.getHeaders(),
        body: JSON.stringify(ad),
        credentials: "include",
      },
    );
    if (!adRes.ok) {
      // const error = await adRes.json();
      // console.error("Error creating advertisement:", error);
      // throw new Error("Failed to create advertisement");
    }
  }

  static async uploadImageForAdvertisement(image: File): Promise<string> {
    const formData = new FormData();
    formData.append("document", image);

    const uploadRes = await fetch(`${GeneralServerCommunication.url}/image`, {
      method: "POST",
      body: formData,
      credentials: "include",
      headers: await GeneralServerCommunication.getHeadersForFormData(),
    });
    const responseText = await uploadRes.text();
    const json = JSON.parse(responseText);
    const imageID = json.id;
    if (!uploadRes.ok) {
      // const error = await uploadRes.json();
      // console.error("Error uploading image:", error);
      throw new Error("Failed to upload image");
    } else {
      return imageID;
    }
  }

  static async updateAdvertisement(ad: Advertisement): Promise<void> {
    const adRes = await fetch(
      `${GeneralServerCommunication.url}/advertisement/${ad.id}`,
      {
        method: "PATCH",
        headers: await GeneralServerCommunication.getHeaders(),
        body: JSON.stringify(ad),
        credentials: "include",
      },
    );
    if (!adRes.ok) {
      // const error = await adRes.json();
      // console.error("Error updating advertisement:", error);
      // throw new Error("Failed to update advertisement");
    }
  }

  static async deleteAdvertisement(id: string): Promise<void> {
    const adRes = await fetch(
      `${GeneralServerCommunication.url}/advertisement/${id}`,
      {
        method: "DELETE",
        headers: await GeneralServerCommunication.getHeaders(),
        credentials: "include",
      },
    );
    if (!adRes.ok) {
      // const error = await adRes.json();
      // console.error("Error deleting advertisement:", error);
      // throw new Error("Failed to delete advertisement");
    }
  }
}
