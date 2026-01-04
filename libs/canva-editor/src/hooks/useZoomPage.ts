import React, {
  RefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { throttle } from 'lodash';
import { useEditor } from './useEditor';
import { isMobile } from 'react-device-detect';
import { getTransformStyle } from 'canva-editor/layers';
import { CursorPosition, GestureEvent } from 'canva-editor/types';
import { getPosition } from 'canva-editor/utils';
import { distanceBetweenPoints } from 'canva-editor/utils/2d/distanceBetweenPoints';
import { isSafari } from 'canva-editor/utils/browser';

export const useZoomPage = (
  frameRef: RefObject<HTMLDivElement | null>,
  pageListRef: RefObject<HTMLDivElement[]>,
  pageContainerRef: RefObject<HTMLDivElement | null>
) => {
  const transformRef = useRef<{
    isMoving: boolean;
    isZoom: boolean;
    touchStart: [CursorPosition, CursorPosition];
    lastTouch: [CursorPosition, CursorPosition];
    start: CursorPosition;
    last: CursorPosition;
  }>({
    isMoving: false,
    isZoom: false,
    touchStart: [
      { clientX: 0, clientY: 0 },
      { clientX: 0, clientY: 0 },
    ],
    lastTouch: [
      { clientX: 0, clientY: 0 },
      { clientX: 0, clientY: 0 },
    ],
    start: { clientX: 0, clientY: 0 },
    last: { clientX: 0, clientY: 0 },
  });
  const [pageTransform, setPageTransform] = useState<{
    x: number;
    y: number;
    scale: number;
  }>({
    scale: 1,
    x: 0,
    y: 0,
  });

  const {
    actions,
    scale,
    activePage,
    pageSize,
    isDragging,
    isRotating,
    isResizing,
    openImageEditor,
    openTextEditor,
    pageLength,
  } = useEditor((state) => {
    return {
      scale: state.scale,
      activePage: state.activePage,
      pageSize: state.pageSize,
      isDragging: state.dragData.status,
      isRotating: state.rotateData.status,
      isResizing: state.resizeData.status,
      openImageEditor: !!state.imageEditor,
      openTextEditor: !!state.textEditor,
      pageLength: state.pages.length,
    };
  });

  const pageZoomStart = useCallback(() => {
    transformRef.current.isZoom = true;
    transformRef.current.isMoving = false;
  }, []);

  const pageZoomMove = useCallback(
    (change: number) => {
      if (
        frameRef.current &&
        transformRef.current.isZoom &&
        pageListRef.current
      ) {
        const headerHeight = 70;
        const footerHeight = 72;
        const offset = 16;
        const containerWidth = window.innerWidth - offset * 2;
        const containerHeight =
          window.innerHeight - headerHeight - footerHeight - offset * 2;
        const { x, y } = pageTransform;
        const oldPageW = pageSize.width * scale;
        const oldPageH = pageSize.height * scale;
        const perfectX = (containerWidth - oldPageW) / 2;
        const perfectY = (containerHeight - oldPageH) / 2;
        const changeX = perfectX === x ? 0 : x - perfectX;
        const changeY = perfectY === y ? 0 : y - perfectY;
        pageListRef.current[activePage].style.transform = getTransformStyle({
          position: {
            x: x + changeX * (change - 1),
            y: y + changeY * (change - 1),
          },
          scale: change,
        });
      }
    },
    [pageSize, scale]
  );

  const pageZoomEnd = useCallback(
    (change: number) => {
      if (
        frameRef.current &&
        transformRef.current.isZoom &&
        pageListRef.current
      ) {
        transformRef.current.isZoom = false;
        let zoom = change;
        const { x, y } = pageTransform;
        const headerHeight = 70;
        const footerHeight = 72;
        const offset = 16;
        const containerWidth = window.innerWidth - offset * 2;
        const containerHeight =
          window.innerHeight - headerHeight - footerHeight - offset * 2;
        let pageW = pageSize.width * scale * zoom;
        if (pageW < containerWidth) {
          zoom = containerWidth / scale / pageSize.width;
          pageW = containerWidth;
        }
        const oldPageW = pageSize.width * scale;
        const pageH = pageSize.height * scale * zoom;
        const oldPageH = pageSize.height * scale;
        const perfectX = (containerWidth - oldPageW) / 2;
        const perfectY = (containerHeight - oldPageH) / 2;
        const changeX =
          (pageW - oldPageW) / 2 -
          (perfectX === x ? 0 : x - perfectX) * (zoom - 1);
        const changeY =
          (pageH - oldPageH) / 2 -
          (perfectY === y ? 0 : y - perfectY) * (zoom - 1);

        const newX = Math.max(
          -(pageW - containerWidth),
          Math.min(x - changeX, 0)
        );
        const newY = Math.max(
          -(pageH - containerHeight / 2),
          Math.min(y - changeY, containerHeight / 2)
        );

        if (zoom > change) {
          //state change doesn't rerender
          pageListRef.current[activePage].style.transform = getTransformStyle({
            position: { x: newX, y: newY },
            scale: 1,
          });
        }
        setPageTransform({ scale: 1, x: newX, y: newY });
        actions.setScale(Math.max(scale * zoom));
      }
    },
    [pageSize, scale, actions]
  );
  const handleZoomStart = useCallback(
    (e: React.TouchEvent) => {
      const { touches } = e.nativeEvent;
      if (touches.length !== 2) {
        return;
      }
      transformRef.current.touchStart = [touches[0], touches[1]];
      transformRef.current.lastTouch = [touches[0], touches[1]];
      pageZoomStart();
    },
    [pageZoomStart]
  );
  const handleZoomMove = useCallback(
    throttle((e: React.TouchEvent) => {
      const { touches } = e.nativeEvent;
      if (touches.length !== 2) {
        return;
      }
      const start = distanceBetweenPoints(
        transformRef.current.touchStart[0],
        transformRef.current.touchStart[1]
      );
      const current = distanceBetweenPoints(touches[0], touches[1]);
      const scale = current / start;
      transformRef.current.lastTouch = [touches[0], touches[1]];
      pageZoomMove(scale);
    }, 16),
    [pageZoomMove]
  );
  const handleZoomEnd = useCallback(
    (e: React.TouchEvent) => {
      const { touches } = e.nativeEvent;
      if (transformRef.current.isZoom) {
        const start = distanceBetweenPoints(
          transformRef.current.touchStart[0],
          transformRef.current.touchStart[1]
        );
        const current = distanceBetweenPoints(
          transformRef.current.lastTouch[0],
          transformRef.current.lastTouch[1]
        );
        const scale = current / start;
        transformRef.current.lastTouch = [touches[0], touches[1]];
        pageZoomEnd(scale);
      }
    },
    [pageZoomEnd]
  );

  const handleMoveStart = (e: TouchEvent) => {
    const { clientX, clientY } = getPosition(e);
    transformRef.current.isMoving = true;
    transformRef.current.start = {
      clientX,
      clientY,
    };
    transformRef.current.last = {
      clientX,
      clientY,
    };
  };
  const handleMove = (e: React.TouchEvent) => {
    if (!transformRef.current.isMoving) {
      return;
    }
    const headerHeight = 70;
    const footerHeight = 72;
    const offset = 16;
    const containerWidth = window.innerWidth - offset * 2;
    const containerHeight =
      window.innerHeight - headerHeight - footerHeight - offset * 2;
    if (
      transformRef.current.isZoom ||
      !transformRef.current.isMoving ||
      containerWidth >= pageSize.width * scale
    )
      return;
    const { clientX, clientY } = getPosition(e.nativeEvent);
    transformRef.current.last = {
      clientX,
      clientY,
    };

    const pageW = pageSize.width * scale;
    const pageH = pageSize.height * scale;
    const x = Math.max(
      -(pageW - containerWidth),
      Math.min(
        pageTransform.x + clientX - transformRef.current.start.clientX,
        0
      )
    );
    const y = Math.max(
      -(pageH - containerHeight / 2),
      Math.min(
        pageTransform.y + clientY - transformRef.current.start.clientY,
        containerHeight / 2
      )
    );
    if (pageListRef.current) {
      pageListRef.current[activePage].style.transform = getTransformStyle({
        position: { x, y },
        scale: pageTransform.scale,
      });
    }
  };

  const handleMoveEnd = () => {
    if (!transformRef.current.isMoving) {
      return;
    }
    const headerHeight = 70;
    const footerHeight = 72;
    const offset = 16;
    const containerWidth = window.innerWidth - offset * 2;
    const containerHeight =
      window.innerHeight - headerHeight - footerHeight - offset * 2;
    if (
      transformRef.current.isZoom ||
      !transformRef.current.isMoving ||
      containerWidth >= pageSize.width * scale
    )
      return;
    const { clientX, clientY } = transformRef.current.last;
    const moveX = clientX - transformRef.current.start.clientX;
    const pageW = pageSize.width * scale;
    const pageH = pageSize.height * scale;
    const x = Math.max(
      -(pageW - containerWidth),
      Math.min(pageTransform.x + moveX, 0)
    );
    const y = Math.max(
      -(pageH - containerHeight / 2),
      Math.min(
        pageTransform.y + clientY - transformRef.current.start.clientY,
        containerHeight / 2
      )
    );
    setPageTransform({ scale: pageTransform.scale, x, y });
    transformRef.current.isMoving = false;
  };

  const handleMovePage = (e: React.TouchEvent) => {
    if (
      !pageContainerRef.current ||
      transformRef.current.isZoom ||
      !transformRef.current.isMoving ||
      isRotating ||
      isResizing ||
      isDragging ||
      openImageEditor ||
      openTextEditor
    )
      return;
    const { clientX, clientY } = getPosition(e.nativeEvent);
    transformRef.current.last = {
      clientX,
      clientY,
    };
    const offset = 16;
    const moveX = clientX - transformRef.current.start.clientX;
    const containerWidth = window.innerWidth - offset * 2;
    if (containerWidth >= pageSize.width * scale) {
      pageContainerRef.current.style.transform = getTransformStyle({
        position: { x: -(window.innerWidth * activePage) + moveX, y: 0 },
      });
    }
  };
  const handleMovePageEnd = () => {
    if (
      !pageContainerRef.current ||
      transformRef.current.isZoom ||
      !transformRef.current.isMoving ||
      isRotating ||
      isResizing ||
      isDragging ||
      openImageEditor ||
      openTextEditor
    )
      return;
    const { clientX } = transformRef.current.last;
    const offset = 16;
    const moveX = clientX - transformRef.current.start.clientX;
    const containerWidth = window.innerWidth - offset * 2;
    if (containerWidth >= pageSize.width * scale) {
      if (
        moveX <= -(window.innerWidth * 0.35) &&
        activePage + 1 <= pageLength - 1
      ) {
        pageContainerRef.current.style.transform = getTransformStyle({
          position: { x: -(window.innerWidth * (activePage + 1)), y: 0 },
        });
        actions.setActivePage(Math.min(activePage + 1, pageLength - 1));
      } else if (moveX >= window.innerWidth * 0.35 && activePage - 1 >= 0) {
        pageContainerRef.current.style.transform = getTransformStyle({
          position: { x: -(window.innerWidth * (activePage - 1)), y: 0 },
        });
        actions.setActivePage(Math.max(activePage - 1, 0));
      } else {
        pageContainerRef.current.style.transform = getTransformStyle({
          position: { x: -(window.innerWidth * activePage), y: 0 },
        });
      }
    }
  };

  useEffect(() => {
    const updateSize = () => {
      if (frameRef.current) {
        const ratio = pageSize.width / pageSize.height;
        const margin = window.innerWidth <= 900 ? 16 : 56;
        const w = frameRef.current.clientWidth - margin * 2;
        const size = {
          width: w,
          height: w * ratio,
        };
        const scale = Math.min(1, size.width / pageSize.width);
        actions.setScale(scale);
        if (isMobile) {
          const x = (window.innerWidth - pageSize.width * scale - 16 * 2) / 2;
          const headerHeight = 70;
          const footerHeight = 72;
          const offsetTop = 16;
          const y =
            (window.innerHeight -
              pageSize.height * scale -
              headerHeight -
              footerHeight -
              offsetTop) /
            2;
          setPageTransform({ scale: 1, x, y });
        }
      }
    };
    updateSize();
  }, [pageSize, setPageTransform]);

  useEffect(() => {
    // if (isSafari) return; // Skipping Safari
    const handleGestureStart = (e: Event) => {
      e.preventDefault();
      pageZoomStart();
      document.addEventListener('gesturechange', handleGestureChange);
      document.addEventListener('gestureend', handleGestureEnd, { once: true });
    };
    const handleGestureChange = throttle((e: Event) => {
      pageZoomMove((e as GestureEvent).scale);
      e.preventDefault();
    }, 16);
    const handleGestureEnd = (e: Event) => {
      pageZoomEnd((e as GestureEvent).scale);
      e.preventDefault();
      document.removeEventListener('gesturechange', handleGestureChange);
      document.removeEventListener('gestureend', handleGestureEnd);
    };
    document.addEventListener('gesturestart', handleGestureStart);
    return () => {
      document.removeEventListener('gesturestart', handleGestureStart);
    };
  }, [scale, pageTransform, setPageTransform, actions]);

  return {
    pageTransform,
    onZoomStart: handleZoomStart,
    onZoomMove: handleZoomMove,
    onZoomEnd: handleZoomEnd,
    onMoveStart: handleMoveStart,
    onMove: handleMove,
    onMoveEnd: handleMoveEnd,
    onMovePage: handleMovePage,
    onMovePageEnd: handleMovePageEnd,
  };
};
