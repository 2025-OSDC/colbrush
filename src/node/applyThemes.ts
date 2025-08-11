import fs from 'node:fs';
import postcss, { Root, Rule } from 'postcss';
import safeParser from 'postcss-safe-parser';
import { buildScaleFromBaseHex } from '../utils/core/colorScale.js';

type Vision = 'protanopia' | 'deuteranopia' | 'tritanopia' | 'achromatopsia';

export type ThemeType = Vision | 'default' | 'system';

type VariableSimple = string; // "#dd3f21"
interface VariableRich {
    base: string; // HEX
    scale: boolean; // true=스케일 생성, false=단일 변수
    keys?: string[]; // 스케일 키셋(선택)
    anchor?: string; // "500" 등 (현재 로직에선 anchor는 참고용)
}
type VariableInput = Record<string, VariableSimple | VariableRich>;

interface ThemeGenInput {
    vision: Vision; // 색각 유형
    theme: string; // data-theme 이름 (예: "tritanopia")
    variables: VariableInput; // {"--primary-500":"#dd3f21", "--accent":{base:"#0088ff", scale:false}}
}

const CSS_PATH = 'src/index.css';
// key는 50|100|...|900 같은 단계 숫자만 허용
const VAR_RE = /^--(.+?)-(50|100|200|300|400|500|600|700|800|900)$/i;

const DEFAULT_KEYS = [
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
] as const;

// (필요 시) 색맹 변환 자리에 연결하는 함수. 지금은 패스스루.
function toThemeColor(hex: string, _vision: Vision): string {
    return hex;
}

// CSS 로드
function loadRoot(cssPath = CSS_PATH): Root {
    const css = fs.readFileSync(cssPath, 'utf8');
    return postcss().process(css, { parser: safeParser }).root as Root;
}

// 해당 token의 기존 variation 키셋 스캔 (없으면 빈 배열)
function getExistingKeysForToken(root: Root, token: string): string[] {
    const keys = new Set<string>();
    root.walkDecls((d) => {
        if (!d.prop.startsWith('--')) return;
        const m = d.prop.match(VAR_RE);
        if (!m) return;
        const [, t, k] = m;
        if (t === token) keys.add(k);
    });
    return Array.from(keys);
}

// 특정 selector 블록에 변수 upsert
function upsertBlock(root: Root, selector: string, kv: Record<string, string>) {
    let rule: Rule | undefined;
    root.walkRules((r) => {
        if (r.selector === selector) rule = r;
    });
    if (!rule) {
        rule = new Rule({ selector });
        root.append(rule);
    }

    const remain = new Map(Object.entries(kv));
    rule.walkDecls((d) => {
        if (remain.has(d.prop)) {
            d.value = remain.get(d.prop)!;
            remain.delete(d.prop);
        }
    });
    for (const [prop, value] of remain) rule.append({ prop, value });
}

// 메인: 입력을 받아 [data-theme='...']에 반영
export function applyThemes(input: ThemeGenInput, cssPath = CSS_PATH) {
    const root = loadRoot(cssPath);
    const selector = `[data-theme='${input.theme}']`;
    const varsForTheme: Record<string, string> = {};

    for (const [varName, val] of Object.entries(input.variables)) {
        // 값 해석
        const rich: VariableRich =
            typeof val === 'string'
                ? inferRich(varName, val) // 간단값 → 규칙에 따라 scale 여부 자동 추론
                : val;

        const m = varName.match(VAR_RE);
        const isPattern = !!m;

        if (isPattern) {
            // --token-key 형태
            const [, token] = m!;
            const keys =
                rich.keys && rich.keys.length
                    ? rich.keys
                    : getExistingKeysForToken(root, token).length
                      ? getExistingKeysForToken(root, token)
                      : Array.from(DEFAULT_KEYS);

            if (rich.scale !== false) {
                // 스케일 생성
                const scaleMap = buildScaleFromBaseHex(rich.base, {
                    keys: keys as any,
                });
                for (const k of keys) {
                    const hex = scaleMap[k as keyof typeof scaleMap];
                    varsForTheme[`--${token}-${k}`] = toThemeColor(
                        hex,
                        input.vision
                    );
                }
            } else {
                // 단일 변수로만 override
                varsForTheme[varName] = toThemeColor(rich.base, input.vision);
            }
        } else {
            // variation 없는 변수명 → 단일 색만
            varsForTheme[varName] = toThemeColor(rich.base, input.vision);
        }
    }

    // 블록 upsert 후 저장
    upsertBlock(root, selector, varsForTheme);
    fs.writeFileSync(cssPath, root.toString(), 'utf8');
    console.log(`✅ [${input.theme}] theme updated in ${cssPath}`);
}

// 간단 값 전달 시 규칙: "--토큰-숫자"면 기본 scale=true, 아니면 false
function inferRich(varName: string, baseHex: string): VariableRich {
    return VAR_RE.test(varName)
        ? { base: baseHex, scale: true }
        : { base: baseHex, scale: false };
}
