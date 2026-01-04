import { IconProps } from 'canva-editor/types';
import React from 'react';

const LockOpenIcon: React.FC<IconProps> = ({ className = '' }: IconProps) => {
  return (
    <svg
      className={className}
      width='20'
      height='20'
      viewBox='0 0 20 20'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        d='M14.996 7.78H5.039m9.957 0c.574 0 1.039.466 1.039 1.04m-1.04-1.04c.572 0 1.04.468 1.04 1.04M5.039 7.78A1.04 1.04 0 0 0 4 8.82m1.04-1.04C4.467 7.78 4 8.249 4 8.82m12.035 0v7.466m0 0a1.04 1.04 0 0 1-1.04 1.04m1.04-1.04c0 .572-.468 1.04-1.04 1.04m0 0H5.04m0 0A1.04 1.04 0 0 1 4 16.286m1.04 1.04c-.572 0-1.04-.468-1.04-1.04m0 0V8.82M10.02 11.7v3.074'
        stroke='currentColor'
        strokeWidth='1.25'
        strokeLinecap='round'
        strokeLinejoin='round'
      ></path>
      <path
        d='M10.017 12.528c.815 0 1.476-.69 1.476-1.542 0-.851-.66-1.541-1.476-1.541-.814 0-1.475.69-1.475 1.541 0 .852.66 1.542 1.475 1.542Z'
        fill='currentColor'
      ></path>
      <path
        d='M10.13.75a4.344 4.344 0 0 0-4.125 2.986A4.32 4.32 0 0 1 10.129.75Zm0 0A4.35 4.35 0 0 1 14.5 5.1M10.13.75c2.397 0 4.37 1.947 4.37 4.35m0 0v2.4'
        stroke='currentColor'
        strokeWidth='1.25'
        strokeLinecap='round'
        strokeLinejoin='round'
      ></path>
    </svg>
  );
};

export default LockOpenIcon;
