import * as React from "react";
import type { SVGProps } from "react";
const SvgX = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={30}
    height={30}
    fill="none"
    {...props}
  >
    <path
      fill="#000"
      fillRule="evenodd"
      d="M25.977 4.023a.94.94 0 0 1 0 1.328L5.352 25.976a.939.939 0 0 1-1.327-1.328L24.65 4.023a.94.94 0 0 1 1.327 0"
      clipRule="evenodd"
    />
    <path
      fill="#000"
      fillRule="evenodd"
      d="M4.023 4.023a.94.94 0 0 0 0 1.328L24.65 25.976a.939.939 0 0 0 1.327-1.328L5.351 4.023a.94.94 0 0 0-1.328 0"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgX;
