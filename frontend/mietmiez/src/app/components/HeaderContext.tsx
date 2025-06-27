'use client';

import React, {createContext, useContext} from 'react';
import Category from "@/app/objects/category";

export const HeaderContext = createContext<Category[] | null>(null);

export function HeaderProvider({children, categories}: {
    children: React.ReactNode,
    categories: Category[]
}) {
    return (
        <HeaderContext.Provider value={categories}>
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
