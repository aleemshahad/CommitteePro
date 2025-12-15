import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { DashboardStats, DashboardCommittee } from '../../types';
import { calculateDashboardStats, getDashboardCommittees } from '../../utils/dashboard';
import { StatCard } from '../../components/dashboard/StatCard';
import { CommitteeCard } from '../../components/dashboard/CommitteeCard';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

export const Dashboard: React.FC = () => {
    const { user } = useAuth();
    const { t } = useLanguage();
    const navigate = useNavigate();
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [committees, setCommittees] = useState<DashboardCommittee[]>([]);

    useEffect(() => {
        if (user) {
            const dashboardStats = calculateDashboardStats(user.id, user.role);
            setStats(dashboardStats);

            const dashboardCommittees = getDashboardCommittees(user.id, user.role);
            setCommittees(dashboardCommittees);
        }
    }, [user]);

    if (!user || !stats) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>{t('loading')}</p>
            </div>
        );
    }

    return (
        <div className="dashboard-page">
            {/* Header */}
            <div className="dashboard-header">
                <div>
                    <h1 className="dashboard-title">
                        {t('welcome')}, {user.name} 👋
                    </h1>
                    <p className="dashboard-subtitle">
                        {t('dashboard_title')} - {new Date().toLocaleDateString()}
                    </p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="stats-grid">
                <StatCard
                    icon="👥"
                    label={t('active_committees')}
                    value={stats.activeCommittees.toString()}
                    subValue={`${t('total_committees')}: ${stats.totalCommittees}`}
                    color="primary"
                />
                <StatCard
                    icon="👤"
                    label={t('total_members')}
                    value={stats.totalMembers.toString()}
                    color="secondary"
                />
                <StatCard
                    icon="⏳"
                    label={t('pending_payments')}
                    value={stats.pendingPayments.toString()}
                    color="warning"
                />
                <StatCard
                    icon="💰"
                    label={t('total_collected')}
                    value={`Rs. ${stats.totalCollected.toLocaleString()}`}
                    color="success"
                />
            </div>

            {/* Quick Actions */}
            <div className="quick-actions-section">
                <h2 className="section-title">{t('quick_actions')}</h2>
                <div className="quick-actions-grid">
                    <button
                        className="action-button action-primary"
                        onClick={() => navigate('/committees/new')}
                    >
                        <span className="action-icon">➕</span>
                        <span className="action-label">{t('create_committee')}</span>
                    </button>
                    <button
                        className="action-button action-secondary"
                        onClick={() => navigate('/payments/add')}
                    >
                        <span className="action-icon">💵</span>
                        <span className="action-label">{t('add_payment')}</span>
                    </button>
                    <button
                        className="action-button action-accent"
                        onClick={() => navigate('/draws')}
                    >
                        <span className="action-icon">🎯</span>
                        <span className="action-label">{t('conduct_draw')}</span>
                    </button>
                    <button
                        className="action-button action-info"
                        onClick={() => navigate('/reports')}
                    >
                        <span className="action-icon">📊</span>
                        <span className="action-label">{t('generate_report')}</span>
                    </button>
                </div>
            </div>

            {/* Committees List */}
            <div className="committees-section">
                <div className="section-header">
                    <h2 className="section-title">{t('committees')}</h2>
                    <button
                        className="btn btn-outline btn-sm"
                        onClick={() => navigate('/committees')}
                    >
                        {t('view')} {t('committees')} →
                    </button>
                </div>

                {committees.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">📋</div>
                        <h3>{t('no_committees')}</h3>
                        <p>{t('create_first_committee')}</p>
                        <button
                            className="btn btn-primary"
                            onClick={() => navigate('/committees/new')}
                        >
                            {t('create_committee')}
                        </button>
                    </div>
                ) : (
                    <div className="committees-grid">
                        {committees.slice(0, 6).map((committee) => (
                            <CommitteeCard
                                key={committee.id}
                                committee={committee}
                                onClick={() => navigate(`/committees/${committee.id}`)}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Super Admin Section */}
            {user.role === 'superadmin' && (
                <div className="admin-section">
                    <div className="admin-badge">
                        <span className="badge-icon">⭐</span>
                        <span>{t('superadmin')}</span>
                    </div>
                    <p className="admin-description">
                        You have full access to all committees and system settings.
                    </p>
                </div>
            )}
        </div>
    );
};
