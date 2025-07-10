"use client";

import React, { createContext, useContext } from "react";

/**
 * creates an advertisement context that provides the categories as string
 */
export const NewAdvertisementContext = createContext<Promise<string> | null>(
  null,
);

/**
 * a provider for the new advertisement page
 * @param children - the children of the provider
 * @param categoriesStringPromise - categories array as json string
 * @constructor
 */
export function NewAdvertisementProvider({
  children,
  categoriesStringPromise,
}: {
  children: React.ReactNode;
  categoriesStringPromise: Promise<string>;
}) {
  return (
    <NewAdvertisementContext.Provider value={categoriesStringPromise}>
      {children}
    </NewAdvertisementContext.Provider>
  );
}

/**
 * a hook to use the new advertisement context
 */
export function useNewAdvertisementContext() {
  const context = useContext(NewAdvertisementContext);
  if (context === null) {
    throw new Error("useProfileContext must be used within a ProfileProvider");
  }
  return context;
}
