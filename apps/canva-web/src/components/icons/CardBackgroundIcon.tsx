import React from 'react';

const CardBackgroundIcon = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="2106"
      height="1327"
      viewBox="0 0 2106 1327"
      {...props}
    >
      <defs>
        <filter
          id="hi-a"
          width="133.3%"
          height="131.3%"
          x="-16.7%"
          y="-15.6%"
          filterUnits="objectBoundingBox"
        >
          <feGaussianBlur in="SourceGraphic" stdDeviation="0"></feGaussianBlur>
        </filter>
        <filter
          id="hi-b"
          width="133.3%"
          height="131.3%"
          x="-16.7%"
          y="-15.6%"
          filterUnits="objectBoundingBox"
        >
          <feGaussianBlur in="SourceGraphic" stdDeviation="0"></feGaussianBlur>
        </filter>
        <filter
          id="hi-c"
          width="159.9%"
          height="145%"
          x="-29.9%"
          y="-22.5%"
          filterUnits="objectBoundingBox"
        >
          <feGaussianBlur in="SourceGraphic" stdDeviation="0"></feGaussianBlur>
        </filter>
      </defs>
      <g fill="none" fillRule="evenodd">
        <path
          fill="#6D28D9"
          fillOpacity=".72"
          d="M1110.164 893.257C1191.124 1079.102 1484 839.962 1484 626.315S883.228 0 669.507 0s40.54 412.668 40.54 626.315c0 213.647 319.156 81.096 400.117 266.942Z"
          filter="url(#hi-a)"
          transform="translate(0 -605)"
        ></path>
        <path
          fill="#67E8F9"
          fillOpacity=".64"
          d="M1732.164 1753.257c80.96 185.845 373.836-53.295 373.836-266.942S1505.228 860 1291.507 860s40.54 412.668 40.54 626.315c0 213.647 319.156 81.096 400.117 266.942Z"
          filter="url(#hi-b)"
          transform="translate(0 -605)"
        ></path>
        <path
          fill="#F472B6"
          fillOpacity=".8"
          d="M1191.108 871C1338.988 871 1631 635.765 1631 487.507 1631 339.248 1625.874 205 1477.994 205s-267.76 120.187-267.76 268.445c0 148.259-167.006 397.555-19.126 397.555Z"
          filter="url(#hi-c)"
          transform="translate(0 -605)"
        ></path>
      </g>
    </svg>
  );
};

export default CardBackgroundIcon;
