
import React, { useState } from 'react';
import { MENU_ITEMS } from '../constants';
import { useLanguage } from '../context/LanguageContext';
import { Menu, X, LogOut, Wallet, Languages, PlusCircle, Globe, Check, ShieldCheck } from 'lucide-react';
import { TRANSLATIONS } from '../types';
import { db } from '../services/storageService';
import { RecordPaymentModal } from './RecordPaymentModal';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, onTabChange }) => {
  const { language, setLanguage, t } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isRecordPaymentOpen, setIsRecordPaymentOpen] = useState(false);

  const handleLogout = () => {
    db.logoutUser();
    // Force reload to clear state/show login screen
    window.location.reload();
  };

  const handlePaymentSuccess = () => {
    // Reload active tab / state
    window.dispatchEvent(new Event('storage'));
  };

  return (
    <div className={`min-h-screen flex flex-col md:flex-row bg-slate-50 text-slate-900 ${language === 'ur' ? 'dir-rtl font-sans' : ''}`}>
      {/* Sidebar Navigation */}
      <aside className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-slate-900 text-slate-100 transform transition-transform duration-200 ease-in-out
        md:relative md:translate-x-0
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 flex items-center justify-between border-b border-slate-800">
           <div className="flex items-center gap-3">
             <div className="p-2 bg-indigo-600 rounded-xl text-white shadow-md shadow-indigo-900/50">
               <Wallet className="w-6 h-6" />
             </div>
             <div>
               <h1 className="text-lg font-extrabold tracking-tight text-white">CommitteePro</h1>
               <span className="text-[10px] text-indigo-300 font-medium tracking-wide uppercase">ROSCA Manager</span>
             </div>
           </div>
           <button onClick={() => setIsMobileMenuOpen(false)} className="md:hidden text-slate-400 hover:text-white">
             <X size={20} />
           </button>
        </div>

        <nav className="p-4 space-y-1.5">
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
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-medium text-sm transition-all ${
                  activeTab === item.id 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50 font-bold' 
                    : 'hover:bg-slate-800 text-slate-400 hover:text-slate-100'
                }`}
              >
                <Icon size={18} />
                <span>{label}</span>
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer with Language & Logout */}
        <div className="absolute bottom-0 w-full p-4 border-t border-slate-800 space-y-3 bg-slate-900">
            <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700/60">
                <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-2 flex items-center gap-1.5">
                  <Globe size={13} className="text-indigo-400" />
                  <span>{t.language}</span>
                </div>
                <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800">
                    <button 
                        onClick={() => setLanguage('en')}
                        className={`py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1 ${
                          language === 'en' 
                            ? 'bg-indigo-600 text-white shadow-xs' 
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                    >
                        <span>English</span>
                        {language === 'en' && <Check size={12} />}
                    </button>
                    <button 
                        onClick={() => setLanguage('ur')}
                        className={`py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1 ${
                          language === 'ur' 
                            ? 'bg-indigo-600 text-white shadow-xs' 
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                    >
                        <span>اردو</span>
                        {language === 'ur' && <Check size={12} />}
                    </button>
                </div>
            </div>

            <button 
                onClick={handleLogout}
                className="flex items-center justify-center gap-2 text-slate-400 hover:text-red-400 p-2.5 transition-colors w-full rounded-xl hover:bg-slate-800/50 text-sm font-semibold"
            >
                <LogOut size={16} />
                <span>{t.logout}</span>
            </button>
        </div>
      </aside>

      {/* Main Wrapper */}
      <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
        {/* Top Navigation Bar Header */}
        <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 md:px-8 py-3.5 flex items-center justify-between shadow-xs">
          {/* Mobile menu button & brand */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
              aria-label="Toggle menu"
            >
              <Menu size={22} />
            </button>

            <div className="hidden md:flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Online Sync Active
              </span>
            </div>
          </div>

          {/* Top Actions: Admin Role Badge, Language Switcher & Quick Record Payment Button */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Admin Role Selector / Badge */}
            <div className="flex items-center gap-1.5 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200/80 px-2.5 py-1.5 rounded-2xl shadow-2xs">
              <ShieldCheck size={16} className="text-indigo-600 shrink-0" />
              <div className="flex flex-col">
                <span className="text-[9px] uppercase font-bold text-indigo-500 tracking-wider hidden sm:inline">Active Access</span>
                <select
                  value={db.getCurrentUser()?.role || 'SUPER_ADMIN'}
                  onChange={(e) => {
                    db.switchUserRole(e.target.value as any);
                    window.location.reload();
                  }}
                  className="bg-transparent text-xs font-extrabold text-indigo-950 focus:outline-hidden cursor-pointer"
                  title={t.roleSwitch}
                >
                  <option value="SUPER_ADMIN">👑 {t.superAdmin}</option>
                  <option value="GROUP_ADMIN">🛡️ {t.groupAdmin}</option>
                </select>
              </div>
            </div>

            {/* Quick Record Payment Action Button */}
            <button
              onClick={() => setIsRecordPaymentOpen(true)}
              className="px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/20 transition-all flex items-center gap-1.5 active:scale-95"
            >
              <PlusCircle size={17} />
              <span>{t.recordPayment}</span>
            </button>

            {/* Top Navigation Bar Language Switcher Button */}
            <div className="flex items-center p-1 bg-slate-100 border border-slate-200 rounded-2xl shadow-inner">
              <button
                onClick={() => setLanguage('en')}
                className={`px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 ${
                  language === 'en'
                    ? 'bg-white text-indigo-700 shadow-sm border border-slate-200/60'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Switch to English"
              >
                <span>🇬🇧</span>
                <span className="hidden xs:inline">English</span>
              </button>

              <button
                onClick={() => setLanguage('ur')}
                className={`px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 ${
                  language === 'ur'
                    ? 'bg-white text-indigo-700 shadow-sm border border-slate-200/60'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="اردو زبان میں تبدیل کریں"
              >
                <span>🇵🇰</span>
                <span className="hidden xs:inline">اردو</span>
              </button>
            </div>
          </div>
        </header>

        {/* Main View Area */}
        <main className="flex-1 p-4 md:p-8">
          {children}
        </main>
      </div>

      {/* Record Payment Global Modal */}
      <RecordPaymentModal
        isOpen={isRecordPaymentOpen}
        onClose={() => setIsRecordPaymentOpen(false)}
        onSuccess={handlePaymentSuccess}
      />

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-20 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
};
