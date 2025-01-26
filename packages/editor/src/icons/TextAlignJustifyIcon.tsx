import { IconProps } from 'canva-editor/types';
import React from 'react';

const TextAlignJustifyIcon: React.FC<IconProps> = ({
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
          id='_1025355287__a'
          d='M3.8 17.3h16.6c.9 0 .9 1.6-.1 1.5H3.8c-.8 0-.9-1.4 0-1.5zm0-8h16.6c.9 0 .9 1.6-.1 1.5H3.8c-.8 0-.9-1.4 0-1.5zm0 4h16.6c.9 0 .9 1.6-.1 1.5H3.8c-.8 0-.9-1.4 0-1.5zm0-8c5.5 0 11-.1 16.5 0 .9 0 .9 1.5-.1 1.5-5.5-.1-11 0-16.5-.1-.9 0-.9-1.4-.1-1.4Z'
        ></path>
      </defs>
      <use
        fill='currentColor'
        xlinkHref='#_1025355287__a'
        fillRule='evenodd'
      ></use>
    </svg>
  );
};

export default TextAlignJustifyIcon;
