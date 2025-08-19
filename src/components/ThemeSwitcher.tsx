'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import {
    useTheme,
    getThemeOptions,
    THEME_LABEL,
    type ThemeKey,
} from './ThemeProvider.js';
import Logo from '../icons/Logo.js';
import US from '../icons/Us.js';
import KR from '../icons/Kr.js';
import IconTritanopia from '../icons/theme/Tritanopia.js';
import IconDefault from '../icons/theme/Default.js';
import IconProtanopia from '../icons/theme/Protanopia.js';
import IconDeuteranopia from '../icons/theme/Deuteranopia.js';

const THEME_ICON: Record<ThemeKey, React.FC<React.SVGProps<SVGSVGElement>>> = {
    default: IconDefault,
    protanopia: IconProtanopia,
    deuteranopia: IconDeuteranopia,
    tritanopia: IconTritanopia,
};
type Props = {
    options?: { key: ThemeKey; label: string }[]; // ← 라벨/키 쌍으로 받기
    className?: string;
};

export function ThemeSwitcher({ options, className }: Props) {
    const { theme, updateTheme, language, updateLanguage } = useTheme();
    const list = useMemo(
        () => (options?.length ? options : getThemeOptions(language)),
        [options, language]
    );
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    // 바깥 클릭 닫기
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
        <div
            ref={wrapperRef}
            className={[
                'fixed bottom-[20px] right-[20px] flex justify-center items-center text-[20px] bg-[#ffffff] drop-shadow-md',
                isOpen
                    ? 'w-[220px] h-fit rounded-[18px]'
                    : 'w-[60px] h-[60px] rounded-full',
                className ?? '',
            ].join(' ')}
            role="presentation"
        >
            {/* 토글 버튼 */}
            <button
                type="button"
                aria-haspopup="menu"
                aria-expanded={isOpen}
                onClick={toggle}
                className={[
                    'w-[60px] h-[60px] p-[10px] bg-[#ffffff] rounded-full flex justify-center items-center',
                    isOpen ? 'hidden' : 'block',
                ].join(' ')}
            >
                <Logo className="self-center" width={40} height={40} />
            </button>

            {/* 메뉴 목록 */}
            {isOpen && (
                <div
                    role="menu"
                    aria-label="Select theme"
                    className="flex flex-col bg-[#ffffff] rounded-[18px] w-[220px]"
                >
                    {list.map((opt) => {
                        const Icon = THEME_ICON[opt.key];
                        return (
                            <button
                                key={opt.key}
                                type="button"
                                role="menuitemradio"
                                aria-checked={theme === opt.key}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    updateTheme(opt.key);
                                }}
                                className={[
                                    'text-[18px] text-[#3D4852] py-1 w-full h-[50px] text-center gap-[8px] flex items-center justify-center rounded-[18px]',
                                    'hover:bg-[#0072B1]',
                                    theme === opt.key
                                        ? 'bg-[#0072B1] text-[#ffffff]'
                                        : '',
                                ].join(' ')}
                            >
                                <Icon
                                    width={18}
                                    height={18}
                                    stroke={`${theme === opt.key} ? '#ffffff': '#3D4852'`}
                                    fill={`${theme === opt.key} ? '#ffffff': '#3D4852'`}
                                    className="inline-block"
                                />
                                <span>{opt.label}</span>
                            </button>
                        );
                    })}

                    <div className="w-full border-[0.5px] border-[#B8B8B8]" />

                    <div className="flex h-[80px] justify-evenly items-center gap-[10px] px-[10px]">
                        <div
                            className={`relative hover:cursor-pointer flex text-[18px] text-[#3D4852] ${
                                language === 'English' ? 'underline' : ''
                            }`}
                            onClick={() => updateLanguage('English')}
                        >
                            <span className="absolute top-[-20px] left-[0px] text-[#3D4852] text-[8px] px-[9px] py-[2px] rounded-[13px] bg-[#D9D9D9]">
                                Language
                            </span>
                            <US
                                className="self-center"
                                width={30}
                                height={30}
                            />
                            English
                        </div>

                        <div className="h-full w-[1px] border-r-[0.5px] border-r-[#B8B8B8]" />

                        <div
                            className={`hover:cursor-pointer flex text-[18px] text-[#3D4852] ${
                                language === 'Korean' ? 'underline' : ''
                            }`}
                            onClick={() => updateLanguage('Korean')}
                        >
                            <KR
                                className="self-center"
                                width={30}
                                height={30}
                            />
                            Korean
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
