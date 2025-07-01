'use client';

import React, {createContext, useContext} from 'react';

export const HomeContext = createContext<Promise<string> | null>(null);

export function HomeProvider({children, advertisements}: {
    children: React.ReactNode,
    advertisements: Promise<string>
}) {
    return (
        <HomeContext.Provider value={advertisements}>
            {children}
        </HomeContext.Provider>
    );
}

export function useHomeContext() {
    const context = useContext(HomeContext);
    if (context === null) {
        throw new Error("useHomeContext must be used within a HomeProvider");
    }
    return context;
}
