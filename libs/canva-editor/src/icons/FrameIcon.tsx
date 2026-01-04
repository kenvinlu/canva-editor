import { IconProps } from 'canva-editor/types';
import React from 'react';

const FrameIcon: React.FC<IconProps> = ({ className = '' }: IconProps) => {
  return (
    <svg
      className={className}
      height='20'
      width='20'
      xmlns='http://www.w3.org/2000/svg'
      xmlnsXlink='http://www.w3.org/1999/xlink'
      viewBox='0 0 42.621 42.621'
      xmlSpace='preserve'
    >
      <g>
        <path
          fill='currentColor'
          d='M0,7.698v31.787h38.061c2.516,0,4.56-2.043,4.56-4.562V3.136H4.563C2.041,3.136,0,5.179,0,7.698z
		 M8.625,7.484h29.934v23.092c0,2.519-2.045,4.561-4.561,4.561H4.065V12.046C4.065,9.526,6.104,7.484,8.625,7.484z'
        />
        <circle fill='currentColor' cx='21.311' cy='14.79' r='3.991' />
        <path
          fill='currentColor'
          d='M9.207,33.463h23.092c1.258,0,2.279-0.628,2.279-1.401v-1.4l-5.006-9.849
		c-0.961-2.33-2.906-2.539-4.342-0.468l-5.381,7.75l-5.875-4.151c-2.057-1.454-4.285-0.668-4.979,1.753l-2.07,4.965
		c0,0,0,0.626,0,1.4C6.926,32.835,7.948,33.463,9.207,33.463z'
        />
      </g>
    </svg>
  );
};

export default FrameIcon;
