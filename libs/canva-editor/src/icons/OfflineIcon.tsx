import { IconProps } from 'canva-editor/types';
import React from 'react';

const OfflineIcon: React.FC<IconProps> = ({ className = '' }: IconProps) => {
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
        d='M4.323 3.323A.75.75 0 0 0 3.47 4.53L5.51 6.572a5.968 5.968 0 0 0-.502 2.09A5.627 5.627 0 0 0 7 19.498v.001h10v-.001c.436-.01.86-.069 1.266-.172l1.704 1.703a.75.75 0 1 0 1.06-1.06l-.253-.254a.747.747 0 0 1-.307-.186l-16-16a.749.749 0 0 1-.147-.207ZM6.5 9c0-.438.062-.86.179-1.26L16.939 18a4.537 4.537 0 0 1-.189-.002V18h-9.5v-.002a4.125 4.125 0 0 1-.681-8.21A4.528 4.528 0 0 1 6.5 9Z'
        fill='currentColor'
      ></path>
      <path
        d='M20.883 17.822a5.625 5.625 0 0 0-3.93-9.571 6.001 6.001 0 0 0-9.632-3.99l1.072 1.07a4.5 4.5 0 0 1 6.99 4.697 4.125 4.125 0 0 1 4.44 6.733l1.06 1.061Z'
        fill='currentColor'
      ></path>
    </svg>
  );
};

export default OfflineIcon;
