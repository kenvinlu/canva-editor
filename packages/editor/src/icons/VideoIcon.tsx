import { IconProps } from 'canva-editor/types';
import React from 'react';

const VideoIcon: React.FC<IconProps> = ({
  className = '',
}: IconProps) => {
  return (
    <svg
      className={className}
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      viewBox='0 0 24 24'
    >
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M4 5h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Zm0 1.5a.5.5 0 0 0-.5.5v10s.224.5.5.5h16s.5-.224.5-.5V7a.5.5 0 0 0-.5-.5H4ZM14.5 12 10 9.5v5l4.5-2.5Z'
        fill='currentColor'
      ></path>
    </svg>
  );
};

export default VideoIcon;