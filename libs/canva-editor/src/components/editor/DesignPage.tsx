import React, {
  forwardRef,
  ForwardRefRenderFunction,
  Fragment,
  useEffect,
  useRef,
} from 'react';
import PageElement from 'canva-editor/layers/core/PageElement';
import { useEditor, useSelectedLayers } from '../../hooks';
import { useLinkedRef } from '../../hooks/useLinkedRef';
import {
  BoxData,
  LayerComponentProps,
  LayerDataRef,
  LayerId,
} from 'canva-editor/types';
import { useDisabledFeatures } from '../../hooks/useDisabledFeatures';
import { getTransformStyle } from 'canva-editor/layers';
import { visualCorners } from 'canva-editor/utils/2d/visualCorners';
import { isPointInsideBox } from 'canva-editor/utils/2d/isPointInsideBox';
import { getPosition } from 'canva-editor/utils';
import { ResizeCallbackData, useResizeLayer } from '../../hooks/useResizeLayer';
import { isImageLayer } from 'canva-editor/utils/layer/layers';
import { getImageSize } from '../../hooks/useResize';
import { ImageLayerProps } from 'canva-editor/layers/ImageLayer';
import { getControlBoxSizeFromLayers } from 'canva-editor/utils/layer/getControlBoxSizeFromLayers';
import { RotateCallbackData, useRotateLayer } from '../../hooks/useRotateLayer';
import PageProvider from 'canva-editor/layers/core/PageContext';
import ControlBox from 'canva-editor/layers/control/ControlBox';
import Toolbar from 'canva-editor/layers/control/Toolbar';
import Guideline from 'canva-editor/layers/control/Guideline';
import LayerBorderBox from 'canva-editor/layers/core/LayerBorderBox';
import ImageEditor from '../image-editor/ImageEditor';
import TextEditor from '../text-editor/TextEditor';

// Icons
import LockIcon from 'canva-editor/icons/LockIcon';
import LockOpenIcon from 'canva-editor/icons/LockOpenIcon';
import DuplicateIcon from 'canva-editor/icons/DuplicateIcon';
import TrashIcon from 'canva-editor/icons/TrashIcon';
import ArrowUpIcon from 'canva-editor/icons/ArrowUpIcon';
import ArrowDownIcon from 'canva-editor/icons/ArrowDownIcon';
import AddNewPageIcon from 'canva-editor/icons/AddNewPageIcon';
import EditInlineInput from '../EditInlineInput';
import { useTranslate } from 'canva-editor/contexts/TranslationContext';

export interface PageProps {
  pageIndex: number;
  pageName: string;
  width: number;
  height: number;
  transform: {
    x: number;
    y: number;
    scale: number;
  };
  onMovePageUp: () => void;
  onMovePageDown: () => void;
}
const DesignPage: ForwardRefRenderFunction<HTMLDivElement, PageProps> = (
  {
    pageIndex,
    pageName,
    width,
    height,
    transform,
    onMovePageUp,
    onMovePageDown,
  },
  ref
) => {
  const pageRef = useRef<HTMLDivElement>(null);
  const displayRef = useRef<HTMLDivElement>(null);
  const [controlBoxRef] = useLinkedRef<HTMLDivElement>(null);
  const layerBorderRef = useRef<Record<LayerId, HTMLDivElement>>({});
  const [controlBoxData, getControlBoxData, setControlBoxData] =
    useLinkedRef<BoxData>();
  const [layerData, getLayerData, setLayerData] = useLinkedRef<LayerDataRef>(
    {}
  );
  const { selectedLayerIds, selectedLayers } = useSelectedLayers();
  const disabled = useDisabledFeatures();
  const t = useTranslate();
  const {
    actions,
    hoveredLayer,
    scale,
    activePage,
    controlBox,
    imageEditor,
    textEditor,
    totalPages,
    isLocked,
    isAdjustingSlider,
  } = useEditor((state) => {
    const hoverLayerId = state.hoveredLayer[pageIndex];
    return {
      activePage: state.activePage,
      controlBox: state.controlBox,
      scale: state.scale,
      isLocked:
        state.pages[pageIndex] &&
        state.pages[pageIndex].layers.ROOT.data.locked,
      isAdjustingSlider: state.isAdjustingSlider,
      hoveredLayer: hoverLayerId
        ? state.pages[pageIndex].layers[hoverLayerId]
        : null,
      selectStatus: state.selectData.status,
      imageEditor: state.imageEditor,
      textEditor: state.textEditor,
      totalPages: state.pages.length,
    };
  });
  const openContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    if (hoveredLayer && hoveredLayer.data.locked) {
      return;
    }
    if (controlBox && pageRef.current && hoveredLayer) {
      const matrix = new WebKitCSSMatrix(
        getTransformStyle({
          rotate: controlBox.rotate,
        })
      );
      const rect = pageRef.current.getBoundingClientRect();
      const controlBoxCorner = visualCorners(
        {
          width: controlBox.boxSize.width * scale,
          height: controlBox.boxSize.height * scale,
        },
        matrix,
        {
          x: rect.x + controlBox.position.x * scale,
          y: rect.y + controlBox.position.y * scale,
        }
      );
      if (!isPointInsideBox({ x: e.clientX, y: e.clientY }, controlBoxCorner)) {
        actions.selectLayers(pageIndex, hoveredLayer.id);
      }
    } else if (hoveredLayer) {
      actions.selectLayers(pageIndex, hoveredLayer.id);
    }
    actions.showContextMenu(getPosition(e.nativeEvent));
  };

  useEffect(() => {
    if (controlBoxData.current) {
      setControlBoxData({
        boxSize: {
          width: controlBoxData.current.boxSize.width * scale,
          height: controlBoxData.current.boxSize.height * scale,
        },
        position: {
          x: controlBoxData.current.position.x * scale,
          y: controlBoxData.current.position.y * scale,
        },
        rotate: controlBoxData.current.rotate,
        scale: controlBoxData.current.scale,
      });
    }
    if (layerData.current) {
      Object.entries(layerData.current).forEach(([layerId, layer]) => {
        if (layer.centerX) {
          layerData.current[layerId].centerX = layer.centerX * scale;
        }
        if (layer.centerY) {
          layerData.current[layerId].centerY = layer.centerY * scale;
        }
        layerData.current[layerId].position.x = layer.position.x * scale;
        layerData.current[layerId].position.y = layer.position.y * scale;
        layerData.current[layerId].boxSize.width = layer.boxSize.width * scale;
        layerData.current[layerId].boxSize.height =
          layer.boxSize.height * scale;
      });
    }
  }, [scale]);

  const handleResize = ({
    controlBox,
    layers,
    direction,
    lockAspect,
  }: ResizeCallbackData) => {
    actions.setControlBox(controlBox);
    Object.entries(layers).forEach(([layerId, newSize]) => {
      const l = selectedLayers.find((l) => l.id === layerId);
      if (l) {
        if (isImageLayer(l)) {
          const changeX = newSize.boxSize.width - l.data.props.boxSize.width;
          const changeY = newSize.boxSize.height - l.data.props.boxSize.height;
          const props = l.data.props;
          if (!lockAspect) {
            const imageSize = getImageSize(props, props.image, direction, {
              width: changeX,
              height: changeY,
            });
            actions.history.merge().setProp(pageIndex, layerId, {
              ...imageSize,
              position: {
                x: newSize.position.x,
                y: newSize.position.y,
              },
            });
          } else {
            const ratio = newSize.boxSize.width / l.data.props.boxSize.width;
            actions.history
              .merge()
              .setProp<ImageLayerProps>(pageIndex, layerId, {
                ...newSize,
                image: {
                  boxSize: {
                    width: l.data.props.image.boxSize.width * ratio,
                    height: l.data.props.image.boxSize.height * ratio,
                  },
                  position: {
                    x: l.data.props.image.position.x * ratio,
                    y: l.data.props.image.position.y * ratio,
                  },
                  rotate: 0,
                },
              });
          }
        } else {
          actions.history.merge().setProp(pageIndex, layerId, newSize);
        }
      }
    });
  };

  const { startResizing } = useResizeLayer({
    options: {
      scalable: !disabled.scalable,
    },
    getLayerData,
    setLayerData,
    controlBox,
    getControlBoxData,
    setControlBoxData,
    onResize: handleResize,
    onResizeStop: handleResize,
  });
  useEffect(() => {
    const layerRecords = selectedLayers
      .filter((layer) => layer.id !== 'ROOT')
      .reduce((acc, layer) => {
        acc[layer.id] = layer.data.props;
        return acc;
      }, {} as Record<LayerId, LayerComponentProps>);
    actions.setControlBox(getControlBoxSizeFromLayers(layerRecords));
  }, [JSON.stringify(selectedLayerIds), scale]);

  const handleRotate = ({ controlBox, layers }: RotateCallbackData) => {
    actions.setControlBox(controlBox);
    Object.entries(layers).forEach(([layerId, data]) => {
      actions.history.merge().setProp(pageIndex, layerId, data);
    });
  };
  const { startRotate } = useRotateLayer({
    pageIndex,
    getLayerData,
    setLayerData,
    pageOffset: {
      x: pageRef.current?.getBoundingClientRect().x || 0,
      y: pageRef.current?.getBoundingClientRect().y || 0,
    },
    getControlBoxData,
    setControlBoxData,
    onRotate: handleRotate,
    onRotateEnd: handleRotate,
  });

  return (
    <PageProvider pageIndex={pageIndex}>
      <div
        css={{
          fontWeight: 'bold',
          marginTop: 24,
          height: 28,
          display: 'flex',
          alignItems: 'center',
          marginBottom: 4,
          width: width * scale,
          whiteSpace: 'nowrap',
          '@media (max-width: 900px)': {
            display: 'none',
          },
        }}
      >
        <div css={{ flexGrow: 1 }}>
          <div css={{ display: 'flex' }}>
            <div>{t('common.page', 'Page')} {pageIndex + 1} -</div>&nbsp;
            <EditInlineInput
              text={pageName}
              placeholder={t('common.addPageTitle', 'Add page title')}
              onSetText={(newText) => {
                actions.setPageName(pageIndex, newText);
              }}
            />
          </div>
        </div>
        <div
          css={{
            display: 'flex',
            alignItems: 'center',
            fontSize: 20,
            color: '#0d1216',
            height: 28,
            opacity: 0.7,
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
              cursor: pageIndex === 0 ? 'not-allowed' : 'pointer',
              color: pageIndex === 0 ? 'rgba(36,49,61,.4)' : '#0d1216',
              ':hover': {
                background:
                  pageIndex === 0 ? undefined : 'rgba(64, 87, 109, 0.07)',
              },
            }}
            onClick={() => {
              if (pageIndex !== 0) {
                onMovePageUp();
              }
            }}
          >
            <ArrowUpIcon />
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
              cursor: pageIndex === totalPages - 1 ? 'not-allowed' : 'pointer',
              color:
                pageIndex === totalPages - 1 ? 'rgba(36,49,61,.4)' : '#0d1216',
              ':hover': {
                background:
                  pageIndex === totalPages - 1
                    ? undefined
                    : 'rgba(64, 87, 109, 0.07)',
              },
            }}
            onClick={() => {
              if (pageIndex !== totalPages - 1) {
                onMovePageDown();
              }
            }}
          >
            <ArrowDownIcon />
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
            onClick={() => {
              isLocked
                ? actions.unlockPage(pageIndex)
                : actions.lockPage(pageIndex);
            }}
          >
            {!isLocked && <LockOpenIcon />}
            {isLocked && <LockIcon />}
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
            onClick={() => actions.duplicatePage(pageIndex)}
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
              !isLocked && totalPages > 1 && actions.deletePage(pageIndex)
            }
          >
            <TrashIcon />
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
            onClick={() => actions.addPage(pageIndex)}
          >
            <AddNewPageIcon />
          </div>
        </div>
      </div>
      <div
        ref={ref}
        css={{
          position: 'relative',
          margin: 'auto',
          boxShadow: '0 2px 8px rgba(14,19,24,.07)',
          '@media (max-width: 900px)': {
            boxShadow: 'none',
          },
        }}
        style={{
          width: width * scale * transform.scale,
          height: height * scale * transform.scale,
          transform: getTransformStyle({
            position: transform,
            scale: transform.scale,
          }),
        }}
      >
        <div
          ref={pageRef}
          css={{
            background: 'white',
            overflow: 'hidden',
            transformOrigin: '0 0',
          }}
          style={{
            width: width,
            height: height,
            transform: `scale(${scale * transform.scale})`,
          }}
          onContextMenu={openContextMenu}
        >
          <div
            ref={displayRef}
            className='page-content'
            css={{
              width,
              height,
              position: 'relative',
              left: 0,
              top: 0,
              zIndex: 1,
              overflow: 'hidden'
            }}
          >
            <PageElement />
          </div>
        </div>

        <div
          css={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            zIndex: 2,
          }}
        >
          {!imageEditor &&
            !isAdjustingSlider &&
            pageIndex === activePage &&
            controlBox &&
            selectedLayers.length > 1 && (
              <LayerBorderBox
                boxSize={controlBox.boxSize}
                position={controlBox.position}
                rotate={controlBox.rotate}
                type={'dashed'}
              />
            )}
          {!imageEditor &&
            !isAdjustingSlider &&
            pageIndex === activePage &&
            selectedLayers.map((layer) => (
              <LayerBorderBox
                key={layer.id}
                ref={(el) => { layerBorderRef.current[layer.id] = el; }}
                boxSize={layer.data.props.boxSize}
                position={layer.data.props.position}
                rotate={layer.data.props.rotate}
                layerType={layer.data.type}
              />
            ))}
          {!imageEditor &&
            !isAdjustingSlider &&
            hoveredLayer &&
            !selectedLayerIds.includes(hoveredLayer.id) && (
              <LayerBorderBox
                ref={(el) => {
                  if (el) layerBorderRef.current[hoveredLayer.id] = el;
                }}
                boxSize={hoveredLayer.data.props.boxSize}
                position={hoveredLayer.data.props.position}
                rotate={hoveredLayer.data.props.rotate}
              />
            )}
          {!imageEditor &&
            !isAdjustingSlider &&
            pageIndex === activePage &&
            selectedLayerIds.length > 0 && (
              <Fragment>
                {controlBox && (
                  <ControlBox
                    ref={controlBoxRef}
                    boxSize={controlBox.boxSize}
                    position={controlBox.position}
                    rotate={controlBox.rotate}
                    scale={controlBox.scale}
                    locked={disabled.locked}
                    disabled={disabled}
                    onRouteStart={startRotate}
                    onResizeStart={startResizing}
                  />
                )}
                <Toolbar />
              </Fragment>
            )}
          {pageIndex === activePage && <Guideline />}
        </div>
        {imageEditor && imageEditor.pageIndex === pageIndex && <ImageEditor />}
        {textEditor && textEditor.pageIndex === pageIndex && <TextEditor />}
      </div>
    </PageProvider>
  );
};

export default forwardRef<HTMLDivElement, PageProps>(DesignPage);
