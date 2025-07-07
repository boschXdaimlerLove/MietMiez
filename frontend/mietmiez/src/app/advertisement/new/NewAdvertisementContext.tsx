"use client";

import React, { createContext, useContext } from "react";

export const NewAdvertisementContext = createContext<Promise<string> | null>(
  null,
);

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

export function useNewAdvertisementContext() {
  const context = useContext(NewAdvertisementContext);
  if (context === null) {
    throw new Error("useProfileContext must be used within a ProfileProvider");
  }
  return context;
}
