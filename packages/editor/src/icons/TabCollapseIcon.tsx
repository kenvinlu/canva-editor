import { IconProps } from 'canva-editor/types';
import React from 'react';

const TabCollapseIcon: React.FC<IconProps> = ({
className = '',
  fill = '#252627'
}: IconProps) => {
  return (
    <svg
      className={className}
      width='13'
      height='96'
      viewBox='0 0 13 96'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path fill={fill} d="M0,0 h1 c0,20,12,12,12,32 v32 c0,20,-12,12,-12,32 H0 z"></path>
      <path fill="transparent" d="M0.5,0 c0,20,12,12,12,32 v32 c0,20,-12,12,-12,32"></path>
    </svg>
  );
};

export default TabCollapseIcon;
