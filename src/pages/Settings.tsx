import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Globe, Key, Trash2, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { getGeminiApiKey, saveGeminiApiKey, clearAllData, clearUser } from '@/services/storageService';

export const Settings: React.FC = () => {
    const { t, language, setLanguage } = useLanguage();
    const navigate = useNavigate();
    const [apiKey, setApiKey] = useState('');
    const [showApiKey, setShowApiKey] = useState(false);

    useEffect(() => {
        const savedKey = getGeminiApiKey();
        if (savedKey) {
            setApiKey(savedKey);
        }
    }, []);

    const handleSaveApiKey = () => {
        saveGeminiApiKey(apiKey);
        alert('API key saved successfully!');
    };

    const handleClearData = () => {
        if (confirm(t('settings.confirmClear'))) {
            clearAllData();
            navigate('/login');
        }
    };

    const handleLogout = () => {
        if (confirm('Are you sure you want to logout?')) {
            clearUser();
            navigate('/login');
        }
    };

    return (
        <div className="settings-page">
            <div className="page-header">
                <h1>{t('settings.title')}</h1>
            </div>

            <div className="settings-container">
                <div className="setting-section">
                    <div className="setting-header">
                        <Globe size={24} />
                        <h2>{t('settings.language')}</h2>
                    </div>
                    <p className="setting-description">Choose your preferred language</p>
                    <div className="language-selector">
                        <button
                            className={language === 'en' ? 'language-button active' : 'language-button'}
                            onClick={() => setLanguage('en')}
                        >
                            English
                        </button>
                        <button
                            className={language === 'ur' ? 'language-button active' : 'language-button'}
                            onClick={() => setLanguage('ur')}
                        >
                            اردو (Urdu)
                        </button>
                    </div>
                </div>

                <div className="setting-section">
                    <div className="setting-header">
                        <Key size={24} />
                        <h2>{t('settings.apiKey')}</h2>
                    </div>
                    <p className="setting-description">
                        Enter your Google Gemini API key to enable AI-powered payment reminders.
                        Get your API key from <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer">Google AI Studio</a>
                    </p>
                    <div className="api-key-input">
                        <input
                            type={showApiKey ? 'text' : 'password'}
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            placeholder="Enter your Gemini API key"
                        />
                        <button
                            onClick={() => setShowApiKey(!showApiKey)}
                            className="secondary-button"
                        >
                            {showApiKey ? 'Hide' : 'Show'}
                        </button>
                        <button
                            onClick={handleSaveApiKey}
                            className="primary-button"
                        >
                            {t('settings.saveApiKey')}
                        </button>
                    </div>
                </div>

                <div className="setting-section danger">
                    <div className="setting-header">
                        <Trash2 size={24} />
                        <h2>{t('settings.clearData')}</h2>
                    </div>
                    <p className="setting-description">
                        This will permanently delete all your data including groups, members, and payment records.
                        This action cannot be undone.
                    </p>
                    <button onClick={handleClearData} className="danger-button">
                        <Trash2 size={18} />
                        {t('settings.clearData')}
                    </button>
                </div>

                <div className="setting-section">
                    <div className="setting-header">
                        <LogOut size={24} />
                        <h2>{t('nav.logout')}</h2>
                    </div>
                    <p className="setting-description">
                        Logout from your account. Your data will remain saved locally.
                    </p>
                    <button onClick={handleLogout} className="secondary-button">
                        <LogOut size={18} />
                        {t('nav.logout')}
                    </button>
                </div>

                <div className="app-info">
                    <p>CommitteePro v1.0.0</p>
                    <p>© 2025 All rights reserved</p>
                </div>
            </div>
        </div>
    );
};
