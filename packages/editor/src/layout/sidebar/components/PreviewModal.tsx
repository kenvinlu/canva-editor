import { FC } from 'react';
// import { Preview } from 'canva-editor/components/editor';
import CloseIcon from 'canva-editor/icons/CloseIcon';
import Preview from 'canva-editor/components/editor/Preview';

interface PreviewModalProps {
  onClose: () => void;
}

const PreviewModal: FC<PreviewModalProps> = ({ onClose }) => {
  return (
    <div
      css={{
        position: 'fixed',
        inset: 0,
        zIndex: 1040,
        background: 'rgba(13,18,22,.95)',
      }}
    >
      <Preview onClose={() => onClose()} />
      <div
        css={{
          background: 'transparent',
          width: 60,
          height: 60,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'fixed',
          right: 24,
          top: 24,
          borderRadius: '50%',
          fontSize: 36,
          color: '#fff',
          cursor: 'pointer',
          ':hover': {
            background: 'rgba(255,255,255,0.3)',
            transition: 'background-color 200ms linear',
          },
        }}
        onClick={onClose}
      >
        <CloseIcon />
      </div>
    </div>
  );
};

export default PreviewModal;
