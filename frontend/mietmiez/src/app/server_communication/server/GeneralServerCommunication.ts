import UserCommunication from "@/app/server_communication/server/UserCommunication";
import About from "@/app/objects/about";

/**
 * Server communication class for general operations.
 */
export default class GeneralServerCommunication {
  // const url: string = 'https://mietmietz.de/v1';
  /**
   * url to communicate with the backend server.
   */
  static url: string = "http://backend:8080/v1"; // For docker development

  /**
   * method to provide headers for requests.
   */
  static async getHeaders() {
    const token = await UserCommunication.fetchUserCookies();
    return {
      "Content-Type": "application/json",
      Cookie: `session=${token}`,
    };
  }

  /**
   * method to provide headers for requests that include form data.
   */
  static async getHeadersForFormData() {
    const token = await UserCommunication.fetchUserCookies();
    return {
      Cookie: `session=${token}`,
    };
  }

  /**
   * Fetches the about information from the server.
   */
  static async fetchAbout(): Promise<About> {
    const response = await fetch(`${this.url}/about.json`, {
      method: "GET",
      cache: "no-cache",
      headers: await this.getHeaders(),
    });
    if (!response.ok) {
      throw new Error("Failed to fetch about information");
    }
    const text = await response.text();
    const json = JSON.parse(text);
    return About.fromJSON(json);
  }
}
