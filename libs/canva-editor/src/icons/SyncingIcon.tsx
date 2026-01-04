import { IconProps } from 'canva-editor/types';
import React from 'react';

const SyncingIcon: React.FC<IconProps> = ({ className = '' }: IconProps) => {
  return (
    <svg
      className={className}
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M1.5 13.875c0 2.98 2.318 5.42 5.25 5.613v.012h10.5v-.012a5.625 5.625 0 0 0-.296-11.237 6.001 6.001 0 0 0-11.945.41A5.627 5.627 0 0 0 1.5 13.875ZM7.25 18h9.5v-.002l.125.002a4.125 4.125 0 1 0-1.493-7.972 4.5 4.5 0 1 0-8.813-.241 4.126 4.126 0 0 0 .681 8.211V18Z'
        fill='currentColor'
      ></path>
      <rect x='7' y='13' width='2' height='2' rx='1' fill='currentColor'></rect>
      <rect
        x='11'
        y='13'
        width='2'
        height='2'
        rx='1'
        fill='currentColor'
      ></rect>
      <rect
        x='15'
        y='13'
        width='2'
        height='2'
        rx='1'
        fill='currentColor'
      ></rect>
    </svg>
  );
};

export default SyncingIcon;
