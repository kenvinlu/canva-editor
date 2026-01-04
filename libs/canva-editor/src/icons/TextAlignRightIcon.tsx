import { IconProps } from 'canva-editor/types';
import React from 'react';

const TextAlignRightIcon: React.FC<IconProps> = ({
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
        fillRule='evenodd'
        d='M20.25 5.25a.75.75 0 1 1 0 1.5H3.75a.75.75 0 0 1 0-1.5h16.5zm0 4a.75.75 0 1 1 0 1.5h-8.5a.75.75 0 1 1 0-1.5h8.5zm0 4a.75.75 0 1 1 0 1.5H3.75a.75.75 0 1 1 0-1.5h16.5zm0 4a.75.75 0 1 1 0 1.5h-8.5a.75.75 0 1 1 0-1.5h8.5z'
      ></path>
    </svg>
  );
};

export default TextAlignRightIcon;
