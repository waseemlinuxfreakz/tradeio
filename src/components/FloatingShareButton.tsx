import React from 'react';
import { Share2 } from 'lucide-react';
import ShareModal from './ShareModal';

interface FloatingShareButtonProps {
  type?: 'signal' | 'profile' | 'system';
  data?: {
    title?: string;
    description?: string;
    url?: string;
  };
}

const FloatingShareButton: React.FC<FloatingShareButtonProps> = ({ type = 'system', data }) => {
  const [showShareModal, setShowShareModal] = React.useState(false);

  return (
    <>
      <button
        onClick={() => setShowShareModal(true)}
        className="fixed bottom-24 right-4 z-40 w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center shadow-lg hover:opacity-90 transition-opacity"
        aria-label="Share"
      >
        <Share2 className="w-5 h-5 text-white" />
      </button>

      <ShareModal 
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
      />
    </>
  );
};

export default FloatingShareButton;