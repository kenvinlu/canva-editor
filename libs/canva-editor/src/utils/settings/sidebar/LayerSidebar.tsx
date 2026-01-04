import React, {
  forwardRef,
  ForwardRefRenderFunction,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import reverse from 'lodash/reverse';
import Sidebar, { SidebarProps } from './Sidebar';
import ReverseTransformLayer from './layer/ReverseTransformLayer';
import { useEditor, useSelectedLayers } from 'canva-editor/hooks';
import { getPosition } from 'canva-editor/utils';
import { PageContext } from 'canva-editor/layers/core/PageContext';
import BackgroundSelectionIcon from 'canva-editor/icons/BackgroundSelectionIcon';
import { cloneDeep } from 'lodash';
import SortableListLayer from './layer/SortableListLayer';
import CloseIcon from 'canva-editor/icons/CloseIcon';
import useMobileDetect from 'canva-editor/hooks/useMobileDetect';
import BottomSheet from 'canva-editor/components/bottom-sheet/BottomSheet';

type LayerSidebarProps = SidebarProps;
const LayerSidebar: ForwardRefRenderFunction<
  HTMLDivElement,
  LayerSidebarProps
> = ({ ...props }, ref) => {
  const dataRef = useRef({ isMultipleSelect: false });
  const { selectedLayerIds } = useSelectedLayers();
  const isMobile = useMobileDetect();
  const { layers, actions, activePage } = useEditor((state) => ({
    layers:
      state.pages[state.activePage] && state.pages[state.activePage].layers,
    activePage: state.activePage,
  }));
  const layerList = useMemo(() => {
    if (!layers) {
      return;
    }
    return reverse(layers['ROOT'].data.child.map((layerId) => layers[layerId]));
  }, [layers]);
  const rootLayer = useMemo(() => {
    if (!layers) {
      return;
    }
    return layers.ROOT;
  }, [layers]);
  useEffect(() => {
    const enableMultipleSelect = (e: KeyboardEvent) => {
      dataRef.current.isMultipleSelect = e.shiftKey;
    };
    window.addEventListener('keydown', enableMultipleSelect);
    window.addEventListener('keyup', enableMultipleSelect);
    return () => {
      window.removeEventListener('keydown', enableMultipleSelect);
      window.removeEventListener('keyup', enableMultipleSelect);
    };
  }, []);

  const checkLayerSelected = (layerId: string) => {
    return selectedLayerIds.includes(layerId);
  };

  const onSelectLayer = (layerId: string) => {
    actions.selectLayers(
      activePage,
      layerId,
      dataRef.current.isMultipleSelect ? 'add' : 'replace'
    );
  };

  const handleClickOption = (e: React.MouseEvent) => {
    e.preventDefault();
    actions.showContextMenu(getPosition(e.nativeEvent));
  };

  const handleBringTo = (
    layerId: string,
    fromIndex: number,
    toIndex: number
  ) => {
    if (!layerList) return;
    const indexBeforeReverse = layerList.length - 1 - toIndex;
    if (fromIndex > toIndex) {
      actions.bringToFront(activePage, layerId, indexBeforeReverse);
    } else {
      actions.sendToBack(activePage, layerId, indexBeforeReverse);
    }
  };

  const renderPage = () => (
    <PageContext.Provider value={{ pageIndex: activePage }}>
      <div
        css={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          overflowY: 'auto',
        }}
      >
        <div
          css={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            height: 50,
            borderBottom: '1px solid rgba(57,76,96,.15)',
            padding: '0 20px',
          }}
        >
          <p
            css={{
              lineHeight: '48px',
              fontWeight: 600,
              color: '#181C32',
              flexGrow: 1,
            }}
          >
            Layers
          </p>
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
            }}
            onClick={() => {
              actions.setSidebar();
            }}
          >
            <CloseIcon />
          </div>
        </div>

        <div
          ref={ref}
          css={{
            flexGrow: 1,
            overflowY: 'auto',
          }}
        >
          <div
            css={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0,1fr)',
              gridRowGap: 8,
              padding: 16,
            }}
          >
            <SortableListLayer
              items={cloneDeep(layerList)}
              checkIsSelected={checkLayerSelected}
              onSelectLayer={onSelectLayer}
              onOpenContextMenu={handleClickOption}
              onChange={(change) => {
                handleBringTo(change.layerId, change.fromIndex, change.toIndex);
              }}
            />
            {rootLayer && (
              <div
                css={{
                  background: '#F6F6F6',
                  borderRadius: 8,
                  padding: 8,
                  cursor: 'pointer',
                  position: 'relative',
                  borderWidth: 2,
                  borderStyle: 'solid',
                  borderColor: selectedLayerIds.includes(rootLayer.id)
                    ? '#3d8eff'
                    : 'transparent',
                }}
                onMouseDown={() => {
                  actions.selectLayers(
                    activePage,
                    rootLayer.id,
                    dataRef.current.isMultipleSelect ? 'add' : 'replace'
                  );
                }}
              >
                <div
                  css={{
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <div
                    css={{
                      width: 40,
                      height: 40,
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      flexShrink: 0,
                    }}
                  ></div>
                  <div css={{ minWidth: 0, flexGrow: 1 }}>
                    <ReverseTransformLayer
                      layer={rootLayer}
                      hiddenChild={true}
                    />
                  </div>

                  <div css={{ flexShrink: 0, fontSize: 24 }}>
                    <BackgroundSelectionIcon />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageContext.Provider>
  );

  return isMobile ? (
    <BottomSheet
      isOpen={props.open}
      containerId='bottom_sheet'
      dragListener={false}
      zIndex={12}
      style={{ paddingBottom: 0 }}
      onClose={() => {}}
    >
      {renderPage()}
    </BottomSheet>
  ) : (
    <Sidebar {...props}>{renderPage()}</Sidebar>
  );
};

export default forwardRef<HTMLDivElement, LayerSidebarProps>(LayerSidebar);
