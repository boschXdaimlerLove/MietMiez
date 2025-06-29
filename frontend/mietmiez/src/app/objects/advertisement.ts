import User, {UserJson} from "@/app/objects/user";
export default class Advertisement {
    id: string;
    user: User;
    animal: string;
    title: string;
    description: string;
    images: [string];

    constructor(id: string, user: User, title : string, description: string, animal : string, images: [string]) {
        this.id = id;
        this.user = user;
        this.animal = animal;
        this.title = title;
        this.description = description;
        this.images = images;
    }

    static fromJSON(json: AdvertisementJson): Advertisement {
        return new Advertisement(
            json["id"],
            User.fromJSONObject(json["user"]),
            json["title"],
            json["description"],
            json["animal"],
            json["images"]
        );
    }

    toJSON(): AdvertisementJson {
        return {
            id: this.id,
            user: this.user.toJSON(),
            animal: this.animal,
            title: this.title,
            description: this.description,
            images: this.images,
        };
    }
}


export interface AdvertisementJson {
    "id": string;
    "user": UserJson;
    "animal": string;
    "title": string;
    "description": string;
    "images": [string];
}
