import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Sparkles } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { saveUser } from '@/services/storageService';
import { User } from '@/types';
import { useLanguage } from '@/context/LanguageContext';

export const Login: React.FC = () => {
    const { t } = useLanguage();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [step, setStep] = useState<'email' | 'name' | 'sent'>('email');
    const [loading, setLoading] = useState(false);

    const handleSendMagicLink = async () => {
        if (!email) return;

        setLoading(true);
        // Simulate sending magic link
        setTimeout(() => {
            setStep('name');
            setLoading(false);
        }, 1000);
    };

    const handleContinue = () => {
        if (!name) return;

        const user: User = {
            id: uuidv4(),
            email,
            name,
            createdAt: new Date().toISOString(),
        };

        saveUser(user);
        navigate('/dashboard');
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <div className="login-header">
                    <div className="logo">
                        <Sparkles size={48} />
                    </div>
                    <h1>{t('login.title')}</h1>
                    <p>{t('login.subtitle')}</p>
                </div>

                <div className="login-form">
                    {step === 'email' && (
                        <>
                            <div className="form-group">
                                <label htmlFor="email">
                                    <Mail size={20} />
                                    {t('login.email')}
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    onKeyPress={(e) => e.key === 'Enter' && handleSendMagicLink()}
                                />
                            </div>
                            <button
                                onClick={handleSendMagicLink}
                                disabled={!email || loading}
                                className="primary-button"
                            >
                                {loading ? t('common.loading') : t('login.sendMagicLink')}
                            </button>
                        </>
                    )}

                    {step === 'name' && (
                        <>
                            <div className="form-group">
                                <label htmlFor="name">{t('login.enterName')}</label>
                                <input
                                    type="text"
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="John Doe"
                                    onKeyPress={(e) => e.key === 'Enter' && handleContinue()}
                                    autoFocus
                                />
                            </div>
                            <button
                                onClick={handleContinue}
                                disabled={!name}
                                className="primary-button"
                            >
                                {t('login.continue')}
                            </button>
                        </>
                    )}
                </div>

                <div className="login-footer">
                    <p>© 2025 CommitteePro. All rights reserved.</p>
                </div>
            </div>

            <div className="login-background">
                <div className="gradient-orb orb-1"></div>
                <div className="gradient-orb orb-2"></div>
                <div className="gradient-orb orb-3"></div>
            </div>
        </div>
    );
};
