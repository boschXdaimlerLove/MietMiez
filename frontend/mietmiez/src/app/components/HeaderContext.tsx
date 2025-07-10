"use client";

import React, { createContext, useContext } from "react";

/**
 * the props of the context
 */
export type HeaderContextProps = {
  categoriesStringPromise: Promise<string>;
  isLoggedIn: boolean;
};

/**
 * header context with props to pass
 */
export const HeaderContext = createContext<HeaderContextProps | null>(null);

/**
 * HeaderProvider component to provide the context to its children
 * @param children - the children passed to the provider
 * @param categoriesStringPromise - the categories array as string
 * @param isLoggedIn - whether a user is logged in or not
 * @constructor
 */
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

/**
 * useHeaderContext hook to access the header context
 */
export function useHeaderContext() {
  const context = useContext(HeaderContext);
  if (context === null) {
    throw new Error("useHeaderContext must be used within a HeaderProvider");
  }
  return context;
}
