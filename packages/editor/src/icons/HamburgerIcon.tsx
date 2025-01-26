import { IconProps } from 'canva-editor/types';
import React from 'react';

const HamburgerIcon: React.FC<IconProps> = ({
  className = '',
  fill,
}: IconProps) => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      viewBox='0 0 24 24'
      className={className}
    >
      <path
        fill={fill ? fill : 'currentColor'}
        fillRule='evenodd'
        d='M5.75 5.25h12.5a.75.75 0 1 1 0 1.5H5.75a.75.75 0 0 1 0-1.5zm0 6h12.5a.75.75 0 1 1 0 1.5H5.75a.75.75 0 1 1 0-1.5zm0 6h12.5a.75.75 0 1 1 0 1.5H5.75a.75.75 0 1 1 0-1.5z'
      ></path>
    </svg>
  );
};

export default HamburgerIcon;
