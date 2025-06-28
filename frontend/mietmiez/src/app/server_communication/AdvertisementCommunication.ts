import Advertisement from "@/app/objects/advertisement";
import SearchParams from "@/app/search/SearchParams";
import GeneralServerCommunication from "@/app/server_communication/GeneralServerCommunication";
import Category, {CategoryJson} from "@/app/objects/category";

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
            cache: 'no-cache',
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });
        const categoriesJSON: string = await categoriesRes.text();
        return JSON.parse(categoriesJSON).map((category: CategoryJson) => Category.fromJSON(category));
    }


    /* ADVERTISEMENTS */


    static async fetchAdvertisementsFor(params: SearchParams): Promise<Advertisement[]> {
        if (params === undefined) {
            // set default params for build
            params = new SearchParams("katze", "12345");
        }
        const ads = await fetch(`${GeneralServerCommunication.url}/search?animal=${encodeURIComponent(params.animal ?? '')}&zip-code=${encodeURIComponent(params.zipCode ?? '')}`, {
            cache: 'no-cache',
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });
        return AdvertisementCommunication.responseToAdvertisements(ads);
    }

    static async fetchLatestAdvertisements(): Promise<Advertisement[]> {
        const ads = await fetch(`${GeneralServerCommunication.url}/advertisement`, {
            cache: 'no-cache',
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });
        return AdvertisementCommunication.responseToAdvertisements(ads);
    }

    static async fetchAdvertisement(id: string): Promise<Advertisement> {
        const adRes = await fetch(`${GeneralServerCommunication.url}/advertisement/${id}`, {
            cache: 'no-cache',
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });
        const adJson = await adRes.json();
        return Advertisement.fromJSON(adJson);
    }

    static async fetchUserFavorites(): Promise<Advertisement[]> {
        const favoritesRes = await fetch(`${GeneralServerCommunication.url}/user/favorites/`, {
            cache: 'no-cache',
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });
        return AdvertisementCommunication.responseToAdvertisements(favoritesRes);
    }

    static async createAdvertisement(ad: Advertisement): Promise<void> {
        const adRes = await fetch(`${GeneralServerCommunication.url}/advertisement`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(ad)
        });
        if (!adRes.ok) {
            // const error = await adRes.json();
            // console.error("Error creating advertisement:", error);
            // throw new Error("Failed to create advertisement");
        }
    }

    static async updateAdvertisement(ad: Advertisement): Promise<void> {
        const adRes = await fetch(`${GeneralServerCommunication.url}/advertisement/${ad.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(ad)
        });
        if (!adRes.ok) {
            // const error = await adRes.json();
            // console.error("Error updating advertisement:", error);
            // throw new Error("Failed to update advertisement");
        }
    }


    static async deleteAdvertisement(id: string): Promise<void> {
        const adRes = await fetch(`${GeneralServerCommunication.url}/advertisement/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
        });
        if (!adRes.ok) {
            // const error = await adRes.json();
            // console.error("Error deleting advertisement:", error);
            // throw new Error("Failed to delete advertisement");
        }
    }
}
