'use client';

import React, {createContext, useContext} from 'react';

export const HeaderContext = createContext<string | null>(null);

export function HeaderProvider({children, categories}: {
    children: React.ReactNode,
    categories: string
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
