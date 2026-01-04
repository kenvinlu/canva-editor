import { IconProps } from 'canva-editor/types';
import React from 'react';

const FormatUppercaseIcon: React.FC<IconProps> = ({
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
        d='m8.77 19-.29-1.37h-.07c-.48.6-.96 1.01-1.44 1.22-.47.22-1.07.33-1.79.33-.95 0-1.7-.25-2.24-.74-.54-.5-.81-1.2-.81-2.1 0-1.95 1.55-2.97 4.66-3.06l1.64-.05v-.6c0-.76-.17-1.32-.5-1.68-.32-.36-.84-.54-1.55-.54-.8 0-1.71.25-2.73.74l-.44-1.11a6.86 6.86 0 0 1 3.26-.83c1.15 0 2 .25 2.55.76.55.51.83 1.33.83 2.46V19H8.77zm-3.3-1.03c.91 0 1.63-.25 2.14-.75.52-.5.78-1.2.78-2.09v-.87l-1.46.06a5.3 5.3 0 0 0-2.5.54c-.52.32-.78.82-.78 1.5 0 .52.16.92.48 1.2.32.27.77.41 1.34.41zM21.15 19l-1.6-4.09H14.4L12.82 19h-1.51l5.08-12.9h1.26L22.7 19h-1.55zm-2.06-5.43-1.5-3.98c-.19-.5-.39-1.13-.6-1.86-.12.56-.3 1.18-.55 1.86l-1.5 3.98h4.15z'
      ></path>
    </svg>
  );
};

export default FormatUppercaseIcon;
