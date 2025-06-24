import User from "@/app/objects/user";
import Advertisement from "@/app/objects/advertisement";
import SearchParams from "@/app/search/SearchParams";
import Category from "@/app/objects/category";

const url: string = 'https://mietmietz.de/v1';

async function responseToAdvertisements(response: Response): Promise<Advertisement[]> {
    const adsArr: Advertisement[] = [];
    const json = await response.json();
    for (const ad of json) {
        const adJSON = await ad.json();
        adsArr.push(adJSON);
    }
    return adsArr;
}


/* CATEGORIES */

export async function fetchCategories(): Promise<Category[]> {
    const categoriesRes = await fetch(`${url}/categories`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    });
    const categoriesJSON = await categoriesRes.json();
    const cats: Category[] = [];
    for (const categoryJSON of categoriesJSON) {
        const catJSON = await categoryJSON.json();
        cats.push(Category.fromJSON(catJSON));
    }
    return cats;
}


/* ADVERTISEMENTS */

export async function fetchAdvertisementsFor(params: SearchParams): Promise<Advertisement[]> {
    const ads = await fetch(`${url}/search?animal=${encodeURIComponent(params.animal)}&zip-code=${encodeURIComponent(params.zipCode)}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    });
    return responseToAdvertisements(ads);
}

export async function fetchLatestAdvertisements(): Promise<Advertisement[]> {
    const ads = await fetch(`${url}/advertisement`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    });
    return responseToAdvertisements(ads);
}


export async function fetchAdvertisement(id: string): Promise<Advertisement> {
    const adRes = await fetch(`${url}/advertisement/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    });
    const adJson = await adRes.json();
    return Advertisement.fromJSON(adJson);
}


/* USER */

export async function fetchUser(mail: string): Promise<User> {
    const userRes = await fetch(`${url}/account/${mail}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    });
    const json = await userRes.json();
    return User.fromJSON(json);
}
