import { SortableContainer, SortableElement } from 'canva-editor/drag-and-drop';
import { Layer, LayerComponentProps } from 'canva-editor/types';
import { isGroupLayer } from 'canva-editor/utils/layer/layers';
import MoreVertIcon from 'canva-editor/icons/MoreVertIcon';
import MoreHorizIcon from 'canva-editor/icons/MoreHorizIcon';
import GroupingIcon from 'canva-editor/icons/GroupingIcon';
import styled from '@emotion/styled';
import ReverseTransformLayer from './ReverseTransformLayer';
import { FC } from 'react';
import { SortEnd } from 'canva-editor/drag-and-drop/types';

type LayerSortableType = {
  items?: Array<Layer<LayerComponentProps>> | any;
  checkIsSelected: (layerId: string) => boolean;
  onSelectLayer: (layerId: string) => void;
  onOpenContextMenu: (e: React.MouseEvent) => void;
  onChange: (change: {
    layerId: string;
    fromIndex: number;
    toIndex: number;
  }) => void;
};

const LayerItem = styled('button')`
  width: 100%;
  background: #f6f6f6;
  border-radius: 8px;
  padding: 8px;
  margin: 4px 0;
  cursor: pointer;
  border-width: 2px;
  border-style: solid;
  position: relative;

  .drag-icon: {
    font-size: 24px;
    width: 40px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-shrink: 0;
  }

  .more-btn {
    display: none;
    position: absolute;
    right: 4px;
    top: 4px;
    background: #5e6278;
    border-radius: 8px;
    color: #fff;
    padding: 0 6px;
    @media (max-width: 900px) {
      display: none!important;
    }
  }
  :hover .more-btn {
    display: block;
  }
`;

const SortableItem = SortableElement(
  ({
    item,
    isSelected,
    onSelectLayer,
    onOpenContextMenu,
  }: {
    item?: Layer<LayerComponentProps> | any;
    index?: number;
    isSelected?: number;
    onSelectLayer: () => void;
    onOpenContextMenu: (e: React.MouseEvent) => void;
  }): JSX.Element => {
    return (
      <li css={{ listStyle: 'none' }}>
        <LayerItem
          key={item.id}
          css={{
            borderColor: isSelected ? '#3d8eff' : 'transparent',
          }}
          onContextMenu={onOpenContextMenu}
          onMouseDown={onSelectLayer}
        >
          <div
            css={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <div className='drag-icon'>
              <MoreVertIcon />
            </div>
            <div css={{ minWidth: 0, flexGrow: 1 }}>
              <ReverseTransformLayer layer={item} />
            </div>
            {isGroupLayer(item) && (
              <div css={{ flexShrink: 0, fontSize: 24 }}>
                <GroupingIcon />
              </div>
            )}
          </div>
          <div className='more-btn' onMouseDown={onOpenContextMenu}>
            <MoreHorizIcon style={{ width: 16, height: 16 }} />
          </div>
        </LayerItem>
      </li>
    );
  }
);

const SortableList = SortableContainer(
  ({
    items,
    checkIsSelected,
    onOpenContextMenu,
    onSelectLayer,
  }: LayerSortableType) => {
    return (
      <ul>
        {items.map((layer: Layer<LayerComponentProps>, index: number) => (
          <SortableItem
            key={`item-${index}`}
            item={layer}
            isSelected={checkIsSelected(layer.id)}
            onSelectLayer={() => onSelectLayer(layer.id)}
            onOpenContextMenu={onOpenContextMenu}
            index={index}
          />
        ))}
      </ul>
    );
  }
);

const SortableListLayer: FC<LayerSortableType> = ({
  items,
  checkIsSelected,
  onSelectLayer,
  onOpenContextMenu,
  onChange,
}) => {
  return (
    <SortableList
      items={items}
      checkIsSelected={checkIsSelected}
      onSelectLayer={onSelectLayer}
      onOpenContextMenu={onOpenContextMenu}
      onSortEnd={(change: SortEnd) => {
        if (change?.newIndex !== change.oldIndex) {
          onChange({
            layerId: items[change.oldIndex].id,
            fromIndex: change.oldIndex,
            toIndex: change.newIndex,
          });
        }
      }}
    />
  );
};

export default SortableListLayer;
