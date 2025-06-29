export default class User {
    firstName: string;
    lastName: string;
    email: string;
    city: string;
    favorites: string[] = [];

    constructor(firstName: string, lastName: string, email: string, city: string, favorites: string[]) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.city = city;
        this.favorites = favorites;
    }

    static fromJSON(json: UserJson): User {
        return new User(
            json["first-name"],
            json["last-name"],
            json["email"],
            json["city"],
            json["favorites"] || []
        );
    }

    static fromJSONObject(json: unknown): User {
        if (
            typeof json === "object" &&
            json !== null &&
            "first-name" in json &&
            "last-name" in json &&
            "email" in json &&
            "city" in json
        ) {
            const obj = json as UserJson;
            return new User(
                obj["first-name"],
                obj["last-name"],
                obj["email"],
                obj["city"],
                obj["favorites"] || []
            );
        }
        throw new Error("Ungültiges JSON-Objekt");
    }

    toJSON(): UserJson {
        return {
            "first-name": this.firstName,
            "last-name": this.lastName,
            email: this.email,
            city: this.city,
            favorites: this.favorites
        };
    }
}

export interface UserJson {
    "first-name": string;
    "last-name": string;
    email: string;
    city: string;
    favorites?: string[];
}
