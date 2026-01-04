import { IconProps } from 'canva-editor/types';
import React from 'react';

const ArrowForwardIcon: React.FC<IconProps> = ({
  className = '',
}: IconProps) => {
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
        d='M6.23 20.23 8 22l10-10L8 2 6.23 3.77 14.46 12z'
      ></path>
    </svg>
  );
};

export default ArrowForwardIcon;
