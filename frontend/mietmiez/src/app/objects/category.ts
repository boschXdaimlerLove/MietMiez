export default class Category {
    id: number;
    name: string;

    constructor(id: number, name: string) {
        this.id = id;
        this.name = name;
    }

    static fromJSON(json: CategoryJson): Category {
        return new Category(
            json["id"],
            json["name"]
        );
    }
}

interface CategoryJson {
    id: number;
    name: string;
}
