import { IconProps } from 'canva-editor/types';
import React from 'react';

const ClipboardIcon: React.FC<IconProps> = ({ className = '' }: IconProps) => {
  return (
    <svg
      className={className}
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <mask id='_1304310517__a' fill='#fff'>
        <path
          fillRule='evenodd'
          clipRule='evenodd'
          d='M14 5a2 2 0 1 0-4 0H8v3a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V5h-2Z'
        ></path>
      </mask>
      <path
        d='M14 5h-1.5v1.5H14V5Zm-4 0v1.5h1.5V5H10ZM8 5V3.5H6.5V5H8Zm8 0h1.5V3.5H16V5Zm-4-.5a.5.5 0 0 1 .5.5h3A3.5 3.5 0 0 0 12 1.5v3Zm-.5.5a.5.5 0 0 1 .5-.5v-3A3.5 3.5 0 0 0 8.5 5h3ZM8 6.5h2v-3H8v3ZM9.5 8V5h-3v3h3ZM9 7.5a.5.5 0 0 1 .5.5h-3A2.5 2.5 0 0 0 9 10.5v-3Zm6 0H9v3h6v-3Zm-.5.5a.5.5 0 0 1 .5-.5v3A2.5 2.5 0 0 0 17.5 8h-3Zm0-3v3h3V5h-3ZM14 6.5h2v-3h-2v3Z'
        fill='currentColor'
        mask='url(#_1304310517__a)'
      ></path>
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M16 6.5h1.714c.316 0 .572.224.572.5v13c0 .276-.256.5-.572.5H6.286c-.316 0-.572-.224-.572-.5V7c0-.276.256-.5.572-.5H8V5H6.286C5.023 5 4 5.895 4 7v13c0 1.105 1.023 2 2.286 2h11.428C18.977 22 20 21.105 20 20V7c0-1.105-1.023-2-2.286-2H16v1.5Z'
        fill='currentColor'
      ></path>
    </svg>
  );
};

export default ClipboardIcon;
