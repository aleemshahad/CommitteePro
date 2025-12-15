import React from 'react';
import { DashboardCommittee } from '../../types';
import { formatDate, getCompletionColor } from '../../utils/dashboard';
import { useLanguage } from '../../contexts/LanguageContext';
import './CommitteeCard.css';

interface CommitteeCardProps {
    committee: DashboardCommittee;
    onClick: () => void;
}

export const CommitteeCard: React.FC<CommitteeCardProps> = ({ committee, onClick }) => {
    const { t } = useLanguage();

    return (
        <div className={`committee-card ${!committee.isActive ? 'committee-inactive' : ''}`} onClick={onClick}>
            <div className="committee-card-header">
                <h3 className="committee-name">{committee.name}</h3>
                {committee.isActive ? (
                    <span className="badge badge-success">{t('active')}</span>
                ) : (
                    <span className="badge badge-error">{t('inactive')}</span>
                )}
            </div>

            <div className="committee-stats">
                <div className="committee-stat">
                    <span className="stat-icon-small">👥</span>
                    <div>
                        <p className="stat-label-small">{t('members')}</p>
                        <p className="stat-value-small">{committee.memberCount}</p>
                    </div>
                </div>

                <div className="committee-stat">
                    <span className="stat-icon-small">📅</span>
                    <div>
                        <p className="stat-label-small">{t('next')} {t('draw_date')}</p>
                        <p className="stat-value-small">{formatDate(committee.nextDrawDate)}</p>
                    </div>
                </div>
            </div>

            <div className="completion-section">
                <div className="completion-header">
                    <span className="completion-label">{t('completion_rate')}</span>
                    <span className="completion-percentage">{committee.completionRate}%</span>
                </div>
                <div className="progress-bar">
                    <div
                        className="progress-fill"
                        style={{
                            width: `${committee.completionRate}%`,
                            background: getCompletionColor(committee.completionRate),
                        }}
                    ></div>
                </div>
            </div>

            <div className="committee-card-footer">
                <button className="view-button">
                    {t('view')} {t('committee')} →
                </button>
            </div>
        </div>
    );
};
