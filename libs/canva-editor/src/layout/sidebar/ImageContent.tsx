import React, { FC } from 'react';
import CloseSidebarButton from './CloseButton';
import useMobileDetect from 'canva-editor/hooks/useMobileDetect';
import Tabs from 'canva-editor/components/tab/Tabs';
import Tab from 'canva-editor/components/tab/Tab';
import ImageCollectionTab from './components/image/ImageCollectionTab';
import UploadContentTab from './components/image/UploadContentTab';
import UnsplashTab from './components/image/UnsplashTab';
import { useTranslate } from 'canva-editor/contexts/TranslationContext';

const ImageContent: FC<{ onClose: () => void }> = ({ onClose }) => {
  const isMobile = useMobileDetect();
  const t = useTranslate();
  return (
    <div
      css={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {!isMobile && <CloseSidebarButton onClose={onClose} />}
      <Tabs>
        <Tab title={t('sidebar.imageCollection', 'Collection')}>
          <ImageCollectionTab onClose={onClose} />
        </Tab>
        <Tab title={t('sidebar.yourUploads', 'Your Uploads')}>
          <UploadContentTab visibility={true} onClose={onClose} />
        </Tab>
        <Tab title="Unsplash">
          <UnsplashTab />
        </Tab>
      </Tabs>
    </div>
  );
};

export default ImageContent;
