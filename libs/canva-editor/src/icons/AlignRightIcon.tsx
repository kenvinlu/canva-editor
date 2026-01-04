import { IconProps } from 'canva-editor/types';
import React from 'react';

const AlignRightIcon: React.FC<IconProps> = ({ className = '' }: IconProps) => {
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
        d='M20 3a.75.75 0 0 0-.75.75v16.5a.75.75 0 1 0 1.5 0V3.75A.75.75 0 0 0 20 3zm-5 3H6a2 2 0 0 0-2 2v1c0 1.1.9 2 2 2h9a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2zm0 7h-4a2 2 0 0 0-2 2v1c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2v-1a2 2 0 0 0-2-2zm0-5.5c.28 0 .5.22.5.5v1a.5.5 0 0 1-.5.5H6a.5.5 0 0 1-.5-.5V8c0-.28.22-.5.5-.5h9zm0 7c.28 0 .5.22.5.5v1a.5.5 0 0 1-.5.5h-4a.5.5 0 0 1-.5-.5v-1c0-.28.22-.5.5-.5h4z'
      ></path>
    </svg>
  );
};

export default AlignRightIcon;
