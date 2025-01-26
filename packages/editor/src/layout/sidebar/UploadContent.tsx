import { ChangeEvent, FC, useRef, useState } from 'react';
import { useEditor } from 'canva-editor/hooks';
import CloseSidebarButton from './CloseButton';
import Button from 'canva-editor/components/button/Button';
import useMobileDetect from 'canva-editor/hooks/useMobileDetect';

interface UploadContentProps {
  visibility: boolean;
  onClose: () => void;
}
const UploadContent: FC<UploadContentProps> = ({ visibility, onClose }) => {
  const inputFileRef = useRef<HTMLInputElement>(null);
  const { actions } = useEditor();
  const isMobile = useMobileDetect();

  const [images, setImages] = useState<
    { url: string; type: 'svg' | 'image' }[]
  >([]);
  const addImage = async (url: string) => {
    const img = new Image();
    img.onerror = (err) => window.alert(err);
    img.src = url;
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      actions.addImageLayer(
        { url, thumb: url },
        { width: img.naturalWidth, height: img.naturalHeight }
      );
      if (isMobile) {
        onClose();
      }
    };
  };
  const handleUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages((prevState) => {
          return prevState.concat([
            { url: reader.result as string, type: 'image' },
          ]);
        });
      };
      reader.readAsDataURL(file);
    }
  };
  return (
    <div
      css={{
        width: '100%',
        height: '100%',
        flexDirection: 'column',
        overflowY: 'auto',
        display: visibility ? 'flex' : 'none',
      }}
    >
      {!isMobile && <CloseSidebarButton onClose={onClose} />}
      <div
        css={{
          margin: 16,
        }}
      >
        <Button
          css={{ width: '100%' }}
          onClick={() => inputFileRef.current?.click()}
        >
          Upload
        </Button>
      </div>
      <input
        ref={inputFileRef}
        type={'file'}
        accept='image/*'
        css={{ display: 'none' }}
        onChange={handleUpload}
      />
      <div css={{ padding: '16px' }}>
        <div
          css={{
            flexGrow: 1,
            overflowY: 'auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(2,minmax(0,1fr))',
            gridGap: 8,
          }}
        >
          {images.map((item, idx) => (
            <div
              key={idx}
              css={{ cursor: 'pointer', position: 'relative' }}
              onClick={() => addImage(item.url)}
            >
              <div css={{ paddingBottom: '100%', height: 0 }} />
              <div
                css={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <img
                  src={item.url}
                  loading='lazy'
                  css={{ maxHeight: '100%' }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UploadContent;
