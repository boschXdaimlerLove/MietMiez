import User, {UserJson} from "@/app/objects/user";
import Pet, {PetJson} from "@/app/objects/pet";

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

    static fromJSON(json: AdvertisementJson): Advertisement {
        return new Advertisement(
            json["id"],
            User.fromJSONObject(json["user"]),
            Pet.fromJSON(json["pet"]),
            json["title"],
            json["description"],
            json["images"]
        );
    }

    toJSON(): AdvertisementJson {
        return {
            id: this.id,
            user: this.user.toJSON(),
            pet: this.pet.toJSON(),
            title: this.title,
            description: this.description,
            images: this.images,
        };
    }
}


export interface AdvertisementJson {
    "id": string;
    "user": UserJson;
    "pet": PetJson;
    "title": string;
    "description": string;
    "images": [string];
}
