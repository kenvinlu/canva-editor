import { IconProps } from 'canva-editor/types';
import React from 'react';

const AlignTopIcon: React.FC<IconProps> = ({ className = '' }: IconProps) => {
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
        d='M21 4c0 .41-.34.75-.75.75H3.75a.75.75 0 0 1 0-1.5h16.5c.41 0 .75.34.75.75zM11 9v9a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V9c0-1.1.9-2 2-2h1a2 2 0 0 1 2 2zm7 0v4a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2V9c0-1.1.9-2 2-2h1a2 2 0 0 1 2 2zM9.5 9a.5.5 0 0 0-.5-.5H8a.5.5 0 0 0-.5.5v9c0 .28.22.5.5.5h1a.5.5 0 0 0 .5-.5V9zm7 0a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v4c0 .28.22.5.5.5h1a.5.5 0 0 0 .5-.5V9z'
      ></path>
    </svg>
  );
};

export default AlignTopIcon;
