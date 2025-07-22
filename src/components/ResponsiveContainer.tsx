import React from 'react';
import { useResponsive, LayoutConfig } from '../lib/useResponsive';

interface ResponsiveContainerProps {
  children: React.ReactNode;
  className?: string;
  customLayout?: Partial<LayoutConfig>;
}

const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({
  children,
  className = '',
  customLayout
}) => {
  const { layout, screenSize } = useResponsive();

  // Merge custom layout with default layout
  const finalLayout = {
    ...layout,
    ...customLayout
  };

  const containerStyle = {
    padding: `${finalLayout.padding}px`,
    gap: `${finalLayout.gap}px`,
    maxWidth: finalLayout.maxWidth === 'full' ? '100%' : `${finalLayout.maxWidth}px`,
    display: 'grid',
    gridTemplateColumns: `repeat(${finalLayout.columns}, minmax(0, 1fr))`,
    margin: '0 auto',
    width: '100%'
  };

  return (
    <div 
      className={`responsive-container ${className}`}
      style={containerStyle}
      data-screen-size={screenSize}
    >
      {children}
    </div>
  );
};

export default ResponsiveContainer;