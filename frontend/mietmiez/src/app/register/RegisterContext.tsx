"use client";

import React, { createContext, useContext } from "react";

/**
 * the context for the register page
 */
export const RegisterContext = createContext<boolean | null>(null);

/**
 * provider to provide the user login state
 * @param children - the children displayed in the provider
 * @param isLoggedIn - whether the user is logged in or not
 * @constructor
 */
export function RegisterProvider({
  children,
  isLoggedIn,
}: {
  children: React.ReactNode;
  isLoggedIn: boolean;
}) {
  return (
    <RegisterContext.Provider value={isLoggedIn}>
      {children}
    </RegisterContext.Provider>
  );
}

/**
 * hook to use the register context
 */
export function useRegisterContext() {
  const context = useContext(RegisterContext);
  if (context === null) {
    throw new Error("useHeaderContext must be used within a HeaderProvider");
  }
  return context;
}
