import GeneralServerCommunication from "@/app/server_communication/server/GeneralServerCommunication";
import User from "@/app/objects/user/user";
import AdvertisementFetched from "@/app/objects/advertisement/AdvertisementFetched";
import { cookies } from "next/headers";

export default class UserCommunication {
  static async fetchUserCookies(): Promise<string | undefined> {
    const cookieStore = await cookies();
    return cookieStore.get("token")?.value;
  }

  static async login(
    email: string,
    password: string,
  ): Promise<{ token: string; expires_at: string }> {
    const loginRes = await fetch(
      `${GeneralServerCommunication.url}/user/login/`,
      {
        cache: "no-cache",
        method: "POST",
        headers: await GeneralServerCommunication.getHeaders(),
        body: JSON.stringify({ email, password }),
        credentials: "include",
      },
    );
    if (!loginRes.ok) {
      throw new Error("Login failed");
    }
    return await loginRes.json();
  }

  static async register(user: User, password: string): Promise<void> {
    const body = {
      ...user.toJSON(),
      password: password,
    };
    const res = await fetch(`${GeneralServerCommunication.url}/user/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      credentials: "include",
    });
    if (!res.ok) {
      const error = await res.json();
      console.error("Error registering user:", error);
      throw new Error("Failed to register user");
    }
  }

  static async logout(): Promise<boolean> {
    const res = await fetch(`${GeneralServerCommunication.url}/user/logout`, {
      method: "POST",
      headers: await GeneralServerCommunication.getHeaders(),
      credentials: "include",
    });
    return res.ok;
  }

  static async deleteUser(): Promise<boolean> {
    const res = await fetch(`${GeneralServerCommunication.url}/user/`, {
      method: "DELETE",
      headers: await GeneralServerCommunication.getHeaders(),
      credentials: "include",
    });
    return res.ok;
  }

  static async update(user: User): Promise<boolean> {
    const res = await fetch(`${GeneralServerCommunication.url}/user/`, {
      method: "PUT",
      headers: await GeneralServerCommunication.getHeaders(),
      body: JSON.stringify(user.toJSON()),
      credentials: "include",
    });
    return res.ok;
  }

  static async resetPassword(email: string): Promise<void> {
    const res = await fetch(
      `${GeneralServerCommunication.url}/user/reset-password/`,
      {
        method: "POST",
        headers: await GeneralServerCommunication.getHeaders(),
        body: JSON.stringify({ email }),
        credentials: "include",
      },
    );
    if (!res.ok) {
    }
  }

  static async changePassword(
    oldPassword: string,
    newPassword: string,
  ): Promise<boolean> {
    const user = await UserCommunication.fetchSelfUser();
    const mail = user.email;
    const res = await fetch(
      `${GeneralServerCommunication.url}/user/change-password/`,
      {
        method: "POST",
        headers: await GeneralServerCommunication.getHeaders(),
        body: JSON.stringify({
          email: mail,
          "old-password": oldPassword,
          "new-password": newPassword,
        }),
        credentials: "include",
      },
    );
    return res.ok;
  }

  static async addFavorite(ad: AdvertisementFetched): Promise<void> {
    const id = ad.id;
    const res = await fetch(
      `${GeneralServerCommunication.url}/user/favorites/`,
      {
        method: "POST",
        headers: await GeneralServerCommunication.getHeaders(),
        body: JSON.stringify({ id }),
        credentials: "include",
      },
    );
    if (!res.ok) {
    }
  }

  static async fetchSelfUser(): Promise<User> {
    const userRes = await fetch(`${GeneralServerCommunication.url}/user/`, {
      cache: "no-cache",
      method: "GET",
      headers: await GeneralServerCommunication.getHeaders(),
      credentials: "include",
    });
    if (!userRes.ok) {
      throw new Error("Failed to fetch user or user not logged in");
    }
    return User.fromJSON(JSON.parse(await userRes.text()));
  }

  static async fetchUser(mail: string): Promise<User> {
    const userRes = await fetch(
      `${GeneralServerCommunication.url}/user/${encodeURIComponent(mail)}/`,
      {
        cache: "no-cache",
        method: "GET",
        headers: await GeneralServerCommunication.getHeaders(),
        credentials: "include",
      },
    );
    const body = await userRes.text();
    if (!userRes.ok) {
      throw new Error(`Failed to fetch user: ${body}`);
    } else {
      return User.fromJSON(JSON.parse(body));
    }
  }

  static async activateUser(token: string): Promise<boolean> {
    const res = await fetch(
      `${GeneralServerCommunication.url}/user/activate/${encodeURIComponent(token)}`,
      {
        method: "GET",
        headers: await GeneralServerCommunication.getHeaders(),
        credentials: "include",
        cache: "no-cache",
      },
    );
    return res.ok;
  }
}
