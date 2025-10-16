'use client';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { THEME_SWITCHER_PORTAL_ID } from '../core/constants/key.js';

// 모듈 전역: 컨테이너 싱글턴 & 활성 인스턴스 추적
let portalEl: HTMLElement | null = null;
let activeOwner: symbol | null = null;

function ensurePortal(): HTMLElement {
    if (typeof document === 'undefined') throw new Error('No document');
    if (portalEl && document.body.contains(portalEl)) return portalEl;

    const existing = document.getElementById(
        THEME_SWITCHER_PORTAL_ID
    ) as HTMLElement | null;
    portalEl =
        existing ??
        Object.assign(document.createElement('div'), {
            id: THEME_SWITCHER_PORTAL_ID,
        });
    if (!existing) document.body.appendChild(portalEl);
    return portalEl;
}

export function ThemeSwitcherPortal({
    children,
}: {
    children: React.ReactNode;
}) {
    const [container, setContainer] = useState<HTMLElement | null>(null);
    const ownerId = useRef<symbol>(Symbol('ThemeSwitcherPortal'));

    useEffect(() => {
        const el = ensurePortal();
        setContainer(el);

        // 첫 주인만 등록 (이미 있으면 그대로 유지)
        if (activeOwner === null) activeOwner = ownerId.current;

        return () => {
            // 내가 주인이었을 때만 해제
            if (activeOwner === ownerId.current) {
                activeOwner = null;
            }
        };
    }, []);

    if (!container) return null;

    const isPrimary = activeOwner === ownerId.current;
    return createPortal(isPrimary ? children : null, container);
}
