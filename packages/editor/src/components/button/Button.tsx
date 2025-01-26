import React, { ButtonHTMLAttributes, ForwardedRef } from 'react';

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  icon?: JSX.Element;
  text?: string;
  style?: any;
};

const Button = React.forwardRef(
  (
    { icon, text, onClick, type = 'button', style, children, ...rest }: ButtonProps,
    ref: ForwardedRef<HTMLButtonElement>
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        onClick={onClick}
        css={{
          border: 0,
          borderRadius: 4,
          cursor: 'pointer',
          color: '#fff',
          backgroundColor: '#8b3dff',
          transition: 'background-color 0.3s ease',
          height: 40,
          padding: '0 6px',
          boxShadow: 'inset 0 0 0 1px rgba(57,76,96,.15)',
          fontWeight: 400,
          '&:hover': {
            backgroundColor: '#7300e6'
          },
          ...style,
        }}
        {...rest}
      >
        {icon && <span css={{ marginRight: 5 }}>{icon}</span>}
        {text && <span css={{ verticalAlign: 'middle' }}>{text}</span>}
        {children}
      </button>
    );
  }
);

export default Button;
