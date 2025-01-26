import { IconProps } from 'canva-editor/types';
import React from 'react';

const DownloadIcon: React.FC<IconProps> = ({ className = '' }: IconProps) => {
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
        fill='currentColor'
        d='m11.25 15.85-4.38-4.38a.75.75 0 0 0-1.06 1.06l4.95 4.95c.69.68 1.8.68 2.48 0l4.95-4.95a.75.75 0 1 0-1.06-1.06l-4.38 4.38V4.25a.75.75 0 1 0-1.5 0v11.6zm-7.5 3.4h16.5a.75.75 0 1 1 0 1.5H3.75a.75.75 0 1 1 0-1.5z'
      ></path>
    </svg>
  );
};

export default DownloadIcon;
