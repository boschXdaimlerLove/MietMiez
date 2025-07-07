export default class SearchParams {
  animal?: string;
  zipCode?: string;

  constructor(animal?: string, city?: string) {
    this.animal = animal;
    this.zipCode = city;
  }
}
