import * as React from "react";
import type { SVGProps } from "react";
const SvgKr = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={42}
    height={30}
    fill="none"
    {...props}
  >
    <g clipPath="url(#KR_svg__a)" filter="url(#KR_svg__b)">
      <path fill="#fff" d="M3 3h36v24H3z" />
      <path
        fill="#000"
        fillRule="evenodd"
        d="m8.496 10.27 3.328-4.992.876.584-3.328 4.992zm1.248.832 3.328-4.992.876.584-3.328 4.992zm1.248.832 3.328-4.992.876.584-3.328 4.992zm15.81 10.54 3.327-4.993.876.584-3.328 4.992zm1.247.831 3.329-4.992.875.584-3.328 4.992zm5.452-3.576-3.328 4.992-.876-.584 3.329-4.992z"
        clipRule="evenodd"
      />
      <path
        fill="#fff"
        fillRule="evenodd"
        d="m31.988 22.853-4.16-2.774.487-.73 4.16 2.774z"
        clipRule="evenodd"
      />
      <path
        fill="#CA163A"
        d="M25.992 18.328a6 6 0 1 0-9.985-6.657 6 6 0 0 0 9.984 6.657"
      />
      <path
        fill="#0E4896"
        d="M16.007 11.671A3.001 3.001 0 0 0 20.999 15a3.001 3.001 0 0 1 4.993 3.328 6 6 0 0 1-8.321 1.664 6 6 0 0 1-1.664-8.32"
      />
      <path
        fill="#000"
        fillRule="evenodd"
        d="m30.173 5.277 3.328 4.993-.875.584-3.329-4.993zm-1.248.832 3.328 4.993-.875.584-3.329-4.993zm-1.248.832 3.328 4.993-.876.584-3.328-4.993zm-15.809 10.54 3.328 4.992-.876.584-3.328-4.992zm-1.248.832 3.328 4.992-.876.584-3.328-4.992zm-1.248.832 3.328 4.992-.876.584-3.328-4.992z"
        clipRule="evenodd"
      />
      <path
        fill="#000"
        d="m11.224 21.516 1.248-.832zm16.847-11.232 1.458-.971zm2.706-1.804 1.248-.832z"
      />
      <path
        fill="#fff"
        fillRule="evenodd"
        d="m32.269 8.013-1.248.832-.487-.73 1.248-.832zm-2.496 1.664-1.458.972-.487-.73 1.458-.972zM12.716 21.05l-1.248.832-.487-.73 1.248-.832z"
        clipRule="evenodd"
      />
    </g>
    <defs>
      <clipPath id="KR_svg__a">
        <path fill="#fff" d="M3 3h36v24H3z" />
      </clipPath>
      <filter
        id="KR_svg__b"
        width={40.684}
        height={28.684}
        x={0.658}
        y={0.658}
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
        <feGaussianBlur stdDeviation={1.171} />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
        <feBlend in2="BackgroundImageFix" result="effect1_dropShadow_85_784" />
        <feBlend
          in="SourceGraphic"
          in2="effect1_dropShadow_85_784"
          result="shape"
        />
      </filter>
    </defs>
  </svg>
);
export default SvgKr;
