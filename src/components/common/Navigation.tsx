import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import './Navigation.css';

export const Navigation: React.FC = () => {
    const { user, logout } = useAuth();
    const { t, language, setLanguage } = useLanguage();
    const location = useLocation();
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    if (!user) return null;

    const navItems = [
        { path: '/dashboard', label: t('dashboard'), icon: '📊' },
        { path: '/committees', label: t('committees'), icon: '👥' },
        { path: '/payments', label: t('payments'), icon: '💰' },
        { path: '/draws', label: t('draws'), icon: '🎯' },
        { path: '/reports', label: t('reports'), icon: '📄' },
        { path: '/settings', label: t('settings'), icon: '⚙️' },
    ];

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const toggleLanguage = () => {
        setLanguage(language === 'en' ? 'ur' : 'en');
    };

    return (
        <nav className="navigation">
            <div className="nav-container">
                {/* Logo */}
                <Link to="/dashboard" className="nav-logo">
                    <span className="logo-icon">💼</span>
                    <span className="logo-text">{t('app_name')}</span>
                </Link>

                {/* Mobile Menu Toggle */}
                <button
                    className="mobile-menu-toggle"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    aria-label="Toggle menu"
                >
                    <span className="hamburger-line"></span>
                    <span className="hamburger-line"></span>
                    <span className="hamburger-line"></span>
                </button>

                {/* Nav Items */}
                <div className={`nav-items ${isMobileMenuOpen ? 'nav-items-open' : ''}`}>
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`nav-item ${location.pathname.startsWith(item.path) ? 'nav-item-active' : ''}`}
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            <span className="nav-icon">{item.icon}</span>
                            <span className="nav-label">{item.label}</span>
                        </Link>
                    ))}
                </div>

                {/* User Menu */}
                <div className="nav-actions">
                    <button className="language-btn" onClick={toggleLanguage} title="Toggle language">
                        <span>{language === 'en' ? 'اردو' : 'EN'}</span>
                    </button>

                    <div className="user-menu">
                        <div className="user-info">
                            <div className="user-avatar">
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="user-details">
                                <p className="user-name">{user.name}</p>
                                <p className="user-role">{t(user.role)}</p>
                            </div>
                        </div>
                        <button className="logout-btn" onClick={handleLogout}>
                            <span>🚪</span>
                            <span>{t('logout')}</span>
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};
