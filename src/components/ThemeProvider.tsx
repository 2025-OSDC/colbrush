'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';

export const THEMES = [
    'default',
    'protanopia',
    'deuteranopia',
    'tritanopia',
] as const;
export type ThemeType = (typeof THEMES)[number];

type ThemeContextType = {
    theme: ThemeType;
    updateTheme: (t: ThemeType) => void;
};

const KEY = 'theme';

const ThemeContext = createContext<ThemeContextType>({
    theme: 'default',
    updateTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<ThemeType>('default');

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const stored =
                (localStorage.getItem(KEY) as ThemeType) || 'default';
            setTheme(stored);
            document.documentElement.setAttribute('data-theme', stored);
        }
    }, []);

    const updateTheme = (t: ThemeType) => {
        setTheme(t);
        if (typeof window !== 'undefined') {
            localStorage.setItem(KEY, t);
            document.documentElement.setAttribute('data-theme', t);
        }
    };

    const value = useMemo(() => ({ theme, updateTheme }), [theme]);

    return (
        <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
    );
}
