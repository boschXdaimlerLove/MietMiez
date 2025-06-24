import {fetchCategories} from "@/app/server_communication/ServerCommunication";
import {HeaderProvider} from "@/app/components/HeaderContext";
import Category from "@/app/objects/category";
import Header from "@/app/components/header";

export default async function HeaderWrapper() {
    const categoryPromise: Promise<Category[]> = fetchCategories();
    return (
        <HeaderProvider categoryPromise={categoryPromise}>
            <Header/>
        </HeaderProvider>
    );
}
