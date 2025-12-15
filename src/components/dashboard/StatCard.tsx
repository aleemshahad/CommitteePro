import React from 'react';
import './StatCard.css';

interface StatCardProps {
    icon: string;
    label: string;
    value: string;
    subValue?: string;
    color: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
}

export const StatCard: React.FC<StatCardProps> = ({ icon, label, value, subValue, color }) => {
    return (
        <div className={`stat-card stat-card-${color}`}>
            <div className="stat-icon-wrapper">
                <span className="stat-icon">{icon}</span>
            </div>
            <div className="stat-content">
                <p className="stat-label">{label}</p>
                <h3 className="stat-value">{value}</h3>
                {subValue && <p className="stat-subvalue">{subValue}</p>}
            </div>
            <div className="stat-decoration"></div>
        </div>
    );
};
