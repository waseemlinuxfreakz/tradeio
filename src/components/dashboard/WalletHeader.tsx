import React from 'react';
import { Wallet } from 'lucide-react';

interface WalletHeaderProps {
  balance: string;
  onConnect: () => void;
}

const WalletHeader: React.FC<WalletHeaderProps> = ({ balance, onConnect }) => {
  return (
    <div className="sticky top-0 z-50 bg-[#0f172a]/95 backdrop-blur-sm p-3 border-b border-slate-800/50">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2 text-slate-300">
          <Wallet className="w-4 h-4 text-pink-500" />
          <span className="text-sm">Balance:</span>
          <span className="text-sm font-bold">{balance} TRT</span>
        </div>
        <button 
          onClick={onConnect}
          className="px-4 py-1.5 bg-pink-500 rounded-full text-sm font-medium text-white hover:bg-pink-600 transition-colors"
        >
          Connect Wallet
        </button>
      </div>
    </div>
  );
};

export default WalletHeader;