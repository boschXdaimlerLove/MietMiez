export default class User {
    firstName: string;
    lastName: string;
    email: string;
    city: string;

    constructor(firstName: string, lastName: string, email: string, city: string) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.city = city;
    }

    static fromJSON(json: UserJson): User {
        return new User(
            json["first-name"],
            json["last-name"],
            json["email"],
            json["city"]
        );
    }
}

interface UserJson {
    "first-name": string;
    "last-name": string;
    email: string;
    city: string;
}
