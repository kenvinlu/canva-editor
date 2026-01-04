import { IconProps } from 'canva-editor/types';
import React from 'react';

const DuplicateIcon: React.FC<IconProps> = ({ className = '' }: IconProps) => {
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
        d='M5 3h8a2 2 0 0 1 2 2v.5h-1.5V5a.5.5 0 0 0-.5-.5H5a.5.5 0 0 0-.5.5v10a.5.5 0 0 0 .5.5h2.5V17H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Zm6 5.5a.5.5 0 0 0-.5.5v10a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5V9a.5.5 0 0 0-.5-.5h-8ZM19 7h-8a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2Z'
        fill='currentColor'
      ></path>
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M15 11a.75.75 0 0 0-.75.75v1.5h-1.5a.75.75 0 0 0 0 1.5h1.5v1.5a.75.75 0 0 0 1.5 0v-1.5h1.5a.75.75 0 0 0 0-1.5h-1.5v-1.5A.75.75 0 0 0 15 11Z'
        fill='currentColor'
      ></path>
    </svg>
  );
};

export default DuplicateIcon;
