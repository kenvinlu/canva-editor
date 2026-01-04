import React, { useCallback, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useEditor } from 'canva-editor/hooks';
import { Delta, ImageData, SearchResponse } from 'canva-editor/types';
import useMobileDetect from 'canva-editor/hooks/useMobileDetect';
import Draggable from 'canva-editor/layers/core/Dragable';
import HorizontalCarousel from 'canva-editor/components/carousel/HorizontalCarousel';
import OutlineButton from 'canva-editor/components/button/OutlineButton';
import { getBestImageFormat } from 'canva-editor/utils/image';
import ImageSearchBox from '../ImageSearchBox';

interface Image {
  img: ImageData;
}
function ImageCollectionTab({ onClose }: { onClose: () => void }) {
  const [images, setImages] = useState<Image[]>([]);
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
      const res: any = await axios.get<SearchResponse<Image>>(
        `${config.apis.url}${config.apis.searchImages}?ps=18&pi=${offset}&kw=${kw}`
      );
      if (res.data.data) {
        setImages((images) => [...images, ...res.data.data]);
      }
      setIsLoading(false);
      if (res.data.data.length > 0) {
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
        overflowY: 'hidden',
        display: 'flex',
      }}
    >
      <ImageSearchBox searchString={keyword} onStartSearch={handleSearch} />
      <div css={{ paddingTop: 8, marginBottom: 8 }}>
        <HorizontalCarousel>
          {config.imageKeywordSuggestions &&
            config.imageKeywordSuggestions.split(',').map((kw) => (
              <div key={kw} className="carousel-item">
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
      <div
        ref={scrollRef}
        css={{
          flex: 1, height: '100%',
          overflowY: 'auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(3,minmax(0,1fr))',
          gridGap: 8,
          boxSizing: 'border-box',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {images.map((item, idx) => (
          <Draggable
            key={idx}
            onDrop={(pos) => {
              if (pos) {
                addImage(
                  item?.img?.url,
                  getBestImageFormat(item?.img).url,
                  pos
                );
              }
            }}
            onClick={() => {
              addImage(item?.img?.url, getBestImageFormat(item?.img).url);
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
                src={item?.img?.url}
                width={item?.img?.width}
                height={item?.img?.height}
                loading="lazy"
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
  );
}

export default ImageCollectionTab;
