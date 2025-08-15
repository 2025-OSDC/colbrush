import { variableRegex } from '../constants/regex.js';
import { VariableRich, Vision, VariableInput } from '../types/types.js';
import { applyThemes } from './applyThemes.js';
import { requestColorTransformation } from './colorTransform.js';
import fs from 'node:fs';
import { removeExistingThemeBlocks } from './removeExistingThemeBlocks.js';

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
function calculateScale(varName: string, hexColor: string): boolean {
    if (isBlackOrWhite(hexColor)) {
        return false;
    }

    return /\d+$/.test(varName);
}

export async function runThemeApply(cssPath: string) {
    if (!fs.existsSync(cssPath)) {
        throw new Error(`❌ CSS 파일이 존재하지 않습니다: ${cssPath}`);
    }

    let content = fs.readFileSync(cssPath, 'utf8');
    content = removeExistingThemeBlocks(content);
    const variables: VariableInput = {};

    let match;
    while ((match = variableRegex.exec(content)) !== null) {
        const [, key, value] = match;

        const cleanKey = key.trim();
        const cleanValue = value.trim();

        const scale = calculateScale(cleanKey, cleanValue);
        const rich: VariableRich = {
            base: cleanValue,
            scale,
        };
        variables[cleanKey] = rich;
    }

    const visions: Vision[] = ['deuteranopia', 'protanopia', 'tritanopia'];

    // console.log('📤 추출된 원본 색상 데이터:', variables);

    // 색상 변환 알고리즘 호출
    try {
        const algorithmResult = await requestColorTransformation(variables);

        for (const themeData of algorithmResult.themes) {
            await applyThemes(themeData, cssPath);
        }
    } catch (error) {
        console.log('🚀 ~ runThemeApply ~ error:', error);
        // 에러 발생 시 원본 색상으로 폴백
        for (const vision of visions) {
            await applyThemes({ vision, variables }, cssPath);
        }
    }

    console.log(`✅ ${cssPath}에 색맹 테마가 적용되었습니다`);
}
