import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home } from 'lucide-react';
import PageTransition from '../components/PageTransition';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <PageTransition>
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-24 h-24 bg-pink-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">404</span>
          </div>
          <h2 className="text-2xl font-bold mb-2">Page Not Found</h2>
          <p className="text-slate-400 mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl font-medium hover:opacity-90 transition-opacity"
          >
            <Home className="w-5 h-5" />
            Return Home
          </button>
        </div>
      </div>
    </PageTransition>
  );
};

export default NotFoundPage;