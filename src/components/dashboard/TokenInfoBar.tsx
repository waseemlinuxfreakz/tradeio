import React, { useState } from 'react';
import { Wallet } from 'lucide-react';
import WalletConnectModal from '../WalletConnectModal';

interface TokenInfoBarProps {
  balance: string;
  currency: string;
  onWalletConnect?: () => void;
}

const TokenInfoBar: React.FC<TokenInfoBarProps> = ({ balance, currency, onWalletConnect }) => {
  const [showWalletModal, setShowWalletModal] = useState(false);

  const handleWalletConnect = () => {
    setShowWalletModal(true);
    onWalletConnect?.();
  };

  return (
    <>
      <div className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700/50 p-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Wallet className="w-4 h-4 text-pink-500" />
            <span className="text-sm text-slate-400">Balance:</span>
            <span className="text-sm font-bold">{balance} {currency}</span>
          </div>
          <button 
            onClick={handleWalletConnect}
            className="px-4 py-1.5 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-xs font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            <Wallet className="w-3 h-3" />
            Connect Wallet
          </button>
        </div>
      </div>

      <WalletConnectModal 
        isOpen={showWalletModal}
        onClose={() => setShowWalletModal(false)}
      />
    </>
  );
};

export default TokenInfoBar;