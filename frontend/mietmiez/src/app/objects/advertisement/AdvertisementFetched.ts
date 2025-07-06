import User, { UserJson } from "@/app/objects/user/user";

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

  static forUpload(user: User): AdvertisementFetched {
    return new AdvertisementFetched("", user, "", "", "", []);
  }

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

export interface AdvertisementFetchedJson {
  id: string;
  user: UserJson;
  animal: string;
  title: string;
  description: string;
  images: string[];
}
