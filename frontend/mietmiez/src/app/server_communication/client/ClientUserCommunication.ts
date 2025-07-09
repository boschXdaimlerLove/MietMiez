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
    const body = JSON.stringify({ user: user.toJSON(), password });
    const res = await fetch("/api/user/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: body,
      credentials: "include",
    });
    return res.ok;
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

  static async resetPasswordRequest(email: string): Promise<boolean> {
    const res = await fetch("/api/user/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
      credentials: "include",
    });
    return res.ok;
  }

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
