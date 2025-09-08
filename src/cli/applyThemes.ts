import fs from 'node:fs';
import postcss, { Root, Rule } from 'postcss';
import safeParser from 'postcss-safe-parser';
import { buildScaleFromBaseHex } from '../core/utils/colorScale.js';
import { variationRegex } from '../core/constants/regex.js';
import type { ThemeGenInput, VariableRich, Vision } from '../core/types.js';
import { DEFAULT_KEYS } from '../core/constants/variation.js';

const CSS_PATH = 'src/index.css';

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

function getColorVariablesFromRoot(root: Root): Record<string, string> {
    const vars: Record<string, string> = {};

    root.walkDecls((decl) => {
        const name = decl.prop.trim();
        const value = decl.value.trim();

        if (name.startsWith('--color')) {
            vars[name] = value;
        }
    });

    return vars;
}

// 메인: 입력을 받아 [data-theme='...']에 반영
export function applyThemes(
    input: ThemeGenInput,
    cssPath = CSS_PATH,
    opts?: { silent?: boolean }
) {
    const root = loadRoot(cssPath);
    const originalVars = getColorVariablesFromRoot(root); // 이미 구현된 함수 사용
    const varsForTheme: Record<string, string> = {};

    for (const [varName, value] of Object.entries(originalVars)) {
        varsForTheme[varName] = value; // 기본값으로 그대로 넣기
    }

    // 2️⃣ input.variables 덮어쓰기
    for (const [varName, val] of Object.entries(input.variables)) {
        const rich: VariableRich =
            typeof val === 'string' ? inferRich(varName, val) : val;

        const m = varName.match(variationRegex);
        const isPattern = !!m;

        if (isPattern) {
            const [, token] = m!;
            const keys =
                rich.keys && rich.keys.length
                    ? rich.keys
                    : getExistingKeysForToken(root, token).length
                      ? getExistingKeysForToken(root, token)
                      : Array.from(DEFAULT_KEYS);

            if (rich.scale !== false) {
                const scaleMap = buildScaleFromBaseHex(rich.base, {
                    keys: keys as any,
                });
                for (const k of keys) {
                    const hex = scaleMap[k as keyof typeof scaleMap];
                    varsForTheme[`--${token}-${k}`] = hex;
                }
            } else {
                varsForTheme[varName] = rich.base;
            }
        } else {
            varsForTheme[varName] = rich.base;
        }
    }

    // 3️⃣ varsForTheme 적용
    upsertBlock(root, `[data-theme='${input.vision}']`, varsForTheme);
    fs.writeFileSync(cssPath, root.toString(), 'utf8');
    if (!opts?.silent) {
        console.log(`✅ [${input.vision}] theme updated in ${cssPath}`);
    }
}

// 간단 값 전달 시 규칙: "--토큰-숫자"면 기본 scale=true, 아니면 false
export function inferRich(varName: string, baseHex: string): VariableRich {
    return variationRegex.test(varName)
        ? { base: baseHex, scale: true }
        : { base: baseHex, scale: false };
}
