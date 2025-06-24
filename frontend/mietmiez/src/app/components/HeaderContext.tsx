'use client';

import React, {createContext} from 'react';
import Category from "@/app/objects/category";

export const HeaderContext = createContext<Promise<Category[]> | null>(null);

export function HeaderProvider({children, categoryPromise}: {
    children: React.ReactNode,
    categoryPromise: Promise<Category[]>
}) {
    return (
        <HeaderContext.Provider value={categoryPromise}>
            {children}
        </HeaderContext.Provider>
    );
}

export function useHeaderContext() {
    const context = React.useContext(HeaderContext);
    if (context === null) {
        throw new Error("useHeaderContext must be used within a HeaderProvider");
    }
    return context;
}
