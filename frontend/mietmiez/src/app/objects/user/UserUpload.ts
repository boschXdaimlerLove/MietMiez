export default class User {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  city: string;
  zipCode: string;
  favorites: string[] = [];

  constructor(
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    city: string,
    zipCode: string,
    favorites: string[] = [],
  ) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.password = password;
    this.city = city;
    this.zipCode = zipCode;
    this.favorites = favorites;
  }

  static fromJSON(json: UserUploadJson): User {
    return new User(
      json["first-name"],
      json["last-name"],
      json["email"],
      json["password"],
      json["city"],
      json["zip-code"],
      json["favorites"] || [],
    );
  }

  static fromJSONObject(json: unknown): User {
    if (
      typeof json === "object" &&
      json !== null &&
      "first-name" in json &&
      "last-name" in json &&
      "email" in json &&
      "password" in json &&
      "city" in json &&
      "zip-code" in json
    ) {
      const obj = json as UserUploadJson;
      return new User(
        obj["first-name"],
        obj["last-name"],
        obj["email"],
        obj["password"],
        obj["city"],
        obj["zip-code"],
        obj["favorites"] || [],
      );
    }
    throw new Error("Ungültiges JSON-Objekt");
  }

  toJSON(): UserUploadJson {
    return {
      "first-name": this.firstName,
      "last-name": this.lastName,
      email: this.email,
      password: this.password,
      city: this.city,
      "zip-code": this.zipCode,
      favorites: this.favorites,
    };
  }
}

export interface UserUploadJson {
  "first-name": string;
  "last-name": string;
  email: string;
  password: string;
  city: string;
  "zip-code": string;
  favorites?: string[];
}
