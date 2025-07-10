/**
 * object for advertisement upload
 * This does only contain data set by the user and not data set by the server.
 */
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

  /**
   * Creates an empty advertisement upload object.
   * This is used to create a new advertisement upload.
   * @returns {AdvertisementUpload} an empty advertisement upload object
   */
  static forUpload(): AdvertisementUpload {
    return new AdvertisementUpload("", "", "", []);
  }

  /**
   * Creates an advertisement upload object from a JSON object.
   * @param json
   */
  static fromJSON(json: AdvertisementUploadJson): AdvertisementUpload {
    return new AdvertisementUpload(
      json["title"],
      json["description"],
      json["animal"],
      json["images"],
    );
  }

  /**
   * Converts the advertisement upload object to a JSON object.
   */
  toJSON(): AdvertisementUploadJson {
    return {
      animal: this.animal,
      title: this.title,
      description: this.description,
      images: this.images,
    };
  }
}

/**
 * Interface for the JSON representation of an advertisement upload.
 */
export interface AdvertisementUploadJson {
  animal: string;
  title: string;
  description: string;
  images: string[];
}
