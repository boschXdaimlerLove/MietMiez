import {router} from "next/client";
import GeneralServerCommunication from "@/app/server_communication/GeneralServerCommunication";
import User from "@/app/objects/user";

export default class UserCommunication {
    static async login(email: string, password: string): Promise<void> {
        const res = await fetch(`${GeneralServerCommunication.url}/user/login/`, {
            cache: 'no-cache',
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({email, password}),
        });

        const data = await res.json();
        if (!res.ok) {
            console.log(data);
            return;
        }
        sessionStorage.setItem("token", data.token);
        router.push('/main');
    }

    static async register(email: string, password: string, firstName: string, lastName: string): Promise<void> {

    }

    static async logout(): Promise<void> {

    }

    static async deleteUser(): Promise<User> {

    }

    static async updateUser(user: User): Promise<User> {

    }

    static async resetPassword(email: string): Promise<void> {

    }

    static async changePassword(oldPassword: string, newPassword: string): Promise<void> {

    }

    static async fetchFavorites(): Promise<User> {

    }


    static async fetchUser(mail: string): Promise<User> {
        const userRes = await fetch(`${GeneralServerCommunication.url}/user/${mail}/`, {
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
