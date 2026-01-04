import { useSelectedLayers, useEditor } from 'canva-editor/hooks';
import { boundingRect } from 'canva-editor/utils/2d/boundingRect';
import { isGroupLayer } from 'canva-editor/utils/layer/layers';
import React, { Fragment, useContext, useMemo, useRef } from 'react';
import { duplicate } from 'canva-editor/utils/menu/actions/duplicate';
import { PageContext } from '../core/PageContext';
import DuplicateIcon from 'canva-editor/icons/DuplicateIcon';
import TrashIcon from 'canva-editor/icons/TrashIcon';
import MoreHorizIcon from 'canva-editor/icons/MoreHorizIcon';
import LockIcon from 'canva-editor/icons/LockIcon';

const Toolbar = () => {
  const { pageIndex } = useContext(PageContext);
  const toolbarRef = useRef<HTMLDivElement>(null);
  const { selectedLayerIds, selectedLayers } = useSelectedLayers();
  const {
    actions,
    state,
    isDragging,
    isResizing,
    isRotating,
    controlBox,
    pageSize,
    isOpenMenu,
    scale,
    isPageLocked,
  } = useEditor((state) => ({
    isGroup: state.selectedLayers[state.activePage].length > 1,
    isDragging: state.dragData.status,
    isResizing: state.resizeData.status,
    isRotating: state.rotateData.status,
    controlBox: state.controlBox,
    pageSize: state.pageSize,
    isPageLocked: state.pages[state.activePage].layers.ROOT.data.locked,
    isOpenMenu: !!state.openMenu,
    scale: state.scale,
  }));
  const isLocked = selectedLayers.find((i) => i.data.locked);
  const boundingBoxRect = useMemo(() => {
    if (!controlBox) {
      return {
        x: 0,
        y: 80,
        width: pageSize.width,
        height: pageSize.height,
      };
    }
    return boundingRect(
      controlBox.boxSize,
      controlBox.position,
      controlBox.rotate
    );
  }, [controlBox]);
  const handleDuplicate = () => {
    duplicate(state, { pageIndex, layerIds: selectedLayerIds, actions });
  };
  const showContextMenu = () => {
    if (isOpenMenu) {
      actions.hideContextMenu();
    } else {
      const rect = toolbarRef.current?.getBoundingClientRect() as DOMRect;
      actions.showContextMenu({
        clientX: rect.right - 42,
        clientY: rect.bottom + 4,
      });
    }
  };

  const handleUngroup = () => {
    if (selectedLayerIds.length === 1) {
      actions.ungroup(selectedLayerIds[0]);
    }
  };

  const handleGroup = () => {
    actions.group(selectedLayerIds);
  };
  if (
    isDragging ||
    isResizing ||
    isRotating ||
    (selectedLayerIds.includes('ROOT') && !isLocked && !isPageLocked) ||
    !controlBox
  ) {
    return null;
  }
  const containerGroupLayer = !!selectedLayers.find((l) => isGroupLayer(l));
  return (
    <div
      ref={toolbarRef}
      css={{
        position: 'absolute',
        left: (boundingBoxRect.x + boundingBoxRect.width / 2) * scale,
        top: boundingBoxRect.y * scale - 60,
        transform: 'translateX(-50%)',
      }}
    >
      <div
        css={{
          height: 40,
          borderRadius: 4,
          padding: '0 4px',
          display: 'inline-flex',
          alignItems: 'center',
          background: '#fff',
          boxShadow:
            '0 0 0 1px rgba(64,87,109,.07),0 2px 12px rgba(53,71,90,.2)',
          overflow: 'hidden',
          pointerEvents: 'auto',
          color: '#0d1216',
        }}
        onMouseDown={(e) => {
          e.stopPropagation();
        }}
      >
        <div
          css={{
            alignItems: 'center',
            display: 'flex',
            whiteSpace: 'nowrap',
          }}
        >
          {!isPageLocked && !isLocked && !selectedLayerIds.includes('ROOT') && (
            <Fragment>
              {selectedLayerIds.length > 1 && (
                <div
                  css={{
                    lineHeight: '32px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    cursor: 'pointer',
                    fontSize: 14,
                    padding: '0 8px',
                    fontWeight: 700,
                    ':hover': {
                      backgroundColor: 'rgba(64,87,109,.07)',
                    },
                  }}
                  onClick={handleGroup}
                >
                  Group
                </div>
              )}
              {containerGroupLayer && (
                <div
                  css={{
                    lineHeight: '32px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    cursor: 'pointer',
                    fontSize: 14,
                    padding: '0 8px',
                    fontWeight: 700,
                    ':hover': {
                      backgroundColor: 'rgba(64,87,109,.07)',
                    },
                  }}
                  onClick={handleUngroup}
                >
                  Ungroup
                </div>
              )}
              <div
                css={{
                  width: 32,
                  height: 32,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  cursor: 'pointer',
                  fontSize: 24,
                  ':hover': {
                    backgroundColor: 'rgba(64,87,109,.07)',
                  },
                }}
                onClick={handleDuplicate}
              >
                <DuplicateIcon />
              </div>

              <div
                css={{
                  width: 32,
                  height: 32,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  cursor: 'pointer',
                  fontSize: 24,
                  ':hover': {
                    backgroundColor: 'rgba(64,87,109,.07)',
                  },
                }}
                onClick={() => actions.deleteLayer(pageIndex, selectedLayerIds)}
              >
                <TrashIcon />
              </div>

              <div
                css={{
                  width: 32,
                  height: 32,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  cursor: 'pointer',
                  fontSize: 24,
                  ':hover': {
                    backgroundColor: 'rgba(64,87,109,.07)',
                  },
                }}
                onClick={showContextMenu}
              >
                <MoreHorizIcon />
              </div>
            </Fragment>
          )}
          {(isLocked || isPageLocked) && (
            <div
              css={{
                width: 32,
                height: 32,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                cursor: 'pointer',
                fontSize: 24,
                color: isPageLocked ? 'rgba(36,49,61,.4)' : undefined,
                ':hover': {
                  backgroundColor: isPageLocked
                    ? undefined
                    : 'rgba(64,87,109,.07)',
                },
              }}
              onClick={() => {
                actions.unlock(pageIndex, selectedLayerIds);
              }}
            >
              <LockIcon />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default React.memo(Toolbar);
