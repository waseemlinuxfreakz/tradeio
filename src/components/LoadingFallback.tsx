import React from 'react';

const LoadingFallback: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 mx-auto relative">
          <div className="absolute inset-0 rounded-full border-4 border-pink-500/30 animate-pulse"></div>
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-pink-500 animate-spin"></div>
        </div>
        <div className="space-y-2">
          <p className="text-slate-300 font-medium">Loading your dashboard...</p>
          <p className="text-sm text-slate-400">Please wait while we fetch your data</p>
        </div>
      </div>
    </div>
  );
};

export default LoadingFallback;