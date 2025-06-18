import User from "@/app/objects/user";
import Advertisement from "@/app/objects/advertisement";
import SearchParams from "@/app/search/search_params";

const url: string = 'https://mietmietz.de/v1';

async function fetchAdvertisementsFor(params: SearchParams): Promise<Advertisement[]> {
    // TODO: update search url
    const ads = await fetch(`${url}/search`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const adsArr: Advertisement[] = [];
    const json = await ads.json();
    for (const ad of json) {
        const adJSON = ad.json();
        adsArr.push(adJSON);
    }
    return adsArr;
}


async function fetchAdvertisement(id: string) {
    const ad = await fetch(`${url}/advertisement/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    });
    return ad;
}

async function fetchUser(mail: string): Promise<User> {
    const userRes = await fetch(`${url}/account/${mail}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    });
    const json = await userRes.json();
    return User.fromJSON(json);
}
