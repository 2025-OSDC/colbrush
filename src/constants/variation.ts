import { ScaleKeys } from '../types/types';

export const DEFAULT_KEYS = [
    '50',
    '100',
    '200',
    '300',
    '400',
    '500',
    '600',
    '700',
    '800',
    '900',
];

export const DEFAULT_SCALE: Record<ScaleKeys, { dL: number; cMul: number }> = {
    '50': { dL: +0.36, cMul: 0.95 },
    '100': { dL: +0.28, cMul: 0.96 },
    '200': { dL: +0.18, cMul: 0.98 },
    '300': { dL: +0.08, cMul: 0.99 },
    '400': { dL: +0.02, cMul: 1.0 },
    '500': { dL: 0.0, cMul: 1.0 },
    '600': { dL: -0.05, cMul: 0.98 },
    '700': { dL: -0.15, cMul: 0.94 },
    '800': { dL: -0.22, cMul: 0.9 },
    '900': { dL: -0.3, cMul: 0.88 },
};
