import { IconProps } from 'canva-editor/types';
import React from 'react';

const DocumentIcon: React.FC<IconProps> = ({ className = '' }: IconProps) => {
  return (
    <svg
      className={className}
      width='32'
      height='32'
      viewBox='0 0 32 32'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M25.333 13.333v-.044h.032l-.032-.031V13c0-.713-.285-1.396-.792-1.898l-7.762-7.666a2.667 2.667 0 0 0-1.874-.77H9.333a2.667 2.667 0 0 0-2.666 2.667v21.334a2.667 2.667 0 0 0 2.666 2.666h13.334a2.667 2.667 0 0 0 2.666-2.666V15.333h-2v11.334a.667.667 0 0 1-.666.666H9.333a.667.667 0 0 1-.666-.666V5.333c0-.368.298-.666.666-.666h5.334v5.955a2.667 2.667 0 0 0 2.666 2.667h6v.044h2Zm-8.666-7.197 5.216 5.153h-4.55a.667.667 0 0 1-.666-.667V6.136ZM13 16.333h6a1 1 0 1 1 0 2h-6a1 1 0 0 1 0-2Zm6 5.334h-6a1 1 0 1 0 0 2h6a1 1 0 1 0 0-2Z'
        fill='currentColor'
      ></path>
    </svg>
  );
};

export default DocumentIcon;
