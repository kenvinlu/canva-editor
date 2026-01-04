import { IconProps } from 'canva-editor/types';
import React from 'react';

const LayersIcon: React.FC<IconProps> = ({ className = '' }: IconProps) => {
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
        d='m19.474 12.838 1.697.835a1 1 0 0 1 0 1.795L13.32 19.33a3 3 0 0 1-2.649 0L2.82 15.468a1 1 0 0 1 0-1.795l1.697-.835 1.698.836-1.821.896 6.94 3.415a1.5 1.5 0 0 0 1.324 0l6.94-3.415-1.822-.896 1.7-.836ZM13.32 4.673l7.852 3.864a1 1 0 0 1 0 1.794l-7.852 3.864a3 3 0 0 1-2.649 0L2.82 10.33a1 1 0 0 1 0-1.794l7.851-3.864a3 3 0 0 1 2.65 0Zm-1.986 8.176a1.5 1.5 0 0 0 1.324 0l6.94-3.415-6.94-3.415a1.5 1.5 0 0 0-1.324 0l-6.94 3.415 6.94 3.415Z'
      ></path>
    </svg>
  );
};

export default LayersIcon;
