import { FC, useCallback, useEffect, useState } from 'react';
import Page from './Page';
import { useEditor } from '../../hooks';
import { useUsedFont } from '../../hooks/useUsedFont';
import { GlobalStyle } from 'canva-editor/layers';
import ArrowBackIcon from 'canva-editor/icons/ArrowBackIcon';
import ArrowForwardIcon from 'canva-editor/icons/ArrowForwardIcon';
import { SerializedPage } from 'canva-editor/types';
import { unpack } from 'canva-editor/utils/minifier';

type Interval = ReturnType<typeof setTimeout>;
let timeout: Interval;

interface Props {
  onClose?: () => void;
  slideMode?: boolean;
  data?: any;
}
const Preview: FC<Props> = ({ onClose, data, slideMode = true }) => {
  const { pages, pageSize, actions } = useEditor((state) => ({
    pages: state.pages,
    pageSize: state.pageSize,
  }));

  useEffect(() => {
    if (!data) return;
    const serializedData: SerializedPage[] = unpack(data);
    actions.setData(serializedData);
  }, [data, actions]);

  const [activeSlide, setActiveSlide] = useState(0);
  const [size, setSize] = useState({ width: 0, height: 0, scale: 1 });
  const { usedFonts } = useUsedFont();
  const moveSlide = useCallback(
    (number: number) => {
      if (!slideMode || pages.length <= 1) return;
      setActiveSlide((prevState) => {
        const value = (prevState + number) % pages.length;
        if (value >= 0) {
          return value;
        } else {
          return pages.length + value;
        }
      });
    },
    [setActiveSlide, pages.length, slideMode]
  );
  useEffect(() => {
    timeout = setTimeout(() => {
      moveSlide(1);
    }, 5000);
    return () => {
      clearTimeout(timeout);
    };
  }, [moveSlide, activeSlide]);

  useEffect(() => {
    const updateSize = () => {
      const { clientWidth, clientHeight } = window.document.body;
      const ratio = clientWidth / clientHeight;
      const pageRatio = pageSize.width / pageSize.height;
      if (ratio > pageRatio) {
        const w = clientHeight * pageRatio;
        setSize({
          width: w,
          height: clientHeight,
          scale: w / pageSize.width,
        });
      } else {
        const w = clientWidth;
        const h = w / pageRatio;
        setSize({
          width: w,
          height: h,
          scale: w / pageSize.width,
        });
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => {
      window.removeEventListener('resize', updateSize);
    };
  }, [pageSize]);

  useEffect(() => {
    const callback = (event: KeyboardEvent) => {
      if (event.code === 'ArrowRight') {
        if (pages.length > 1) moveSlide(1);
      } else if (event.code === 'ArrowLeft') {
        if (pages.length > 1) moveSlide(-1);
      } else if (event.code === 'Escape') {
        if (onClose) onClose();
      }
    };
    document.addEventListener('keydown', callback);
    return () => {
      document.removeEventListener('keydown', callback);
    };
  }, [onClose, pages.length, moveSlide]);

  if (size.width === 0) {
    return null;
  }

  return (
    <div
      css={{
        position: 'relative',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <GlobalStyle fonts={usedFonts} />
      {slideMode && pages.length > 1 && (
        <>
          <div
            css={{
              position: 'absolute',
              top: '50%',
              transform: 'translate(0, -50%)',
              left: '16px',
              zIndex: 1050,
            }}
          >
            <div
              css={{
                border: '1px solid #fff',
                background: 'transparent',
                width: 60,
                height: 60,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 32,
                color: '#fff',
                borderRadius: '50%',
                cursor: 'pointer',
                ':hover': {
                  background: 'rgba(255,255,255,0.3)',
                  transition: 'background-color 200ms linear',
                },
              }}
              onClick={() => moveSlide(-1)}
            >
              <ArrowBackIcon />
            </div>
          </div>
          <div
            css={{
              position: 'absolute',
              top: '50%',
              transform: 'translate(0, -50%)',
              right: '16px',
              zIndex: 1050,
            }}
          >
            <div
              css={{
                border: '1px solid #fff',
                background: 'transparent',
                width: 60,
                height: 60,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 32,
                color: '#fff',
                borderRadius: '50%',
                cursor: 'pointer',
                ':hover': {
                  background: 'rgba(255,255,255,0.3)',
                  transition: 'background-color 200ms linear',
                },
              }}
              onClick={() => moveSlide(1)}
            >
              <ArrowForwardIcon />
            </div>
          </div>
        </>
      )}
      <div css={{ width: size.width, height: size.height }}>
        <div css={{ position: 'relative' }}>
          {pages.map((_, index) => (
            <div key={index}>
              <Page
                pageIndex={index}
                width={pageSize.width}
                height={pageSize.height}
                scale={size.scale}
                isActive={activeSlide === index}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Preview;
