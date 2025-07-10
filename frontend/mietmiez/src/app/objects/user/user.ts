/**
 * class to represent a user fetched from the server
 */
export default class User {
  firstName: string;
  lastName: string;
  email: string;
  city: string;
  zipCode: string;
  favorites: string[] = [];

  constructor(
    firstName: string,
    lastName: string,
    email: string,
    city: string,
    zipCode: string,
    favorites: string[] = [],
  ) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.city = city;
    this.zipCode = zipCode;
    this.favorites = favorites;
  }

  /**
   * Creates a User object from a JSON object interface.
   * @param json - json as UserJson interface
   */
  static fromJSON(json: UserJson): User {
    return new User(
      json["first-name"],
      json["last-name"],
      json["email"],
      json["city"],
      json["zip-code"],
      json["favorites"] || [],
    );
  }

  /**
   * Creates a User object from a JSON object as a type
   * @param json - json as unknown type
   */
  static fromJSONObject(json: unknown): User {
    if (
      typeof json === "object" &&
      json !== null &&
      "first-name" in json &&
      "last-name" in json &&
      "email" in json &&
      "city" in json &&
      "zip-code" in json
    ) {
      const obj = json as UserJson;
      return new User(
        obj["first-name"],
        obj["last-name"],
        obj["email"],
        obj["city"],
        obj["zip-code"],
        obj["favorites"] || [],
      );
    }
    throw new Error("Ungültiges JSON-Objekt");
  }

  /**
   * Converts the User object to a JSON object interface.
   */
  toJSON(): UserJson {
    return {
      "first-name": this.firstName,
      "last-name": this.lastName,
      email: this.email,
      city: this.city,
      "zip-code": this.zipCode,
      favorites: this.favorites,
    };
  }
}

/**
 * Interface for the JSON representation of a User object.
 */
export interface UserJson {
  "first-name": string;
  "last-name": string;
  email: string;
  city: string;
  "zip-code": string;
  favorites?: string[];
}
