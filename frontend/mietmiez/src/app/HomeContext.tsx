'use client';

import React, {createContext, useContext} from 'react';

export const HomeContext = createContext<string | null>(null);

export function HomeProvider({children, advertisements}: {
    children: React.ReactNode,
    advertisements: string
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
        throw new Error("useHeaderContext must be used within a HomeProvider");
    }
    return context;
}
