import {
  FC,
  Fragment,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { EditorContext } from './EditorContext';
import DesignPage from './DesignPage';
import { SerializedPage } from 'canva-editor/types';
import { useTrackingShiftKey } from '../../hooks/useTrackingShiftKey';
import { useUsedFont } from '../../hooks/useUsedFont';
import useShortcut from '../../hooks/useShortcut';
import { useEditor, useSelectedLayers } from '../../hooks';
import { useZoomPage } from '../../hooks/useZoomPage';
import useClickOutside from '../../hooks/useClickOutside';
import { isElementInViewport } from 'canva-editor/utils/dom/isElementInViewport';
import { useSelectLayer } from '../../hooks/useSelectLayer';
import { useDragLayer } from '../../hooks/useDragLayer';
import { getPosition, isMouseEvent, isTouchEvent } from 'canva-editor/utils';
import { GlobalStyle, getTransformStyle } from 'canva-editor/layers';
import { visualCorners } from 'canva-editor/utils/2d/visualCorners';
import { isPointInsideBox } from 'canva-editor/utils/2d/isPointInsideBox';
import { rectangleInsideAnother } from 'canva-editor/utils/2d/rectangleInsideAnother';
import LayerContextMenu from 'canva-editor/layers/core/context-menu/LayerContextMenu';
import SelectionBox from 'canva-editor/layers/core/SelectionBox';
import { isMobile } from 'react-device-detect';
import PageSettings from 'canva-editor/utils/settings/PageSettings';
import { dataMapping, pack, unpack } from 'canva-editor/utils/minifier';
import useDebouncedEffect from 'canva-editor/hooks/useDebouncedEffect';
import { domToPng } from 'modern-screenshot'
import { slugify } from 'canva-editor/utils/slugify';
import { jsPDF } from "jspdf";
import { useTranslate } from 'canva-editor/contexts/TranslationContext';

interface DesignFrameProps {
  data: any;
  onChanges?: (changes: any) => void;
}
const DesignFrame: FC<DesignFrameProps> = ({ data, onChanges }) => {
  const t = useTranslate();
  const shiftKeyRef = useTrackingShiftKey();
  const frameRef = useRef<HTMLDivElement>(null);
  const pageContainerRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef<HTMLDivElement[]>([]);
  const contextMenuRef = useRef<HTMLDivElement>(null);
  const { usedFonts } = useUsedFont();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const {
    config: { editorAssetsUrl },
  } = useContext(EditorContext);
  useShortcut(frameRef.current);
  const {
    name,
    actions,
    query,
    scale,
    pages,
    hoveredPage,
    hoveredLayer,
    selectStatus,
    rotateData,
    resizeData,
    controlBox,
    activePage,
    dragData,
    imageEditor,
    pageSize,
    openPageSettings,
    downloadPNGCmd,
    downloadPDFCmd,
  } = useEditor((state) => {
    const hoveredPage = parseInt(Object.keys(state.hoveredLayer)[0]);
    const hoverLayerId = state.hoveredLayer[hoveredPage];
    return {
      name: state.name,
      scale: state.scale,
      pages: state.pages,
      hoveredPage,
      hoveredLayer: hoverLayerId
        ? state.pages[hoveredPage].layers[hoverLayerId]
        : null,
      selectStatus: state.selectData.status,
      rotateData: state.rotateData,
      resizeData: state.resizeData,
      controlBox: state.controlBox,
      activePage: state.activePage,
      dragData: state.dragData,
      imageEditor: state.imageEditor,
      pageSize: state.pageSize,
      openPageSettings: state.openPageSettings,
      downloadPNGCmd: state.downloadPNGCmd,
      downloadPDFCmd: state.downloadPDFCmd,
    };
  });
  const {
    pageTransform,
    onZoomStart,
    onZoomMove,
    onZoomEnd,
    onMoveStart,
    onMove,
    onMoveEnd,
    onMovePage,
    onMovePageEnd,
  } = useZoomPage(frameRef, pageRef, pageContainerRef);
  useEffect(() => {
    const serializedData: SerializedPage[] = unpack(data);
    actions.setData(serializedData);

    setTimeout(() => {
      const maxInitScale = 0.5;
      const initScale =
        ((frameRef?.current?.offsetWidth || 0) - (isMobile ? 32 : 112)) /
        pageSize.width; // Padding 16x2
      actions.setScale(initScale > maxInitScale ? maxInitScale : initScale);
    }, 16);
  }, [data, actions]);

  useEffect(() => {
    if (downloadPNGCmd === -1) return;
    // Download active page
    if (downloadPNGCmd === 1) {
      handleDownloadPNG(activePage);
      actions.fireDownloadPNGCmd(-1); // Reset
      return;
    }
    // Download all pages
    if (downloadPNGCmd === 0) {
      pages.forEach((_, idx) => handleDownloadPNG(idx));
      actions.fireDownloadPNGCmd(-1); // Reset
      return;
    }
  }, [downloadPNGCmd]);

  useEffect(() => {
    console.log('downloadPDFCmd', downloadPDFCmd)
    if (downloadPNGCmd === -1) return;
    // Download all pages
    if (downloadPDFCmd === 0) {
      handleDownloadPDF();
      return;
    }
  }, [downloadPDFCmd]);

  useDebouncedEffect(
    () => {
      if (onChanges) onChanges(pack(query.serialize(), dataMapping)[0]);
    },
    500,
    [pages]
  );

  useClickOutside(
    contextMenuRef,
    () => {
      actions.hideContextMenu();
    },
    'mousedown',
    { capture: true }
  );

  const boxRef = useRef<HTMLDivElement>(null);
  const { selectedLayerIds } = useSelectedLayers();

  const handleScroll = () => {
    if (!dragData.status && !selectStatus) {
      const viewport = frameRef.current as HTMLDivElement;
      // change active page
      if (
        pageRef.current[activePage] &&
        !isElementInViewport(viewport, pageRef.current[activePage])
      ) {
        pageRef.current.some((page, pageIndex) => {
          if (isElementInViewport(viewport, page)) {
            actions.selectLayers(pageIndex, 'ROOT');
            return true;
          }
        });
      }
    }
  };

  const [previousScale, setPreviousScale] = useState(scale);
  useEffect(() => {
    if (isMobile) return;
    let offset = {
      x: frameRef?.current?.scrollLeft || 0,
      y: frameRef?.current?.scrollTop || 0,
    };
    let pageLoc = { x: mousePos.x + offset.x, y: mousePos.y + offset.y };
    let zoomPoint = {
      x: pageLoc.x / previousScale,
      y: pageLoc.y / previousScale,
    };

    let zoomPointNew = { x: zoomPoint.x * scale, y: zoomPoint.y * scale };
    let newScroll = {
      x: zoomPointNew.x - mousePos.x,
      y: zoomPointNew.y - mousePos.y,
    };

    if (frameRef?.current) {
      frameRef.current.scrollTop = newScroll.y;
      frameRef.current.scrollLeft = newScroll.x;
    }
    setPreviousScale(scale);
  }, [scale]);

  useEffect(() => {
    const mouseMove = (event: any) => {
      setMousePos({
        x: event.pageX,
        y: event.pageY,
      });
    };

    const mouseLeave = () => {
      setMousePos({
        x: (frameRef.current?.offsetWidth || 2) / 2,
        y: (frameRef.current?.offsetHeight || 2) / 2,
      });
    };

    if (frameRef?.current) {
      frameRef.current.addEventListener('mousemove', mouseMove);
      frameRef.current.addEventListener('mouseleave', mouseLeave);
    }

    return () => {
      if (frameRef?.current) {
        frameRef.current.removeEventListener('mousemove', mouseMove);
        frameRef.current.removeEventListener('mouseleave', mouseLeave);
      }
    };
  }, [frameRef?.current]);

  const handleScrollToActivePage = (pageIndex: number) => {
    setTimeout(() => {
      pageRef.current[pageIndex].scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }, 16);
  };
  const handleDownloadPNG = async (pageIndex: number) => {
    console.log('handleDownloadPNG', pageIndex)
    const pageContentEl =
      pageRef.current[pageIndex]?.querySelector('.page-content');
    if (pageContentEl) {
      try {
        const dataUrl = await domToPng(pageContentEl as HTMLElement, {
          width: pageSize.width,
          height: pageSize.height
        });
        const link = document.createElement('a');
        link.download = `design-id-page-${pageIndex + 1}.png`;
        link.href = dataUrl;
        link.click();
      } catch (e) {
        window.alert('Cannot download: ' + (e as Error).message);
      }
    }
  };
  const handleDownloadPDF = async () => {
    const pageProcesses: Promise<string>[] = [];
    pages.forEach((_, idx) => {
      const pageContentEl =
        pageRef.current[idx]?.querySelector('.page-content');
      pageProcesses.push(domToPng(pageContentEl as HTMLElement, {
        width: pageSize.width,
        height: pageSize.height
      }));
    });
    const dataUrls = await Promise.all(pageProcesses);
    const doc = new jsPDF({
      unit: "px",
    });

    dataUrls.forEach((dataUrl, idx) => {
      doc.internal.pageSize.width =  pageSize.width;
      doc.internal.pageSize.height = pageSize.height;
      doc.addImage(dataUrl, 'PNG', 0, 0, pageSize.width, pageSize.height, 'p'+idx, 'SLOW');
      if (idx !== dataUrls.length - 1) {
        doc.addPage();
        doc.internal.pageSize.width =  pageSize.width;
        doc.internal.pageSize.height = pageSize.height;
      }
    });
    const fileName = name ? slugify(name) : 'untitled-design';
    doc.save(fileName + '.pdf');
    console.log('handleDownloadPDF', fileName + '.pdf');
    actions.fireDownloadPDFCmd(-1); // Reset
  };
  const { tmpSelected, onSelectStart } = useSelectLayer({
    frameRef: frameRef,
    pageListRef: pageRef,
    selectionBoxRef: boxRef,
  });

  const { onDragStart } = useDragLayer({
    frameRef,
    pageListRef: pageRef,
  });

  const handMouseDown = useCallback(
    (e: MouseEvent | TouchEvent) => {
      if (
        (isMouseEvent(e) && e.button === 2) ||
        imageEditor ||
        (isTouchEvent(e) && e.touches.length > 1)
      ) {
        return;
      }
      const isClickPage = pageRef.current.find((page) =>
        page.contains(e.target as Node)
      );
      const isClickOutPage = pageRef.current.find((page) =>
        (e.target as Node).contains(page)
      );
      const { clientX, clientY } = getPosition(e);
      if (!isClickPage && !isClickOutPage) {
        return;
      }

      let isInsideControlBox = false;
      if (controlBox) {
        const matrix = new WebKitCSSMatrix(
          getTransformStyle({
            rotate: controlBox.rotate,
          })
        );
        const rect = pageRef.current[activePage].getBoundingClientRect();
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
        isInsideControlBox = isPointInsideBox(
          { x: clientX, y: clientY },
          controlBoxCorner
        );
      }
      if (
        hoveredLayer &&
        hoveredLayer.id !== 'ROOT' &&
        !selectedLayerIds.includes(hoveredLayer.id)
      ) {
        if (
          !isInsideControlBox ||
          (controlBox &&
            rectangleInsideAnother(hoveredLayer.data.props, controlBox))
        ) {
          actions.selectLayers(
            hoveredPage,
            hoveredLayer.id,
            shiftKeyRef.current ? 'add' : 'replace'
          );
        }
      }
      if (
        (hoveredLayer &&
          hoveredLayer.id !== 'ROOT' &&
          !hoveredLayer.data.locked) ||
        isInsideControlBox
      ) {
        onDragStart(e);
        e.stopPropagation();
      } else if (isMouseEvent(e)) {
        onSelectStart(e);
        e.stopPropagation();
      } else if (isTouchEvent(e)) {
        onMoveStart(e);
      }
    },
    [hoveredLayer, controlBox, selectedLayerIds, dragData]
  );

  const cursorCSS = () => {
    if (rotateData.status) {
      const cursor = Math.round((rotateData.rotate || 0) / 10);
      return {
        cursor: `url('${editorAssetsUrl}/cursors/rotate/${
          cursor === 36 ? 0 : cursor
        }.png') 12 12, auto;`,
      };
    } else if (resizeData.status) {
      const rd = {
        bottomLeft: 45,
        left: 90,
        topLeft: 135,
        top: 180,
        topRight: 225,
        right: 270,
        bottomRight: 315,
        bottom: 0,
      };
      const rotate =
        (resizeData.rotate || 0) + rd[resizeData.direction || 'bottom'] + 90;
      const file = Math.round((rotate % 180) / 10);
      return {
        cursor: `url('${editorAssetsUrl}/cursors/resize/${file}.png') 12 12, auto`,
      };
    } else if (dragData.status) {
      return {
        cursor: 'move',
      };
    }
    return {};
  };

  return (
    <Fragment>
      <div
        ref={frameRef}
        css={{
          display: 'flex',
          position: 'relative',
          height: '100%',
          overflow: 'auto',
          ...cursorCSS(),
          '@media (max-width: 900px)': {
            overflow: 'hidden',
            height: 'calc(100% - 72px)',
          },
        }}
        tabIndex={0}
        onTouchStart={onZoomStart}
        onTouchMove={onZoomMove}
        onTouchEnd={onZoomEnd}
        onScroll={() => {
          handleScroll();
        }}
      >
        <div
          css={{
            position: 'absolute',
            display: 'flex',
            minWidth: '100%',
            minHeight: '100%',
          }}
          onMouseDown={(e) => handMouseDown(e.nativeEvent)}
          onTouchStart={(e) => handMouseDown(e.nativeEvent)}
        >
          <div
            css={{
              position: 'relative',
              display: 'flex',
              flexGrow: 1,
              touchAction: 'pinch-zoom',
              margin: '48px 0'
            }}
          >
            <div
              ref={pageContainerRef}
              css={{
                display: 'flex',
                position: 'relative',
                flexDirection: 'row',
                justifyContent: 'center',
                margin: 'auto',
                '@media (max-width: 900px)': {
                  transition: 'transform 250ms linear 0s',
                  margin: 'initial',
                },
              }}
              style={{
                transform: `translateX(-${
                  isMobile ? window.innerWidth * activePage : 0
                }px)`,
              }}
            >
              <div
                css={{
                  marginLeft: 56,
                  '@media (max-width: 900px)': {
                    display: 'flex',
                    marginLeft: 0,
                  },
                }}
                onTouchMove={(e) => {
                  onMove(e);
                  onMovePage(e);
                }}
                onTouchEnd={() => {
                  onMoveEnd();
                  onMovePageEnd();
                }}
              >
                <GlobalStyle fonts={usedFonts} mode={'editor'} />
                {pages.map((page, index) => (
                  <div
                    key={index}
                    css={{
                      '@media (max-width: 900px)': {
                        padding: '0 16px',
                        width: window.innerWidth,
                        height: window.innerHeight,
                        overflow: 'hidden',
                        marginTop: 5,
                      },
                    }}
                  >
                    <DesignPage
                      ref={(el) => { pageRef.current[index] = el; }}
                      pageIndex={index}
                      pageName={page.name}
                      width={pageSize.width}
                      height={pageSize.height}
                      transform={pageTransform}
                      onMovePageUp={() => {
                        actions.movePageUp(index);
                        handleScrollToActivePage(activePage - 1);
                      }}
                      onMovePageDown={() => {
                        actions.movePageDown(index);
                        handleScrollToActivePage(activePage + 1);
                      }}
                    />
                  </div>
                ))}
                <button
                  css={{
                    alignItems: 'center',
                    justifyItems: 'center',
                    marginTop: 20,
                    marginBottom: 20,
                    border: '1px solid rgba(64,87,109,.1)',
                    color: '#0d1216',
                    width: pageSize.width * scale,
                    height: 40,
                    textAlign: 'center',
                    padding: '0 2px',
                    fontWeight: 600,
                    borderRadius: 3,
                    '@media (max-width: 900px)': {
                      display: 'none',
                    },
                  }}
                  onClick={() => {
                    actions.addPage();
                    handleScrollToActivePage(activePage + 1);
                  }}
                >
                  + {t('common.addPage', 'Add Page')}
                </button>
              </div>
              <div
                css={{
                  width: 56,
                  pointerEvents: 'none',
                  '@media (max-width: 900px)': {
                    width: 0,
                  },
                }}
              />
            </div>
            <LayerContextMenu ref={contextMenuRef} />
            {selectStatus && (
              <SelectionBox
                ref={boxRef}
                selectedLayers={tmpSelected?.selectedLayers}
              />
            )}
          </div>
        </div>
      </div>
      {resizeData.status && (
        <div
          css={{
            position: 'fixed',
            top: `${(resizeData.cursor?.clientY || 0) + 36}px`,
            left: `${(resizeData.cursor?.clientX || 0) + 60}px`,
            whiteSpace: 'nowrap',
            background: '#3a3a4c',
            padding: '3px 8px',
            borderRadius: 4,
            textAlign: 'center',
            color: 'white',
            fontSize: 12,
            fontWeight: 700,
          }}
        >
          w: {Math.round(resizeData.boxSize?.width || 0)} h:{' '}
          {Math.round(resizeData.boxSize?.height || 0)}
        </div>
      )}
      {openPageSettings && (
        <PageSettings
          onChangePage={(pageIndex) => {
            actions.setActivePage(pageIndex);
            pageRef.current[pageIndex].scrollIntoView({
              block: 'center',
            });
          }}
        />
      )}
    </Fragment>
  );
};

export default DesignFrame;
