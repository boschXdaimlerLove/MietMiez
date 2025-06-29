import GeneralServerCommunication from "@/app/server_communication/GeneralServerCommunication";
import User from "@/app/objects/user";
import Advertisement from "@/app/objects/advertisement";

export default class UserCommunication {
    static async login(email: string, password: string): Promise<void> {
        await fetch(`${GeneralServerCommunication.clientSideUrl}/user/login/`, {
            cache: 'no-cache',
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({email, password}),
        });
        // sessionStorage.setItem("token", data.token);
    }

    static async register(user: User): Promise<void> {
        await fetch(`${GeneralServerCommunication.clientSideUrl}/user/`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(user.toJSON()),
        });
    }

    static async logout(): Promise<void> {
        const res = await fetch(`${GeneralServerCommunication.clientSideUrl}/user/logout`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
        });
        if (!res.ok) {
            return;
        } else {
            // TODO: remove token even if logout fails?
            sessionStorage.removeItem("token");
        }
    }

    static async deleteUser(): Promise<void> {
        const res = await fetch(`${GeneralServerCommunication.serverSideUrl}/user/`, {
            method: "DELETE",
            headers: {"Content-Type": "application/json"},
        });
        if (!res.ok) {
            return;
        } else {
            sessionStorage.removeItem("token");
        }
    }

    static async updateUser(user: User): Promise<void> {
        const res = await fetch(`${GeneralServerCommunication.serverSideUrl}/user/`, {
            method: "PATCH",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(user.toJSON()),
        });
        if (!res.ok) {
            return;
        }
    }

    static async resetPassword(email: string): Promise<void> {
        const res = await fetch(`${GeneralServerCommunication.serverSideUrl}/user/reset-password/`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({email}),
        });
        if (!res.ok) {
        }
    }

    static async changePassword(user: User, oldPassword: string, newPassword: string): Promise<void> {
        const mail = user.email;
        const res = await fetch(`${GeneralServerCommunication.serverSideUrl}/user/change-password/`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({mail, oldPassword, newPassword}),
        });
        if (!res.ok) {
        }
    }

    static async addFavorite(ad: Advertisement): Promise<void> {
        const id = ad.id;
        const res = await fetch(`${GeneralServerCommunication.serverSideUrl}/user/favorites/`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({id}),
        });
        if (!res.ok) {
        }
    }

    static async fetchUser(mail: string): Promise<User> {
        const userRes = await fetch(`${GeneralServerCommunication.serverSideUrl}/user/${mail}/`, {
            cache: 'no-cache',
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });
        const json = await userRes.json();
        return User.fromJSON(json);
    }
}
