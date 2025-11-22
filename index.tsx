
import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { Layout } from './components/Layout';
import { LanguageProvider } from './context/LanguageContext';
import { Dashboard } from './pages/Dashboard';
import { Groups } from './pages/Groups';
import { GroupDetail } from './pages/GroupDetail';
import { Reports } from './pages/Reports';
import { Login } from './pages/Login';
import { db } from './services/storageService';
import { User } from './types';

const App = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for authenticated user on load
    const user = db.getCurrentUser();
    setCurrentUser(user);
    setLoading(false);
  }, []);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setSelectedGroupId(null);
  };

  const handleGroupSelect = (groupId: string) => {
    setSelectedGroupId(groupId);
  };

  const handleLoginSuccess = () => {
    const user = db.getCurrentUser();
    setCurrentUser(user);
  };

  // Render Login if not authenticated
  if (!loading && !currentUser) {
      return (
        <LanguageProvider>
            <Login onLoginSuccess={handleLoginSuccess} />
        </LanguageProvider>
      );
  }

  const renderContent = () => {
    if (selectedGroupId) {
      return (
        <GroupDetail 
          groupId={selectedGroupId} 
          onBack={() => setSelectedGroupId(null)} 
        />
      );
    }

    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'groups':
        return <Groups onSelectGroup={handleGroupSelect} />;
      case 'reports':
        return <Reports />;
      default:
        return <Dashboard />;
    }
  };

  if (loading) return null;

  return (
    <LanguageProvider>
      <Layout activeTab={activeTab} onTabChange={handleTabChange}>
        {renderContent()}
      </Layout>
    </LanguageProvider>
  );
};

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<App />);
