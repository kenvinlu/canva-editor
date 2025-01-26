import { SortableContainer, SortableElement } from 'canva-editor/drag-and-drop';
import { PageSize, Page as PageType } from 'canva-editor/types';
import { FC } from 'react';
import { SortEnd } from 'canva-editor/drag-and-drop/types';
import { PageGridItem, PageGridItemContainer } from './PageGridView';
import Page from 'canva-editor/components/editor/Page';
import EditInlineInput from 'canva-editor/components/EditInlineInput';
import EditorButton from 'canva-editor/components/EditorButton';
import PlusIcon from 'canva-editor/icons/PlusIcon';
import useMobileDetect from 'canva-editor/hooks/useMobileDetect';

type PageSortableType = {
  items?: Array<PageType> | any;
  containerRef: React.MutableRefObject<null>;
  newItemIndex: number;
  activePage: number;
  scale: number;
  pageSize: PageSize;
  itemSize: PageSize;
  onSetText: (txt: string) => void;
  onChangePage: (index: number) => void;
  onAddNewPage: (index: number) => void;
  onDoubleClick: (index: number) => void;
  onChange: (change: { fromIndex: number; toIndex: number }) => void;
};

const SortableItem = SortableElement(
  ({
    item,
    containerRef,
    idx,
    newItemIndex,
    scale,
    activePage,
    pageSize,
    itemSize,
    onSetText,
    onChangePage,
    onAddNewPage,
    onDoubleClick
  }: {
    containerRef: React.MutableRefObject<null>;
    item: PageType;
    idx: number;
    newItemIndex: number;
    activePage: number;
    scale: number;
    pageSize: PageSize;
    itemSize: PageSize;
    onSetText: (txt: string) => void;
    onChangePage: (index: number) => void;
    onAddNewPage: (index: number) => void;
    onDoubleClick: (index: number) => void;
  }): JSX.Element => {
    return (
      <li css={{ float: 'left', listStyle: 'none' }}>
        <PageGridItemContainer
          key={idx}
          className={activePage === idx ? 'is-active' : ''}
        >
          <PageGridItem
            ref={containerRef}
            className='page-btn'
            isNew={idx === newItemIndex}
            onClick={() => onChangePage(idx)}
            onDoubleClick={() => onDoubleClick(idx)}
          >
            <div
              css={{
                position: 'relative',
                height: itemSize.height,
              }}
            >
              <Page
                pageIndex={idx}
                width={pageSize.width}
                height={pageSize.height}
                scale={scale}
                isActive={true}
              />
            </div>
            <div>
              <span css={{ whiteSpace: 'nowrap' }}>
                {idx + 1} &#8226;&nbsp;
              </span>
              <div css={{ width: '96%' }}>
                <EditInlineInput
                  text={item.name}
                  placeholder='Add page title'
                  onSetText={onSetText}
                />
              </div>
            </div>
          </PageGridItem>
          <EditorButton
            className='add-btn'
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onAddNewPage(idx);
            }}
          >
            <PlusIcon />
          </EditorButton>
        </PageGridItemContainer>
      </li>
    );
  }
);

const SortableList = SortableContainer(
  ({
    items,
    containerRef,
    newItemIndex,
    scale,
    activePage,
    pageSize,
    itemSize,
    onSetText,
    onChangePage,
    onAddNewPage,
    onDoubleClick
  }: PageSortableType) => {
    const isMobile = useMobileDetect();
    return (
      <div
        css={{
          display: 'grid',
          gridTemplateColumns: `repeat(auto-fill, ${
            isMobile ? 'minmax(120px, .5fr)' : 'minmax(217px, 1fr)'
          })`,
          gap: 10,
          position: 'relative',
        }}
      >
        {items.map((page: PageType, index: number) => (
          <SortableItem
            key={`page-${index}`}
            containerRef={containerRef}
            item={page}
            idx={index}
            index={index}
            activePage={activePage}
            scale={scale}
            newItemIndex={newItemIndex}
            pageSize={pageSize}
            itemSize={itemSize}
            onSetText={onSetText}
            onChangePage={onChangePage}
            onAddNewPage={onAddNewPage}
            onDoubleClick={onDoubleClick}
          />
        ))}
      </div>
    );
  }
);

const SortablePageSettings: FC<PageSortableType> = ({
  items,
  containerRef,
  newItemIndex,
  scale,
  activePage,
  pageSize,
  itemSize,
  onSetText,
  onChangePage,
  onAddNewPage,
  onDoubleClick,
  onChange,
}) => {
  return (
    <SortableList
      items={items}
      containerRef={containerRef}
      activePage={activePage}
      scale={scale}
      newItemIndex={newItemIndex}
      pageSize={pageSize}
      itemSize={itemSize}
      onSetText={onSetText}
      onChangePage={onChangePage}
      onAddNewPage={onAddNewPage}
      onDoubleClick={onDoubleClick}
      axis='xy'
      pressDelay={120}
      onSortEnd={(change: SortEnd) => {
        if (change?.newIndex !== change.oldIndex) {
          onChange({
            fromIndex: change.oldIndex,
            toIndex: change.newIndex,
          });
          onChangePage(change.newIndex);
        }
      }}
    />
  );
};

export default SortablePageSettings;
