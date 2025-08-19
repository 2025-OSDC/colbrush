import * as React from "react";
import type { SVGProps } from "react";
const SvgKr = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={17}
    fill="none"
    {...props}
  >
    <g clipPath="url(#a)" filter="url(#b)">
      <path fill="#fff" d="M1.906 2h20v13.333h-20z" />
      <path
        fill="#000"
        fillRule="evenodd"
        d="m4.959 6.04 1.849-2.774.487.324-1.85 2.773zm.693.461 1.85-2.773.486.324-1.85 2.774zm.694.463L8.195 4.19l.486.324-1.849 2.774zm8.782 5.855 1.85-2.774.486.325-1.849 2.773zm.694.462 1.849-2.774.486.325-1.849 2.773zm3.029-1.987L17 14.068l-.486-.325 1.85-2.773z"
        clipRule="evenodd"
      />
      <path
        fill="#fff"
        fillRule="evenodd"
        d="m18.01 13.03-2.31-1.542.27-.405 2.31 1.54z"
        clipRule="evenodd"
      />
      <path
        fill="#CA163A"
        d="M14.68 10.514a3.333 3.333 0 1 0-5.548-3.698 3.333 3.333 0 0 0 5.547 3.698"
      />
      <path
        fill="#0E4896"
        d="M9.132 6.816a1.667 1.667 0 0 0 2.774 1.85 1.667 1.667 0 0 1 2.773 1.848 3.334 3.334 0 0 1-5.547-3.698"
      />
      <path
        fill="#000"
        fillRule="evenodd"
        d="m17.002 3.266 1.849 2.773-.487.325-1.849-2.774zm-.694.462 1.85 2.773-.487.325-1.85-2.774zm-.693.462 1.85 2.774-.488.324-1.848-2.773zm-8.783 5.855 1.85 2.774-.487.324-1.85-2.773zm-.693.463 1.849 2.773-.487.324-1.849-2.773zm-.693.462 1.849 2.773-.487.325-1.849-2.774z"
        clipRule="evenodd"
      />
      <path
        fill="#000"
        d="m6.475 12.286.693-.462zm9.36-6.24.81-.54zm1.502-1.002.694-.462z"
      />
      <path
        fill="#fff"
        fillRule="evenodd"
        d="m18.166 4.784-.693.463-.27-.406.693-.462zm-1.386.925-.81.54-.27-.406.81-.54zm-9.476 6.317-.694.463-.27-.406.693-.462z"
        clipRule="evenodd"
      />
    </g>
    <defs>
      <clipPath id="a">
        <path fill="#fff" d="M1.906 2h20v13.333h-20z" />
      </clipPath>
      <filter
        id="b"
        width={22.602}
        height={15.936}
        x={0.605}
        y={0.699}
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
        <feGaussianBlur stdDeviation={0.65} />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
        <feBlend
          in2="BackgroundImageFix"
          result="effect1_dropShadow_306_2477"
        />
        <feBlend
          in="SourceGraphic"
          in2="effect1_dropShadow_306_2477"
          result="shape"
        />
      </filter>
    </defs>
  </svg>
);
export default SvgKr;
