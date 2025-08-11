import { variableRegex } from '../constants/regex';
import { VariableRich, Vision, VariableInput } from '../types/types';
import { applyThemes } from './applyThemes';
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
            base: value,
            scale,
        };
        variables[cleanKey] = rich;
    }

    const visions: Vision[] = [
        'deuteranopia',
        'protanopia',
        'tritanopia',
        'achromatopsia',
    ];

    // 여기에 제가 추후에 함수 추가 하면 될 듯 싶습니다!
    //     variables = {
    //   '--color-primary-100': { base: '#e7fdec', scale: true },
    //   '--color-primary-300': { base: '#b5f7d3', scale: true },
    //   '--color-primary-500': { base: '#7fe4c1', scale: true },
    //   '--color-primary-700': { base: '#3fa495', scale: true },
    //   '--color-primary-900': { base: '#186a6d', scale: true },
    //   '--color-secondary-yellow': { base: '#fdfa91', scale: false },
    //   '--color-secondary-blue': { base: '#005880', scale: false },
    //   '--color-warning': { base: '#ff517c', scale: false },
    //   '--color-default-gray-100': { base: '#fefefe', scale: true },
    //   '--color-default-gray-400': { base: '#e6e6e6', scale: true },
    //   '--color-default-gray-500': { base: '#c3c3c3', scale: true },
    //   '--color-default-gray-700': { base: '#616161', scale: true },
    //   '--color-default-gray-800': { base: '#212121', scale: true }
    //   } 이렇게 데이터 넘겨 드릴테니 notion에 적어놓은 것처럼 넘겨주시면 됩니다!

    visions.forEach(async (vision, idx) => {
        await applyThemes({ vision, variables }, cssPath);
    });
    console.log(`✅ ${cssPath}에 색맹 테마가 적용되었습니다`);
}
