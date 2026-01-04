import Image from 'next/image';
import styles from './MaskedImage.module.css';
import React, { useEffect, useMemo, useRef, useState } from 'react';

const MaskedImage = ({ id, svg, src }: { id: string; svg: React.ReactElement<{ scaleFactor?: number }>; src: string }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  // Update container width on resize
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver(() => {
      setContainerWidth(container.getBoundingClientRect().width);
    });

    observer.observe(container);
    return () => observer.unobserve(container);
  }, []);

  // Memoize scaleFactor based on containerWidth
  const scaleFactor = useMemo(() => {
    return containerWidth / 500;
  }, [containerWidth]);

  return (
    <div ref={containerRef} className={styles.container}>
      {React.cloneElement(svg, { scaleFactor })}
      <div className={styles.imageWrapper}>
        <Image
          src={src}
          alt="Canva Clone Banner"
          fill
          priority
          className={styles.maskedImage}
          style={{
            clipPath: `url(#${id})`,
            WebkitClipPath: `url(#${id})`,
          }}
        />
      </div>
    </div>
  );
};

export default MaskedImage;