"use client";

import User from "@/app/objects/user";

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
}
