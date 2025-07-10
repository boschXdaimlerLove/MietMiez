"use client";

import React, { createContext, useContext } from "react";

/**
 * the home context to pass advertisements as string
 */
export const HomeContext = createContext<Promise<string> | null>(null);

/**
 * the home provider
 * @param children - the children in the provider
 * @param advertisements - the advertisements as a promise of string
 * @constructor
 */
export function HomeProvider({
  children,
  advertisements,
}: {
  children: React.ReactNode;
  advertisements: Promise<string>;
}) {
  return (
    <HomeContext.Provider value={advertisements}>
      {children}
    </HomeContext.Provider>
  );
}

/**
 * context hook to use the home context
 */
export function useHomeContext() {
  const context = useContext(HomeContext);
  if (context === null) {
    throw new Error("useHomeContext must be used within a HomeProvider");
  }
  return context;
}
