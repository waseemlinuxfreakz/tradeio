import React from 'react';

interface LoadingSkeletonProps {
  type?: 'card' | 'text' | 'avatar';
  count?: number;
}

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ type = 'card', count = 1 }) => {
  const renderSkeleton = () => {
    switch (type) {
      case 'card':
        return (
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50 animate-pulse">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-slate-700 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-slate-700 rounded w-3/4"></div>
                <div className="h-3 bg-slate-700 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        );
      case 'text':
        return <div className="h-4 bg-slate-700 rounded animate-pulse"></div>;
      case 'avatar':
        return <div className="w-12 h-12 bg-slate-700 rounded-full animate-pulse"></div>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index}>{renderSkeleton()}</div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;