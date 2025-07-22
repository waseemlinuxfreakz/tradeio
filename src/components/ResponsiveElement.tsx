import React from 'react';
import { useResponsive } from '../lib/useResponsive';

interface ResponsiveElementProps {
  children: React.ReactNode;
  className?: string;
  mobileStyles?: React.CSSProperties;
  tabletStyles?: React.CSSProperties;
  desktopStyles?: React.CSSProperties;
  style?: React.CSSProperties;
}

const ResponsiveElement: React.FC<ResponsiveElementProps> = ({
  children,
  className = '',
  mobileStyles = {},
  tabletStyles = {},
  desktopStyles = {},
  style = {}
}) => {
  const { isMobile, isTablet, isDesktop } = useResponsive();

  const responsiveStyles = {
    ...style,
    ...(isMobile ? mobileStyles : {}),
    ...(isTablet ? tabletStyles : {}),
    ...(isDesktop ? desktopStyles : {})
  };

  return (
    <div className={className} style={responsiveStyles}>
      {children}
    </div>
  );
};

export default ResponsiveElement;