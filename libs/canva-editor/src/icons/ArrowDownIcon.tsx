import { IconProps } from 'canva-editor/types';
import React from 'react';

const ArrowDownIcon: React.FC<IconProps> = ({ className = '' }: IconProps) => {
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
        fillRule='evenodd'
        clipRule='evenodd'
        d='M10.265 11.101a.375.375 0 0 1-.53 0L4.942 6.308a.625.625 0 1 0-.884.884l4.793 4.793a1.625 1.625 0 0 0 2.298 0l4.793-4.793a.625.625 0 1 0-.884-.884l-4.793 4.793Z'
        fill='currentColor'
      ></path>
    </svg>
  );
};

export default ArrowDownIcon;
