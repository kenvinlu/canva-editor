import { IconProps } from 'canva-editor/types';
import React from 'react';

const HelpIcon: React.FC<IconProps> = ({ className = '' }: IconProps) => {
  return (
    <svg
      className={className}
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      viewBox='0 0 24 24'
    >
      <path
        fill='currentColor'
        d='M12 22a10 10 0 1 1 0-20 10 10 0 0 1 0 20zm0-1.5a8.5 8.5 0 1 0 0-17 8.5 8.5 0 0 0 0 17zM8.75 9.85c.05-1.62 1.17-2.8 3.2-2.8 1.87 0 3.12 1.08 3.12 2.6 0 1.04-.52 1.77-1.45 2.33-.9.52-1.15.87-1.15 1.55v.39H10.9l-.01-.47c-.06-1.02.33-1.64 1.28-2.2.84-.5 1.13-.87 1.13-1.54 0-.71-.57-1.23-1.43-1.23-.89 0-1.45.54-1.5 1.37H8.74zm3 7.33c-.68 0-1.13-.43-1.13-1.09 0-.66.45-1.1 1.13-1.1.7 0 1.14.44 1.14 1.1 0 .66-.44 1.09-1.14 1.09z'
      ></path>
    </svg>
  );
};

export default HelpIcon;
