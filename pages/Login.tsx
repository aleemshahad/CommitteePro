
import React, { useState } from 'react';
import { db } from '../services/storageService';
import { useLanguage } from '../context/LanguageContext';
import { Wallet, Mail, ArrowRight, CheckCircle, Sparkles } from 'lucide-react';

interface LoginProps {
    onLoginSuccess: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
    const { t, language, setLanguage } = useLanguage();
    const [email, setEmail] = useState('');
    const [step, setStep] = useState<'input' | 'sent'>('input');
    const [loading, setLoading] = useState(false);

    const handleSendLink = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;
        
        setLoading(true);
        // Simulate API delay
        setTimeout(() => {
            setLoading(false);
            setStep('sent');
        }, 1500);
    };

    const handleSimulateClick = () => {
        setLoading(true);
        setTimeout(() => {
            db.loginUser(email);
            onLoginSuccess();
        }, 1000);
    };

    return (
        <div className={`min-h-screen bg-gradient-to-br from-slate-900 to-indigo-900 flex flex-col items-center justify-center p-4 ${language === 'ur' ? 'dir-rtl' : ''}`}>
            
            {/* Language Switcher Top Right */}
            <div className="absolute top-6 right-6">
                 <button 
                    onClick={() => setLanguage(language === 'en' ? 'ur' : 'en')}
                    className="text-sm text-white/80 hover:text-white bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm border border-white/10 transition-all"
                >
                    {language === 'en' ? 'English' : 'اردو'}
                </button>
            </div>

            <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">
                <div className="p-8 md:p-10">
                    <div className="flex justify-center mb-8">
                        <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/30 rotate-3">
                            <Wallet className="text-white w-8 h-8" />
                        </div>
                    </div>

                    <h1 className="text-3xl font-bold text-center text-slate-800 mb-2">
                        {step === 'input' ? t.loginTitle : t.checkInbox}
                    </h1>
                    <p className="text-center text-slate-500 mb-8">
                        {step === 'input' ? t.loginSubtitle : `${t.magicLinkSent} ${email}`}
                    </p>

                    {step === 'input' ? (
                        <form onSubmit={handleSendLink} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2 ml-1">{t.emailOrPhone}</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-3.5 text-slate-400 w-5 h-5" />
                                    <input 
                                        type="text" 
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                        placeholder="name@example.com"
                                        required
                                    />
                                </div>
                            </div>

                            <button 
                                type="submit" 
                                disabled={loading}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <span className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                ) : (
                                    <>
                                        <Sparkles size={20} />
                                        {t.sendMagicLink}
                                    </>
                                )}
                            </button>
                        </form>
                    ) : (
                        <div className="space-y-6 animate-fade-in">
                            <div className="flex justify-center">
                                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center animate-bounce">
                                    <Mail className="text-green-600 w-10 h-10" />
                                </div>
                            </div>
                            
                            <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 text-sm text-indigo-800 text-center">
                                Since this is a demo without a real email server, click below to simulate the login process.
                            </div>

                            <button 
                                onClick={handleSimulateClick}
                                disabled={loading}
                                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-green-200 flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02]"
                            >
                                {loading ? (
                                    <span className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                ) : (
                                    <>
                                        {t.clickToLogin}
                                        <ArrowRight size={20} />
                                    </>
                                )}
                            </button>

                            <button 
                                onClick={() => setStep('input')}
                                className="w-full text-slate-500 hover:text-slate-700 text-sm font-medium py-2"
                            >
                                {t.backToLogin}
                            </button>
                        </div>
                    )}
                </div>
                
                {/* Footer decorative */}
                <div className="h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
            </div>

            <p className="mt-8 text-slate-400 text-sm">
                © 2024 CommitteePro. Secure & Private.
            </p>
        </div>
    );
};
