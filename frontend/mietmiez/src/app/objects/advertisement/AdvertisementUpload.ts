export default class AdvertisementUpload {
  animal: string;
  title: string;
  description: string;
  images: string[];

  constructor(
    title: string,
    description: string,
    animal: string,
    images: string[],
  ) {
    this.animal = animal;
    this.title = title;
    this.description = description;
    this.images = images;
  }

  static forUpload(): AdvertisementUpload {
    return new AdvertisementUpload("", "", "", []);
  }

  static fromJSON(json: AdvertisementUploadJson): AdvertisementUpload {
    return new AdvertisementUpload(
      json["title"],
      json["description"],
      json["animal"],
      json["images"],
    );
  }

  toJSON(): AdvertisementUploadJson {
    return {
      animal: this.animal,
      title: this.title,
      description: this.description,
      images: this.images,
    };
  }
}

export interface AdvertisementUploadJson {
  animal: string;
  title: string;
  description: string;
  images: string[];
}
