import { IconProps } from 'canva-editor/types';
import React from 'react';

const LayoutIcon: React.FC<IconProps> = ({
  className = '',
}: IconProps) => {
  return (
    <svg
      className={className}
      width='24'
      height='24'
      viewBox='0 0 32 32'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M25.333 4H6.667A2.667 2.667 0 0 0 4 6.667v18.666A2.667 2.667 0 0 0 6.667 28h18.666A2.667 2.667 0 0 0 28 25.333V6.667A2.667 2.667 0 0 0 25.333 4ZM6 6.667C6 6.298 6.298 6 6.667 6h10.666v20H6.667A.667.667 0 0 1 6 25.333V6.667Zm13.333 6.666V6h6c.369 0 .667.298.667.667v6.666h-6.667Zm0 2V26h6a.667.667 0 0 0 .667-.667v-10h-6.667Z'
        fill='currentColor'
      ></path>
    </svg>
  );
};

export default LayoutIcon;
