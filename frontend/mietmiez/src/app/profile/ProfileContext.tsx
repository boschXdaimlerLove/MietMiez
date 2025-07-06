"use client";

import React, { createContext, useContext } from "react";

export const ProfileContext = createContext<string | null>(null);

export function ProfileProvider({
  children,
  user,
}: {
  children: React.ReactNode;
  user: string;
}) {
  return (
    <ProfileContext.Provider value={user}>{children}</ProfileContext.Provider>
  );
}

export function useProfileContext() {
  const context = useContext(ProfileContext);
  if (context === null) {
    throw new Error("useProfileContext must be used within a ProfileProvider");
  }
  return context;
}
