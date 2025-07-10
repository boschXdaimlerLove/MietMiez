/**
 * Category class representing a category with a name and an ID.
 */
export default class Category {
  name: string;
  id: number;

  constructor(name: string, id: number) {
    this.name = name;
    this.id = id;
  }

  /**
   * Converts the Category instance to a JSON object.
   * @param json - the json object to convert to a class
   */
  static fromJSON(json: CategoryJson): Category {
    return new Category(json["Title"], json["ID"]);
  }
}

/**
 * Interface representing the JSON structure for a category.
 */
export interface CategoryJson {
  Title: string;
  ID: number;
}
