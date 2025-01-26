import { IconProps } from 'canva-editor/types';
import React from 'react';

const AlignLeftIcon: React.FC<IconProps> = ({ className = '' }: IconProps) => {
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
        d='M4 3c.41 0 .75.34.75.75v16.5a.75.75 0 1 1-1.5 0V3.75c0-.41.34-.75.75-.75zm5 3h9a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V8c0-1.1.9-2 2-2zm0 7h4a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2v-1c0-1.1.9-2 2-2zm0-5.5a.5.5 0 0 0-.5.5v1c0 .28.22.5.5.5h9a.5.5 0 0 0 .5-.5V8a.5.5 0 0 0-.5-.5H9zm0 7a.5.5 0 0 0-.5.5v1c0 .28.22.5.5.5h4a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5H9z'
      ></path>
    </svg>
  );
};

export default AlignLeftIcon;
