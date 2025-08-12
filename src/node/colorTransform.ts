import chroma from 'chroma-js';
import blinder from 'color-blind'
import { VariableInput, VariableRich, Vision } from '../types/types.js';
import { inferRich } from './applyThemes.js';

export const THRESHOLD = 10;
export const CANDIDATE_COUNT = 10;
export const HUE_STEP = 180;

// 후보군 생성 함수
export function generateCandidates(hex: string) {
  const [baseHue] = chroma(hex).hcl();
  const candidates: string[] = [];

  candidates[0] = hex;

  for (let i = 1; i <= CANDIDATE_COUNT / 2; i++) {
    candidates[i * 2 - 1] = chroma(hex).set("hcl.h", ((baseHue + (HUE_STEP / CANDIDATE_COUNT * i))) % 360).hex()
    candidates[i * 2] = chroma(hex).set("hcl.h", ((baseHue - (HUE_STEP / CANDIDATE_COUNT * i)) + 360) % 360).hex()
  }

  return candidates;
}

// 색상 보정 함수
export function findOptimalColorCombination(
  colorKeys: string[],
  baseColorsArray: string[],
  candidateList: string[][],
  vision: Vision,
) {
  const n = baseColorsArray.length;
  let bestColors = null;
  let minDeltaSum = Infinity;

  let blind: (hex: string) => string;

  switch (vision) {
    // 적색맹
    case 'protanopia':
      blind = blinder.protanopia
      break;

    // 녹색맹 
    case 'deuteranopia':
      blind = blinder.deuteranopia
      break;

    // 청색맹
    case 'tritanopia':
      blind = blinder.tritanopia
      break;

    default:
      throw new Error('Invalid color blindness option');
  }

  function dfs(index: number, currentColors: string[], totalDelta: number) {
    if (index === n) {
      if (isValidColors(currentColors, blind)) {
        if (totalDelta < minDeltaSum) {
          minDeltaSum = totalDelta;
          bestColors = [...currentColors];
        }
      }
      return;
    }
    for (const candidate of candidateList[index]) {
      const delta = chroma.deltaE(baseColorsArray[index], candidate);

      if (totalDelta + delta > minDeltaSum) continue;

      currentColors.push(candidate);
      dfs(index + 1, currentColors, totalDelta + delta);
      currentColors.pop();
    }
  }

  dfs(0, [], 0);
  console.log('dfs 완료')
  const finalColors = bestColors ?? [...baseColorsArray];

  return colorKeys.reduce((acc, key, idx) => {
    acc[key] = finalColors![idx];
    return acc;
  }, {} as Record<string, string>);
}

// 테마 반환 함수
export async function requestColorTransformation(
  variables: VariableInput
) {

  const scaleGroups: Record<string, string[]> = {};
  const filteredVariables: VariableInput = {};

  for (const key in variables) {
    if (variables[key].scale) {
      // 숫자 스케일 그룹핑 (예: --color-primary-100 => --color-primary)
      const prefixMatch = key.match(/^(--[\w-]+)-\d+$/);
      if (!prefixMatch) {
        // 숫자 없는 경우 그냥 통과 (그냥 포함)
        filteredVariables[key] = variables[key];
        continue;
      }
      const prefix = prefixMatch[1];
      if (!scaleGroups[prefix]) scaleGroups[prefix] = [];
      scaleGroups[prefix].push(key);
    } else {
      // scale이 false면 무조건 포함
      filteredVariables[key] = variables[key];
    }
  }

  // 그룹별로 중간값만 필터링해서 filteredVariables에 추가
  for (const prefix in scaleGroups) {
    const keys = scaleGroups[prefix];
    const middleKey = getMiddleScaleKey(keys);
    if (middleKey) {
      filteredVariables[middleKey] = variables[middleKey];
    }
  }

  const colorKeys = Object.keys(filteredVariables)
  const baseColorsArray = Object.values(filteredVariables).map(v => v.base);
  const candidateList = baseColorsArray.map((color) => {
    return generateCandidates(color);
  });

  const colors_d = findOptimalColorCombination(colorKeys, baseColorsArray, candidateList, "deuteranopia")
  const colors_p = findOptimalColorCombination(colorKeys, baseColorsArray, candidateList, "protanopia")
  const colors_t = findOptimalColorCombination(colorKeys, baseColorsArray, candidateList, "tritanopia")

  const visions: Vision[] = ['deuteranopia', 'protanopia', 'tritanopia'];

  const colorsMap = {
    deuteranopia: colors_d,
    protanopia: colors_p,
    tritanopia: colors_t,
  };

  const themes = visions.map(vision => ({
    vision,
    variables: Object.entries(colorsMap[vision]).reduce((acc, [varName, baseHex]) => {
      acc[varName] = inferRich(varName, baseHex);
      return acc;
    }, {} as Record<string, VariableRich>)
  }));

  return { themes }
}

// 중간 스케일 추출 함수
function getMiddleScaleKey(keys: string[]): string | null {
  const scaleNumbers = keys
    .map(k => {
      const m = k.match(/\d+$/);
      return m ? parseInt(m[0], 10) : null;
    })
    .filter(n => n !== null) as number[];

  if (scaleNumbers.length === 0) return null;

  scaleNumbers.sort((a, b) => a - b);
  const midIndex = Math.floor(scaleNumbers.length / 2);
  const midNumber = scaleNumbers[midIndex];
  const middleKey = keys.find(k => k.endsWith(midNumber.toString())) || null;
  return middleKey;
}

// DeltaE 확인 함수
function isValidColors(colors: string[], blind: (hex: string) => string) {

  for (let i = 0; i < colors.length; i++) {
    for (let j = i + 1; j < colors.length; j++) {
      if (chroma.deltaE(blind(colors[i]), blind(colors[j])) < THRESHOLD) return false;
    }
  }

  return true;
}