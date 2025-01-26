import { IconProps } from 'canva-editor/types';
import React from 'react';

const LineSpacingIcon: React.FC<IconProps> = ({
  className = '',
}: IconProps) => {
  return (
    <svg
      className={className}
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M3 6a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 3 6Zm0 6a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 3 12Zm.75 5.25a.75.75 0 0 0 0 1.5h7.5a.75.75 0 0 0 0-1.5h-7.5Z'
        fill='currentColor'
      ></path>
      <path
        d='M17.75 4a.75.75 0 0 0-.75.75v14.5a.75.75 0 0 0 1.5 0V4.75a.75.75 0 0 0-.75-.75Z'
        fill='currentColor'
      ></path>
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M14.72 16.43a.75.75 0 0 1 1.06 0l1.97 1.97 1.97-1.97a.75.75 0 1 1 1.06 1.06l-2.145 2.146a1.254 1.254 0 0 1-1.364.271 1.248 1.248 0 0 1-.406-.271L14.72 17.49a.75.75 0 0 1 0-1.06ZM20.78 7.573a.75.75 0 0 1-1.06 0l-1.97-1.97-1.97 1.97a.75.75 0 1 1-1.06-1.06l2.145-2.146a1.255 1.255 0 0 1 1.364-.272c.152.063.29.156.406.272l2.145 2.146a.75.75 0 0 1 0 1.06Z'
        fill='currentColor'
      ></path>
    </svg>
  );
};

export default LineSpacingIcon;
