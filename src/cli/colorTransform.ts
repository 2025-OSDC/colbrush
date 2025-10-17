import chroma from 'chroma-js';
import type { VariableInput, VariableRich, Vision } from '../core/types.js';
import { inferRich } from './applyThemes.js';
import type { ProgressReporter } from './progress.js';

const ALPHA = 1.5; // 조정 계수

function colorTranslate(
  colorKeys: string[],
  baseColorsArray: string[],
  vision: Vision,
) {

  const labArray = baseColorsArray.map(hex => chroma(hex).lab())

  const newLabArray = labArray.map(lab => {
    const newLab = [...lab]; // 복사 [L, a, b]

    switch (vision) {
      case "protanopia":
        newLab[2] += ALPHA * lab[1]; // a* -> b* 매핑
        break;
      case "deuteranopia":
        newLab[2] += ALPHA * lab[1]; // a* -> b* 매핑
        break;
      case "tritanopia":
        newLab[1] -= ALPHA * 0.5 * lab[2]; // b* -> a* 매핑
        break;
    }

    return newLab
  })

  const newColorArray = newLabArray.map(lab => chroma.lab(lab[0], lab[1], lab[2]).hex())

  return colorKeys.reduce(
    (acc, key, idx) => {
      acc[key] = newColorArray[idx];
      return acc;
    },
    {} as Record<string, string>
  );
}

// 특정 시각 유형에 대한 테마 생성
export function buildThemeForVision(
  colorKeys: string[],
  baseColorsArray: string[],
  vision: Vision
) {
  const colors = colorTranslate(
    colorKeys,
    baseColorsArray,
    vision
  );
  const variables = Object.entries(colors).reduce(
    (acc, [varName, baseHex]) => {
      acc[varName] = inferRich(varName, baseHex);
      return acc;
    },
    {} as Record<string, VariableRich>
  );
  return { vision, variables } as const;
}

// 후보 준비: 변수 필터링
export function prepareCandidates(
  variables: VariableInput,
  progress?: ProgressReporter
) {
  const scaleGroups: Record<string, string[]> = {};
  const filteredVariables: VariableInput = {};

  for (const key in variables) {
    if (variables[key].scale) {
      const prefixMatch = key.match(/^(--[\w-]+)-\d+$/);
      if (!prefixMatch) {
        filteredVariables[key] = variables[key];
        continue;
      }
      const prefix = prefixMatch[1];
      if (!scaleGroups[prefix]) scaleGroups[prefix] = [];
      scaleGroups[prefix].push(key);
    } else {
      filteredVariables[key] = variables[key];
    }
  }

  for (const prefix in scaleGroups) {
    const keys = scaleGroups[prefix];
    const middleKey = getMiddleScaleKey(keys);
    if (middleKey) {
      filteredVariables[middleKey] = variables[middleKey];
    }
  }

  const colorKeys = Object.keys(filteredVariables);
  const baseColorsArray = Object.values(filteredVariables).map((v) => v.base);

  return { colorKeys, baseColorsArray };
}

// 중간 스케일 추출 함수
function getMiddleScaleKey(keys: string[]): string | null {
  const scaleNumbers = keys
    .map((k) => {
      const m = k.match(/\d+$/);
      return m ? parseInt(m[0], 10) : null;
    })
    .filter((n) => n !== null) as number[];

  if (scaleNumbers.length === 0) return null;

  scaleNumbers.sort((a, b) => a - b);
  const midIndex = Math.floor(scaleNumbers.length / 2);
  const midNumber = scaleNumbers[midIndex];
  const middleKey =
    keys.find((k) => k.endsWith(midNumber.toString())) || null;
  return middleKey;
}