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
        const el = document.createElement('div');
        el.id = 'theme-switcher-portal';
        document.body.appendChild(el);
        setContainer(el);
        return () => {
            document.body.removeChild(el);
        };
    }, []);

    if (!container) return null;
    return createPortal(children, container);
}
