import { FC, PropsWithChildren, useRef, useState } from 'react';

type CoordinatesType = { x: number; y: number } | null;
type DrapableProps = {
  onDrop: (pos: CoordinatesType) => void;
  onClick?: () => void;
};
const Draggable: FC<PropsWithChildren<DrapableProps>> = ({
  children,
  onDrop,
  onClick,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const dragRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isClick, setIsClick] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [size, setSize] = useState({ w: 50, h: 50 });

  const handleMouseDown = (e: any) => {
    setIsClick(true);

    setTimeout(() => {
      if (isClick) {
        // If the mouse is still down after a delay (e.g., 200ms), consider it a click
        // You can adjust the delay based on your needs
        setIsDragging(false);
        // Prevent the onClick event from firing
        e.preventDefault();
      }
    }, 200);

    const offsetX = e.nativeEvent.offsetX;
    const offsetY = e.nativeEvent.offsetY;
    const offsetW = ref.current?.offsetWidth || 0;
    const offsetH = ref.current?.offsetHeight ? ref.current?.offsetHeight / 2 : 0;

    setPosition({ x: e.clientX - offsetX, y: e.clientY - offsetY - offsetH });
    setSize({ w: offsetW, h: offsetH });

    function isInDropArea(e: MouseEvent) {
      const dropArea: any = getElementByClassNearestTheCursorPosition(
        e,
        'page-content'
      );
      if (!dropArea) return false;

      // Get cursor coordinates
      const clientX = e.clientX;
      const clientY = e.clientY;

      // Get drop area coordinates
      const dropAreaRect = dropArea.getBoundingClientRect();
      const x = dropAreaRect.left;
      const y = dropAreaRect.top;
      const width = dropAreaRect.width;
      const height = dropAreaRect.height;

      return (
        clientX >= x &&
        clientX <= x + width &&
        clientY >= y &&
        clientY <= y + height
      );
    }

    const handleMouseMove = (e: MouseEvent) => {
      setIsClick(false);
      setIsDragging(true);

      const x = e.clientX - offsetX,
        y = e.clientY - offsetY - offsetH;
      setPosition({ x, y });
    };

    const handleMouseUp = (e: MouseEvent) => {
      setIsDragging(false);
      onDrop(
        isInDropArea(e)
          ? { x: e.clientX - offsetW, y: e.clientY - offsetH }
          : null
      );
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  function getElementByClassNearestTheCursorPosition(
    e: MouseEvent,
    className: string
  ) {
    // Get the coordinates of the cursor.
    const cursorX = e.clientX;
    const cursorY = e.clientY;

    // Get all elements with the specified class.
    const elements = document.querySelectorAll(`.${className}`);

    // Find the element that is closest to the cursor.
    let closestElement: Element | null = null;
    let closestDistance = Infinity;

    for (const element of elements) {
      // Get the coordinates of the element.
      const elementRect = element.getBoundingClientRect();

      // Calculate the distance between the cursor and the element.
      const distance = Math.sqrt(
        Math.pow(cursorX - elementRect.left, 2) +
          Math.pow(cursorY - elementRect.top, 2)
      );

      // If the distance is smaller than the current closest distance, update the closest element.
      if (distance < closestDistance) {
        closestElement = element;
        closestDistance = distance;
      }
    }

    // Return the closest element.
    return closestElement;
  }

  return (
    <>
      <div
        ref={ref}
        onMouseDown={handleMouseDown}
        onClick={() => {
          if (isClick && onClick) {
            onClick();
          }
        }}
      >
        {isDragging && (
          <div
            css={{
              width: size.w,
              height: size.h
            }}
          >
            {''}
          </div>
        )}
        <div
          ref={dragRef}
          style={{
            ...(isDragging && {
              position: 'absolute',
              left: position.x,
              top: position.y,
              width: size.w,
              height: size.h,
              zIndex: 1
            }),
          }}
        >
          {children}
        </div>
      </div>
    </>
  );
};
export default Draggable;
