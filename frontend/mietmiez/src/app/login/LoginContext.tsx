"use client";

import React, { createContext, useContext } from "react";

/**
 * context to provide the login state of the user
 */
export const LoginContext = createContext<boolean | null>(null);

/**
 * Provider for the login context
 * @param children - the children in the provider
 * @param isLoggedIn - the login state of the user
 * @constructor
 */
export function LoginProvider({
  children,
  isLoggedIn,
}: {
  children: React.ReactNode;
  isLoggedIn: boolean;
}) {
  return (
    <LoginContext.Provider value={isLoggedIn}>{children}</LoginContext.Provider>
  );
}

/**
 * react hook to use the login context
 */
export function useLoginContext() {
  const context = useContext(LoginContext);
  if (context === null) {
    throw new Error("useHeaderContext must be used within a HeaderProvider");
  }
  return context;
}
