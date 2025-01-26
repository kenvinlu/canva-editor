import { IconProps } from 'canva-editor/types';
import React from 'react';

const ArrowUpIcon: React.FC<IconProps> = ({ className = '' }: IconProps) => {
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
        d='M10.265 8.4a.375.375 0 0 0-.53 0l-4.793 4.792a.625.625 0 1 1-.884-.884l4.793-4.793a1.625 1.625 0 0 1 2.298 0l4.793 4.793a.625.625 0 1 1-.884.884l-4.793-4.793Z'
        fill='currentColor'
      ></path>
    </svg>
  );
};

export default ArrowUpIcon;
