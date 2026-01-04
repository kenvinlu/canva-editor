import debounce from 'lodash/debounce';
import { useCallback, useEffect, useState } from 'react';
import { singletonHook } from 'react-singleton-hook';

const initState = false;
const useMobileDetect = singletonHook(initState, () => {
  const [isMobile, setIsMobile] = useState(initState);
  const width = 900;

  const windowListener = useCallback(
    debounce(() => {
      if (window) {
        setIsMobile(window.innerWidth < width);
      }
    }, 250),
    []
  );

  useEffect(() => {
    if (window) {
      setIsMobile(window.innerWidth < width);
      window.addEventListener('resize', windowListener);
    }
    return () => {
      windowListener.cancel();
      window && window.removeEventListener('resize', windowListener);
    };
  }, []);

  return isMobile;
});

export default useMobileDetect;
