"use client";

import { Edit, Trash2 } from "lucide-react";
import ImageSlider from "@/app/components/ImageSlider";
import UserCard from "@/app/components/cards/UserCard";
import React, { useEffect, useState } from "react";
import AdvertisementFetched from "@/app/objects/advertisement/AdvertisementFetched";
import Category from "@/app/objects/category";
import AdvertisementUpload from "@/app/objects/advertisement/AdvertisementUpload";
import ClientAdvertisementCommunication from "@/app/server_communication/client/ClientAdvertisementCommunication";
import Button from "@/app/components/button";
import { useRouter } from "next/navigation";

export default function AdvertisementEdit({
  isLoggedIn,
  advertisement,
  categoriesString,
}: {
  isLoggedIn: boolean;
  advertisement: string;
  categoriesString: string;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const ad: AdvertisementFetched = AdvertisementFetched.fromJSON(
    JSON.parse(advertisement),
  );
  const categories: Category[] = JSON.parse(categoriesString);
  const router = useRouter();

  const [files, setFiles] = React.useState<File[]>([]);
  const [title, setTitle] = useState(ad.title);
  const [description, setDescription] = useState(ad.description);
  const [animal, setAnimal] = useState(ad.animal);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [newAdvertisement, setAdvertisement] =
    React.useState<AdvertisementUpload>(ad);
  const [error, setError] = useState<string>("");

  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

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

  async function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const selectedFiles = Array.from(event.target.files || []);
    if (selectedFiles) {
      setFiles(selectedFiles);
    }
  }

  async function handleImageUpload() {
    const uploadResAdvertisement: AdvertisementUpload =
      await ClientAdvertisementCommunication.uploadImagesForAdvertisement(
        newAdvertisement,
        files,
      );
    setAdvertisement(uploadResAdvertisement);
  }

  async function handleSubmit() {
    if (title.length === 0 || description.length === 0) {
      setError("data incomplete");
      console.log(error);
    } else {
      const localAd = newAdvertisement;
      localAd.title = title;
      localAd.animal = animal;
      localAd.description = description;
      localAd.images = [];
      setAdvertisement(localAd);
      await handleImageUpload();

      const success =
        await ClientAdvertisementCommunication.updateAdvertisement(localAd);
      if (success) {
        alert("successfully updated your advertisement!");
        setTitle(newAdvertisement.title);
        setDescription(newAdvertisement.description);
        setFiles([]);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        setIsEditing(false);
      } else {
        console.error("error while creating:", error);
        alert("Error while creating your advertisement!");
      }
    }
    router.refresh();
  }

  async function handleDelete() {
    try {
      await ClientAdvertisementCommunication.deleteAdvertisement(
        newAdvertisement,
      );
      router.push("/home");
    } catch {
      console.error("Error deleting advertisement");
      alert("Error while deleting your advertisement!");
    }
  }

  return (
    <main className="px-4 py-8 md:px-12 lg:px-24 max-w-6xl mx-auto">
      {isLoggedIn ? (
        <div className="flex items-end justify-end">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex gap-2 px-4 py-2 bg-[#47702d] text-white rounded-lg hover:bg-[#3a5a25] transition-colors disabled:bg-gray-400 mb-4 items-end"
          >
            <Edit size={16} />
            {isEditing ? "Cancel" : "Edit"}
          </button>
        </div>
      ) : null}
      {/* Grid: Image + Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Images Section */}
        <div className="w-full aspect-video overflow-hidden rounded-2xl shadow-md">
          {isEditing ? (
            <label className="block text-gray-700 font-medium">
              Upload Image:
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="mt-2 block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-lg file:border-0
              file:text-sm file:font-semibold
              file:bg-indigo-50 file:text-indigo-700
              hover:file:bg-indigo-100
              cursor-pointer
            "
              />
            </label>
          ) : (
            <ImageSlider
              images={newAdvertisement.images}
              externalFetching={true}
            />
          )}
        </div>

        {/* Info Section */}
        <div className="space-y-6">
          {/* User Info */}
          <div className="rounded-xl shadow-md p-4 bg-white dark:bg-gray-900">
            <UserCard userJSON={JSON.stringify(ad.user.toJSON())} />
          </div>

          {/* Advertisement Text Info */}
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-6 m-3">
            {isEditing ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 m-2">
                  Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#47702d] focus:border-transparent text-gray-900 mb-3"
                />
              </div>
            ) : (
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                {newAdvertisement.title}
              </h1>
            )}
            {isEditing ? (
              <div
                ref={dropdownRef}
                className="relative w-full border border-gray-300 rounded-lg"
              >
                <button
                  className="flex items-center text-gray-700 px-4 py-2 bg-white rounded-md max-w-[200px] truncate"
                  onClick={() => setCategoriesOpen(!categoriesOpen)}
                >
                  <span className="truncate">{animal}</span>
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
                            setAnimal(category.name);
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
            ) : (
              <p className="text-lg text-gray-600 dark:text-gray-300">
                <strong>Animal:</strong> {newAdvertisement.animal}
              </p>
            )}
            <p className="text-lg text-gray-600 dark:text-gray-300">
              <strong>Location:</strong> {ad.user.city}
            </p>
          </div>
        </div>
      </div>

      {/* Description Section */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-2">
          Description
        </h2>
        {isEditing ? (
          <div>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full m-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#47702d] focus:border-transparent text-gray-900"
            />
          </div>
        ) : (
          <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line m-2">
            {newAdvertisement.description}
          </p>
        )}
      </div>
      {isEditing ? (
        <button
          onClick={handleDelete}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          <Trash2 size={16} />
          Delete advertisement
        </button>
      ) : null}
      {isEditing ? (
        <Button
          onClick={handleSubmit}
          isPrimary={true}
          title={"Save"}
          className="mt-2"
        />
      ) : null}
    </main>
  );
}
