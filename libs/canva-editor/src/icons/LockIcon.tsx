import { IconProps } from 'canva-editor/types';
import React from 'react';

const LockIcon: React.FC<IconProps> = ({ className = '' }: IconProps) => {
  return (
    <svg
      className={className}
      xmlns='http://www.w3.org/2000/svg'
      width='20'
      height='24'
      viewBox='0 0 20 24'
    >
      <path
        d='M14.996 7.633H5.039m9.957 0c.574 0 1.039.465 1.039 1.04m-1.04-1.04c.572 0 1.04.468 1.04 1.04M5.039 7.632A1.04 1.04 0 0 0 4 8.673m1.04-1.04c-.572 0-1.04.468-1.04 1.04m12.035 0v7.466m0 0a1.04 1.04 0 0 1-1.04 1.039m1.04-1.04c0 .572-.468 1.04-1.04 1.04m0 0H5.04m0 0A1.04 1.04 0 0 1 4 16.138m1.04 1.04c-.572 0-1.04-.468-1.04-1.04m0 0V8.673'
        stroke='currentColor'
        strokeWidth='1.25'
        strokeLinecap='round'
        strokeLinejoin='round'
      ></path>
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M10.018 2.028a4.983 4.983 0 0 0-4.983 4.983v1.22h1.25V7.01a3.736 3.736 0 0 1 3.732-3.733 3.736 3.736 0 0 1 3.733 3.733v1.22H15V7.01a4.983 4.983 0 0 0-4.982-4.983Z'
        fill='currentColor'
      ></path>
      <path
        stroke='currentColor'
        strokeWidth='1.25'
        strokeLinecap='round'
        strokeLinejoin='round'
        d='M10.02 11.553v3.074'
      ></path>
      <path
        d='M10.017 12.38c.815 0 1.476-.69 1.476-1.541 0-.852-.66-1.542-1.476-1.542-.814 0-1.475.69-1.475 1.542 0 .851.66 1.541 1.475 1.541Z'
        fill='currentColor'
      ></path>
    </svg>
  );
};

export default LockIcon;
