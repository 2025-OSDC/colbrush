'use client';
import type { ReactNode } from 'react';
import {
    createContext,
    PropsWithChildren,
    useContext,
    useEffect,
    useMemo,
    useState,
} from 'react';
import { KNOWN_MODES, SimulationMode } from '../devtools/vision/modes.js';
import { set } from 'colorjs.io/fn';

export type TLanguage = 'English' | 'Korean';

// 1) 내부 공통 키(변하지 않는 값)
const THEME_KEYS = [
    'default',
    'protanopia',
    'deuteranopia',
    'tritanopia',
] as const;

const SIMULATION_KEYS = [
    'none',
    'deuteranopia',
    'protanopia',
    'tritanopia',
] as const;

export type ThemeKey = (typeof THEME_KEYS)[number];
export type SimulationKey = (typeof SIMULATION_KEYS)[number];

// 2) 언어별 라벨 매핑
export const THEME_LABEL: Record<TLanguage, Record<ThemeKey, string>> = {
    English: {
        default: 'default',
        protanopia: 'protanopia',
        deuteranopia: 'deuteranopia',
        tritanopia: 'tritanopia',
    },
    Korean: {
        default: '기본',
        protanopia: '적색맹',
        deuteranopia: '녹색맹',
        tritanopia: '청색맹',
    },
};

// 3) 옵션 리스트 생성기
export const getThemeOptions = (lang: TLanguage) =>
    THEME_KEYS.map((key) => ({ key, label: THEME_LABEL[lang][key] }));

type ThemeContextType = {
    theme: ThemeKey;
    language: TLanguage;
    updateTheme: (k: ThemeKey) => void;
    updateLanguage: (t: TLanguage) => void;
    simulationFilter: SimulationKey;
    setSimulationFilter: (value: SimulationKey) => void;
};

const KEY = 'theme';
const LANG_KEY = 'theme_lang';

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
    if ((THEME_KEYS as readonly string[]).includes(value))
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
        const storedTheme = normalizeToKey(localStorage.getItem(KEY));
        const storedLang =
            (localStorage.getItem(LANG_KEY) as TLanguage) || 'English';
        setTheme(storedTheme);
        setLanguage(storedLang);
        document.documentElement.setAttribute('data-theme', storedTheme);
    }, []);

    const updateTheme = (k: ThemeKey) => {
        setTheme(k);
        if (typeof window !== 'undefined') {
            localStorage.setItem(KEY, k);
            document.documentElement.setAttribute('data-theme', k);
        }
    };

    const updateLanguage = (t: TLanguage) => {
        setLanguage(t);
        if (typeof window !== 'undefined') {
            localStorage.setItem(LANG_KEY, t);
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
