import { IconProps } from 'canva-editor/types';
import React from 'react';

const GridViewIcon: React.FC<IconProps> = ({ className = '' }: IconProps) => {
  return (
    <svg
      className={className}
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      viewBox='0 0 24 24'
    >
      <path
        fill='currentColor'
        d='M5.5 4h4c.83 0 1.5.67 1.5 1.5v4c0 .83-.67 1.5-1.5 1.5h-4A1.5 1.5 0 0 1 4 9.5v-4C4 4.67 4.67 4 5.5 4zm9 0h4c.83 0 1.5.67 1.5 1.5v4c0 .83-.67 1.5-1.5 1.5h-4A1.5 1.5 0 0 1 13 9.5v-4c0-.83.67-1.5 1.5-1.5zm0 9h4c.83 0 1.5.67 1.5 1.5v4c0 .83-.67 1.5-1.5 1.5h-4a1.5 1.5 0 0 1-1.5-1.5v-4c0-.83.67-1.5 1.5-1.5zm-9 0h4c.83 0 1.5.67 1.5 1.5v4c0 .83-.67 1.5-1.5 1.5h-4A1.5 1.5 0 0 1 4 18.5v-4c0-.83.67-1.5 1.5-1.5zm0-7.5v4h4v-4h-4zm9 0v4h4v-4h-4zm0 9v4h4v-4h-4zm-9 0v4h4v-4h-4z'
      ></path>
    </svg>
  );
};

export default GridViewIcon;
