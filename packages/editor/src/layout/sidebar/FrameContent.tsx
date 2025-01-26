import { FC, useCallback, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useEditor } from 'canva-editor/hooks';
import Draggable from 'canva-editor/layers/core/Dragable';
import { Delta } from 'canva-editor/types';
import CloseSidebarButton from './CloseButton';
import FrameSearchBox from './components/FrameSearchBox';
import useMobileDetect from 'canva-editor/hooks/useMobileDetect';

interface Frame {
  img: string;
  desc: string;
  clipPath: string;
  width: number;
  height: number;
}
const FrameContent: FC<{ onClose: () => void }> = ({ onClose }) => {
  const [frames, setFrames] = useState<Frame[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { actions, query, config } = useEditor();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);
  const dataRef = useRef(false);
  const [keyword, setKeyword] = useState('');
  const isMobile = useMobileDetect();

  const loadData = useCallback(
    async (offset = 0, kw = '') => {
      dataRef.current = true;
      setIsLoading(true);
      const res: any = await axios.get<Frame[]>(
        `${config.apis.url}${config.apis.searchFrames}?ps=18&pi=${offset}&kw=${kw}`
      );
      setFrames((frames) => [...frames, ...res.data]);
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
    setFrames([]);
  };
  const addFrame = async (frame: Frame, position?: Delta) => {
    const pageSize = query.getPageSize();
    const pageRatio = pageSize.width / pageSize.height;
    const frameRatio = frame.width / frame.height;
    const scale =
      pageRatio > frameRatio
        ? (pageSize.height * 0.5) / frame.height
        : (pageSize.width * 0.5) / frame.width;

    actions.addFrameLayer({
      type: {
        resolvedName: 'FrameLayer',
      },
      props: {
        position,
        boxSize: {
          width: frame.width * scale,
          height: frame.height * scale,
        },
        rotate: 0,
        clipPath: `path("${frame.clipPath}")`,
        scale,
        image: {
          boxSize: {
            width: frame.width,
            height: frame.height,
          },
          position: {
            x: 0,
            y: 0,
          },
          rotate: 0,
          thumb: frame.img,
          url: frame.img,
        },
      },
    });
    if (isMobile) {
      onClose();
    }
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
      <div
        css={{
          marginBottom: 16,
        }}
      >
        <FrameSearchBox onStartSearch={handleSearch} />
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
          {frames.map((frame, index) => (
            <Draggable
              key={index}
              onDrop={(pos) => {
                if (pos) {
                  addFrame(frame, pos);
                }
              }}
              onClick={() => {
                addFrame(frame);
              }}
            >
              <div css={{ cursor: 'pointer', position: 'relative' }}>
                <div css={{ paddingBottom: '100%' }} />
                <div
                  css={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    height: '100%',
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <img
                    src={frame.img}
                    css={{
                      maxHeight: '100%',
                      maxWidth: '100%',
                    }}
                  />
                </div>
              </div>
            </Draggable>
          ))}
          {isLoading && <div>Loading...</div>}
        </div>
      </div>
    </div>
  );
};

export default FrameContent;
