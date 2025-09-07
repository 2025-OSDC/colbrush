import { variableRegex } from '../core/constants/regex.js';
import type { VariableRich, Vision, VariableInput } from '../core/types.js';
import { applyThemes } from './applyThemes.js';
import { prepareCandidates, buildThemeForVision } from './colorTransform.js';
import fs from 'node:fs';
import { removeExistingThemeBlocks } from './removeExistingThemeBlocks.js';
import type { ProgressReporter } from './progress.js';

// HEX → RGB 변환
export function hexToRgb(hex: string): [number, number, number] | null {
    let clean = hex.replace('#', '').toLowerCase();
    if (clean.length === 3) {
        clean = clean
            .split('')
            .map((c) => c + c)
            .join('');
    }
    if (clean.length !== 6) return null;

    const r = parseInt(clean.substring(0, 2), 16);
    const g = parseInt(clean.substring(2, 4), 16);
    const b = parseInt(clean.substring(4, 6), 16);

    return [r, g, b];
}

// 무채색 판별: R,G,B 값이 완전히 같을 때만 true
export function isNeutralColor(value: string): boolean {
    const rgb = hexToRgb(value);
    if (!rgb) return false;

    const [r, g, b] = rgb;
    return r === g && g === b;
}

// 흑백 색상 감지 함수
function isBlackOrWhite(hexColor: string): boolean {
    const hex = hexColor.toLowerCase().replace('#', '');
    const fullHex =
        hex.length === 3
            ? hex
                  .split('')
                  .map((char) => char + char)
                  .join('')
            : hex;

    const r = parseInt(fullHex.substr(0, 2), 16);
    const g = parseInt(fullHex.substr(2, 2), 16);
    const b = parseInt(fullHex.substr(4, 2), 16);

    const isWhite = r >= 250 && g >= 250 && b >= 250;
    const isBlack = r <= 10 && g <= 10 && b <= 10;

    return isWhite || isBlack;
}

// scale 값 계산 함수
export function calculateScale(varName: string, hexColor: string): boolean {
    if (isBlackOrWhite(hexColor)) {
        return false;
    }

    return /\d+$/.test(varName);
}

export async function runThemeApply(
    cssPath: string,
    progress?: ProgressReporter
) {
    if (!fs.existsSync(cssPath)) {
        throw new Error(`❌ CSS 파일이 존재하지 않습니다: ${cssPath}`);
    }

    let content = fs.readFileSync(cssPath, 'utf8');

    // Section 1: theme 중복 생성 방지를 위해 기존에 존재하는 theme 블록 제거
    progress?.startSection('Remove existing theme blocks');
    content = removeExistingThemeBlocks(content);
    progress?.update(100);
    progress?.finishSection('Done');
    const variables: VariableInput = {};

    // Section 2: CSS에서 변수 추출
    progress?.startSection('Extract variables');
    const scanRegex = new RegExp(variableRegex.source, variableRegex.flags);
    const all = Array.from(content.matchAll(scanRegex));
    const totalVars = all.length || 1;
    const loopRegex = new RegExp(variableRegex.source, variableRegex.flags);
    let match;
    let count = 0;
    while ((match = loopRegex.exec(content)) !== null) {
        const [, key, value] = match;

        const cleanKey = key.trim();

        const cleanValue = value.trim().toLowerCase();

        if (isNeutralColor(cleanValue)) {
            count++;
            progress?.update((count / totalVars) * 100);
            continue;
        }

        const scale = calculateScale(cleanKey, cleanValue);
        const rich: VariableRich = {
            base: cleanValue,
            scale,
        };
        variables[cleanKey] = rich;
        count++;
        progress?.update((count / totalVars) * 100);
    }
    progress?.finishSection('Done');

    const visions: Vision[] = ['deuteranopia', 'protanopia', 'tritanopia'];

    // 색상 변환 알고리즘 호출
    try {
        const { colorKeys, baseColorsArray, candidateList } = prepareCandidates(
            variables,
            progress
        );
        for (const vision of visions) {
            const label = `Process — ${vision}`;
            progress?.startSection(label);
            progress?.update(30, 'Optimizing...');
            const themeData = buildThemeForVision(
                colorKeys,
                baseColorsArray,
                candidateList,
                vision
            );
            progress?.update(70, 'Applying CSS...');
            await applyThemes(themeData, cssPath, { silent: !!progress });
            progress?.update(100, 'Done');
            progress?.finishSection('Done');
        }
    } catch (error) {
        console.log('🚀 ~ runThemeApply ~ error:', error);
        // 에러 발생 시 원본 색상으로 폴백
        for (const vision of visions) {
            const label = `Process (fallback) — ${vision}`;
            progress?.startSection(label);
            await applyThemes({ vision, variables }, cssPath, {
                silent: !!progress,
            });
            progress?.finishSection('Done');
        }
    }

    // 섹션 기반이므로 전체 finish는 생략
    console.log(`\n✅ Colbrush themes applied to ${cssPath}`);
}
