'use client';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';

export const THEMES = [
    'default',
    'protanopia',
    'deuteranopia',
    'tritanopia',
    'achromatopsia',
] as const;

export type ThemeType = (typeof THEMES)[number];

type ThemeContextType = {
    theme: ThemeType;
    updateTheme: (t: ThemeType) => void;
};
export interface ThemeProviderProps {
    children?: React.ReactNode; // ← children 명시
}
const KEY = 'theme';

const ThemeContext = createContext<ThemeContextType>({
    theme: 'default',
    updateTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<ThemeType>('default');

    useEffect(() => {
        const stored = (localStorage.getItem(KEY) as ThemeType) || 'default';
        setTheme(stored);
        document.documentElement.setAttribute('data-theme', stored); // ✅ 핵심
    }, []);

    const updateTheme = (t: ThemeType) => {
        setTheme(t);
        localStorage.setItem(KEY, t);
        document.documentElement.setAttribute('data-theme', t); // ✅ 핵심
    };

    const value = useMemo(() => ({ theme, updateTheme }), [theme]);
    return (
        <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
    );
}
