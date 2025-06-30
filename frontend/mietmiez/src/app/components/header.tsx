'use client';

import React, {use, useState} from "react";
import Link from "next/link";
import {useRouter} from "next/navigation";
import Image from "next/image";
import {useHeaderContext} from "@/app/components/HeaderContext";
import Category from "@/app/objects/category";

export default function Header() {

    const router = useRouter();
    const categoriesStringPromise = useHeaderContext();
    const categoriesString: string = use(categoriesStringPromise);
    const categories: Category[] = JSON.parse(categoriesString);

    const [categoriesOpen, setCategoriesOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("Alle Kategorien");


    // const categories = [
    //     "Alle Kategorien",
    // new Category(1, "Hunde"),
    // new Category(2, "Katzen"),
    //     "Kleintiere",
    //     "Vögel",
    //     "Reptilien",
    //     "Amphibien",
    //     "Fische",
    //     "Andere"
    // ];

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        // TODO: update city and distance etc.
        e.preventDefault();
        const zipCode = (e.currentTarget.querySelector('input[type="text"]') as HTMLInputElement).value.trim();
        if (zipCode) {
            // Redirect to the search page with query parameters
            router.push(`/search?animal=${encodeURIComponent(selectedCategory)}&zipCode=${encodeURIComponent(zipCode)}`);
        } else {
            // Handle an empty search case if needed
            console.warn("Search input is empty");
        }

    }

    return (
        /* Header START */
        <header className="w-full">
            <div className={'items-center align-middle flex px-4'}>
                <Link href="/">
                    <Image
                        alt={"the icon of the MietMietz website"}
                        src='/mietmiez_icon_256.png'
                        width={36}
                        height={36}
                        className='rounded-md'
                    />
                </Link>
                <div className="w-full py-3 flex justify-end items-center px-4">
                    <Link href="/register"
                          className="rounded-full border border-gray-300 px-6 py-2 text-green-800 font-medium">
                        Registrieren
                    </Link>
                    <span className="mx-4 text-gray-700">oder</span>
                    <Link href="/login"
                          className="rounded-full bg-[#c9e265] px-6 py-2 text-black font-medium flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                             className="w-6 h-6 mr-2">
                            <path fillRule="evenodd"
                                  d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
                                  clipRule="evenodd"/>
                        </svg>
                        Einloggen
                    </Link>
                </div>
            </div>

            <div className="w-full py-4 bg-[var(--primary)] px-4 flex items-center justify-between">
                <div className="flex items-center space-x-2 flex-1">
                    {/* Category Dropdown */}
                    <div className="relative inline-block text-left border-r border-gray-300 pr-2">
                        <button
                            className="flex items-center text-gray-700 px-4 py-2 bg-white rounded-md"
                            onClick={() => setCategoriesOpen(!categoriesOpen)}
                        >
                            <span>{selectedCategory}</span>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                 strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 ml-2">
                                <path d="m19.5 8.25-7.5 7.5-7.5-7.5"/>
                            </svg>
                        </button>


                        {categoriesOpen && (
                            <div
                                className="absolute mt-1 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                                <div className="py-1" role="menu" aria-orientation="vertical">
                                    {categories.map((category) => (
                                        <button
                                            key={'h' + category.id}
                                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            role="menuitem"
                                            onClick={() => {
                                                setSelectedCategory(category.name);
                                                setCategoriesOpen(false);
                                            }}
                                        >
                                            {category.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>


                    <div style={{backgroundColor: 'white', marginLeft: '5px', padding: '3px'}}>
                        <form onSubmit={handleSubmit}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                                 stroke="currentColor" style={{width: '20px', height: '20px', display: 'inline'}}>
                                <path d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"/>
                                <path d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"/>
                            </svg>
                            <input className="text-gray-600" type="text" placeholder="70469 Stuttgart"
                                   style={{border: 'none', marginLeft: '5px'}}/>
                        </form>
                    </div>
                </div>

                <div className="flex items-center space-x-8">
                    <Link href="/src/app/advertisement/new" className="flex flex-col items-center text-[var(--primaryBtnTxt)]">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                             stroke="currentColor" className="w-6 h-6">
                            <path
                                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"/>
                        </svg>
                        <span>Tiersitter finden</span>
                    </Link>
                    <Link href="/profile" className="flex flex-col items-center text-[var(--primaryBtnTxt)]">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                             stroke="currentColor" className="w-6 h-6">
                            <path
                                d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"/>
                        </svg>
                        <span>Profil</span>
                    </Link>
                </div>
            </div>
        </header>
        /* Header END */
    );
}
