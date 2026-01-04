import { IconProps } from 'canva-editor/types';
import React from 'react';

const ShapeSettingsIcon: React.FC<IconProps> = ({
  className = '',
}: IconProps) => {
  return (
    <svg
      className={className}
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
    >
      <rect
        width='18'
        height='1.5'
        x='3'
        y='4'
        fill='currentColor'
        rx='.75'
      ></rect>
      <rect
        width='18'
        height='3'
        x='3'
        y='8.5'
        fill='currentColor'
        rx='1'
      ></rect>
      <rect
        width='18'
        height='5.5'
        x='3'
        y='14.5'
        fill='currentColor'
        rx='1'
      ></rect>
    </svg>
  );
};

export default ShapeSettingsIcon;
