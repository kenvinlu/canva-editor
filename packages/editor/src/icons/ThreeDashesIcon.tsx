import { IconProps } from 'canva-editor/types';
import React from 'react';

const ThreeDashesIcon: React.FC<IconProps> = ({
  className = '',
}: IconProps) => {
  return (
    <svg
      className={className}
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <line
        x1='1'
        x2='23'
        y1='50%'
        y2='50%'
        stroke='currentColor'
        strokeDasharray='6 2'
        strokeWidth='2'
        shapeRendering='crispEdges'
      ></line>
    </svg>
  );
};

export default ThreeDashesIcon;
