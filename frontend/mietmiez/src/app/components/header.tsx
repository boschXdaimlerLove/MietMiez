"use client";

import React, { use, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import {
  HeaderContextProps,
  useHeaderContext,
} from "@/app/components/HeaderContext";
import Category from "@/app/objects/internal/category";
import Button from "@/app/components/button";
import ClientUserCommunication from "@/app/server_communication/client/ClientUserCommunication";
import { Search, Undo2, User } from "lucide-react";

export default function Header() {
  const ALL_CATEGORIES: string = "All Categories";
  const router = useRouter();
  const { categoriesStringPromise, isLoggedIn }: HeaderContextProps =
    useHeaderContext();
  const categoriesString: string = use(categoriesStringPromise);
  const categories: Category[] = JSON.parse(categoriesString);

  const searchParams = useSearchParams();
  let passedAnimal = searchParams.get("animal");
  let passedZipCode: string = searchParams.get("zipCode") ?? "";
  const path = usePathname();
  if (!path.startsWith("/search")) {
    passedAnimal = ALL_CATEGORIES;
    passedZipCode = "";
  }
  let reset: boolean = false;

  const [categoriesOpen, setCategoriesOpen] = useState(false);
  let selectedCategory: string = passedAnimal ?? ALL_CATEGORIES;
  const [statedZipCode, setStatedZipCode] = useState(passedZipCode);

  const dropdownRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setCategoriesOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  function handleSubmit() {
    let localStatedZipCode: string = statedZipCode;
    if (reset) {
      localStatedZipCode = "";
      reset = false;
    }
    router.push(
      `/search?animal=${encodeURIComponent(selectedCategory)}&zipCode=${encodeURIComponent(localStatedZipCode)}`,
    );
  }

  return (
    <header className="w-full">
      {/* Top Bar */}
      <div className="flex flex-wrap items-center justify-between px-4 py-3 gap-4">
        {/* Logo */}
        <Link href="/">
          <div className="flex items-center">
            <Image
              alt="MietMiez Icon"
              src="/images/logo.png"
              width={36}
              height={36}
              className="rounded-md"
            />
            <span className="ml-2 text-lg font-bold">MietMiez</span>
          </div>
        </Link>

        {/* Auth Links */}
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/register"
            className="rounded-full border border-gray-300 px-4 py-2 text-green-800 text-sm font-medium"
          >
            Sign-up
          </Link>
          <span className="text-gray-600 justify-center items-center align-middle">
            or
          </span>
          <Button
            onClick={() => {
              async function logout() {
                await ClientUserCommunication.logout();
              }

              if (isLoggedIn) {
                // Handle logout logic here
                logout().then(() => router.refresh());
              } else {
                router.push("/login");
              }
            }}
            title={
              <>
                <User className="w-5 h-5 mr-1" />
                <span>{isLoggedIn ? "Logout" : "Login"}</span>
              </>
            }
            isPrimary={false}
            isCustom={true}
            className="rounded-full px-4 py-2 text-sm font-medium flex items-center text-black"
            customButtonStyle={{ backgroundColor: "#c9e265" }}
          />
        </div>
      </div>

      {/* Search Bar */}
      <div className="w-full bg-[var(--primary)] py-4 px-4 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex flex-wrap gap-2 items-center w-full md:w-auto">
          {/* Category Dropdown */}
          <button
            onClick={async () => {
              selectedCategory = ALL_CATEGORIES;
              setStatedZipCode("");
              reset = true;
              handleSubmit();
            }}
          >
            <Undo2 color="#FAF9F6" />
          </button>
          <div ref={dropdownRef} className="relative">
            <button
              className="flex items-center text-gray-700 px-4 py-2 bg-white rounded-md w-full md:w-60 max-w-[200px] truncate"
              onClick={() => setCategoriesOpen(!categoriesOpen)}
            >
              <span className="truncate">{selectedCategory}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5 ml-2"
              >
                <path d="m19.5 8.25-7.5 7.5-7.5-7.5" />
              </svg>
            </button>

            {categoriesOpen && (
              <div className="absolute mt-1 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-20">
                <div className="py-1">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => {
                        selectedCategory = category.name;
                        setCategoriesOpen(false);
                        handleSubmit();
                      }}
                    >
                      <div>{category.name}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Zip Code Input */}
          <form
            onSubmit={() => handleSubmit()}
            className="flex items-center bg-white px-4 max-w-[200px] py-2 rounded-md w-full md:w-60"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
              />
            </svg>
            <input
              className="ml-2 text-gray-600 w-full focus:outline-none"
              type="text"
              placeholder="70469"
              value={statedZipCode}
              onChange={(event) => setStatedZipCode(event.target.value)}
            />
          </form>
          <button onClick={() => handleSubmit()}>
            <Search color="#FAF9F6" />
          </button>
        </div>

        {/* Navigation Icons */}
        <div className="flex gap-6 items-center justify-center w-full md:w-auto">
          <Link
            href="/advertisement/new"
            className="flex flex-col items-center text-[var(--primaryBtnTxt)] text-sm"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 mb-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
            <span>Find pet sitter</span>
          </Link>
          <Link
            href="/profile"
            className="flex flex-col items-center text-[var(--primaryBtnTxt)] text-sm"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 mb-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
            <span>Profile</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
