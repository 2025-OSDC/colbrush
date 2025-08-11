import Color from 'colorjs.io';

type ScaleKeys =
    | '50'
    | '100'
    | '200'
    | '300'
    | '400'
    | '500'
    | '600'
    | '700'
    | '800'
    | '900';
export type Scale = Record<ScaleKeys, string>;

const CLAMP01 = (x: number) => Math.max(0, Math.min(1, x));

const DEFAULT_SCALE: Record<ScaleKeys, { dL: number; cMul: number }> = {
    '50': { dL: +0.36, cMul: 0.95 },
    '100': { dL: +0.28, cMul: 0.96 },
    '200': { dL: +0.18, cMul: 0.98 },
    '300': { dL: +0.08, cMul: 0.99 },
    '400': { dL: +0.02, cMul: 1.0 },
    '500': { dL: 0.0, cMul: 1.0 }, // anchor
    '600': { dL: -0.05, cMul: 0.98 },
    '700': { dL: -0.15, cMul: 0.94 },
    '800': { dL: -0.22, cMul: 0.9 },
    '900': { dL: -0.3, cMul: 0.88 },
};

function hexToOKLCH(hex: string) {
    const c = new Color(hex);
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
        keys?: ScaleKeys[]; // 필요시 커스텀 키셋
        cMin?: number; // 최소 채도 바닥
        cMax?: number; // 최대 채도 한계
        lockHue?: boolean; // hue 고정(기본 true)
    }
): Scale {
    const keys = opts?.keys ?? [
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
