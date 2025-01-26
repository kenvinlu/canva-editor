import { IconProps } from 'canva-editor/types';
import React from 'react';

const AlignCenterVerticalIcon: React.FC<IconProps> = ({
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
        d='M11 11.25h2V7c0-1.1.9-2 2-2h1a2 2 0 0 1 2 2v4.25h2.25a.75.75 0 1 1 0 1.5H18V17a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-4.25h-2V14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-1.25H3.75a.75.75 0 1 1 0-1.5H6V10c0-1.1.9-2 2-2h1a2 2 0 0 1 2 2v1.25zM16.5 7a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v10c0 .28.22.5.5.5h1a.5.5 0 0 0 .5-.5V7zm-7 3a.5.5 0 0 0-.5-.5H8a.5.5 0 0 0-.5.5v4c0 .28.22.5.5.5h1a.5.5 0 0 0 .5-.5v-4z'
      ></path>
    </svg>
  );
};

export default AlignCenterVerticalIcon;
