import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useEditor } from 'canva-editor/hooks';
import Draggable from 'canva-editor/layers/core/Dragable';
import { Delta } from 'canva-editor/types';
import CloseSidebarButton from './CloseButton';
import ImageSearchBox from './components/ImageSearchBox';
import HorizontalCarousel from 'canva-editor/components/carousel/HorizontalCarousel';
import OutlineButton from 'canva-editor/components/button/OutlineButton';
import useMobileDetect from 'canva-editor/hooks/useMobileDetect';

const ImageContent: FC<{ onClose: () => void }> = ({ onClose }) => {
  const [images, setImages] = useState<{ img: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { actions, config } = useEditor();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);
  const dataRef = useRef(false);
  const [keyword, setKeyword] = useState('');
  const isMobile = useMobileDetect();

  const loadData = useCallback(
    async (offset = 0, kw = '') => {
      dataRef.current = true;
      setIsLoading(true);
      const res: any = await axios.get(`${config.apis.url}${config.apis.searchImages}?ps=18&pi=${offset}&kw=${kw}`);
      setImages((frames) => [...frames, ...res.data]);
      setIsLoading(false);
      if (res.data.length > 0) {
        dataRef.current = false;
      }
    },
    [setIsLoading]
  );

  useEffect(() => {
    loadData(offset, keyword);
  }, [offset, keyword]);

  useEffect(() => {
    const handleLoadMore = async (e: Event) => {
      const node = e.target as HTMLDivElement;
      if (
        node.scrollHeight - node.scrollTop - 80 <= node.clientHeight &&
        !dataRef.current
      ) {
        setOffset((prevOffset) => prevOffset + 1);
      }
    };

    scrollRef.current?.addEventListener('scroll', handleLoadMore);
    return () => {
      scrollRef.current?.removeEventListener('scroll', handleLoadMore);
    };
  }, [loadData]);

  const handleSearch = async (kw: string) => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
    setOffset(0);
    setKeyword(kw);
    setImages([]);
  };

  const addImage = async (thumb: string, url: string, position?: Delta) => {
    const img = new Image();
    img.onerror = (err) => {
      console.error(err);
    };
    img.src = url;
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      actions.addImageLayer(
        { thumb, url, position },
        { width: img.naturalWidth, height: img.naturalHeight }
      );
      if (isMobile) {
        onClose();
      }
    };
  };

  return (
    <div
      css={{
        width: '100%',
        height: '100%',
        flexDirection: 'column',
        overflowY: 'auto',
        display: 'flex',
        padding: 16,
      }}
    >
      {!isMobile && <CloseSidebarButton onClose={onClose} />}
      <div>
        <ImageSearchBox searchString={keyword} onStartSearch={handleSearch} />
        <div css={{ paddingTop: 8 }}>
          <HorizontalCarousel>
            {config.imageKeywordSuggestions && config.imageKeywordSuggestions.split(',').map((kw) => (
              <div key={kw} className='carousel-item'>
                <OutlineButton
                  onClick={() => {
                    setKeyword(kw);
                    handleSearch(kw);
                  }}
                >
                  {kw}
                </OutlineButton>
              </div>
            ))}
          </HorizontalCarousel>
        </div>
      </div>
      <div
        css={{ flexDirection: 'column', overflowY: 'auto', display: 'flex' }}
      >
        <div
          ref={scrollRef}
          css={{
            flexGrow: 1,
            overflowY: 'auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(3,minmax(0,1fr))',
            gridGap: 8,
          }}
        >
          {images.map((item, idx) => (
            <Draggable
              key={idx}
              onDrop={(pos) => {
                if (pos) {
                  addImage(item.img, item.img, pos);
                }
              }}
              onClick={() => {
                addImage(item.img, item.img);
              }}
            >
              <div
                css={{
                  cursor: 'pointer',
                  position: 'relative',
                  paddingBottom: '100%',
                  width: '100%',
                }}
              >
                <img
                  src={item.img}
                  loading='lazy'
                  css={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    height: '100%',
                    width: '100%',
                    objectFit: 'cover',
                  }}
                />
              </div>
            </Draggable>
          ))}
          {isLoading && <div>Loading...</div>}
        </div>
      </div>
    </div>
  );
};

export default ImageContent;
