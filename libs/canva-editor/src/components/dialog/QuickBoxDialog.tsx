import CloseIcon from 'canva-editor/icons/CloseIcon';
import { forwardRef, ForwardRefRenderFunction, PropsWithChildren } from 'react';
import EditorButton from '../EditorButton';

interface Props {
  open: boolean;
  onClose: () => void;
}
const QuickBoxDialog: ForwardRefRenderFunction<
  HTMLDivElement,
  PropsWithChildren<Props>
> = ({ open, children, onClose, ...props }, ref) => {
  const child = (
    <div
      ref={ref}
      css={{
        position: 'absolute',
        right: 10,
        top: 120,
        minWidth: 150,
        zIndex: 1,
        backgroundColor: '#fff',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        borderRadius: 4,
        border: '1px solid #e3e6e9',
      }}
      {...props}
    >
      <div>
        <EditorButton onClick={onClose} css={{margin: '8px 8px 0 auto'}}>
          <CloseIcon css={{ width: 22, height: 22 }} />
        </EditorButton>
      </div>
      {children}
    </div>
  );
  return open ? child : null;
};

export default forwardRef<HTMLDivElement, PropsWithChildren<Props>>(
  QuickBoxDialog
);
