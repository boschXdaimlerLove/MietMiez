import GeneralServerCommunication from "@/app/server_communication/GeneralServerCommunication";
import User from "@/app/objects/user";
import Advertisement from "@/app/objects/advertisement";
import { cookies } from "next/headers";

export default class UserCommunication {
  static async fetchUserCookies(): Promise<string | undefined> {
    return cookies().then((cookies) => cookies.get("token")?.value);
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
      },
    );
    if (!loginRes.ok) {
      throw new Error("Login failed");
    }
    return await loginRes.json();
  }

  static async register(user: User): Promise<void> {
    await fetch(`${GeneralServerCommunication.url}/user/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user.toJSON()),
    });
  }

  static async logout(): Promise<boolean> {
    const res = await fetch(`${GeneralServerCommunication.url}/user/logout`, {
      method: "POST",
      headers: await GeneralServerCommunication.getHeaders(),
    });
    return res.ok;
  }

  static async deleteUser(): Promise<void> {
    const res = await fetch(`${GeneralServerCommunication.url}/user/`, {
      method: "DELETE",
      headers: await GeneralServerCommunication.getHeaders(),
    });
    if (!res.ok) {
      return;
    } else {
      sessionStorage.removeItem("token");
    }
  }

  static async updateUser(user: User): Promise<void> {
    const res = await fetch(`${GeneralServerCommunication.url}/user/`, {
      method: "PATCH",
      headers: await GeneralServerCommunication.getHeaders(),
      body: JSON.stringify(user.toJSON()),
    });
    if (!res.ok) {
      return;
    }
  }

  static async resetPassword(email: string): Promise<void> {
    const res = await fetch(
      `${GeneralServerCommunication.url}/user/reset-password/`,
      {
        method: "POST",
        headers: await GeneralServerCommunication.getHeaders(),
        body: JSON.stringify({ email }),
      },
    );
    if (!res.ok) {
    }
  }

  static async changePassword(
    user: User,
    oldPassword: string,
    newPassword: string,
  ): Promise<void> {
    const mail = user.email;
    const res = await fetch(
      `${GeneralServerCommunication.url}/user/change-password/`,
      {
        method: "POST",
        headers: await GeneralServerCommunication.getHeaders(),
        body: JSON.stringify({ mail, oldPassword, newPassword }),
      },
    );
    if (!res.ok) {
    }
  }

  static async addFavorite(ad: Advertisement): Promise<void> {
    const id = ad.id;
    const res = await fetch(
      `${GeneralServerCommunication.url}/user/favorites/`,
      {
        method: "POST",
        headers: await GeneralServerCommunication.getHeaders(),
        body: JSON.stringify({ id }),
      },
    );
    if (!res.ok) {
    }
  }

  static async fetchUser(mail: string): Promise<User> {
    const userRes = await fetch(
      `${GeneralServerCommunication.url}/user/${mail}/`,
      {
        cache: "no-cache",
        method: "GET",
        headers: await GeneralServerCommunication.getHeaders(),
      },
    );
    const json = await userRes.json();
    return User.fromJSON(json);
  }
}
