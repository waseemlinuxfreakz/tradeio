import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const BottomCTA = () => {
  const navigate = useNavigate();

  return (
    <div className="px-6 py-12 text-center">
      <h2 className="text-2xl font-bold mb-4">Ready to Start Trading?</h2>
      <p className="text-slate-400 mb-8">Join our community and start making smarter trading decisions today.</p>
      
      <button
        onClick={() => navigate('/register')}
        className="w-full max-w-xs bg-gradient-to-r from-pink-500 to-purple-600 py-3 rounded-xl font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
      >
        Create Free Account
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
};

export default BottomCTA;