import { useState, useEffect } from 'react';

// Define breakpoints (in pixels)
export const breakpoints = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

// Define screen sizes
export type ScreenSize = keyof typeof breakpoints;

// Define layout configurations for different screen sizes
export interface LayoutConfig {
  padding: number;
  gap: number;
  columns: number;
  maxWidth: number | 'full';
}

export const defaultLayouts: Record<ScreenSize, LayoutConfig> = {
  xs: {
    padding: 16,
    gap: 16,
    columns: 1,
    maxWidth: 'full',
  },
  sm: {
    padding: 20,
    gap: 20,
    columns: 2,
    maxWidth: 640,
  },
  md: {
    padding: 24,
    gap: 24,
    columns: 2,
    maxWidth: 768,
  },
  lg: {
    padding: 32,
    gap: 32,
    columns: 3,
    maxWidth: 1024,
  },
  xl: {
    padding: 40,
    gap: 40,
    columns: 4,
    maxWidth: 1280,
  },
  '2xl': {
    padding: 48,
    gap: 48,
    columns: 4,
    maxWidth: 1536,
  },
};

export interface ResponsiveInfo {
  screenSize: ScreenSize;
  width: number;
  height: number;
  layout: LayoutConfig;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}

export function useResponsive(): ResponsiveInfo {
  const [dimensions, setDimensions] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    const handleResize = () => {
      // Debounce resize events
      let timeoutId: NodeJS.Timeout;
      clearTimeout(timeoutId);
      
      timeoutId = setTimeout(() => {
        setDimensions({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      }, 100);
    };

    window.addEventListener('resize', handleResize);
    
    // Initial size check
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Determine current screen size based on width
  const getCurrentScreenSize = (): ScreenSize => {
    const sortedBreakpoints = Object.entries(breakpoints)
      .sort(([, a], [, b]) => b - a);

    const [size] = sortedBreakpoints.find(([, minWidth]) => 
      dimensions.width >= minWidth
    ) || ['xs'];

    return size as ScreenSize;
  };

  const screenSize = getCurrentScreenSize();
  const layout = defaultLayouts[screenSize];

  return {
    screenSize,
    width: dimensions.width,
    height: dimensions.height,
    layout,
    isMobile: dimensions.width < breakpoints.md,
    isTablet: dimensions.width >= breakpoints.md && dimensions.width < breakpoints.lg,
    isDesktop: dimensions.width >= breakpoints.lg,
  };
}