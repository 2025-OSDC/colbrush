import * as React from "react";
import type { SVGProps } from "react";
const SvgUs = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={28}
    height={21}
    fill="none"
    {...props}
  >
    <g clipPath="url(#a)" filter="url(#b)">
      <path fill="#fff" d="M3.996 4.166h20v13.333h-20z" />
      <path
        fill="#D80027"
        d="M3.996 4.166h20v1.025h-20zm0 2.05h20v1.026h-20zm0 2.051h20v1.026h-20zm0 2.051h20v1.025h-20zm0 2.055h20v1.025h-20zm0 2.05h20v1.026h-20zm0 2.051h20v1.025h-20z"
      />
      <path fill="#2E52B2" d="M3.996 4.166h10v7.177h-10z" />
      <path
        fill="#fff"
        d="m5.86 9.581-.156-.499-.172.5h-.514l.417.3-.156.498.425-.308.413.308-.16-.499.425-.3zm2.195 0-.16-.499-.164.5h-.515l.418.3-.156.498.417-.308.42.308-.155-.499.417-.3zm2.202 0-.167-.499-.156.5h-.527l.43.3-.164.498.417-.308.429.308-.164-.499.417-.3zm2.191 0-.156-.499-.163.5h-.519l.421.3-.156.498.417-.308.422.308-.168-.499.429-.3zm-4.553-2.48-.164.5h-.515l.418.308-.156.49.417-.303.42.304-.155-.491.417-.308h-.522zm-2.191 0-.172.5h-.514l.417.308-.156.49.425-.303.413.304-.16-.491.425-.308H5.86zm4.386 0-.156.5h-.527l.43.308-.164.49.417-.303.429.304-.164-.491.417-.308h-.515zm2.202 0-.163.5h-.519l.421.308-.156.49.417-.303.422.304-.168-.491.429-.308h-.527zM5.704 5.13l-.172.491h-.514l.417.308-.156.495.425-.308.413.308-.16-.495.425-.308H5.86zm2.19 0-.163.491h-.515l.418.308-.156.495.417-.308.42.308-.155-.495.417-.308h-.522zm2.196 0-.156.491h-.527l.43.308-.164.495.417-.308.429.308-.164-.495.417-.308h-.515zm2.202 0-.163.491h-.519l.421.308-.156.495.417-.308.422.308-.168-.495.429-.308h-.527z"
      />
    </g>
    <defs>
      <clipPath id="a">
        <path fill="#fff" d="M3.996 4.166h20v13.333h-20z" />
      </clipPath>
      <filter
        id="b"
        width={26.973}
        height={20.307}
        x={0.509}
        y={0.679}
        colorInterpolationFilters="sRGB"
        filterUnits="userSpaceOnUse"
      >
        <feFlood floodOpacity={0} result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          result="hardAlpha"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
        />
        <feOffset />
        <feGaussianBlur stdDeviation={1.743} />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
        <feBlend
          in2="BackgroundImageFix"
          result="effect1_dropShadow_306_3300"
        />
        <feBlend
          in="SourceGraphic"
          in2="effect1_dropShadow_306_3300"
          result="shape"
        />
      </filter>
    </defs>
  </svg>
);
export default SvgUs;
