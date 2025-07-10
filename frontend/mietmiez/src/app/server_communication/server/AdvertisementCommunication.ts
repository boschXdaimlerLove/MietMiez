import AdvertisementFetched, { AdvertisementFetchedJson } from "@/app/objects/advertisement/AdvertisementFetched";
import SearchParams from "@/app/objects/SearchParams";
import GeneralServerCommunication from "@/app/server_communication/server/GeneralServerCommunication";
import Category, { CategoryJson } from "@/app/objects/internal/category";
import AdvertisementUpload from "@/app/objects/advertisement/AdvertisementUpload";

/**
 * Handles communication with the backend server regarding advertisements.
 */
export default class AdvertisementCommunication {
  /* CATEGORIES */

  /**
   * converts a response to an array of AdvertisementFetched objects.
   * @param response
   */
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

  /**
   * fetches the categories from the server
   */
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

  /**
   * fetches all advertisements for the given search parameters.
   * @param params - the search criteria for advertisements.
   */
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

  /**
   * fetches the latest advertisements from the server
   * Used on the home screen
   */
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

  /**
   * fetches a specific advertisement by its ID.
   * @param id
   */
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

  /**
   * fetches all user favorites from the backend
   */
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

  /**
   * creates a new advertisement on the server.
   * @param ad - the advertisement to to upload
   */
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

  /**
   * uploads an image for an advertisement.
   * @param image - the image file to upload
   */
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

  /**
   * fetches an image from the server by its ID specified when the image was uploaded.
   * @param id - the image id
   */
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

  /**
   * updates an existing advertisement with new data.
   * @param ad - the advertisement to update with new data
   */
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

  /**
   * deletes an advertisement by its ID.
   * @param id - the id of the advertisement to delete
   */
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
