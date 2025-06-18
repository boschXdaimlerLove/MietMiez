import User from "@/app/objects/user";
import Pet from "@/app/objects/pet";

export default class Advertisement {
    id: string;
    user: User;
    pet: Pet;
    title: string;
    description: string;
    images: [string];

    constructor(id: string, user: User, pet: Pet, title: string, description: string, images: [string]) {
        this.id = id;
        this.user = user;
        this.pet = pet;
        this.title = title;
        this.description = description;
        this.images = images;
    }


}
