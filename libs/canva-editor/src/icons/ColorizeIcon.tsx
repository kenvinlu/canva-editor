import { IconProps } from 'canva-editor/types';
import React from 'react';

const ColorizeIcon: React.FC<IconProps> = ({ className = '' }: IconProps) => {
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
        d='m14.33 8.26-6.8 6.8a4.5 4.5 0 0 0-.65.82h3.57l5.75-5.75-1.87-1.87zm1.06-1.06 1.87 1.87 2.4-2.41a1.32 1.32 0 1 0-1.86-1.87l-2.4 2.4zm2.93 2.93 1.54 1.54a.75.75 0 0 1-1.06 1.06l-1.54-1.54-6.81 6.8a6 6 0 0 1-2.04 1.34l-3.83 1.52a.75.75 0 0 1-.97-.98l1.51-3.83a6 6 0 0 1 1.34-2.03l6.8-6.81-1.53-1.54a.75.75 0 0 1 1.06-1.06l1.54 1.54 2.41-2.41a2.82 2.82 0 0 1 3.99 3.99l-2.41 2.4z'
      ></path>
    </svg>
  );
};

export default ColorizeIcon;
