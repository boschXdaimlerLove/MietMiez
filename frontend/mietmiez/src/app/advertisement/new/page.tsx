"use client";

import React from "react";
import Advertisement from "@/app/objects/advertisement";
import User from "@/app/objects/user";
import ClientAdvertisementCommunication from "@/app/server_communication/client/ClientAdvertisementCommunication";

export default function NewAdvertisementPage() {
  const [files, setFiles] = React.useState<File[]>([]);
  const [advertisement, setAdvertisement] = React.useState<Advertisement>(
    Advertisement.forUpload(new User("", "", "", "", "", [])),
  );

  async function handleImageUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    console.log("File selected:", file);
    if (file) {
      console.log(URL.createObjectURL(file));
      const newFiles = [...files, file];
      setFiles(newFiles);
      const uploadRes: Advertisement =
        await ClientAdvertisementCommunication.uploadImagesForAdvertisement(
          advertisement,
          newFiles,
        );
      setAdvertisement(uploadRes);
      console.log("Advertisement after upload:", uploadRes);
      console.log("files", files);
    }
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    console.log("Form submitted");
  }

  return (
    <main>
      <h1>Create new advertisement here</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Upload Image:
          <input type="file" accept="image/*" onChange={handleImageUpload} />
        </label>
        <button type="submit">Submit</button>
      </form>
    </main>
  );
}
