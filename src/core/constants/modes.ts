import { TLanguage } from '../../client.js';
import { TThemeKey, VisionMode } from '../types.js';

export type SimulationMode = Exclude<VisionMode, 'none'>;

export const SIMULATION_MODES: SimulationMode[] = [
    'deuteranopia',
    'protanopia',
    'tritanopia',
];

export const THEME_MODES: TThemeKey[] = [
    'default',
    ...SIMULATION_MODES,
];

export const VISION_MODES: VisionMode[] = ['none', ...SIMULATION_MODES];

export const MODE_LABELS: Record<TLanguage, Record<VisionMode, string>> = {
    English: {
        none: 'default',
        protanopia: 'protanopia',
        deuteranopia: 'deuteranopia',
        tritanopia: 'tritanopia',
    },
    Korean: {
        none: '꺼짐',
        protanopia: '적색맹',
        deuteranopia: '녹색맹',
        tritanopia: '청색맹',
    },
};

export const THEME_LABEL: Record<TLanguage, Record<TThemeKey, string>> = {
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

export function isVisionMode(value: string | null): value is VisionMode {
    return (value ?? '') !== '' && VISION_MODES.includes(value as VisionMode);
}
