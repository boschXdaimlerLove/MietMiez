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
