import { IconProps } from 'canva-editor/types';
import React from 'react';

const NotesIcon: React.FC<IconProps> = ({ className = '' }: IconProps) => {
  return (
    <svg
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      className={className}
    >
      <path
        d='M4.75 5.25a.75.75 0 0 0 0 1.5h11.5a.75.75 0 0 0 0-1.5H4.75ZM4.75 9.25a.75.75 0 0 0 0 1.5h7.5a.75.75 0 0 0 0-1.5h-7.5ZM4 14a.75.75 0 0 1 .75-.75h3.5a.75.75 0 0 1 0 1.5h-3.5A.75.75 0 0 1 4 14ZM4.75 17.25a.75.75 0 0 0 0 1.5h1.5a.75.75 0 0 0 0-1.5h-1.5Z'
        fill='currentColor'
      ></path>
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M21.192 8.308a2.04 2.04 0 0 0-2.884 0l-6.9 6.9a4.625 4.625 0 0 0-1.046 1.61l-.945 2.458a.625.625 0 0 0 .807.807l2.458-.945a4.625 4.625 0 0 0 1.61-1.046l6.9-6.9a2.04 2.04 0 0 0 0-2.884Zm-2 .884a.79.79 0 1 1 1.116 1.116l-.558.558-1.116-1.116.558-.558Zm-1.442 1.442L13.384 15l1.116 1.116 4.366-4.366-1.116-1.116Zm-5.458 5.458.208-.208L13.616 17l-.208.208a3.375 3.375 0 0 1-1.175.763l-.761.293-.236-.235.293-.762c.17-.441.43-.841.763-1.175Z'
        fill='currentColor'
      ></path>
    </svg>
  );
};

export default NotesIcon;
