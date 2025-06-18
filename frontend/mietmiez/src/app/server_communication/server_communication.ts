const url: string = 'https://mietmietz.de/v1';

async function fetchAdvertisement(id: string) {
    const ad = await fetch(`${url}/advertisement/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    });
    return ad;
}
