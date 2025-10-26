'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useTheme, getThemeOptions, type ThemeKey } from './ThemeProvider.js';
import Logo from '../icons/Logo.js';
import US from '../icons/Us.js';
import KR from '../icons/Kr.js';
import XButton from '../icons/X.js';
import IconTritanopia from '../icons/theme/Tritanopia.js';
import IconDefault from '../icons/theme/Default.js';
import IconProtanopia from '../icons/theme/Protanopia.js';
import IconDeuteranopia from '../icons/theme/Deuteranopia.js';
import { ThemeSwitcherPortal } from './ThemeSwitcherPortal.js';
import { Position } from '../types/simulationTypes.js';
import {
    SWITCHER_MENU_POSITION,
    SWITCHER_POSITION,
} from '../core/constants/position.js';

const THEME_ICON: Record<ThemeKey, React.FC<React.SVGProps<SVGSVGElement>>> = {
    default: IconDefault,
    protanopia: IconProtanopia,
    deuteranopia: IconDeuteranopia,
    tritanopia: IconTritanopia,
};

type TThemeSwitcherProps = {
    options?: { key: ThemeKey; label: string }[]; // ← 라벨/키 쌍으로 받기
    position?: Position;
};

export function ThemeSwitcher({ options, position }: TThemeSwitcherProps) {
    const { theme, updateTheme, language, updateLanguage } = useTheme();
    const [hovered, setHovered] = useState<string | null>(null);
    const list = useMemo(
        () => (options?.length ? options : getThemeOptions(language)),
        [options, language]
    );
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    const switcherClass = SWITCHER_POSITION[position ?? 'right-bottom'];
    const switcherMenuClass =
        SWITCHER_MENU_POSITION[position ?? 'right-bottom'];

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                wrapperRef.current &&
                !wrapperRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () =>
            document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggle = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsOpen((prev) => !prev);
    };

    return (
        <ThemeSwitcherPortal>
            <div ref={wrapperRef} className="z-[10000]">
                {/* 토글 버튼 */}

                <button
                    type="button"
                    aria-haspopup="menu"
                    aria-expanded={isOpen}
                    onClick={toggle}
                    className={`fixed w-[60px] h-[60px] p-[10px] ${isOpen ? 'bg-[#252525] border-[1px] border-[#8144FF]' : 'bg-[rgba(129,68,255,0.2)]'} rounded-full flex justify-center items-center shadow-[0_0_3px_0_rgba(0,0,0,0.17)]
                    ${switcherClass}
                        `}
                >
                    {isOpen ? (
                        <div className="absolute flex justify-center items-center inset-0 w-full h-full">
                            <XButton className="self-center" width={30} />
                        </div>
                    ) : (
                        <div
                            className="rounded-full bg-white/2
                            backdrop-blur-[3px]
                            min-w-[60px] min-h-[60px]
                            [filter:drop-shadow(0_18px_calc(60px_*_0.20)_rgba(0,0,0,calc(.55_*_0.20)))]
                            shadow-[inset_0.5px_0.5px_0_rgba(255,255,255,calc(.35_+_.25_*_0.70)),inset_-0.5px_-0.5px_0_rgba(255,255,255,calc(.35_+_.25_*_0.70))]
                            absolute isolate overflow-hidden
                            "
                        >
                            <div className="[mask:linear-gradient(-45deg),white,transparent_40%)] pointer-events-none absolute inset-0 mix-blend-screen opacity-[calc(.50_*_0.80)]"></div>

                            <div className="pointer-events-none absolute inset-0 mix-blend-screen opacity-20"></div>
                            <div className="absolute flex justify-center items-center inset-0 w-full h-full">
                                {isOpen ? (
                                    <XButton
                                        className="self-center"
                                        width={30}
                                    />
                                ) : (
                                    <Logo className="self-center" width={30} />
                                )}
                            </div>
                        </div>
                    )}
                </button>

                {/* 메뉴 목록 */}
                {isOpen && (
                    <div
                        role="menu"
                        aria-label="Select theme"
                        className={`
                            fixed flex-col bg-[#252525] px-[10px] py-[14px] border-[1px] border-[#8144FF] rounded-[18px] w-[220px] gap-[11px] filter drop-shadow-[0_0_1.3px_rgba(0,0,0,0.25)]
                            ${switcherMenuClass}
                            `}
                    >
                        <div>
                            {list.map((opt) => {
                                const Icon = THEME_ICON[opt.key];
                                return (
                                    <div key={opt.key}>
                                        <button
                                            key={opt.key}
                                            type="button"
                                            role="menuitemradio"
                                            aria-checked={theme === opt.key}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                updateTheme(opt.key);
                                            }}
                                            onMouseEnter={() =>
                                                setHovered(opt.key)
                                            }
                                            onMouseLeave={() =>
                                                setHovered(null)
                                            }
                                            className={[
                                                'hover:cursor-pointer group text-[18px] px-[15px] text-[#909090] py-1 w-full h-[50px] text-start gap-[8px] flex items-center rounded-[9px] hover:bg-[#884DFF]',
                                                theme === opt.key
                                                    ? 'bg-[#884DFF] text-[#ffffff]'
                                                    : '',
                                            ].join(' ')}
                                        >
                                            <Icon
                                                width={24}
                                                height={24}
                                                className={`inline-block ${
                                                    theme === opt.key ||
                                                    hovered === opt.key
                                                        ? 'text-white'
                                                        : 'text-[#909090]'
                                                }`}
                                            />
                                            <span className="group-hover:text-[#ffffff]">
                                                {opt.label}
                                            </span>
                                        </button>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="w-full border-[0.5px] border-[#B8B8B8] mt-[8px]" />

                        <div className="flex justify-evenly items-center gap-[10px] px-[10px] mt-[15px]">
                            {language === 'English' ? (
                                <div
                                    className={`hover:cursor-pointer flex text-[18px] text-[#909090] gap-[8px] items-center justify-center`}
                                    onClick={() => updateLanguage('Korean')}
                                >
                                    <US width={24} />
                                    English
                                </div>
                            ) : (
                                <div
                                    className={`hover:cursor-pointer flex text-[18px] text-[#909090] gap-[8px] items-center justify-center `}
                                    onClick={() => updateLanguage('English')}
                                >
                                    <KR width={24} />
                                    한국어
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </ThemeSwitcherPortal>
    );
}
