'use client';

import {
    FILTER_ID,
    FILTER_WRAPPER_ID,
    getMatrixForMode,
} from '../core/constants/simulation.js';
import { MODE_LABELS, SIMULATION_MODES } from '../devtools/vision/modes.js';
import {
    ToolbarPosition,
    VisionMode,
    VisionOptions,
} from '../types/simulationTypes.js';
import { useEffect } from 'react';
import { useTheme } from './ThemeProvider.js';
import { PORTAL_ID, VisionFilterPortal } from './VisionPortal.js';

// 원래의 filter/webkitFilter 값을 복원하기 위해 저장하는 스냅샷.
type FilterSnapshot = {
    filter: string;
    webkitFilter: string;
};

// 필터 목표 엘리먼트별로 기존 스타일을 기억한다.
const originalFilterMap = new WeakMap<HTMLElement, FilterSnapshot>();

interface SimulationFilterSvgProps {
    position?: VisionOptions['toolbarPosition'];
}

export default function SimulationFilterSvg({
    position = 'left-bottom',
}: SimulationFilterSvgProps) {
    const { simulationFilter, setSimulationFilter, language } = useTheme();
    const ANCHOR_CLASSES: Record<ToolbarPosition, string> = {
        'left-bottom': 'left-[16px] bottom-[16px]',
        'right-bottom': 'right-[16px] bottom-[16px]',
        'left-top': 'left-[16px] top-[16px]',
        'right-top': 'right-[16px] top-[16px]',
    };

    const MODES: VisionMode[] = ['none', ...SIMULATION_MODES];

    const anchorClass =
        ANCHOR_CLASSES[position] ?? ANCHOR_CLASSES['left-bottom'];

    useEffect(() => {
        if (typeof document === 'undefined') return;

        // 이미 필터를 적용한 루트를 찾거나, 일반적인 루트 엘리먼트를 선택한다.
        const resolveTarget = () => {
            const preferred =
                document.querySelector('[data-cb-vision-target]') ??
                document.getElementById('root') ??
                document.getElementById('__next');
            if (preferred instanceof HTMLElement) return preferred;

            const bodyChildren = Array.from(
                document.body?.children ?? []
            ) as HTMLElement[];
            const fallback = bodyChildren.find(
                (child) => child.id !== PORTAL_ID
            );
            return fallback ?? document.body;
        };

        const target = resolveTarget();
        if (!(target instanceof HTMLElement)) return;

        const style = target.style as CSSStyleDeclaration & {
            webkitFilter?: string;
        };

        if (!originalFilterMap.has(target)) {
            originalFilterMap.set(target, {
                filter: style.filter ?? '',
                webkitFilter: style.webkitFilter ?? '',
            });
        }

        const snapshot = originalFilterMap.get(target) ?? {
            filter: '',
            webkitFilter: '',
        };

        // 현재 모드에 맞는 필터를 적용한다.
        const applyFilter = () => {
            const filterValue = `url(#${FILTER_ID})`;
            style.filter = filterValue;
            style.webkitFilter = filterValue;
        };

        // 모드가 none이 되면 원래 filter 값을 복구한다.
        const clearFilter = () => {
            style.filter = snapshot.filter;
            style.webkitFilter = snapshot.webkitFilter;
        };

        if (simulationFilter === 'none') {
            clearFilter();
            return;
        }

        applyFilter();

        return () => {
            clearFilter();
        };
    }, [simulationFilter]);

    return (
        <VisionFilterPortal>
            <svg
                id={FILTER_WRAPPER_ID}
                aria-hidden="true"
                data-cb-vision-managed="react"
                preserveAspectRatio="none"
                style={{
                    position: 'fixed',
                    inset: 0,
                    width: '100vw',
                    height: '100vh',
                    pointerEvents: 'none',
                    zIndex: 2147483646,
                }}
            >
                <defs>
                    <filter id={FILTER_ID} data-cb-vision-managed="true">
                        <feColorMatrix
                            type="matrix"
                            values={getMatrixForMode(simulationFilter)}
                        />
                    </filter>
                </defs>
            </svg>
            <div
                className={`cb-vision-toolbar fixed z-[100] inline-flex items-center gap-[6px] rounded-[10px] bg-[rgba(17,17,17,0.85)] p-[6px_8px] text-[12px] text-white opacity-90 shadow-[0_6px_18px_rgba(0,0,0,0.25)] backdrop-blur-[6px] ${anchorClass}`}
            >
                <span className="font-medium">Vision</span>
                {MODES.map((value) => (
                    <button
                        key={value}
                        type="button"
                        className={`rounded-[6px] px-[6px] py-[3px] ${simulationFilter === value ? 'bg-white text-black' : 'hover:bg-[rgba(255,255,255,0.2)]'}`}
                        onClick={() => setSimulationFilter(value)}
                    >
                        {MODE_LABELS[language][value] ?? value}
                    </button>
                ))}
            </div>
        </VisionFilterPortal>
    );
}
