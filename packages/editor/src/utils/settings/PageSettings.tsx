import { FC, useEffect, useRef, useState } from 'react';
import { useEditor } from 'canva-editor/hooks';
import DuplicateIcon from 'canva-editor/icons/DuplicateIcon';
import TrashIcon from 'canva-editor/icons/TrashIcon';
import AddNewPageIcon from 'canva-editor/icons/AddNewPageIcon';
import SortablePageSettings from './SortablePageSettings';
import { cloneDeep } from 'lodash';
import CloseIcon from 'canva-editor/icons/CloseIcon';

interface PageSettingsProps {
  onChangePage: (pageIndex: number) => void;
}
const PageSettings: FC<PageSettingsProps> = ({ onChangePage }) => {
  const ref = useRef<any>(null);
  const [newItemIndex, setNewItemIndex] = useState(-1);
  const gridItemRef = useRef(null);
  const [itemSize, setItemSize] = useState({ width: 0, height: 0 });
  const [scale, setScale] = useState(1);
  const { actions, pages, pageSize, activePage, isLocked, totalPages } =
    useEditor((state) => {
      return {
        pages: state.pages,
        pageSize: state.pageSize,
        activePage: state.activePage,
        totalPages: state.pages.length,
        isLocked:
          state.pages[state.activePage] &&
          state.pages[state.activePage].layers.ROOT.data.locked,
      };
    });

  const handleAddItem = (index: number) => {
    actions.addPage(index);
    setNewItemIndex(-1);
    setTimeout(() => {
      setNewItemIndex(index + 1);
    });
  };

  useEffect(() => {
    const resizeContent = () => {
      if (gridItemRef.current) {
        const borderWidth = 6; // 3 x 2 sides
        const gridItemWidth =
          (gridItemRef.current as HTMLInputElement).clientWidth - borderWidth;
        const calculatedHeight =
          (gridItemWidth * pageSize.height) / pageSize.width + borderWidth;
        setItemSize({
          width: gridItemWidth,
          height: calculatedHeight,
        });
        setScale(gridItemWidth / pageSize.width);
      }
    };

    resizeContent();

    window.addEventListener('resize', resizeContent);
    return () => window.removeEventListener('resize', resizeContent);
  }, []);

  return (
    <div
      css={{
        top: 0,
        left: 0,
        height: `calc(100% - 40px)`,
        width: '100%',
        position: 'absolute',
        background: '#fff',
        zIndex: 3,
        '@media (max-width: 900px)': {
          height: `calc(100% - 65px)`,
        },
      }}
    >
      <div
        css={{
          display: 'flex',
          alignItems: 'center',
          flexShrink: 0,
          height: 48,
          borderBottom: '1px solid rgba(57,76,96,.15)',
          padding: '0 16px',
        }}
      >
        <div
          css={{
            marginLeft: 8,
            width: 28,
            height: 28,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 4,
            cursor: 'pointer',
            ':hover': {
              background: 'rgba(64, 87, 109, 0.07)',
            },
          }}
          onClick={() => {
            handleAddItem(activePage);
          }}
        >
          <AddNewPageIcon />
        </div>
        <div
          css={{
            marginLeft: 8,
            width: 28,
            height: 28,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 4,
            cursor: 'pointer',
            ':hover': {
              background: 'rgba(64, 87, 109, 0.07)',
            },
          }}
          onClick={() => actions.duplicatePage(activePage)}
        >
          <DuplicateIcon />
        </div>
        <div
          css={{
            marginLeft: 8,
            width: 28,
            height: 28,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 4,
            cursor: isLocked || totalPages <= 1 ? 'not-allowed' : 'pointer',
            color:
              isLocked || totalPages <= 1 ? 'rgba(36,49,61,.4)' : '#0d1216',
            ':hover': {
              background:
                isLocked || totalPages <= 1
                  ? undefined
                  : 'rgba(64, 87, 109, 0.07)',
            },
          }}
          onClick={() =>
            !isLocked && totalPages > 1 && actions.deletePage(activePage)
          }
        >
          <TrashIcon />
        </div>
        <div
            css={{
                fontSize: 20,
                flexShrink: 0,
                width: 32,
                height: 32,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginLeft: 'auto'
            }}
            onClick={() => actions.togglePageSettings()}
        >
            <CloseIcon />
        </div>
      </div>
      <div
        ref={ref}
        css={{
          flexGrow: 1,
          overflowY: 'auto',
          padding: '24px 24px 56px',
          maxHeight: '100%'
        }}
      >
        <SortablePageSettings
          items={cloneDeep(pages)}
          containerRef={gridItemRef}
          activePage={activePage}
          scale={scale}
          newItemIndex={newItemIndex}
          pageSize={pageSize}
          itemSize={itemSize}
          onSetText={(newText) => {
            actions.setPageName(activePage, newText);
          }}
          onChangePage={onChangePage}
          onAddNewPage={handleAddItem}
          onChange={(change) => {
            actions.swapPagePosition(change.fromIndex, change.toIndex);
          }}
          onDoubleClick={() => actions.togglePageSettings()}
        />
      </div>
    </div>
  );
};
export default PageSettings;
