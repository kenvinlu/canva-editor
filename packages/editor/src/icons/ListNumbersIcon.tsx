import { IconProps } from 'canva-editor/types';
import React from 'react';

const ListNumbersIcon: React.FC<IconProps> = ({
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
        fill='currentColor'
        fillRule='evenodd'
        d='M11.75 5.25h7.5a.75.75 0 1 1 0 1.5h-7.5a.75.75 0 1 1 0-1.5zm0 6h7.5a.75.75 0 1 1 0 1.5h-7.5a.75.75 0 1 1 0-1.5zm0 6h7.5a.75.75 0 1 1 0 1.5h-7.5a.75.75 0 1 1 0-1.5zM5.69 8V4.07h-.06l-1.21.84v-.96l1.28-.88h1.02V8H5.7zm-1.25 3.04c0-.95.73-1.6 1.8-1.6 1.03 0 1.75.6 1.75 1.44 0 .54-.3 1-1.15 1.8l-.94.9v.06h2.16v.86H4.5v-.72l1.6-1.58c.7-.67.88-.93.88-1.25 0-.4-.32-.68-.78-.68-.47 0-.8.32-.8.77v.02h-.96v-.02zm1.26 7.82v-.77h.6c.47 0 .79-.27.79-.68 0-.4-.3-.64-.79-.64-.48 0-.8.27-.82.7h-.96c.04-.94.73-1.53 1.8-1.53 1.02 0 1.75.56 1.75 1.33 0 .57-.36 1.02-.91 1.13v.06c.67.08 1.1.53 1.1 1.18 0 .86-.81 1.49-1.94 1.49-1.1 0-1.84-.61-1.89-1.54h.99c.03.42.38.68.91.68.52 0 .88-.3.88-.71 0-.43-.34-.7-.9-.7h-.6z'
      ></path>
    </svg>
  );
};

export default ListNumbersIcon;
