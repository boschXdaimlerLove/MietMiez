import Advertisement from "@/app/objects/advertisement";
import SearchParams from "@/app/search/SearchParams";
import GeneralServerCommunication from "@/app/server_communication/GeneralServerCommunication";
import Category from "@/app/objects/category";

export default class AdvertisementCommunication {

    static async responseToAdvertisements(response: Response): Promise<Advertisement[]> {
        const adsArr: Advertisement[] = [];
        const json = await response.json();
        for (const ad of json) {
            const adJSON = await ad.json();
            adsArr.push(adJSON);
        }
        return adsArr;
    }


    /* CATEGORIES */

    static async fetchCategories(): Promise<Category[]> {
        const categoriesRes = await fetch(`${GeneralServerCommunication.url}/categories/`, {
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


    static async fetchAdvertisementsFor(params: SearchParams): Promise<Advertisement[]> {
        const ads = await fetch(`${GeneralServerCommunication.url}/search?animal=${encodeURIComponent(params.animal)}&zip-code=${encodeURIComponent(params.zipCode)}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });
        return AdvertisementCommunication.responseToAdvertisements(ads);
    }

    static async fetchLatestAdvertisements(): Promise<Advertisement[]> {
        const ads = await fetch(`${GeneralServerCommunication.url}/advertisement`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });
        return AdvertisementCommunication.responseToAdvertisements(ads);
    }

    static async fetchAdvertisement(id: string): Promise<Advertisement> {
        const adRes = await fetch(`${GeneralServerCommunication.url}/advertisement/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });
        const adJson = await adRes.json();
        return Advertisement.fromJSON(adJson);
    }
}
