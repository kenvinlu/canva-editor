import { IconProps } from 'canva-editor/types';
import React from 'react';

const ListBulletsIcon: React.FC<IconProps> = ({
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
        d='M11.75 5.25h7.5a.75.75 0 1 1 0 1.5h-7.5a.75.75 0 1 1 0-1.5zm0 6h7.5a.75.75 0 1 1 0 1.5h-7.5a.75.75 0 1 1 0-1.5zm0 6h7.5a.75.75 0 1 1 0 1.5h-7.5a.75.75 0 1 1 0-1.5zM6 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm0 6a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm0 6a2 2 0 1 1 0-4 2 2 0 0 1 0 4z'
      ></path>
    </svg>
  );
};

export default ListBulletsIcon;
