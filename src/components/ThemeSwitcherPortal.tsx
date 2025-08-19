'use client';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

export function ThemeSwitcherPortal({
    children,
}: {
    children: React.ReactNode;
}) {
    const [container, setContainer] = useState<HTMLElement | null>(null);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        let el = document.getElementById(
            'theme-switcher-portal'
        ) as HTMLElement | null;
        if (!el) {
            el = document.createElement('div');
            el.id = 'theme-switcher-portal';
            document.body.appendChild(el);
        }
        setContainer(el);
    }, []);

    if (!container) return null;
    return createPortal(children, container);
}
