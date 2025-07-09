"use client";

import { useRouter } from "next/navigation";
import Button from "@/app/components/button";

export default function NotLoggedIn() {
  const router = useRouter();
  return (
    <main>
      <p>User is not logged in, please log in first to continue</p>
      <Button
        isPrimary={true}
        onClick={() => router.push("/login")}
        title={"Login"}
      />
    </main>
  );
}
