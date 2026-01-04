import { IconProps } from 'canva-editor/types';
import React from 'react';

const SquareBoldIcon: React.FC<IconProps> = ({ className = '' }: IconProps) => {
  return (
    <svg
      className={className}
      xmlns='http://www.w3.org/2000/svg'
      fill='currentColor'
      width='24'
      height='24'
    >
      <g>
        <rect
          rx='0.02'
          strokeWidth='6'
          id='svg_3'
          height='18'
          width='18'
          y='3'
          x='3'
          stroke='currentColor'
          fill='#fff'
        />
      </g>
    </svg>
  );
};

export default SquareBoldIcon;
