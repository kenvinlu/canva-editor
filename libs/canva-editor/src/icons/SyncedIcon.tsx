import { IconProps } from 'canva-editor/types';
import React from 'react';

const SyncedIcon: React.FC<IconProps> = ({ className = '' }: IconProps) => {
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
        d='M11 3a6 6 0 0 0-5.99 5.661A5.627 5.627 0 0 0 7 19.5v.001h10v-.001a5.625 5.625 0 0 0 2.67-10.506l-1.114 1.114a4.126 4.126 0 0 1-1.806 7.891V18h-9.5v-.002a4.125 4.125 0 0 1-.681-8.21 4.5 4.5 0 0 1 8.549-2.606l1.116-1.117A5.998 5.998 0 0 0 11 3Zm7.631 4.91a.75.75 0 1 0-1.053-1.068L10.67 13.75l-1.93-1.93a.75.75 0 1 0-1.088 1.03l-.001.002 2.444 2.445a.748.748 0 0 0 1.11.037v.001l7.425-7.424Z'
        fill='currentColor'
      ></path>
    </svg>
  );
};

export default SyncedIcon;
