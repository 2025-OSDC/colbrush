'use client';
import type { ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { FILTER_WRAPPER_ID } from '../core/constants/simulation.js';

// 공유 포털 노드 id — 필터/툴바가 모두 동일한 컨테이너를 사용하도록 고정한다.
export const PORTAL_ID = 'cb-vision-portal';

let portalEl: HTMLElement | null = null;
let activeOwner: symbol | null = null;

function ensurePortal(): HTMLElement {
    if (typeof document === 'undefined')
        throw new Error('No document available');
    if (portalEl && document.body.contains(portalEl)) return portalEl;

    const existing = document.getElementById(PORTAL_ID) as HTMLElement | null;
    portalEl =
        existing ??
        Object.assign(document.createElement('div'), { id: PORTAL_ID });
    if (!existing) document.body.appendChild(portalEl);
    return portalEl;
}

export interface VisionFilterPortalProps {
    visible?: boolean;
    children: ReactNode;
}

export function VisionFilterPortal({
    visible = true,
    children,
}: VisionFilterPortalProps) {
    const [container, setContainer] = useState<HTMLElement | null>(null);
    const ownerId = useRef(Symbol('VisionFilterPortal'));

    useEffect(() => {
        try {
            const el = ensurePortal();
            setContainer(el);
            if (activeOwner === null) activeOwner = ownerId.current;
        } catch {
            setContainer(null);
        }

        return () => {
            if (activeOwner === ownerId.current) {
                activeOwner = null;
            }
        };
    }, []);

    const isPrimary = container !== null && activeOwner === ownerId.current;
    const enabled = Boolean(isPrimary && visible);

    useEffect(() => {
        if (!enabled || typeof document === 'undefined') return;
        const fallback = document.getElementById(FILTER_WRAPPER_ID);
        if (
            fallback instanceof SVGSVGElement &&
            fallback.dataset.cbVisionManaged === 'fallback'
        ) {
            fallback.remove();
        }
    }, [enabled]);

    if (!container || !isPrimary) return null;

    return createPortal(isPrimary ? children : null, container);
}
