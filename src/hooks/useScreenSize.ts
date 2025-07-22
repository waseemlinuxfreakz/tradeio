import { useEffect, useState } from 'react';

interface ScreenSize {
  width: number;
  height: number;
  orientation: 'portrait' | 'landscape';
  aspectRatio: number;
  devicePixelRatio: number;
}

export function useScreenSize(): ScreenSize {
  const [screenSize, setScreenSize] = useState<ScreenSize>({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
    orientation: typeof window !== 'undefined' ? 
      window.innerHeight > window.innerWidth ? 'portrait' : 'landscape' : 'portrait',
    aspectRatio: typeof window !== 'undefined' ? 
      window.innerWidth / window.innerHeight : 0,
    devicePixelRatio: typeof window !== 'undefined' ? 
      window.devicePixelRatio : 1
  });

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const handleResize = () => {
      // Debounce resize events
      clearTimeout(timeoutId);
      
      timeoutId = setTimeout(() => {
        setScreenSize({
          width: window.innerWidth,
          height: window.innerHeight,
          orientation: window.innerHeight > window.innerWidth ? 'portrait' : 'landscape',
          aspectRatio: window.innerWidth / window.innerHeight,
          devicePixelRatio: window.devicePixelRatio
        });
      }, 100);
    };

    // Listen for resize and orientation change events
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    // Initial size check
    handleResize();

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  return screenSize;
}