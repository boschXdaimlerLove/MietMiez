"use client";

import React, { createContext, useContext } from "react";

export const RegisterContext = createContext<boolean | null>(null);

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

export function useRegisterContext() {
  const context = useContext(RegisterContext);
  if (context === null) {
    throw new Error("useHeaderContext must be used within a HeaderProvider");
  }
  return context;
}
