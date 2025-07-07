"use client";

import React, { createContext, useContext } from "react";

export const LoginContext = createContext<boolean | null>(null);

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

export function useLoginContext() {
  const context = useContext(LoginContext);
  if (context === null) {
    throw new Error("useHeaderContext must be used within a HeaderProvider");
  }
  return context;
}
