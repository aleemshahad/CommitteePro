import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

export const Committees: React.FC = () => {
    const { t } = useLanguage();

    return (
        <div className="page-container">
            <h1>{t('committees')}</h1>
            <p>Committees management page - Coming soon</p>
        </div>
    );
};

export const Payments: React.FC = () => {
    const { t } = useLanguage();

    return (
        <div className="page-container">
            <h1>{t('payments')}</h1>
            <p>Payments tracking page - Coming soon</p>
        </div>
    );
};

export const Draws: React.FC = () => {
    const { t } = useLanguage();

    return (
        <div className="page-container">
            <h1>{t('draws')}</h1>
            <p>Draw system page - Coming soon</p>
        </div>
    );
};

export const Reports: React.FC = () => {
    const { t } = useLanguage();

    return (
        <div className="page-container">
            <h1>{t('reports')}</h1>
            <p>Reports generation page - Coming soon</p>
        </div>
    );
};

export const Settings: React.FC = () => {
    const { t } = useLanguage();

    return (
        <div className="page-container">
            <h1>{t('settings')}</h1>
            <p>Settings page - Coming soon</p>
        </div>
    );
};
