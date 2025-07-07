"use client";

import User from "@/app/objects/user/user";

export default class ClientUserCommunication {
  static async login(email: string, password: string): Promise<boolean> {
    const res = await fetch("/api/user/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      credentials: "include",
    });
    return res.ok;
  }

  static async logout(): Promise<boolean> {
    const res = await fetch("/api/user/logout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    return res.ok;
  }

  static async register(user: User, password: string): Promise<boolean> {
    console.log("Attempting to register user:", user);
    const body = JSON.stringify({ user: user.toJSON(), password });
    console.log("Request body for registration:", body);
    let res: Response = Response.json("Default response");
    try {
      res = await fetch("/api/user/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: body,
        credentials: "include",
      });
    } catch (error) {
      if (!res.ok) {
        console.log(res);
        console.error("Error during registration in client user:", error);
        return false;
      }
    }
    // console.log("Registration response:", res);
    // return res.ok;
    return true;
  }

  static async deleteUser(): Promise<boolean> {
    const res = await fetch("/api/user", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    return res.ok;
  }

  static async changePassword(oldPassword: string, newPassword: string) {
    const res = await fetch("/api/user/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ oldPassword, newPassword }),
      credentials: "include",
    });
    return res.ok;
  }

  static async update(user: User): Promise<boolean> {
    const res = await fetch("/api/user", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
      credentials: "include",
    });
    return res.ok;
  }
}
