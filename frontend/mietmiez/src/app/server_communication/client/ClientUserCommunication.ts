"use client";

import User from "@/app/objects/user/user";

/**
 * ClientUserCommunication handles user-related communication with the internal server API.
 */
export default class ClientUserCommunication {
  /**
   * client method to login a user. Communicates with the server API to authenticate the user.
   * @param email - the email to login with
   * @param password - the password of the user to log in with
   */
  static async login(email: string, password: string): Promise<boolean> {
    const res = await fetch("/api/user/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      credentials: "include",
    });
    return res.ok;
  }

  /**
   * client method to logout a user. Communicates with the server API to log out the user.
   */
  static async logout(): Promise<boolean> {
    const res = await fetch("/api/user/logout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    return res.ok;
  }

  /**
   * client method to register a user. Communicates with the server API to create a new user account.
   * @param user - the user object containing user details to register
   * @param password - the password for the new user account
   */
  static async register(user: User, password: string): Promise<boolean> {
    const body = JSON.stringify({ user: user.toJSON(), password });
    const res = await fetch("/api/user/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: body,
      credentials: "include",
    });
    return res.ok;
  }

  /**
   * client method to delete a user account. Communicates with the server API to remove the user.
   */
  static async deleteUser(): Promise<boolean> {
    const res = await fetch("/api/user", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    return res.ok;
  }

  /**
   * client method to change the password of a user. Communicates with the server API to update the user's password.
   * @param oldPassword - the current password of the user
   * @param newPassword - the new password to set for the user
   */
  static async changePassword(oldPassword: string, newPassword: string) {
    const res = await fetch("/api/user/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ oldPassword, newPassword }),
      credentials: "include",
    });
    return res.ok;
  }

  /**
   * client method to update user details. Communicates with the server API to modify user information.
   * @param user - the new user object with updated information
   */
  static async update(user: User): Promise<boolean> {
    const res = await fetch("/api/user", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
      credentials: "include",
    });
    return res.ok;
  }

  /**
   * client method to fetch the current user's email. Communicates with the server API to retrieve the user's email.
   */
  static async getUserEmail(): Promise<string | null> {
    const res = await fetch("/api/user", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    if (!res.ok) {
      return null;
    }
    return JSON.parse(await res.text())["email"];
  }

  /**
   * client method to request a password reset. Communicates with the server API to initiate a password reset process.
   * @param email - the email to request a password reset for
   */
  static async resetPasswordRequest(email: string): Promise<boolean> {
    const res = await fetch("/api/user/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
      credentials: "include",
    });
    return res.ok;
  }

  /**
   * client method to actually reset the password using the provided token
   * @param token - the token to reset
   * @param password - the new password to set
   */
  static async resetPassword(
    token: string,
    password: string,
  ): Promise<boolean> {
    const res = await fetch(`/api/user/reset-password`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
      credentials: "include",
    });
    return res.ok;
  }
}
