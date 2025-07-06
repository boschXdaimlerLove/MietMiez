"use client";

import React, { useState } from "react";
import ClientAdvertisementCommunication from "@/app/server_communication/client/ClientAdvertisementCommunication";
import AdvertisementUpload from "@/app/objects/advertisement/AdvertisementUpload";

export default function NewAdvertisementPage() {
  const [files, setFiles] = React.useState<File[]>([]);
  const [advertisement, setAdvertisement] = React.useState<AdvertisementUpload>(
    AdvertisementUpload.forUpload(),
  );

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [animal, setAnimal] = useState("");
  const [error, setError] = useState("");

  async function handleImageUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) {
      const newFiles = [...files, file];
      setFiles(newFiles);
      const uploadRes: AdvertisementUpload =
        await ClientAdvertisementCommunication.uploadImagesForAdvertisement(
          advertisement,
          newFiles,
        );
      setAdvertisement(uploadRes);
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (animal.length === 0 || title.length === 0 || description.length === 0) {
      setError("Daten unvollständig");
      console.log(error);
      return;
    }
    const localAd = advertisement;
    localAd.animal = animal;
    localAd.title = title;
    localAd.description = description;
    setAdvertisement(localAd);

    const success =
      await ClientAdvertisementCommunication.createAdvertisement(localAd);
    if (success) {
      alert("Anzeige erfolgreich erstellt!");
      setTitle("");
      setAnimal("");
      setDescription("");
    } else {
      console.error("Fehler beim Erstellen:", error);
      alert("Fehler beim Erstellen der Anzeige.");
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
          placeholder="Name des Tieres"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full p-3 border border-gray-300 rounded-lg text-gray-700 text-base placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <input
          type="text"
          placeholder="Tierart"
          value={animal}
          onChange={(e) => setAnimal(e.target.value)}
          required
          className="w-full p-3 border border-gray-300 rounded-lg text-gray-700 text-base placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <textarea
          placeholder="Was sollte man über dein Tier wissen?"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows={6}
          className="w-full p-3 border border-gray-300 rounded-lg text-gray-700 text-base placeholder-gray-400 resize-y focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <label className="block text-gray-700 font-medium">
          Upload Image:
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
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
