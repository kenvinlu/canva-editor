import EditorButton from 'canva-editor/components/EditorButton';
import {
  forwardRef,
  ForwardRefRenderFunction,
  HTMLProps,
  PropsWithChildren,
} from 'react';
interface SettingButtonProps extends HTMLProps<HTMLElement> {
  isActive?: boolean;
  tooltip?: string;
}
const SettingButton: ForwardRefRenderFunction<
  HTMLDivElement,
  PropsWithChildren<SettingButtonProps>
> = ({ children, tooltip, disabled, onClick, ...props }, ref) => {
  return (
    <EditorButton
      ref={ref as any}
      onClick={(e) => !disabled && onClick && onClick(e)}
      disabled={disabled}
      tooltip={tooltip}
      {...props}
    >
      {children}
    </EditorButton>
  );
};
export default forwardRef<
  HTMLDivElement,
  PropsWithChildren<SettingButtonProps>
>(SettingButton);
