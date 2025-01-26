import { IconProps } from 'canva-editor/types';
import React from 'react';

const UngroupIcon: React.FC<IconProps> = ({ className = '' }: IconProps) => {
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
        d='M17 9h3v11H9v-3c.51 0 1.01-.05 1.5-.14v1.64h8v-8h-1.64c.1-.49.14-.99.14-1.5zm-8 6A6 6 0 1 1 9 3a6 6 0 0 1 0 12zm0-1.5a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9z'
      ></path>
    </svg>
  );
};

export default UngroupIcon;
