"use client";

import React from "react";
import Button from "@/app/components/button";
import ClientUserCommunication from "@/app/server_communication/client/ClientUserCommunication";
import { useRouter } from "next/navigation";

export default function AlreadyLoggedIn() {
  const router = useRouter();
  return (
    <main className="px-4 py-8">
      <p className="text-2xl font-bold text-center mb-4">
        Please log out first
      </p>
      <div className="flex justify-center mt-6">
        <Button
          isPrimary={true}
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
