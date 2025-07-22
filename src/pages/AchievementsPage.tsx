import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import NavigationBar from '../components/NavigationBar';
import AchievementsPanel from '../components/profile/AchievementsPanel';

const AchievementsPage = () => {
  const navigate = useNavigate();
  return (
    <PageTransition>
      <div className="min-h-screen bg-slate-900 text-white pb-20">
        {/* Header */}
        <div className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800">
          <div className="p-4 flex items-center gap-3">
            <button 
              onClick={() => navigate(-1)}
              className="p-2 rounded-full bg-slate-800/50 hover:bg-slate-700/50 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-bold">Achievements</h1>
          </div>
        </div>
        
        {/* Achievements Panel */}
        <AchievementsPanel />
        
        <NavigationBar onQuickAction={() => navigate('/create-signal')} />
      </div>
    </PageTransition>
  );
};

export default AchievementsPage;