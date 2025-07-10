"use client";

import React from "react";
import Button from "@/app/components/button";
import ClientUserCommunication from "@/app/server_communication/client/ClientUserCommunication";
import { useRouter } from "next/navigation";

/**
 * Component to display a message when the user is already logged in and the action doesn't allow being logged in.
 * This provides a button to logout
 * @constructor
 */
export default function AlreadyLoggedIn() {
  const router = useRouter();
  return (
    <main className="px-4 py-8">
      <p className="text-2xl font-bold text-center mb-4">
        Please log out first
      </p>
      <div className="flex flex-col items-center mt-6 space-y-4">
        <Button
          isPrimary={true}
          onClick={() => router.push("/home")}
          title={"Home"}
        />
        <Button
          isPrimary={false}
          onClick={async () => {
            await ClientUserCommunication.logout();
            router.refresh();
          }}
          title={"Logout"}
        />
      </div>
    </main>
  );
}
