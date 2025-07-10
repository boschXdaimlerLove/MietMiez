"use client";

import React, { createContext, useContext } from "react";

/**
 * context for the current user profile
 */
export const ProfileContext = createContext<string | null>(null);

/**
 * ProfileProvider component to provide the user profile context
 * @param children - the children components
 * @param user - the user passed as json string
 * @constructor
 */
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

/**
 * hook to use the ProfileContext
 */
export function useProfileContext() {
  const context = useContext(ProfileContext);
  if (context === null) {
    throw new Error("useProfileContext must be used within a ProfileProvider");
  }
  return context;
}
