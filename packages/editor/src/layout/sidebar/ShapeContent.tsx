import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { Delta } from 'canva-editor/types';
import { useEditor } from 'canva-editor/hooks';
import Draggable from 'canva-editor/layers/core/Dragable';
import CloseSidebarButton from './CloseButton';
import ShapeSearchBox from './components/ShapeSearchBox';
import axios from 'axios';
import useMobileDetect from 'canva-editor/hooks/useMobileDetect';

type Shape = {
  img: string;
  desc: string;
  clipPath: string;
  width: number;
  height: number;
  background: string;
};
const ShapeContent: FC<{ onClose: () => void }> = ({ onClose }) => {
  const { actions, query, config } = useEditor();
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);
  const dataRef = useRef(false);
  const [keyword, setKeyword] = useState('');
  const isMobile = useMobileDetect();

  const loadData = useCallback(
    async (offset = 0, kw = '') => {
      dataRef.current = true;
      setIsLoading(true);
      const res: any = await axios.get<Shape[]>(
        `${config.apis.url}${config.apis.searchShapes}?ps=40&pi=${offset}&kw=${kw}`
      );
      setShapes((shapes) => [...shapes, ...res.data]);
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
    setShapes([]);
  };
  const addShape = (shape: Shape, position?: Delta) => {
    const pageSize = query.getPageSize();
    const pageRatio = pageSize.width / pageSize.height;
    const frameRatio = shape.width / shape.height;
    const scale =
      pageRatio > frameRatio
        ? (pageSize.height * 0.5) / shape.height
        : (pageSize.width * 0.5) / shape.width;

    actions.addShapeLayer({
      type: {
        resolvedName: 'ShapeLayer',
      },
      props: {
        position,
        boxSize: {
          width: shape.width * scale,
          height: shape.height * scale,
        },
        rotate: 0,
        clipPath: shape.clipPath,
        scale,
        color: shape.background,
        shapeSize: {
          width: shape.width,
          height: shape.height
        }
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
        <ShapeSearchBox onStartSearch={handleSearch} />
      </div>
      <div css={{ flexDirection: 'column', overflowY: 'auto', display: 'flex' }}>
        <div
          ref={scrollRef}
          css={{
            flexGrow: 1,
            overflowY: 'auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(4,minmax(0,1fr))',
            gridGap: 8,
          }}
        >
          {shapes.map((shape, index) => (
            <Draggable
              key={index}
              onDrop={(pos) => {
                if (pos) {
                  addShape(shape, pos);
                }
              }}
              onClick={() => {
                addShape(shape);
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
                    src={shape.img}
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

export default ShapeContent;
