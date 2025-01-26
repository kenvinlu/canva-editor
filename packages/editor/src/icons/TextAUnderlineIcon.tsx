import { IconProps } from 'canva-editor/types';
import React from 'react';

const TextAUnderlineIcon: React.FC<IconProps> = ({
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
        d='M11 2 5.5 16h2.25l1.12-3h6.25l1.12 3h2.25L13 2h-2zm-1.38 9L12 4.67 14.38 11H9.62z'
        fill='currentColor'
      ></path>
    </svg>
  );
};

export default TextAUnderlineIcon;
