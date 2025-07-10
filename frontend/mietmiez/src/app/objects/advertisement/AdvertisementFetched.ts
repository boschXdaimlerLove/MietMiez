import User, { UserJson } from "@/app/objects/user/user";

/**
 * Advertisement object that is fetched from the server
 * This contains specific information about the advertisement only relevent when fetching and not updating
 */
export default class AdvertisementFetched {
  id: string;
  user: User;
  animal: string;
  title: string;
  description: string;
  images: string[];

  constructor(
    id: string,
    user: User,
    title: string,
    description: string,
    animal: string,
    images: string[],
  ) {
    this.id = id;
    this.user = user;
    this.animal = animal;
    this.title = title;
    this.description = description;
    this.images = images;
  }

  /**
   * Creates an AdvertisementFetched object from a JSON object
   * @param json
   */
  static fromJSON(json: AdvertisementFetchedJson): AdvertisementFetched {
    return new AdvertisementFetched(
      json["id"],
      User.fromJSONObject(json["user"]),
      json["title"],
      json["description"],
      json["animal"],
      json["images"],
    );
  }

  /**
   * provides an empty AdvertisementFetched object for uploading
   * @param user
   */
  static forUpload(user: User): AdvertisementFetched {
    return new AdvertisementFetched("", user, "", "", "", []);
  }

  /**
   * Converts the AdvertisementFetched object to a JSON object
   */
  toJSON(): AdvertisementFetchedJson {
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

/**
 * JSON representation of the AdvertisementFetched object
 */
export interface AdvertisementFetchedJson {
  id: string;
  user: UserJson;
  animal: string;
  title: string;
  description: string;
  images: string[];
}
