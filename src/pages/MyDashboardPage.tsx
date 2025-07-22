import React from 'react';
import { useNavigate } from 'react-router-dom';
import ModernSignalDashboard from '../components/ModernSignalDashboard';
import PageTransition from '../components/PageTransition';

const MyDashboardPage = () => {
  const navigate = useNavigate();

  return (
    <PageTransition>
      <div className="min-h-screen bg-slate-900 text-white pb-20">
        <ModernSignalDashboard />
      </div>
    </PageTransition>
  );
};

export default MyDashboardPage;