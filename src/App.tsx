import React, { useState } from 'react';
import { AppProvider, useApp } from './contexts/AppContext';
import { Login } from './components/Login';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { FuelPage } from './components/FuelPage';
import { DriversPage } from './components/DriversPage';
import { TrucksPage } from './components/TrucksPage';
import { ReportsPage } from './components/ReportsPage';
import { SettingsPage } from './components/SettingsPage';

function AppContent() {
  const { user } = useApp();
  const [currentPage, setCurrentPage] = useState('dashboard');

  if (!user?.isAuthenticated) {
    return <Login />;
  }

  // Redirect employee users to allowed pages only
  const allowedPages = user.role === 'admin' 
    ? ['dashboard', 'fuel', 'drivers', 'trucks', 'reports', 'settings']
    : ['dashboard', 'fuel'];

  if (!allowedPages.includes(currentPage)) {
    setCurrentPage('dashboard');
  }
  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'fuel':
        return <FuelPage />;
      case 'drivers':
        return user.role === 'admin' ? <DriversPage /> : <Dashboard />;
      case 'trucks':
        return user.role === 'admin' ? <TrucksPage /> : <Dashboard />;
      case 'reports':
        return user.role === 'admin' ? <ReportsPage /> : <Dashboard />;
      case 'settings':
        return user.role === 'admin' ? <SettingsPage /> : <Dashboard />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout currentPage={currentPage} onPageChange={setCurrentPage}>
      {renderPage()}
    </Layout>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;