import { IconProps } from 'canva-editor/types';
import React from 'react';

const TrendingIcon: React.FC<IconProps> = ({ className = '' }: IconProps) => {
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
        d='M15 5.25a.75.75 0 0 0 0 1.5h3.19l-5.69 5.69-1.97-1.97a.75.75 0 0 0-1.06 0l-6.5 6.5a.75.75 0 1 0 1.06 1.06L10 12.06l1.97 1.97a.75.75 0 0 0 1.06 0l6.22-6.22V11a.75.75 0 0 0 1.5 0V6a.75.75 0 0 0-.75-.75h-5Z'
        fill='currentColor'
      ></path>
    </svg>
  );
};

export default TrendingIcon;
