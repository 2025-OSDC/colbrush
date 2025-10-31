'use client';

import {
    DEFAULT_OPTIONS,
    getMatrixForMode,
} from '../core/constants/simulation.js';
import {
    MODE_LABELS,
    SIMULATE_LABEL,
    SIMULATION_MODES,
    isVisionMode,
} from '../core/constants/modes.js';
import { VisionMode, VisionOptions } from '../types/simulationTypes.js';
import { useEffect, useId, useRef, useState } from 'react';
import { SimulationKey, useTheme } from './ThemeProvider.js';
import { VisionFilterPortal } from './VisionPortal.js';
import { TOOLBAR_POSITION } from '../core/constants/position.js';
import {
    FILTER_ID,
    FILTER_WRAPPER_ID,
    SimulationStorageKey,
    VISION_PORTAL_ID,
} from '../core/constants/key.js';

type FilterSnapshot = {
    filter: string;
    webkitFilter: string;
};

const originalFilterMap = new WeakMap<HTMLElement, FilterSnapshot>();

const IS_DEV: boolean = (() => {
    if (
        typeof process !== 'undefined' &&
        typeof process.env?.NODE_ENV === 'string'
    ) {
        return process.env.NODE_ENV !== 'production';
    }
    if (typeof window !== 'undefined') {
        const host = window.location.hostname;
        return host === 'localhost' || host === '127.0.0.1';
    }
    return false;
})();

type SimulationFilterProps = VisionOptions & {
    visible?: boolean;
};

function resolveOptions(props?: SimulationFilterProps) {
    const { visible = true, ...options } = props ?? {};
    const merged = {
        ...DEFAULT_OPTIONS,
        ...options,
        storageKey: options.storageKey ?? DEFAULT_OPTIONS.storageKey,
        position: options.position ?? DEFAULT_OPTIONS.position,
        allowInProd: options.allowInProd ?? DEFAULT_OPTIONS.allowInProd,
    };
    return { config: merged, visible };
}

export default function SimulationFilter(props?: SimulationFilterProps) {
    const { config, visible } = resolveOptions(props);
    const { position, allowInProd, defaultMode, storageKey } = config;
    const [open, setOpen] = useState(false);
    const { simulationFilter, setSimulationFilter, language } = useTheme();
    const initialized = useRef(false);
    const optionsId = useId();

    if (!visible) return null;
    if (!allowInProd && !IS_DEV) return null;

    const MODES: VisionMode[] = ['none', ...SIMULATION_MODES];
    const toolBarClass =
        TOOLBAR_POSITION[position] ?? TOOLBAR_POSITION['left-bottom'];

    const updateSimulationFilter = (value: SimulationKey) => {
        setSimulationFilter(value);
        localStorage.setItem(SimulationStorageKey, value);
    };

    useEffect(() => {
        if (typeof document === 'undefined') return;

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
                (child) => child.id !== VISION_PORTAL_ID
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

        const applyFilter = () => {
            const filterValue = `url(#${FILTER_ID})`;
            style.filter = filterValue;
            style.webkitFilter = filterValue;
        };

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
                            values={getMatrixForMode(
                                simulationFilter as VisionMode
                            )}
                        />
                    </filter>
                </defs>
            </svg>

            <div
                className={`cb-vision-toolbar h-[34px] fixed z-[100] inline-flex items-center gap-[6px] rounded-[8px] bg-[#555555] px-[18px] py-2 text-[14px] text-white font-medium opacity-90 shadow-[0_6px_18px_rgba(0,0,0,0.25)] backdrop-blur-[6px] ${toolBarClass}`}
                role="toolbar"
                aria-label={
                    language === 'Korean'
                        ? '시각 시뮬레이션 도구 모음'
                        : 'Vision simulation toolbar'
                }
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    aria-hidden="true"
                >
                    <path
                        d="M18 9C18 9 14.625 2.8125 9 2.8125C3.375 2.8125 0 9 0 9C0 9 3.375 15.1875 9 15.1875C14.625 15.1875 18 9 18 9ZM1.31929 9C1.38333 8.90236 1.45636 8.79387 1.53818 8.67647C1.91493 8.13592 2.47085 7.41702 3.18612 6.70175C4.63616 5.2517 6.6157 3.9375 9 3.9375C11.3843 3.9375 13.3638 5.2517 14.8139 6.70175C15.5292 7.41702 16.0851 8.13592 16.4618 8.67647C16.5436 8.79387 16.6167 8.90236 16.6807 9C16.6167 9.09764 16.5436 9.20613 16.4618 9.32353C16.0851 9.86408 15.5292 10.583 14.8139 11.2983C13.3638 12.7483 11.3843 14.0625 9 14.0625C6.6157 14.0625 4.63616 12.7483 3.18612 11.2983C2.47085 10.583 1.91493 9.86408 1.53818 9.32353C1.45636 9.20613 1.38333 9.09764 1.31929 9Z"
                        fill="white"
                    />
                    <path
                        d="M9 6.1875C7.4467 6.1875 6.1875 7.4467 6.1875 9C6.1875 10.5533 7.4467 11.8125 9 11.8125C10.5533 11.8125 11.8125 10.5533 11.8125 9C11.8125 7.4467 10.5533 6.1875 9 6.1875ZM5.0625 9C5.0625 6.82538 6.82538 5.0625 9 5.0625C11.1746 5.0625 12.9375 6.82538 12.9375 9C12.9375 11.1746 11.1746 12.9375 9 12.9375C6.82538 12.9375 5.0625 11.1746 5.0625 9Z"
                        fill="white"
                    />
                </svg>
                <button
                    type="button"
                    className="font-medium hover:cursor-pointer ml-[11px]"
                    aria-haspopup="true"
                    aria-expanded={open}
                    aria-controls={optionsId}
                    aria-label={
                        language === 'Korean'
                            ? open
                                ? '시각 시뮬레이션 옵션 닫기'
                                : '시각 시뮬레이션 옵션 열기'
                            : open
                              ? 'Close vision simulation options'
                              : 'Open vision simulation options'
                    }
                    onClick={() => setOpen(!open)}
                >
                    {SIMULATE_LABEL[language]}
                </button>

                {open && (
                    <div className="w-0 h-5 mx-3 outline-[0.40px] outline-offset-[-0.20px] outline-[#909090]" />
                )}

                {open &&
                    (
                        <div
                            id={optionsId}
                            role="group"
                            aria-label={
                                language === 'Korean'
                                    ? '시각 시뮬레이션 모드'
                                    : 'Vision simulation modes'
                            }
                            className="inline-flex items-center gap-[6px]"
                        >
                            {MODES.map((value) => (
                                <button
                                    key={value}
                                    type="button"
                                    className={`rounded-[8px] px-2 py-1 text-[12px] font-normal ${
                                        simulationFilter === value
                                            ? 'bg-white text-black'
                                            : 'hover:bg-[rgba(255,255,255,0.2)]'
                                    }`}
                                    aria-pressed={simulationFilter === value}
                                    onClick={() => updateSimulationFilter(value)}
                                >
                                    {MODE_LABELS[language][value] ?? value}
                                </button>
                            ))}
                        </div>
                    )}
            </div>
        </VisionFilterPortal>
    );
}
