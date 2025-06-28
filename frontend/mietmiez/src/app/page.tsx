"use client";

import {useEffect} from "react";

export default function Home() {
    // const [advertisements, setAdvertisements] = useState<Advertisement[]>([]);

    useEffect(() => {
        async function fetchAdvertisements() {
            // const ads = await AdvertisementCommunication.fetchLatestAdvertisements();
            // setAdvertisements(ads);
        }

        fetchAdvertisements()
    }, []);


    // Sample pet data TODO: Replace with actual data fetching logic
    /*const sampleAdvertisements: Advertisement[] = [
        new Advertisement(
            "1",
            new User(
                "test",
                "user1",
                "test.user@test.com",
                "Stuttgart",
                []
            ),
            new Pet(
                "Bello",
                "Hund"
            ),
            "Bello sucht ein neues Zuhause",
            "Ein netter, freundlicher und süßer Hund sucht ein neues Zuhause. Bello ist 3 Jahre alt, geimpft und kastriert. Er liebt lange Spaziergänge und ist sehr kinderlieb.",
            ['https://images.unsplash.com/photo-1552053831-71594a27632d']
        ),
        new Advertisement(
            "2",
            new User(
                "test",
                "user1",
                "test.user@test.com",
                "Heidelberg",
                []
            ),
            new Pet(
                "Miau",
                "Katze"
            ),
            "Miau sucht einen neuen Freund",
            "Eine nette, verschmuste Katze sucht einen neuen Freund. Miau ist 2 Jahre alt, geimpft und kastriert. Sie liebt es zu spielen und zu kuscheln.",
            ['https://images.unsplash.com/photo-1511044568932-338cba0ad803']
        )
    ];*/


    return (
        <div className="min-h-screen flex flex-col">
            {/* Main Content */}
            <main className="flex-1 p-8">
                <h1 className="text-3xl text-center text-[#47702d] mb-8">Willkommen bei MietMiez</h1>

                {/* Pet Cards Grid Example */}
                {/*<PetGrid advertisements={advertisements}/>*/}
            </main>
        </div>
    );
}
