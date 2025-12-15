import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import './Login.css';

export const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const { t, language, setLanguage, isRTL } = useLanguage();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setMessage('');

        if (!email || !email.includes('@')) {
            setError(t('invalid_email'));
            return;
        }

        setIsLoading(true);
        try {
            await login(email);
            setMessage(t('magic_link_sent'));
            setEmail('');
        } catch (err) {
            setError(t('authentication_failed'));
        } finally {
            setIsLoading(false);
        }
    };

    const toggleLanguage = () => {
        setLanguage(language === 'en' ? 'ur' : 'en');
    };

    return (
        <div className="login-page">
            <div className="login-container">
                {/* Language Toggle */}
                <button className="language-toggle" onClick={toggleLanguage}>
                    {language === 'en' ? 'اردو' : 'English'}
                </button>

                {/* Logo/Brand */}
                <div className="login-header">
                    <div className="logo-circle">
                        <span className="logo-icon">💼</span>
                    </div>
                    <h1 className="app-title">{t('app_name')}</h1>
                    <p className="app-subtitle">
                        {language === 'en'
                            ? 'Committee Management Made Simple'
                            : 'کمیٹی کا انتظام آسان بنایا'}
                    </p>
                </div>

                {/* Login Form */}
                <div className="login-card">
                    <h2 className="login-title">{t('welcome')}</h2>
                    <p className="login-description">
                        {language === 'en'
                            ? 'Enter your email to receive a magic login link'
                            : 'اپنی ای میل درج کریں اور میجک لاگ ان لنک حاصل کریں'}
                    </p>

                    <form onSubmit={handleSubmit} className="login-form">
                        <div className="form-group">
                            <label htmlFor="email" className="form-label">
                                <span className="label-icon">📧</span>
                                {t('email')}
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder={language === 'en' ? 'your@email.com' : 'آپ کی@ای میل.com'}
                                className="form-input"
                                disabled={isLoading}
                                dir={isRTL ? 'rtl' : 'ltr'}
                            />
                        </div>

                        {message && (
                            <div className="alert alert-success">
                                <span className="alert-icon">✓</span>
                                <p>{message}</p>
                                <p className="alert-subtext">{t('check_email')}</p>
                            </div>
                        )}

                        {error && (
                            <div className="alert alert-error">
                                <span className="alert-icon">⚠</span>
                                <p>{error}</p>
                            </div>
                        )}

                        <button
                            type="submit"
                            className="btn btn-primary btn-lg btn-full"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <span className="spinner"></span>
                                    {t('loading')}
                                </>
                            ) : (
                                <>
                                    <span>✨</span>
                                    {t('magic_link')}
                                </>
                            )}
                        </button>
                    </form>

                    {/* Demo Credentials */}
                    <div className="demo-info">
                        <p className="demo-title">
                            {language === 'en' ? '🎯 Demo Accounts' : '🎯 ڈیمو اکاؤنٹس'}
                        </p>
                        <div className="demo-accounts">
                            <div className="demo-account">
                                <strong>{language === 'en' ? 'Super Admin' : 'سپر منتظم'}:</strong>
                                <code>admin@committeepro.com</code>
                            </div>
                            <div className="demo-account">
                                <strong>{language === 'en' ? 'Member' : 'رکن'}:</strong>
                                <code>member@example.com</code>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Features */}
                <div className="features-grid">
                    <div className="feature-item">
                        <span className="feature-icon">🔐</span>
                        <p>{language === 'en' ? 'Secure Login' : 'محفوظ لاگ ان'}</p>
                    </div>
                    <div className="feature-item">
                        <span className="feature-icon">💰</span>
                        <p>{language === 'en' ? 'Easy Payments' : 'آسان ادائیگی'}</p>
                    </div>
                    <div className="feature-item">
                        <span className="feature-icon">🎯</span>
                        <p>{language === 'en' ? 'Fair Draws' : 'منصفانہ قرعہ'}</p>
                    </div>
                    <div className="feature-item">
                        <span className="feature-icon">🌍</span>
                        <p>{language === 'en' ? 'Multi-language' : 'کثیر لسانی'}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
