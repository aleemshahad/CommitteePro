
import React, { useState } from 'react';
import { MENU_ITEMS } from '../constants';
import { useLanguage } from '../context/LanguageContext';
import { Menu, X, LogOut, Wallet } from 'lucide-react';
import { TRANSLATIONS } from '../types';
import { db } from '../services/storageService';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, onTabChange }) => {
  const { language, setLanguage, t } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    db.logoutUser();
    // Force reload to clear state/show login screen
    window.location.reload();
  };

  return (
    <div className={`min-h-screen flex flex-col md:flex-row ${language === 'ur' ? 'dir-rtl' : ''}`}>
      {/* Mobile Header */}
      <div className="md:hidden bg-indigo-700 text-white p-4 flex justify-between items-center shadow-md z-20 sticky top-0">
        <div className="flex items-center gap-2">
            <Wallet className="w-6 h-6" />
            <span className="font-bold text-lg">CommitteePro</span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`
        fixed inset-y-0 left-0 z-10 w-64 bg-slate-900 text-slate-100 transform transition-transform duration-200 ease-in-out
        md:relative md:translate-x-0
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 flex items-center gap-3 border-b border-slate-700">
           <Wallet className="w-8 h-8 text-indigo-400" />
           <h1 className="text-xl font-bold tracking-tight">CommitteePro</h1>
        </div>

        <nav className="p-4 space-y-2">
          {MENU_ITEMS.map((item) => {
            const Icon = item.icon;
            const label = t[item.labelKey as keyof typeof TRANSLATIONS.en];
            return (
              <button
                key={item.id}
                onClick={() => {
                  onTabChange(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  activeTab === item.id 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50' 
                    : 'hover:bg-slate-800 text-slate-400'
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{label}</span>
              </button>
            );
          })}
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-slate-800">
            <div className="flex items-center justify-between px-2 mb-4">
                <span className="text-xs text-slate-500 uppercase font-semibold">{t.language}</span>
                <button 
                    onClick={() => setLanguage(language === 'en' ? 'ur' : 'en')}
                    className="text-sm bg-slate-800 px-3 py-1 rounded-md hover:bg-slate-700 border border-slate-700"
                >
                    {language === 'en' ? 'English' : 'اردو'}
                </button>
            </div>
            <button 
                onClick={handleLogout}
                className="flex items-center gap-2 text-slate-400 hover:text-white px-2 transition-colors w-full"
            >
                <LogOut size={18} />
                <span>{t.logout}</span>
            </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto h-[calc(100vh-64px)] md:h-screen p-4 md:p-8 relative">
        {children}
      </main>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
            className="fixed inset-0 bg-black/50 z-0 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
};
