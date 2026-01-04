import { useState, useEffect, DependencyList } from 'react';

function useDebouncedEffect(callback: { (): void; (): void; }, delay: number | undefined, dependencies: DependencyList | undefined) {
  useEffect(() => {
    const handler = setTimeout(() => {
      callback();
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, dependencies);
}

export default useDebouncedEffect;
