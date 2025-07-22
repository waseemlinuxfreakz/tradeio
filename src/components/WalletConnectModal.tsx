import React, { useEffect, useState } from 'react';
import { X, Send } from 'lucide-react';
import { useAuthStore } from '../lib/store';
import { connectTelegramWallet } from '../lib/telegram';

interface WalletConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WalletConnectModal: React.FC<WalletConnectModalProps> = ({ isOpen, onClose }) => {
  const { actions } = useAuthStore();
  const [connecting, setConnecting] = useState(false);

  const handleTelegramConnect = () => {
    try {
      setConnecting(true);

      // Check if already in Telegram WebApp
      const tg = window.Telegram?.WebApp;
      if (tg?.initDataUnsafe?.user?.username) {
        actions.setTelegramUsername(tg.initDataUnsafe.user.username);
        onClose();
        return;
      }

      // If not in Telegram, redirect to Telegram
      connectTelegramWallet();
      
    } catch (error) {
      console.error('Failed to connect Telegram wallet:', error);
      alert('Please open this app in Telegram to connect your wallet');
    } finally {
      setConnecting(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      handleTelegramConnect();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-slate-800 rounded-xl w-full max-w-sm relative animate-in fade-in slide-in-from-bottom duration-300">
        <div className="p-4 border-b border-slate-700">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Send className="w-5 h-5 text-[#229ED9]" />
              <h3 className="text-lg font-bold">Connect Wallet</h3>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-slate-700/50 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 text-center">
          {connecting ? (
            <>
              <div className="animate-spin w-8 h-8 border-2 border-pink-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-slate-400">
                Opening Telegram to connect your wallet...
              </p>
            </>
          ) : (
            <p className="text-slate-400">
              Please continue in Telegram app
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default WalletConnectModal;