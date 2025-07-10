"use client";

import { useRouter } from "next/navigation";
import Button from "@/app/components/button";

/**
 * component to display when the user is not logged in but a user is required for the following action
 * This provides a button to redirect the user to the login page
 * @constructor
 */
export default function NotLoggedIn() {
  const router = useRouter();
  return (
    <main className="px-4 py-8">
      <p className="text-2xl font-bold text-center mb-4">
        User is not logged in, please log in first to continue
      </p>
      <div className="flex justify-center mt-6">
        <Button
          isPrimary={true}
          onClick={() => router.push("/login")}
          title={"Login"}
        />
      </div>
    </main>
  );
}
