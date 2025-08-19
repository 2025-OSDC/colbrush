import * as React from "react";
import type { SVGProps } from "react";
const SvgUs = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={50}
    height={38}
    fill="none"
    {...props}
  >
    <g clipPath="url(#US_svg__a)" filter="url(#US_svg__b)">
      <path fill="#fff" d="M7 7h35.785v23.857H7z" />
      <path
        fill="#D80027"
        d="M7 7h35.785v1.835H7zm0 3.67h35.785v1.834H7zm0 3.668h35.785v1.835H7zm0 3.67h35.785v1.834H7zm0 3.676h35.785v1.834H7zm0 3.669h35.785v1.834H7zm0 3.669h35.785v1.835H7z"
      />
      <path fill="#2E52B2" d="M7 7h17.892v12.842H7z" />
      <path
        fill="#fff"
        d="m10.334 16.69-.279-.894-.307.893h-.92l.746.537-.279.893.76-.55.74.55-.286-.893.76-.537zm3.928 0-.286-.894-.293.893h-.921l.746.537-.279.893.747-.55.753.55-.28-.893.747-.537zm3.94 0-.3-.894-.278.893h-.942l.767.537-.293.893.747-.55.767.55-.293-.893.747-.537zm3.921 0-.279-.894-.293.893h-.928l.754.537-.28.893.747-.55.753.55-.3-.893.768-.537zm-8.147-4.437-.293.893h-.921l.746.55-.279.88.747-.544.753.544-.28-.88.747-.55h-.934zm-3.92 0-.308.893h-.92l.746.55-.279.88.76-.544.74.544-.286-.88.76-.55h-.935zm7.847 0-.28.893h-.94l.766.55-.293.88.747-.544.767.544-.293-.88.747-.55h-.921zm3.941 0-.293.893h-.928l.754.55-.28.88.747-.544.753.544-.3-.88.768-.55h-.942zm-11.789-3.53-.307.88h-.92l.746.55-.279.886.76-.551.74.551-.286-.886.76-.55h-.935zm3.92 0-.292.88h-.921l.746.55-.279.886.747-.551.753.551-.28-.886.747-.55h-.934zm3.928 0-.28.88h-.94l.766.55-.293.886.747-.551.767.551-.293-.886.747-.55h-.921zm3.941 0-.293.88h-.928l.754.55-.28.886.747-.551.753.551-.3-.886.768-.55h-.942z"
      />
    </g>
    <defs>
      <clipPath id="US_svg__a">
        <path fill="#fff" d="M7 7h35.785v23.857H7z" />
      </clipPath>
      <filter
        id="US_svg__b"
        width={48.261}
        height={36.333}
        x={0.762}
        y={0.762}
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
        <feGaussianBlur stdDeviation={3.119} />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
        <feBlend in2="BackgroundImageFix" result="effect1_dropShadow_85_779" />
        <feBlend
          in="SourceGraphic"
          in2="effect1_dropShadow_85_779"
          result="shape"
        />
      </filter>
    </defs>
  </svg>
);
export default SvgUs;
