export default class Pet {
    name: string;
    type: string;

    constructor(name: string, type: string) {
        this.name = name;
        this.type = type;
    }

    static fromJSON(json: PetJson): Pet {
        return new Pet(
            json["name"],
            json["type"]
        );
    }

    toJSON(): PetJson {
        return {
            "name": this.name,
            "type": this.type
        };
    }
}

export interface PetJson {
    "name": string;
    "type": string;
}
