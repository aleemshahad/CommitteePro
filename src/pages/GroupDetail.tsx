import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, DollarSign, Calendar, Check, X, Send, FileText } from 'lucide-react';
import { getGroupById, updateGroup } from '@/services/storageService';
import { Group, Payment, Winner } from '@/types';
import { useLanguage } from '@/context/LanguageContext';
import { DrawWheel } from '@/components/DrawWheel';
import { generatePaymentReminder } from '@/services/geminiService';

type Tab = 'overview' | 'payments' | 'draw' | 'reminders';

export const GroupDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { t, language } = useLanguage();
    const navigate = useNavigate();
    const [group, setGroup] = useState<Group | null>(null);
    const [activeTab, setActiveTab] = useState<Tab>('overview');
    const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
    const [reminders, setReminders] = useState<Map<string, string>>(new Map());
    const [generatingReminder, setGeneratingReminder] = useState(false);

    useEffect(() => {
        if (id) {
            const foundGroup = getGroupById(id);
            setGroup(foundGroup);
        }
    }, [id]);

    if (!group) {
        return <div className="loading">{t('common.loading')}</div>;
    }

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-PK', {
            style: 'currency',
            currency: 'PKR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const togglePayment = (memberId: string, cycleIndex: number) => {
        const payment = group.payments.find(
            p => p.memberId === memberId && p.cycleIndex === cycleIndex
        );

        if (payment) {
            payment.isPaid = !payment.isPaid;
            payment.paidAt = payment.isPaid ? new Date().toISOString() : undefined;
            updateGroup(group);
            setGroup({ ...group });
        }
    };

    const handleWinnerSelected = (member: any) => {
        const winner: Winner = {
            memberId: member.id,
            memberName: member.name,
            cycleIndex: group.currentCycle,
            selectedAt: new Date().toISOString(),
            amount: group.amount,
        };

        group.winners.push(winner);
        group.currentCycle += 1;

        // Check if all cycles completed
        if (group.currentCycle >= group.members.length) {
            group.isActive = false;
        }

        updateGroup(group);
        setGroup({ ...group });
        setActiveTab('overview');
    };

    const getPendingPaymentsForCycle = (cycleIndex: number) => {
        return group.payments.filter(
            p => p.cycleIndex === cycleIndex && !p.isPaid
        ).length;
    };

    const getPaymentStatus = (memberId: string, cycleIndex: number): boolean => {
        const payment = group.payments.find(
            p => p.memberId === memberId && p.cycleIndex === cycleIndex
        );
        return payment?.isPaid || false;
    };

    const handleGenerateReminder = async (memberId: string) => {
        setGeneratingReminder(true);
        try {
            const member = group.members.find(m => m.id === memberId);
            if (!member) return;

            const reminder = await generatePaymentReminder({
                memberName: member.name,
                groupName: group.name,
                amount: group.amount,
                cycleNumber: group.currentCycle + 1,
                language,
            });

            setReminders(new Map(reminders.set(memberId, reminder)));
        } catch (error) {
            alert(t('reminders.error'));
        } finally {
            setGeneratingReminder(false);
        }
    };

    const calculateStats = () => {
        const totalMembers = group.members.length;
        const totalCycles = group.members.length;
        const completedCycles = group.currentCycle;
        const totalAmount = group.amount * totalMembers * totalCycles;

        const paidPayments = group.payments.filter(p => p.isPaid);
        const paidAmount = paidPayments.reduce((sum, p) => sum + p.amount, 0);
        const pendingAmount = totalAmount - paidAmount;

        return {
            totalMembers,
            totalCycles,
            completedCycles,
            totalAmount,
            paidAmount,
            pendingAmount,
        };
    };

    const stats = calculateStats();
    const excludedMemberIds = group.winners.map(w => w.memberId);

    return (
        <div className="group-detail-page">
            <div className="page-header">
                <button onClick={() => navigate('/groups')} className="back-button">
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h1>{group.name}</h1>
                    <p className="group-subtitle">{group.description}</p>
                </div>
                <span className={`status-badge ${group.isActive ? 'active' : 'inactive'}`}>
                    {group.isActive ? 'Active' : 'Completed'}
                </span>
            </div>

            <div className="tabs">
                <button
                    className={activeTab === 'overview' ? 'tab active' : 'tab'}
                    onClick={() => setActiveTab('overview')}
                >
                    <FileText size={18} />
                    {t('groupDetail.overview')}
                </button>
                <button
                    className={activeTab === 'payments' ? 'tab active' : 'tab'}
                    onClick={() => setActiveTab('payments')}
                >
                    <DollarSign size={18} />
                    {t('groupDetail.payments')}
                </button>
                <button
                    className={activeTab === 'draw' ? 'tab active' : 'tab'}
                    onClick={() => setActiveTab('draw')}
                    disabled={!group.isActive}
                >
                    <Calendar size={18} />
                    {t('groupDetail.draw')}
                </button>
                <button
                    className={activeTab === 'reminders' ? 'tab active' : 'tab'}
                    onClick={() => setActiveTab('reminders')}
                >
                    <Send size={18} />
                    {t('groupDetail.reminders')}
                </button>
            </div>

            <div className="tab-content">
                {activeTab === 'overview' && (
                    <div className="overview-tab">
                        <div className="stats-grid">
                            <div className="stat-card">
                                <Users size={32} />
                                <h3>{stats.totalMembers}</h3>
                                <p>{t('groups.members')}</p>
                            </div>
                            <div className="stat-card">
                                <Calendar size={32} />
                                <h3>{stats.completedCycles} / {stats.totalCycles}</h3>
                                <p>Cycles</p>
                            </div>
                            <div className="stat-card">
                                <DollarSign size={32} />
                                <h3>{formatCurrency(stats.paidAmount)}</h3>
                                <p>Collected</p>
                            </div>
                            <div className="stat-card">
                                <DollarSign size={32} />
                                <h3>{formatCurrency(stats.pendingAmount)}</h3>
                                <p>Pending</p>
                            </div>
                        </div>

                        <div className="section">
                            <h2>{t('groupDetail.previousWinners')}</h2>
                            {group.winners.length === 0 ? (
                                <p className="empty-message">No draws conducted yet</p>
                            ) : (
                                <div className="winners-list">
                                    {group.winners.map((winner, index) => (
                                        <div key={index} className="winner-item">
                                            <div className="winner-info">
                                                <h3>{winner.memberName}</h3>
                                                <p>Cycle {winner.cycleIndex + 1} - {new Date(winner.selectedAt).toLocaleDateString()}</p>
                                            </div>
                                            <div className="winner-amount">{formatCurrency(winner.amount)}</div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="section">
                            <h2>{t('groups.members')}</h2>
                            <div className="members-list">
                                {group.members.map(member => (
                                    <div key={member.id} className="member-item">
                                        <div className="member-avatar">{member.name.charAt(0).toUpperCase()}</div>
                                        <div className="member-info">
                                            <h3>{member.name}</h3>
                                            <p>{member.email}</p>
                                            {member.phone && <p>{member.phone}</p>}
                                        </div>
                                        {excludedMemberIds.includes(member.id) && (
                                            <span className="winner-badge">Winner</span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'payments' && (
                    <div className="payments-tab">
                        <h2>{t('groupDetail.paymentStatus')}</h2>
                        <div className="payment-matrix">
                            <div className="payment-table">
                                <div className="table-header">
                                    <div className="cell">{t('groups.members')}</div>
                                    {Array.from({ length: group.members.length }, (_, i) => (
                                        <div key={i} className="cell">Cycle {i + 1}</div>
                                    ))}
                                </div>
                                {group.members.map(member => (
                                    <div key={member.id} className="table-row">
                                        <div className="cell member-name">{member.name}</div>
                                        {Array.from({ length: group.members.length }, (_, cycleIndex) => (
                                            <div key={cycleIndex} className="cell payment-cell">
                                                <button
                                                    onClick={() => togglePayment(member.id, cycleIndex)}
                                                    className={`payment-toggle ${getPaymentStatus(member.id, cycleIndex) ? 'paid' : 'pending'}`}
                                                >
                                                    {getPaymentStatus(member.id, cycleIndex) ? (
                                                        <Check size={16} />
                                                    ) : (
                                                        <X size={16} />
                                                    )}
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="payment-summary">
                            <h3>Summary</h3>
                            <div className="summary-stats">
                                <div>Total Expected: {formatCurrency(stats.totalAmount)}</div>
                                <div>Collected: {formatCurrency(stats.paidAmount)}</div>
                                <div>Pending: {formatCurrency(stats.pendingAmount)}</div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'draw' && (
                    <div className="draw-tab">
                        <h2>{t('groupDetail.conductDraw')}</h2>
                        <div className="draw-info">
                            <p>Current Cycle: {group.currentCycle + 1}</p>
                            <p>Eligible Members: {group.members.length - excludedMemberIds.length}</p>
                        </div>
                        <DrawWheel
                            members={group.members}
                            onWinnerSelected={handleWinnerSelected}
                            excludeMembers={excludedMemberIds}
                        />
                    </div>
                )}

                {activeTab === 'reminders' && (
                    <div className="reminders-tab">
                        <h2>{t('reminders.title')}</h2>
                        <p className="tab-description">Generate AI-powered payment reminders for members</p>

                        <div className="members-reminders-list">
                            {group.members.map(member => {
                                const pendingPayments = group.payments.filter(
                                    p => p.memberId === member.id && !p.isPaid
                                ).length;

                                return (
                                    <div key={member.id} className="reminder-item">
                                        <div className="reminder-member-info">
                                            <div className="member-avatar">{member.name.charAt(0).toUpperCase()}</div>
                                            <div>
                                                <h3>{member.name}</h3>
                                                <p>{pendingPayments} pending payment{pendingPayments !== 1 ? 's' : ''}</p>
                                            </div>
                                        </div>

                                        {reminders.has(member.id) ? (
                                            <div className="reminder-preview">
                                                <p>{reminders.get(member.id)}</p>
                                                <button className="primary-button small">
                                                    <Send size={16} />
                                                    {t('reminders.send')}
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => handleGenerateReminder(member.id)}
                                                disabled={generatingReminder || pendingPayments === 0}
                                                className="secondary-button"
                                            >
                                                {generatingReminder ? t('reminders.generating') : t('reminders.generate')}
                                            </button>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
