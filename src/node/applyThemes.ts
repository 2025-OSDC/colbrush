import fs from 'node:fs';
import postcss, { Root, Rule } from 'postcss';
import safeParser from 'postcss-safe-parser';
import { buildScaleFromBaseHex } from '../utils/core/colorScale.js';
import { variationRegex } from '../constants/regex.js';
import { ThemeGenInput, VariableRich, Vision } from '../types/types.js';
import { DEFAULT_KEYS } from '../constants/variation.js';

const CSS_PATH = 'src/index.css';

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
        const m = d.prop.match(variationRegex);
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
    const selector = `[data-theme='${input.vision}']`;
    const varsForTheme: Record<string, string> = {};

    for (const [varName, val] of Object.entries(input.variables)) {
        // 값 해석
        const rich: VariableRich =
            typeof val === 'string' ? inferRich(varName, val) : val;

        const m = varName.match(variationRegex);
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
    console.log(`✅ [${input.vision}] theme updated in ${cssPath}`);
}

// 간단 값 전달 시 규칙: "--토큰-숫자"면 기본 scale=true, 아니면 false
export function inferRich(varName: string, baseHex: string): VariableRich {
    return variationRegex.test(varName)
        ? { base: baseHex, scale: true }
        : { base: baseHex, scale: false };
}
