import GeneralServerCommunication from "@/app/server_communication/server/GeneralServerCommunication";
import User from "@/app/objects/user/user";
import AdvertisementFetched from "@/app/objects/advertisement/AdvertisementFetched";
import { cookies } from "next/headers";

/**
 * Server-side class to communicate with the backend server for user-related operations.
 */
export default class UserCommunication {
  /**
   * fetches the current cookie from the users browser
   */
  static async fetchUserCookies(): Promise<string | undefined> {
    const cookieStore = await cookies();
    return cookieStore.get("token")?.value;
  }

  /**
   * logs in a user with the provided email and password.
   * @param email - the email of the user
   * @param password - the password to log in with
   */
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

  /**
   * register a new user with the provided user object and password.
   * @param user - the user object containing user details
   * @param password - the password of the new user
   */
  static async register(user: User, password: string): Promise<boolean> {
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
    return res.ok;
  }

  /**
   * logs out the current user and invalidates the session in backend
   */
  static async logout(): Promise<boolean> {
    const res = await fetch(`${GeneralServerCommunication.url}/user/logout`, {
      method: "POST",
      headers: await GeneralServerCommunication.getHeaders(),
      credentials: "include",
    });
    return res.ok;
  }

  /**
   * deletes the current user from the backend
   */
  static async deleteUser(): Promise<boolean> {
    const res = await fetch(`${GeneralServerCommunication.url}/user/`, {
      method: "DELETE",
      headers: await GeneralServerCommunication.getHeaders(),
      credentials: "include",
    });
    return res.ok;
  }

  /**
   * updates the user information in the backend.
   * @param user - the user object containing updated user details
   */
  static async update(user: User): Promise<boolean> {
    const res = await fetch(`${GeneralServerCommunication.url}/user/`, {
      method: "PUT",
      headers: await GeneralServerCommunication.getHeaders(),
      body: JSON.stringify(user.toJSON()),
      credentials: "include",
    });
    return res.ok;
  }

  /**
   * requests a password reset for the user with the provided email.
   * @param email
   */
  static async resetPasswordRequest(email: string): Promise<boolean> {
    const res = await fetch(
      `${GeneralServerCommunication.url}/user/reset-password/`,
      {
        method: "POST",
        headers: await GeneralServerCommunication.getHeaders(),
        body: JSON.stringify({ email }),
        credentials: "include",
      },
    );
    return res.ok;
  }

  /**
   * resets the password for the user using the provided token and new password.
   * @param token - the token to validate to the backend
   * @param password - the new password
   */
  static async resetPassword(token: string, password: string) {
    const res = await fetch(
      `${GeneralServerCommunication.url}/user/reset-password/${token}`,
      {
        method: "POST",
        headers: await GeneralServerCommunication.getHeaders(),
        credentials: "include",
        body: JSON.stringify({ password }),
      },
    );
    return res.ok;
  }

  /**
   * changes the password of the currently logged-in user.
   * @param oldPassword - the current password of the user
   * @param newPassword - the new password to set for the user
   */
  static async changePassword(
    oldPassword: string,
    newPassword: string,
  ): Promise<boolean> {
    const user = await UserCommunication.fetchSelfUser();
    const mail = user.email;
    const body = JSON.stringify({
      email: mail,
      "old-password": oldPassword,
      "new-password": newPassword,
    });
    const res = await fetch(
      `${GeneralServerCommunication.url}/user/change-password/`,
      {
        method: "POST",
        headers: await GeneralServerCommunication.getHeaders(),
        body: body,
        credentials: "include",
      },
    );
    return res.ok;
  }

  /**
   * adds an advertisement to the user's favorites.
   * @param ad - the advertisement to add to favorites
   */
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

  /**
   * fetches the currently logged-in user from the backend.
   */
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

  /**
   * fetches an existing user by their email address.
   * @param mail - the mail address of the user to fetch
   */
  static async fetchUser(mail: string): Promise<User> {
    const userRes = await fetch(
      `${GeneralServerCommunication.url}/user/${mail}/`,
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

  /**
   * activates a user account using the provided activation token.
   * @param token - the activation token to validate the user account
   */
  static async activateUser(token: string): Promise<boolean> {
    const res = await fetch(
      `${GeneralServerCommunication.url}/user/activate/${token}`,
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
