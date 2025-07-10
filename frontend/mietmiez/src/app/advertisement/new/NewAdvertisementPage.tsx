"use client";

import React, { use, useEffect, useState } from "react";
import ClientAdvertisementCommunication from "@/app/server_communication/client/ClientAdvertisementCommunication";
import AdvertisementUpload from "@/app/objects/advertisement/AdvertisementUpload";
import Category from "@/app/objects/internal/category";
import { useNewAdvertisementContext } from "@/app/advertisement/new/NewAdvertisementContext";

/**
 * the actual page for creating a new advertisement
 * @constructor
 */
export default function NewAdvertisementPage() {
  const [files, setFiles] = React.useState<File[]>([]);
  const [advertisement, setAdvertisement] = React.useState<AdvertisementUpload>(
    AdvertisementUpload.forUpload(),
  );
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const categoriesStringPromise = useNewAdvertisementContext();
  const categoriesString: string = use(categoriesStringPromise);
  const categories: Category[] = JSON.parse(categoriesString);
  const [selectedCategory, setSelectedCategory] = useState("Choose a category");

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

  /**
   * handles the change of an image in the file input
   * @param event - the HTML event
   */
  async function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const selectedFiles = Array.from(event.target.files || []);
    if (selectedFiles) {
      setFiles(selectedFiles);
    }
  }

  /**
   * handles the upload for all images passed to this new advertisement
   */
  async function handleImageUpload() {
    const uploadResAdvertisement: AdvertisementUpload =
      await ClientAdvertisementCommunication.uploadImagesForAdvertisement(
        advertisement,
        files,
      );
    setAdvertisement(uploadResAdvertisement);
  }

  /**
   * handles the submission of the advertisement form and upload of all data
   * @param event - the HTML form event
   */
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (title.length === 0 || description.length === 0) {
      setError("data is not valid");
      return;
    }
    const localAd = advertisement;
    localAd.animal = selectedCategory;
    localAd.title = title;
    localAd.description = description;
    setAdvertisement(localAd);
    await handleImageUpload();

    const success =
      await ClientAdvertisementCommunication.createAdvertisement(localAd);
    if (success) {
      alert("advertisement created successfully!");
      setTitle("");
      setDescription("");
      setFiles([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } else {
      console.error("error while creating:", error);
      alert("Error while creating your advertisement!");
    }
  }

  return (
    <main className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-md mt-10">
      <h1 className="text-3xl font-semibold mb-6 text-center text-gray-800">
        Create new advertisement here
      </h1>
      {error && (
        <p className="text-red-600 text-center mb-4 text-sm">{error}</p>
      )}
      <form onSubmit={handleSubmit} className="space-y-5">
        <input
          type="text"
          placeholder="Name of your pet"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full p-3 border border-gray-300 rounded-lg text-gray-700 text-base placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        {/* Category Dropdown */}
        <div
          ref={dropdownRef}
          className="relative w-full border border-gray-300 rounded-lg"
        >
          <button
            className="w-full flex justify-between items-center text-gray-700 px-4 py-2 bg-white rounded-md max-w-full truncate"
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

        <textarea
          placeholder="What should people know about your pet?"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows={6}
          className="w-full p-3 border border-gray-300 rounded-lg text-gray-700 text-base placeholder-gray-400 resize-y focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

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

        <button
          type="submit"
          className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors duration-300"
        >
          Submit
        </button>
      </form>
    </main>
  );
}
