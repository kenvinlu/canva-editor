import React, { FC } from 'react';
import { SortableContainer, SortableElement } from 'canva-editor/drag-and-drop';
import { Layer, LayerComponentProps } from 'canva-editor/types';
import { isGroupLayer } from 'canva-editor/utils/layer/layers';
import MoreVertIcon from 'canva-editor/icons/MoreVertIcon';
import MoreHorizIcon from 'canva-editor/icons/MoreHorizIcon';
import GroupingIcon from 'canva-editor/icons/GroupingIcon';
import styled from 'styled-components';
import ReverseTransformLayer from './ReverseTransformLayer';
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
  React.forwardRef<HTMLLIElement, {
    item?: Layer<LayerComponentProps> | any;
    index?: number;
    isSelected?: number;
    onSelectLayer: () => void;
    onOpenContextMenu: (e: React.MouseEvent) => void;
  }>(({
    item,
    isSelected,
    onSelectLayer,
    onOpenContextMenu,
  }, ref) => {
    return (
      <li ref={ref} css={{ listStyle: 'none' }}>
        <LayerItem
          key={item.id}
          type="button"
          css={{
            borderColor: isSelected ? '#3d8eff' : 'transparent',
          }}
          onContextMenu={onOpenContextMenu}
          onMouseDown={(e) => {
            const target = e.target as HTMLElement;
            
            // Don't interfere if clicking on drag icon - let drag handle it
            if (target.closest('.drag-icon')) {
              return;
            }
            
            // Track mouse position and time for click vs drag detection
            const startX = e.clientX;
            const startY = e.clientY;
            const startTime = Date.now();
            let hasMoved = false;
            let clickHandled = false;
            
            const handleMouseMove = (moveEvent: MouseEvent) => {
              const moved = Math.abs(moveEvent.clientX - startX) > 5 || 
                           Math.abs(moveEvent.clientY - startY) > 5;
              if (moved) {
                hasMoved = true;
                // If moved, it's a drag - let the drag library handle it
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
              }
            };
            
            const handleMouseUp = (upEvent: MouseEvent) => {
              const timeElapsed = Date.now() - startTime;
              const moved = Math.abs(upEvent.clientX - startX) > 5 || 
                           Math.abs(upEvent.clientY - startY) > 5;
              
              // If it was a quick click without movement, select
              if (!hasMoved && !moved && timeElapsed < 300 && !clickHandled) {
                clickHandled = true;
                onSelectLayer();
              }
              
              document.removeEventListener('mousemove', handleMouseMove);
              document.removeEventListener('mouseup', handleMouseUp);
            };
            
            // Listen for mouse movement and release
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
            
            // Also allow drag to start after a short delay (click and hold)
            // The drag library will handle this via its own mousedown handler
          }}
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
  })
);

const SortableList = SortableContainer(
  React.forwardRef<HTMLUListElement, LayerSortableType>(
    ({
      items,
      checkIsSelected,
      onOpenContextMenu,
      onSelectLayer,
    }, ref) => {
      if (!items || !Array.isArray(items)) {
        return <ul ref={ref}></ul>;
      }
      
      return (
        <ul ref={ref}>
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
  )
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
