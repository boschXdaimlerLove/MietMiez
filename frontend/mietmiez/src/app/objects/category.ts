export default class Category {
    name: string;
    id: number;

    constructor(name: string, id: number) {
        this.name = name;
        this.id = id;
    }

    static fromJSON(json: CategoryJson): Category {
        return new Category(
            json["Title"],
            json["ID"]
        );
    }
}

export interface CategoryJson {
    Title: string;
    ID: number;
}
