import { IconProps } from 'canva-editor/types';
import React from 'react';

const FormatUnderlineIcon: React.FC<IconProps> = ({
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
        d='M6 21.25a.75.75 0 0 1 .75-.75h10.5a.75.75 0 0 1 0 1.5H6.75a.75.75 0 0 1-.75-.75ZM15.754 14.006V5h1.528v8.95c0 1.574-.476 2.807-1.424 3.703-.948.896-2.253 1.347-3.92 1.347-1.667 0-2.952-.454-3.862-1.356-.904-.902-1.358-2.145-1.358-3.733V5h1.528v9.025c0 1.168.32 2.072.966 2.704.646.632 1.592.945 2.83.945 1.183 0 2.1-.313 2.746-.945.646-.638.966-1.548.966-2.723Z'
        fill='currentColor'
      ></path>
    </svg>
  );
};

export default FormatUnderlineIcon;
