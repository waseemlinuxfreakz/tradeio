import React from 'react';
import { Spin } from 'antd';

interface FullPageLoaderProps {
  loading: boolean;
}

const FullPageLoader: React.FC<FullPageLoaderProps> = ({ loading }) => {
  if (!loading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80">
      <Spin spinning={true} size="large" />
    </div>
  );
};

export default FullPageLoader;
