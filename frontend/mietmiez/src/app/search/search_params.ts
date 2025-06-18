export default class SearchParams {
    text: string;
    category: string;
    city: string;

    constructor(text: string, category: string, city: string) {
        this.text = text;
        this.category = category;
        this.city = city;
    }
}
