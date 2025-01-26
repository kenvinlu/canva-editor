import { IconProps } from 'canva-editor/types';
import React from 'react';

const NotAllowedIcon: React.FC<IconProps> = ({ className = '' }: IconProps) => {
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
        d='M19.071 19.071c-3.905 3.905-10.237 3.905-14.142 0-3.905-3.905-3.905-10.237 0-14.142 3.905-3.905 10.237-3.905 14.142 0 3.905 3.905 3.905 10.237 0 14.142ZM5.482 17.457 17.457 5.482A8.5 8.5 0 0 0 5.482 17.457Zm1.06 1.06A8.501 8.501 0 0 0 18.519 6.544L6.543 18.518Z'
        fill='currentColor'
      ></path>
    </svg>
  );
};

export default NotAllowedIcon;
