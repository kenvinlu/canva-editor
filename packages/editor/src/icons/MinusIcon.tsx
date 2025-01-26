import { IconProps } from 'canva-editor/types';
import React from 'react';

const MinusIcon: React.FC<IconProps> = ({ className = '' }: IconProps) => {
  return (
    <svg
      className={className}
      width='16'
      height='16'
      xmlns='http://www.w3.org/2000/svg'
      fill='none'
    >
      <g>
        <title>Layer 1</title>
        <path
          stroke='null'
          id='svg_1'
          fill='currentColor'
          d='m2,8.12499a1.13672,0.75 0 0 1 1.13672,-0.75l9.85155,0a1.13672,0.75 0 0 1 0,1.5l-9.85155,0a1.13672,0.75 0 0 1 -1.13672,-0.75z'
          clipRule='evenodd'
          fillRule='evenodd'
        />
      </g>
    </svg>
  );
};

export default MinusIcon;
