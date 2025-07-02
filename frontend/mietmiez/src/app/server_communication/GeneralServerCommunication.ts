import UserCommunication from "@/app/server_communication/UserCommunication";
import About from "@/app/objects/about";

export default class GeneralServerCommunication {
  // const url: string = 'https://mietmietz.de/v1';
  static url: string = "http://backend:8080/v1"; // For docker development

  static async getHeaders() {
    const token = await UserCommunication.fetchUserCookies();
    return {
      "Content-Type": "application/json",
      Cookie: `session=${token}`,
    };
  }

  static async fetchAbout(): Promise<About> {
    const response = await fetch(`${this.url}/about.json`, {
      method: "GET",
      cache: "no-cache",
      headers: await this.getHeaders(),
    });
    console.log("Response from fetchAbout:", response);
    if (!response.ok) {
      throw new Error("Failed to fetch about information");
    }
    return About.fromJSON(JSON.parse(await response.text()));
  }
}
