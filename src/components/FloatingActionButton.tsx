import React from 'react';
import { ArrowUpCircle } from 'lucide-react';

interface FloatingActionButtonProps {
  onAction: () => void;
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({ onAction }) => {
  return (
    <button
      onClick={onAction}
      className="fixed bottom-24 left-1/2 -translate-x-1/2 z-40 w-16 h-16 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center shadow-lg hover:opacity-90 transition-opacity"
      aria-label="Quick Action"
    >
      <ArrowUpCircle className="w-8 h-8 text-white" />
    </button>
  );
};

export default FloatingActionButton;