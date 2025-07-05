"use client";

import React, { createContext, useContext } from "react";

export type HeaderContextProps = {
  categoriesStringPromise: Promise<string>;
  isLoggedIn: boolean;
};

export const HeaderContext = createContext<HeaderContextProps | null>(null);

export function HeaderProvider({
  children,
  categoriesStringPromise,
  isLoggedIn,
}: {
  children: React.ReactNode;
  categoriesStringPromise: Promise<string>;
  isLoggedIn: boolean;
}) {
  return (
    <HeaderContext.Provider value={{ categoriesStringPromise, isLoggedIn }}>
      {children}
    </HeaderContext.Provider>
  );
}

export function useHeaderContext() {
  const context = useContext(HeaderContext);
  if (context === null) {
    throw new Error("useHeaderContext must be used within a HeaderProvider");
  }
  return context;
}
