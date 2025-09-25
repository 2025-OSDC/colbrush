import { TLanguage } from '../../../client.js';
import type { VisionMode } from '../../../types/simulationTypes.js';

export type SimulationMode = Exclude<VisionMode, 'none'>;

export const KNOWN_MODES: VisionMode[] = [
    'none',
    'deuteranopia',
    'protanopia',
    'tritanopia',
];

export const SIMULATION_MODES: SimulationMode[] = [
    'deuteranopia',
    'protanopia',
    'tritanopia',
];

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

export function isVisionMode(value: string | null): value is VisionMode {
    return (value ?? '') !== '' && KNOWN_MODES.includes(value as VisionMode);
}
