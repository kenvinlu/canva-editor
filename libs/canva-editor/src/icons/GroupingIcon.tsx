import { IconProps } from 'canva-editor/types';
import React from 'react';

const GroupingIcon: React.FC<IconProps> = ({ className = '' }: IconProps) => {
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
        d='M20 17.05A2.5 2.5 0 1 1 17.05 20H6.95A2.5 2.5 0 1 1 4 17.05V6.95A2.5 2.5 0 1 1 6.95 4h10.1A2.5 2.5 0 1 1 20 6.95v10.1zm-1.5.16V6.79a2.5 2.5 0 0 1-1.3-1.29H6.8a2.5 2.5 0 0 1-1.3 1.3v10.4a2.5 2.5 0 0 1 1.3 1.3h10.4a2.5 2.5 0 0 1 1.3-1.3zM4.5 5.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm0 15a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm15-15a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm0 15a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-9-6.5a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7zm0-1.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm4.75-2.5h1.5v5c0 .97-.78 1.75-1.75 1.75h-5v-1.5h5c.14 0 .25-.11.25-.25v-5z'
      ></path>
    </svg>
  );
};

export default GroupingIcon;
