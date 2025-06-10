import User from "@/app/objects/user";

export default class Advertisement {
    id : string;

    user : User;

    constructor(id : string, user : User) {
        this.id = id;
        this.user = user;
    }
}