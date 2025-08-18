declare module '*.svg?react' {
    import * as React from 'react';
    const Component: React.FC<React.SVGProps<SVGSVGElement>>;
    export default Component;
}

declare module '*.svg' {
    const src: string;
    export default src;
}
