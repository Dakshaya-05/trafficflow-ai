import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import AuthModal from './components/AuthModal';

export default function App() {
  const [currentView, setCurrentView] = useState('landing'); // 'landing' or 'dashboard'
  const [initialTab, setInitialTab] = useState('dashboard');

  const goToDashboardWithTab = (tab = 'dashboard') => {
    setInitialTab(tab);
    setCurrentView('dashboard');
  };

  return (
    <AuthProvider>
      <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-cyan-500 selection:text-slate-950">
        {currentView === 'landing' ? (
          <LandingPage
            onOpenDashboard={() => goToDashboardWithTab('dashboard')}
            onExplorePredictions={() => goToDashboardWithTab('predict')}
          />
        ) : (
          <DashboardPage
            initialTab={initialTab}
            onGoHome={() => setCurrentView('landing')}
          />
        )}

        {/* Global JWT Authentication & Registration Modal */}
        <AuthModal />
      </div>
    </AuthProvider>
  );
}
