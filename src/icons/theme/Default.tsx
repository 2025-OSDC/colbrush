import * as React from "react";
import type { SVGProps } from "react";
const SvgDefault = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 31 31"
    {...props}
  >
    <path
      fill="currentColor"
      d="M30.5 15.5s-5.625-10.312-15-10.312S.5 15.5.5 15.5s5.625 10.313 15 10.313 15-10.313 15-10.313m-27.801 0q.16-.245.365-.54c.628-.9 1.554-2.098 2.746-3.29 2.417-2.417 5.716-4.607 9.69-4.607s7.273 2.19 9.69 4.607A24.6 24.6 0 0 1 28.3 15.5q-.16.245-.365.54c-.628.9-1.554 2.098-2.746 3.29-2.417 2.417-5.716 4.608-9.69 4.608s-7.273-2.19-9.69-4.608A24.6 24.6 0 0 1 2.7 15.5"
    />
    <path
      fill="currentColor"
      d="M15.5 10.813a4.688 4.688 0 1 0 0 9.375 4.688 4.688 0 0 0 0-9.375M8.938 15.5a6.562 6.562 0 1 1 13.124 0 6.562 6.562 0 0 1-13.125 0"
    />
  </svg>
);
export default SvgDefault;
