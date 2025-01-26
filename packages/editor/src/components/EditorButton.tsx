import useMobileDetect from 'canva-editor/hooks/useMobileDetect';
import { Tooltip as ReactTooltip } from 'canva-editor/tooltip';
import { generateRandomID } from 'canva-editor/utils/identityGenerator';
import { ForwardRefRenderFunction, PropsWithChildren, forwardRef } from 'react';

interface Props {
  onClick: (event: React.MouseEvent<HTMLElement>) => void;
  className?: string;
  disabled?: boolean;
  isActive?: boolean;
  tooltip?: string;
  styles?: {
    color: string;
    disabledColor: string;
  };
}
const EditorButton: ForwardRefRenderFunction<
  HTMLButtonElement,
  PropsWithChildren<Props>
> = (
  {
    children,
    disabled = false,
    isActive = false,
    className = '',
    styles = {
      color: '#0d1216',
      disabledColor: 'rgba(64,87,109,.4)',
    },
    tooltip,
    ...props
  },
  ref
) => {
  const btnId = 'btn_' + generateRandomID();
  const isMobile = useMobileDetect();
  return (
    <>
      <button
        ref={ref}
        data-tooltip-id={btnId}
        className={className}
        {...props}
        css={{
          padding: '0 4px',
          display: 'flex',
          height: 32,
          minWidth: 32,
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'background-color 0.3s ease',
          borderRadius: 6,
          fontSize: 14,
          fontWeight: 400,
          ...(disabled
            ? { color: styles.disabledColor, cursor: 'not-allowed' }
            : {
                color: styles.color,
                ':hover': {
                  backgroundColor: 'rgba(64,87,109,.2)',
                },
                ...(isActive ? { backgroundColor: 'rgba(64,87,109,.2)' } : {}),
              }),
        }}
      >
        {children}
      </button>
      {!isMobile && tooltip && <ReactTooltip id={btnId} content={tooltip} />}
    </>
  );
};

export default forwardRef<HTMLButtonElement, PropsWithChildren<Props>>(
  EditorButton
);
