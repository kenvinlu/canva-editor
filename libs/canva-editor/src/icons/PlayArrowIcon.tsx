import { IconProps } from 'canva-editor/types';
import React from 'react';

const PlayArrowIcon: React.FC<IconProps> = ({ className = '' }: IconProps) => {
  return (
    <svg
      className={className}
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      viewBox='0 0 24 24'
    >
      <path fill='currentColor' d='M8 5v14l11-7z'></path>
    </svg>
  );
};

export default PlayArrowIcon;
