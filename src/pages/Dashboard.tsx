import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, DollarSign, TrendingUp, AlertCircle, Calendar, Plus } from 'lucide-react';
import { getGroups } from '@/services/storageService';
import { Group, DashboardStats } from '@/types';
import { useLanguage } from '@/context/LanguageContext';

export const Dashboard: React.FC = () => {
    const { t } = useLanguage();
    const navigate = useNavigate();
    const [groups, setGroups] = useState<Group[]>([]);
    const [stats, setStats] = useState<DashboardStats>({
        totalGroups: 0,
        activeGroups: 0,
        totalMembers: 0,
        pendingPayments: 0,
        totalCollected: 0,
    });

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = () => {
        const allGroups = getGroups();
        setGroups(allGroups);

        // Calculate stats
        const activeGroups = allGroups.filter(g => g.isActive);
        const totalMembers = allGroups.reduce((sum, g) => sum + g.members.length, 0);

        let pendingPayments = 0;
        let totalCollected = 0;

        allGroups.forEach(group => {
            group.payments.forEach(payment => {
                if (payment.isPaid) {
                    totalCollected += payment.amount;
                } else {
                    pendingPayments += payment.amount;
                }
            });
        });

        setStats({
            totalGroups: allGroups.length,
            activeGroups: activeGroups.length,
            totalMembers,
            pendingPayments,
            totalCollected,
        });
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-PK', {
            style: 'currency',
            currency: 'PKR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const getNextDrawDate = (group: Group): string => {
        const startDate = new Date(group.startDate);
        const currentCycle = group.currentCycle;

        let nextDate = new Date(startDate);

        switch (group.frequency) {
            case 'weekly':
                nextDate.setDate(nextDate.getDate() + (currentCycle * 7));
                break;
            case 'monthly':
                nextDate.setMonth(nextDate.getMonth() + currentCycle);
                break;
            case 'yearly':
                nextDate.setFullYear(nextDate.getFullYear() + currentCycle);
                break;
        }

        return nextDate.toLocaleDateString();
    };

    return (
        <div className="dashboard-page">
            <div className="dashboard-header">
                <h1>{t('dashboard.title')}</h1>
                <button
                    onClick={() => navigate('/groups/new')}
                    className="primary-button"
                >
                    <Plus size={20} />
                    {t('groups.createGroup')}
                </button>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                        <Users size={24} />
                    </div>
                    <div className="stat-content">
                        <p className="stat-label">{t('dashboard.totalGroups')}</p>
                        <h2 className="stat-value">{stats.totalGroups}</h2>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
                        <TrendingUp size={24} />
                    </div>
                    <div className="stat-content">
                        <p className="stat-label">{t('dashboard.activeGroups')}</p>
                        <h2 className="stat-value">{stats.activeGroups}</h2>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
                        <Users size={24} />
                    </div>
                    <div className="stat-content">
                        <p className="stat-label">{t('dashboard.totalMembers')}</p>
                        <h2 className="stat-value">{stats.totalMembers}</h2>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' }}>
                        <AlertCircle size={24} />
                    </div>
                    <div className="stat-content">
                        <p className="stat-label">{t('dashboard.pendingPayments')}</p>
                        <h2 className="stat-value">{formatCurrency(stats.pendingPayments)}</h2>
                    </div>
                </div>

                <div className="stat-card wide">
                    <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)' }}>
                        <DollarSign size={24} />
                    </div>
                    <div className="stat-content">
                        <p className="stat-label">{t('dashboard.totalCollected')}</p>
                        <h2 className="stat-value">{formatCurrency(stats.totalCollected)}</h2>
                    </div>
                </div>
            </div>

            <div className="active-groups-section">
                <h2>{t('dashboard.recentActivity')}</h2>

                {groups.length === 0 ? (
                    <div className="empty-state">
                        <Users size={64} />
                        <p>{t('dashboard.noGroups')}</p>
                        <button
                            onClick={() => navigate('/groups/new')}
                            className="primary-button"
                        >
                            <Plus size={20} />
                            {t('groups.createGroup')}
                        </button>
                    </div>
                ) : (
                    <div className="groups-grid">
                        {groups.slice(0, 6).map(group => (
                            <div
                                key={group.id}
                                className="group-card"
                                onClick={() => navigate(`/groups/${group.id}`)}
                            >
                                <div className="group-card-header">
                                    <h3>{group.name}</h3>
                                    <span className={`status-badge ${group.isActive ? 'active' : 'inactive'}`}>
                                        {group.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </div>
                                <p className="group-description">{group.description}</p>

                                <div className="group-stats">
                                    <div className="group-stat">
                                        <Users size={16} />
                                        <span>{group.members.length} {t('groups.members')}</span>
                                    </div>
                                    <div className="group-stat">
                                        <DollarSign size={16} />
                                        <span>{formatCurrency(group.amount)}</span>
                                    </div>
                                    <div className="group-stat">
                                        <Calendar size={16} />
                                        <span>{getNextDrawDate(group)}</span>
                                    </div>
                                </div>

                                <div className="group-progress">
                                    <div className="progress-bar">
                                        <div
                                            className="progress-fill"
                                            style={{
                                                width: `${(group.currentCycle / group.members.length) * 100}%`
                                            }}
                                        />
                                    </div>
                                    <span className="progress-text">
                                        Cycle {group.currentCycle} / {group.members.length}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
