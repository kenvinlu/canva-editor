import { useRef, useState, useEffect, FC, ReactNode } from 'react';
import ArrowRightIcon from 'canva-editor/icons/ArrowRightIcon';
import ArrowLeftIcon from 'canva-editor/icons/ArrowLeftIcon';
import './HorizontalCarousel.css';

const HorizontalCarousel: FC<{ children: ReactNode }> = ({ children }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showBackButton, setShowBackButton] = useState(false);
  const [showNextButton, setShowNextButton] = useState(false);
  const [navBtnHeight, setNavBtnHeigth] = useState(0);

  const scrollLeft = () => {
    if (containerRef.current) {
      containerRef.current.scrollLeft -= 200;
    }
  };

  const scrollRight = () => {
    if (containerRef.current) {
      containerRef.current.scrollLeft += 200;
    }
  };

  const handleScroll = () => {
    if (containerRef.current) {
      const shouldShowBackButton = containerRef.current.scrollLeft > 0;
      const shouldShowNextButton =
        containerRef.current.scrollLeft + containerRef.current.clientWidth <
        containerRef.current.scrollWidth;
      const shouldShowAnyButton =
        containerRef.current.scrollWidth > containerRef.current.clientWidth;

      setShowBackButton(shouldShowBackButton && shouldShowAnyButton);
      setShowNextButton(shouldShowNextButton && shouldShowAnyButton);
    }
  };

  useEffect(() => {
    handleScroll();

    if (containerRef.current) {
      setNavBtnHeigth(containerRef.current.scrollHeight);
      containerRef.current.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (containerRef.current) {
        containerRef.current.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  return (
    <div className='horizontal-carousel'>
      <div className='carousel-container' ref={containerRef}>
        {children}
      </div>
      {showBackButton && (
        <button
          className='arrow left'
          onClick={scrollLeft}
          css={{ height: navBtnHeight }}
        >
          <ArrowLeftIcon />
        </button>
      )}
      {showNextButton && (
        <button
          className='arrow right'
          onClick={scrollRight}
          css={{ height: navBtnHeight }}
        >
          <ArrowRightIcon />
        </button>
      )}
    </div>
  );
};

export default HorizontalCarousel;
