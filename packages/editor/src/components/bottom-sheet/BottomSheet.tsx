import React, { FC, useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import {
  motion,
  useAnimation,
  useDragControls,
  useMotionValue,
  AnimatePresence,
} from 'framer-motion';

interface BottomSheetProps {
  isOpen: boolean;
  containerId?: string;
  style?: { [pro: string]: string | number };
  zIndex?: number;
  dragListener?: boolean;
  onClose: () => void;
  onOpen?: () => void;
  children: React.ReactNode;
}

const BottomSheet: FC<BottomSheetProps> = ({
  isOpen,
  containerId,
  style = {
    paddingBottom: 65,
  },
  zIndex = 3,
  dragListener = true,
  onClose,
  onOpen,
  children,
}) => {
  const controls = useAnimation();
  const dragControls = useDragControls();
  const sheetY = useMotionValue(0);

  const sheetRef = useRef<HTMLDivElement>(null);
  const [sheetHeight, setSheetHeight] = useState(0);
  const [offsetY, setOffsetY] = useState(0);

  useEffect(() => {
    if (sheetRef.current) {
      setSheetHeight(sheetRef.current.offsetHeight);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      onOpen?.();
      controls.start({ y: 0 });
      setOffsetY(0);
    } else {
      controls.start({ y: sheetHeight });
      setOffsetY(sheetHeight);
    }
  }, [isOpen, onOpen, sheetHeight, controls]);

  const handleDrag = (
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: { offset: { y: number } }
  ) => {
    sheetY.set(info.offset.y);
  };

  const handleDragEnd = () => {
    if (sheetY.get() > sheetHeight * 0.4) {
      // Hide if dropped position at 40% height
      onClose();
    } else {
      controls.start({ y: 0 });
    }
  };

  const handleBackdropClick = () => {
    onClose();
  };

  const pageRender = () => (
    <AnimatePresence onExitComplete={() => sheetY.set(0)}>
      {offsetY === 0 && (
        <motion.div
          key='backdrop'
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(0, 0, 0, 0.5)',
            zIndex: zIndex ? zIndex : 1,
          }}
          onClick={handleBackdropClick}
        />
      )}
      <motion.div
        key='bottom-sheet'
        drag='y'
        dragControls={dragControls}
        dragElastic={0.1}
        dragListener={dragListener}
        dragConstraints={{ top: 0, bottom: sheetHeight }}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        initial={{ y: sheetHeight }}
        animate={controls}
        exit={{ y: sheetHeight }}
        ref={sheetRef}
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          width: '100%',
          height: '92%',
          minHeight: '50%',
          background: '#fff',
          boxShadow: '0px -2px 10px rgba(0, 0, 0, 0.1)',
          borderTopLeftRadius: '10px',
          borderTopRightRadius: '10px',
          paddingTop: dragListener ? 20 : 0,
          boxSizing: 'border-box',
          overflow: 'auto',
          zIndex: zIndex ? zIndex + 1 : 2,
          ...style,
        }}
      >
        {dragListener && (
          <motion.div
            onPointerDown={(e) => {
              dragControls.start(e);
            }}
            style={{
              position: 'absolute',
              top: '5px',
              left: '50%',
              transform: 'translateX(-50%)',
              cursor: 'grab',
              height: 10,
              width: 100,
              textAlign: 'center',
            }}
          >
            <button
              css={{
                width: 50,
                height: 6,
                background: '#ccc',
                borderRadius: 5,
              }}
            ></button>
          </motion.div>
        )}
        {children}
      </motion.div>
    </AnimatePresence>
  );

  if (!containerId) {
    return pageRender();
  }
  const [container, setContainer] = useState(
    window.document.getElementById(containerId)
  );

  useEffect(() => {
    setContainer(window.document.getElementById(containerId));
  }, []);

  // Container not found
  if (!container) {
    return pageRender();
  }

  return isOpen ? ReactDOM.createPortal(pageRender(), container) : null;
};

export default BottomSheet;
