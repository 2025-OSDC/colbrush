'use client';
import type { ReactNode } from 'react';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { VisionMode } from '../types/simulationTypes.js';
import { THEME_LABEL, THEME_MODES } from '../core/constants/modes.js';
import { TThemeKey } from '../core/types.js';
import {
    LanguageStorageKey,
    SimulationStorageKey,
    ThemeStorageKey,
} from '../core/constants/key.js';

export type TLanguage = 'English' | 'Korean';
export type ThemeKey = TThemeKey[number];
export type SimulationKey = VisionMode[number];

export const getThemeOptions = (lang: TLanguage) =>
    THEME_MODES.map((key) => ({ key, label: THEME_LABEL[lang][key] }));

type ThemeContextType = {
    theme: ThemeKey;
    language: TLanguage;
    updateTheme: (k: ThemeKey) => void;
    updateLanguage: (t: TLanguage) => void;
    simulationFilter: SimulationKey;
    setSimulationFilter: (value: SimulationKey) => void;
};

const ThemeContext = createContext<ThemeContextType>({
    theme: 'default',
    language: 'English',
    updateTheme: () => {},
    updateLanguage: () => {},
    simulationFilter: 'none',
    setSimulationFilter: () => {},
});

export const useTheme = () => useContext(ThemeContext);

function normalizeToKey(value: string | null): ThemeKey {
    if (!value) return 'default';
    if ((THEME_MODES as readonly string[]).includes(value))
        return value as ThemeKey;

    const reverse: Record<string, ThemeKey> = {};
    (['English', 'Korean'] as const).forEach((lang) => {
        (Object.entries(THEME_LABEL[lang]) as [ThemeKey, string][]).forEach(
            ([k, label]) => {
                reverse[label] = k;
            }
        );
    });
    return reverse[value] ?? 'default';
}

type ThemeProviderProps = { children: ReactNode };

export function ThemeProvider({ children }: ThemeProviderProps) {
    const [theme, setTheme] = useState<ThemeKey>('default');
    const [simulationFilter, setSimulationFilter] =
        useState<SimulationKey>('none');
    const [language, setLanguage] = useState<TLanguage>('English');

    useEffect(() => {
        if (typeof window === 'undefined') return;
        const storedTheme = normalizeToKey(
            localStorage.getItem(ThemeStorageKey)
        );
        const storedLang =
            (localStorage.getItem(LanguageStorageKey) as TLanguage) ||
            'English';
        const storedFilter =
            localStorage.getItem(SimulationStorageKey) || 'none';

        setSimulationFilter(storedFilter as SimulationKey);
        setTheme(storedTheme);
        setLanguage(storedLang);
        document.documentElement.setAttribute('data-theme', storedTheme);
    }, []);

    const updateTheme = (k: ThemeKey) => {
        setTheme(k);
        if (typeof window !== 'undefined') {
            localStorage.setItem(ThemeStorageKey, k);
            document.documentElement.setAttribute('data-theme', k);
        }
    };

    const updateLanguage = (t: TLanguage) => {
        setLanguage(t);
        if (typeof window !== 'undefined') {
            localStorage.setItem(LanguageStorageKey, t);
        }
    };

    const value = useMemo(
        () => ({
            theme,
            language,
            updateTheme,
            updateLanguage,
            simulationFilter,
            setSimulationFilter,
        }),
        [theme, language, simulationFilter]
    );

    return (
        <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
    );
}

export const useUpdateTheme = () => useTheme().updateTheme;
export const useUpdateLanguage = () => useTheme().updateLanguage;

export type ThemeType = ThemeKey;
export const THEMES = THEME_LABEL;
