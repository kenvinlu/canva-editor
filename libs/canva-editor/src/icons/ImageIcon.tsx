import { IconProps } from 'canva-editor/types';
import React from 'react';

const ImageIcon: React.FC<IconProps> = ({
  className = '',
}: IconProps) => {
  return (
    <svg
      className={className}
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      viewBox='0 0 32 32'
    >
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M25.334 4H6.666A2.667 2.667 0 0 0 4 6.666v18.668A2.67 2.67 0 0 0 6.666 28h18.668A2.667 2.667 0 0 0 28 25.334V6.666A2.667 2.667 0 0 0 25.334 4ZM6.666 26h9.994l-4.878-6.608a.666.666 0 0 0-1.074.004L6.116 25.71c.12.174.32.29.55.29Zm18.668 0a.668.668 0 0 0 .666-.666v-3.63l-4.914-6.588a.666.666 0 0 0-1.072.004l-4.44 6.04 3.57 4.84h6.19Zm-2.646-12.08L26 18.36V6.666A.666.666 0 0 0 25.334 6H6.666A.666.666 0 0 0 6 6.666v15.802l3.09-4.248a2.666 2.666 0 0 1 4.302-.014l.938 1.27 4.07-5.54a2.666 2.666 0 0 1 4.288-.016ZM9.334 11.334a2 2 0 1 0 4 0 2 2 0 0 0-4 0Z'
        fill='currentColor'
      ></path>
    </svg>
  );
};

export default ImageIcon;