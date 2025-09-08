// src/runtime/applyTheme.ts
// 브라우저 런타임 전용: CSS 변수 팔레트 적용 유틸리티

export type CSSVarMap = Record<string, string>; // { "--color-primary-500": "#7fe4c1", ... }
export type ApplyThemeMode = 'inline' | 'style';

export interface ApplyThemeOptions {
    /*
     * 적용 모드
     *  - 'inline': target.style.setProperty로 직접 주입
     *  - 'style' : <style> 태그에 selector 블록으로 주입
     */
    mode?: ApplyThemeMode;

    /*
     * mode='style'일 때 적용할 CSS 선택자
     * 지정 안 하면 themeName 있으면 `[data-theme="<themeName>"]`, 없으면 ':root'
     */
    selector?: string;

    /*
     * themeName 지정 시 target에 data-theme="<themeName>" 속성 부여
     */
    themeName?: string;

    /*
     * mode='style'일 때 <style> 태그 id
     */
    styleId?: string;

    /*
     * themeName 있을 때 data-theme 속성을 부여할지 여부
     */
    setDataThemeAttr?: boolean;

    /*
     * mode='style'일 때 기존 블록을 완전히 대체할지 여부
     */
    replace?: boolean;
}

/* 변수명 표준화 */
function normalizeVarName(name: string) {
    return name.startsWith('--') ? name : `--${name}`;
}

/* data-theme 속성 세팅 */
function maybeSetDataTheme(
    target: HTMLElement,
    themeName?: string,
    setAttr = true
) {
    if (themeName && setAttr) {
        target.setAttribute('data-theme', themeName);
    }
}

/* inline 모드 적용 */
function applyInline(target: HTMLElement, vars: CSSVarMap) {
    for (const [k, v] of Object.entries(vars)) {
        target.style.setProperty(normalizeVarName(k), v);
    }
}

/* style 태그 모드 적용 */
function applyWithStyleTag(
    vars: CSSVarMap,
    selector: string,
    styleId = 'cbt-theme-style',
    replace = true
) {
    let styleEl = document.getElementById(styleId) as HTMLStyleElement | null;
    if (!styleEl) {
        styleEl = document.createElement('style');
        styleEl.id = styleId;
        document.head.appendChild(styleEl);
    }

    const decls = Object.entries(vars)
        .map(([k, v]) => `${normalizeVarName(k)}:${v};`)
        .join('');
    const block = `${selector}{${decls}}`;

    if (replace) {
        styleEl.textContent = block;
    } else {
        const sheet = styleEl.sheet as CSSStyleSheet | null;
        if (!sheet) {
            styleEl.textContent = block;
            return;
        }
        let replaced = false;
        for (let i = 0; i < sheet.cssRules.length; i++) {
            const rule = sheet.cssRules[i];
            if (
                'selectorText' in rule &&
                (rule as CSSStyleRule).selectorText === selector
            ) {
                sheet.deleteRule(i);
                sheet.insertRule(block, i);
                replaced = true;
                break;
            }
        }
        if (!replaced) {
            sheet.insertRule(block, sheet.cssRules.length);
        }
    }
}

/**
 * 브라우저에서 CSS 변수 팔레트 적용
 * @param vars - CSS 변수 맵
 * @param options - 적용 옵션
 * @param target - 기본 document.documentElement
 */
export function applyTheme(
    vars: CSSVarMap,
    options: ApplyThemeOptions = {},
    target: HTMLElement = document.documentElement
) {
    const {
        mode = 'inline',
        selector,
        themeName,
        styleId = 'cbt-theme-style',
        setDataThemeAttr = true,
        replace = true,
    } = options;

    maybeSetDataTheme(target, themeName, setDataThemeAttr);

    if (mode === 'inline') {
        applyInline(target, vars);
    } else {
        const sel =
            selector ?? (themeName ? `[data-theme="${themeName}"]` : ':root');
        applyWithStyleTag(vars, sel, styleId, replace);
    }
}

/** 현재 target의 CSS 변수 읽기 */
export function readThemeVariables(
    prefix = '--',
    target: Element = document.documentElement
): CSSVarMap {
    const out: CSSVarMap = {};
    const styles = getComputedStyle(target);
    for (let i = 0; i < styles.length; i++) {
        const prop = styles[i];
        if (prop.startsWith(prefix)) {
            out[prop] = styles.getPropertyValue(prop).trim();
        }
    }
    return out;
}

/** 두 팔레트 병합 */
export function mergeVars(base: CSSVarMap, override: CSSVarMap): CSSVarMap {
    return { ...base, ...override };
}

/** prefers-reduced-motion 여부 */
export function prefersReducedMotion(): boolean {
    return (
        window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
    );
}
