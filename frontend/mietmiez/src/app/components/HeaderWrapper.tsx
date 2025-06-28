import Header from "@/app/components/header";
import Category from "@/app/objects/category";
import AdvertisementCommunication from "@/app/server_communication/AdvertisementCommunication";
import {HeaderProvider} from "@/app/components/HeaderContext";

export default async function HeaderWrapper() {
    const categories: Category[] = await AdvertisementCommunication.fetchCategories();
    const categoriesJSON: string = JSON.stringify(categories);
    return (
        <HeaderProvider categories={categoriesJSON}>
            <Header/>
        </HeaderProvider>
    );
}
