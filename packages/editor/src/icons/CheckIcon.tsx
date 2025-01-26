import { IconProps } from 'canva-editor/types';
import React from 'react';

const CheckIcon: React.FC<IconProps> = ({ className = '' }: IconProps) => {
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
        d='M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z'
      ></path>
    </svg>
  );
};

export default CheckIcon;
