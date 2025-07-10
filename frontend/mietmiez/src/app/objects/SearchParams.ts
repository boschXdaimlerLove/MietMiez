/**
 * search params to bundle all search parameters when searching for pets
 */
export default class SearchParams {
  animal?: string;
  zipCode?: string;

  constructor(animal?: string, city?: string) {
    this.animal = animal;
    this.zipCode = city;
  }
}
