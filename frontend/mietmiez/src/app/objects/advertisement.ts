import User from "@/app/objects/user";
import Pet from "@/app/objects/pet";

export default class Advertisement {
    id : string;
    user : User;
    pet : Pet;

    constructor(id : string, user : User, pet : Pet) {
        this.id = id;
        this.user = user;
        this.pet = pet;
    }
}
