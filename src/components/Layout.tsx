import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, FileText, Settings, LogOut, Sparkles } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { clearUser } from '@/services/storageService';

export const Layout: React.FC = () => {
    const { t } = useLanguage();
    const navigate = useNavigate();

    const handleLogout = () => {
        if (confirm('Are you sure you want to logout?')) {
            clearUser();
            navigate('/login');
        }
    };

    return (
        <div className="app-layout">
            <aside className="sidebar">
                <div className="sidebar-header">
                    <Sparkles size={32} />
                    <h1>CommitteePro</h1>
                </div>

                <nav className="sidebar-nav">
                    <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                        <LayoutDashboard size={20} />
                        <span>{t('nav.dashboard')}</span>
                    </NavLink>

                    <NavLink to="/groups" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                        <Users size={20} />
                        <span>{t('nav.groups')}</span>
                    </NavLink>

                    <NavLink to="/reports" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                        <FileText size={20} />
                        <span>{t('nav.reports')}</span>
                    </NavLink>

                    <NavLink to="/settings" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                        <Settings size={20} />
                        <span>{t('nav.settings')}</span>
                    </NavLink>
                </nav>

                <div className="sidebar-footer">
                    <button onClick={handleLogout} className="logout-button">
                        <LogOut size={20} />
                        <span>{t('nav.logout')}</span>
                    </button>
                </div>
            </aside>

            <main className="main-content">
                <Outlet />
            </main>
        </div>
    );
};
