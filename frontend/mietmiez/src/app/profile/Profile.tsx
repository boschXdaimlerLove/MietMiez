"use client";

import { useProfileContext } from "@/app/profile/ProfileContext";
import { use } from "react";

export default function Profile() {
  const userPromise = useProfileContext();
  const userString = use(userPromise);
  const user = JSON.parse(userString);
  return (
    <main>
      <h1>{user.firstName}</h1>
      <p>{user.email}</p>
    </main>
  );
}
