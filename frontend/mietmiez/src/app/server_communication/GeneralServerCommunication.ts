import UserCommunication from "@/app/server_communication/UserCommunication";

export default class GeneralServerCommunication {
  // const url: string = 'https://mietmietz.de/v1';
  static url: string = "http://backend:8080/v1"; // For docker development

  static async getHeaders() {
    const token = await UserCommunication.fetchUserCookies();
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  }
}
