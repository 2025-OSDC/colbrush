import ColorModule from 'colorjs.io';
import type { Scale, ScaleKeys } from '../types.js';
import { DEFAULT_KEYS, DEFAULT_SCALE } from '../constants/variation.js';

const CLAMP01 = (x: number) => Math.max(0, Math.min(1, x));

type ColorCtor = typeof ColorModule;

const Color = ((ColorModule as unknown as { default?: ColorCtor }).default ??
    ColorModule) as ColorCtor;

function hexToOKLCH(color: string) {
    const normalizedColor = color.replace(/,(?=\s*\d)/g, ' ');
    const c = new Color(normalizedColor);
    const o = c.to('oklch');
    return { l: o.l, c: o.c, h: o.h ?? 0 };
}

function oklchToHex(l: number, c: number, h: number) {
    // sRGB 범위 밖이면 r/g/b를 0..1로 클램프
    const color = new Color('oklch', [l, c, h]);
    const srgb = color.to('srgb');
    const r = CLAMP01(srgb.r),
        g = CLAMP01(srgb.g),
        b = CLAMP01(srgb.b);
    return new Color('srgb', [r, g, b]).toString({ format: 'hex' });
}

/**
 * 입력 대표색(보통 500) 하나로 50~900까지 생성
 */
export function buildScaleFromBaseHex(
    baseHex: string,
    opts?: {
        keys?: ScaleKeys[]; // 50, 100, 200 등
        cMin?: number; // 최소 채도 바닥
        cMax?: number; // 최대 채도 한계
        lockHue?: boolean; // hue 고정(기본 true)
    }
): Scale {
    const keys = opts?.keys ?? DEFAULT_KEYS;
    const cMin = opts?.cMin ?? 0.02;
    const cMax = opts?.cMax ?? 0.4;
    const lockHue = true;

    const base = hexToOKLCH(baseHex);
    const out: Partial<Scale> = {};

    for (const k of keys) {
        const pat = DEFAULT_SCALE[k as ScaleKeys] ?? DEFAULT_SCALE['500'];
        // L, C는 패턴 적용 / H는 기본 고정(브랜드 유지)
        const L = CLAMP01(base.l + pat.dL);
        const C = Math.max(cMin, Math.min(cMax, base.c * pat.cMul));
        const H = lockHue ? base.h : base.h; // 필요하면 여기에 소폭 보정 로직 추가
        out[k as ScaleKeys] = oklchToHex(L, C, H);
    }
    return out as Scale;
}
