"use client";

import User from "@/app/objects/user/user";

export default class ClientUserCommunication {
  static async login(email: string, password: string): Promise<boolean> {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      credentials: "include",
    });
    return res.ok;
  }

  static async logout(): Promise<boolean> {
    const res = await fetch("/api/logout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    return res.ok;
  }

  static async register(user: User, password: string): Promise<boolean> {
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user: user.toJSON(), password }),
      credentials: "include",
    });
    return res.ok;
  }

  static async deleteUser() {}

  static async changePassword(oldPassword: string, newPassword: string) {
    console.log("Changing password is not implemented in the client.");
    console.log(oldPassword, newPassword);
  }

  static async update(user: User): Promise<void> {
    console.log("Updating user is not implemented in the client.");
    console.log(user.toJSON());
  }
}
