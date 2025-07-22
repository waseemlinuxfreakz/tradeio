import React from 'react';

interface SwipeProgressIndicatorProps {
  progress: number;
}

const SwipeProgressIndicator: React.FC<SwipeProgressIndicatorProps> = ({ progress }) => {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center gap-2 p-2">
      {[0, 1, 2].map((index) => (
        <div
          key={index}
          className="h-1 w-12 rounded-full transition-all duration-300"
          style={{
            backgroundColor: progress >= (index + 1) * 33.33 ? '#ec4899' : 'rgba(255, 255, 255, 0.2)',
          }}
        />
      ))}
    </div>
  );
};

export default SwipeProgressIndicator;