import { IconProps } from 'canva-editor/types';
import React from 'react';

const BackgroundSelectionIcon: React.FC<IconProps> = ({
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
        d='M4.03 21.03a.75.75 0 0 1-1.06-1.06l17-17a.75.75 0 0 1 1.06 1.06l-17 17Zm4.5.5a.75.75 0 0 1-1.06-1.06l13-13a.75.75 0 0 1 1.06 1.06l-13 13Zm5 0a.75.75 0 0 1-1.06-1.06l8-8a.75.75 0 0 1 1.06 1.06l-8 8Zm5.5-.5a.75.75 0 0 1-1.06-1.06l2-2a.75.75 0 0 1 1.06 1.06l-2 2Zm-15.5-4.5a.75.75 0 0 1-1.06-1.06l13-13a.75.75 0 0 1 1.06 1.06l-13 13Zm0-5a.75.75 0 0 1-1.06-1.06l8-8a.75.75 0 0 1 1.06 1.06l-8 8Zm.5-5.5a.75.75 0 0 1-1.06-1.06l2-2a.75.75 0 0 1 1.06 1.06l-2 2Z'
        fill='currentColor'
      ></path>
    </svg>
  );
};

export default BackgroundSelectionIcon;
