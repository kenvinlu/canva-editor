import { IconProps } from 'canva-editor/types';
import React from 'react';

const TextAlignLeftIcon: React.FC<IconProps> = ({
  className = '',
}: IconProps) => {
  return (
    <svg
      className={className}
      xmlns='http://www.w3.org/2000/svg'
      xmlnsXlink='http://www.w3.org/1999/xlink'
      width='24'
      height='24'
      viewBox='0 0 24 24'
    >
      <defs>
        <path
          id='_310417673__a'
          d='M3.75 5.25h16.5a.75.75 0 1 1 0 1.5H3.75a.75.75 0 0 1 0-1.5zm0 4h8.5a.75.75 0 1 1 0 1.5h-8.5a.75.75 0 1 1 0-1.5zm0 4h16.5a.75.75 0 1 1 0 1.5H3.75a.75.75 0 1 1 0-1.5zm0 4h8.5a.75.75 0 1 1 0 1.5h-8.5a.75.75 0 1 1 0-1.5z'
        ></path>
      </defs>
      <use
        fill='currentColor'
        xlinkHref='#_310417673__a'
        fillRule='evenodd'
      ></use>
    </svg>
  );
};

export default TextAlignLeftIcon;
