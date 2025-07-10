import AdvertisementFetched, {
  AdvertisementFetchedJson,
} from "@/app/objects/advertisement/AdvertisementFetched";
import SearchParams from "@/app/objects/SearchParams";
import GeneralServerCommunication from "@/app/server_communication/server/GeneralServerCommunication";
import Category, { CategoryJson } from "@/app/objects/internal/category";
import AdvertisementUpload from "@/app/objects/advertisement/AdvertisementUpload";

export default class AdvertisementCommunication {
  /* CATEGORIES */

  static async responseToAdvertisements(
    response: Response,
  ): Promise<AdvertisementFetched[]> {
    const json = await response.text();
    if (json == "null" || json == "{}") {
      return [];
    }
    return JSON.parse(json).map((advertisement: AdvertisementFetchedJson) =>
      AdvertisementFetched.fromJSON(advertisement),
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
  ): Promise<AdvertisementFetched[]> {
    if (params === undefined) {
      // set default params for build
      params = new SearchParams("katze", "12345");
    }
    if (params.animal === "All Categories") {
      params.animal = "";
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

  static async fetchLatestAdvertisements(): Promise<AdvertisementFetched[]> {
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

  static async fetchAdvertisement(id: string): Promise<AdvertisementFetched> {
    const adRes = await fetch(
      `${GeneralServerCommunication.url}/advertisement/${encodeURIComponent(id)}`,
      {
        cache: "no-cache",
        method: "GET",
        headers: await GeneralServerCommunication.getHeaders(),
        credentials: "include",
      },
    );
    const adJson = await adRes.json();
    return AdvertisementFetched.fromJSON(adJson);
  }

  static async fetchUserFavorites(): Promise<AdvertisementFetched[]> {
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

  static async createAdvertisement(ad: AdvertisementUpload): Promise<void> {
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

  static async fetchImage(id: string): Promise<Response> {
    return await fetch(
      `${GeneralServerCommunication.url}/image/${encodeURIComponent(id)}`,
      {
        method: "GET",
        headers: await GeneralServerCommunication.getHeaders(),
        credentials: "include",
      },
    );
  }

  static async updateAdvertisement(ad: AdvertisementFetched): Promise<void> {
    const adRes = await fetch(
      `${GeneralServerCommunication.url}/advertisement/${encodeURIComponent(ad.id)}`,
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
      `${GeneralServerCommunication.url}/advertisement/${encodeURIComponent(id)}`,
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
