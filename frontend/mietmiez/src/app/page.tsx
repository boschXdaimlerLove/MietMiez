"use client";
import Link from "next/link";
import { useState } from "react";

export default function Home() {
  // State for categories dropdown
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Alle Kategorien");
  
  // State for distance dropdown
  const [distanceOpen, setDistanceOpen] = useState(false);
  const [selectedDistance, setSelectedDistance] = useState("+ 50 km");
  
  // Sample data
  const categories = [
    "Alle Kategorien",
    "Hunde", 
    "Katzen",
    "Kleintiere",
    "Vögel",
    "Reptilien",
    "Amphibien",
    "Fische",
    "Andere"
  ];
  
  const distances = [
    "+ 5 km",
    "+ 10 km",
    "+ 25 km",
    "+ 50 km",
    "+ 100 km",
    "+ 200 km"
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header START */}
      <header className="w-full">


        <div className="w-full py-3 flex justify-end items-center px-4 bg-white">
          <Link href="/register" className="rounded-full border border-gray-300 px-6 py-2 text-green-800 font-medium">
            Registrieren
          </Link>
          <span className="mx-4 text-gray-700">oder</span>
          <Link href="/login" className="rounded-full bg-[#c9e265] px-6 py-2 text-black font-medium flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 mr-2">
              <path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" clipRule="evenodd" />
            </svg>
            Einloggen
          </Link>
        </div>

        <div className="w-full py-4 bg-[#c9e265] px-4 flex items-center justify-between">
          <div className="flex items-center space-x-2 flex-1">
            {/* Category Dropdown */}
            <div className="relative inline-block text-left border-r border-gray-300 pr-2">
              <button 
                className="flex items-center text-gray-700 px-4 py-2 bg-white rounded-md"
                onClick={() => setCategoriesOpen(!categoriesOpen)}
              >
                <span>{selectedCategory}</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 ml-2">
                  <path d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
              </button>


              {categoriesOpen && (
                <div className="absolute mt-1 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                  <div className="py-1" role="menu" aria-orientation="vertical">
                    {categories.map((category) => (
                      <button
                        key={category}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        role="menuitem"
                        onClick={() => {
                          setSelectedCategory(category);
                          setCategoriesOpen(false);
                        }}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>


            <div style={{backgroundColor: 'white', marginLeft: '5px', padding: '3px'}}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{width: '20px', height: '20px', display: 'inline'}}>
                <path d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
              </svg>
              <input className="text-gray-600" type="text" placeholder="70469 Stuttgart" style={{border: 'none', marginLeft: '5px'}} />
            </div>


            <div>
              <button 
                style={{backgroundColor: 'white', padding: '5px', marginLeft: '10px', cursor: 'pointer'}}
                onClick={() => setDistanceOpen(!distanceOpen)}
              >
                <span className="text-gray-600">{selectedDistance}</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} style={{width: '20px', height: '20px', display: 'inline', marginLeft: '5px'}}>
                  <path d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
              </button>
              


              {distanceOpen && (
                <div className="absolute mt-1 w-32 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                  <div className="py-1" role="menu" aria-orientation="vertical">
                    {distances.map((distance) => (
                      <button
                        key={distance}
                        className="w-full text-left px-4 py-2 text-sm text-gray-500 hover:bg-gray-100"
                        role="menuitem"
                        onClick={() => {
                          setSelectedDistance(distance);
                          setDistanceOpen(false);
                        }}
                      >
                        {distance}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-8">
            <Link href="/insert" className="flex flex-col items-center text-[#47702d]">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
              <span>Tiersitter finden</span>
            </Link>
            <Link href="/profile" className="flex flex-col items-center text-[#47702d]">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
              <span>Profil</span>
            </Link>
          </div>
        </div>
      </header>


      {/* Header END */}


      {/* Main Content */}
      <main className="flex-1 p-8 bg-gray-50">
        <h1 className="text-3xl text-center text-[#47702d]">Willkommen bei MietMiez</h1>
        <p className="text-gray-600">
          Ihre Plattform zum Mieten und Vermieten von Tieren in Ihrer Nähe.
        </p>

        <p className="text-gray-600">Hier kommen dann son paar tiere hin direkt von den home screen wie bei kleinanzeigen</p>
        
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 p-6 text-center text-gray-600">
        <p>Footer folgt... Hatte kb mehr xD</p>
      </footer>
    </div>
  );
}