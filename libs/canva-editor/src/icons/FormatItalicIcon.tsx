import { IconProps } from 'canva-editor/types';
import React from 'react';

const FormatItalicIcon: React.FC<IconProps> = ({
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
      <path
        fill='currentColor'
        fillRule='evenodd'
        d='m14.73 6.5-3.67 11H14l-.3 1.5H6l.3-1.5h2.81l3.68-11H10l.3-1.5H18l-.3 1.5h-2.97z'
      ></path>
    </svg>
  );
};

export default FormatItalicIcon;
