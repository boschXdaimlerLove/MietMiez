export default async function SearchPage() {
}

// export default async function SearchPage({params}: { params: Promise<{ searchParams: SearchParams }> }) {
//     if (params === undefined) {
//         throw new Error("Search parameters are required");
//     }
//     const {searchParams} = await params;
//     const advertisements = await AdvertisementCommunication.fetchAdvertisementsFor(searchParams);
//
//     return (
//         <main>
//             <h1>Search with following params</h1>
//             <p>Animal: {searchParams.animal}</p>
//             <p>City: {searchParams.zipCode}</p>
//             <PetGrid advertisements={advertisements}/>
//         </main>
//     );
// }
