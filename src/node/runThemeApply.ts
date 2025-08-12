import { variableRegex } from '../constants/regex';
import { VariableRich, Vision, VariableInput } from '../types/types';
import { applyThemes } from './applyThemes';
import { requestColorTransformation } from './colorTransform';
import fs from 'node:fs';
import { removeExistingThemeBlocks } from './removeExistingThemeBlocks';

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
        const scale = /\d+$/.test(cleanKey);
        const rich: VariableRich = {
            base: cleanValue,
            scale,
        };
        variables[cleanKey] = rich;
    }

    const visions: Vision[] = ['deuteranopia', 'protanopia', 'tritanopia'];


    console.log('📤 추출된 원본 색상 데이터:', variables);

    // 색상 변환 알고리즘 호출
    try {
        const algorithmResult = await requestColorTransformation(variables);
        
        // 각 vision별로 결과 적용
        for (const themeData of algorithmResult.themes) {
            await applyThemes(themeData, cssPath);
        }
        
    } catch (error) {
        console.error(`❌ 색상 변환 실패:`, error);
        // 에러 발생 시 원본 색상으로 폴백
        console.log(`🔄 원본 색상으로 폴백 적용`);
        for (const vision of visions) {
            await applyThemes({ vision, variables }, cssPath);
        }
    }
    
    console.log(`✅ ${cssPath}에 색맹 테마가 적용되었습니다`);
}
