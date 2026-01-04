import { IconProps } from 'canva-editor/types';
import React from 'react';

const MoreHorizIcon: React.FC<IconProps> = ({ className = '', style = {} }: IconProps) => {
  return (
    <svg
      className={className}
      style={style}
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      viewBox='0 0 24 24'
    >
      <path
        fill='currentColor'
        fillRule='evenodd'
        d='M5 14a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm7 0a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm7 0a2 2 0 1 1 0-4 2 2 0 0 1 0 4z'
      ></path>
    </svg>
  );
};

export default MoreHorizIcon;
