import { IconProps } from 'canva-editor/types';
import React from 'react';

const AlignCenterHorizontalIcon: React.FC<IconProps> = ({
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
        d='M11.25 13v-2H7a2 2 0 0 1-2-2V8c0-1.1.9-2 2-2h4.25V3.75a.75.75 0 1 1 1.5 0V6H17a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2h-4.25v2H14a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2h-1.25v2.25a.75.75 0 1 1-1.5 0V18H10a2 2 0 0 1-2-2v-1c0-1.1.9-2 2-2h1.25zM7 7.5a.5.5 0 0 0-.5.5v1c0 .28.22.5.5.5h10a.5.5 0 0 0 .5-.5V8a.5.5 0 0 0-.5-.5H7zm3 7a.5.5 0 0 0-.5.5v1c0 .28.22.5.5.5h4a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-4z'
      ></path>
    </svg>
  );
};

export default AlignCenterHorizontalIcon;
