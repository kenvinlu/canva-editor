import React, { ForwardedRef } from 'react';
import BaseButton, { ButtonProps } from './Button';

type OutlineButtonProps = ButtonProps & {};

const OutlineButton = React.forwardRef(
  (
    { icon, onClick, children, ...rest }: OutlineButtonProps,
    ref: ForwardedRef<HTMLButtonElement>
  ) => {
    return (
      <BaseButton
        ref={ref}
        icon={icon}
        onClick={onClick}
        style={{
          backgroundColor: '#fff',
          color: '#000',
          ':hover': {
            backgroundColor: 'rgba(64,87,109,.07)'
          }
        }}
        {...rest}
      >
        {children}
      </BaseButton>
    );
  }
);

export default OutlineButton;
