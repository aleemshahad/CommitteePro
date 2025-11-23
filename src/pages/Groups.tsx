import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Users, DollarSign, Calendar, Edit, Trash2, Search } from 'lucide-react';
import { getGroups, addGroup, deleteGroup } from '@/services/storageService';
import { Group, Member, Payment } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import { useLanguage } from '@/context/LanguageContext';

export const Groups: React.FC = () => {
    const { t } = useLanguage();
    const navigate = useNavigate();
    const [groups, setGroups] = useState<Group[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        amount: '',
        frequency: 'monthly' as 'weekly' | 'monthly' | 'yearly',
        startDate: new Date().toISOString().split('T')[0],
    });
    const [members, setMembers] = useState<Partial<Member>[]>([
        { name: '', email: '', phone: '' }
    ]);

    useEffect(() => {
        loadGroups();
    }, []);

    const loadGroups = () => {
        const allGroups = getGroups();
        setGroups(allGroups);
    };

    const handleCreateGroup = () => {
        if (!formData.name || !formData.amount) return;

        const validMembers: Member[] = members
            .filter(m => m.name && m.name.trim() !== '')
            .map(m => ({
                id: uuidv4(),
                name: m.name!,
                email: m.email || '',
                phone: m.phone || '',
            }));

        if (validMembers.length === 0) {
            alert('Please add at least one member');
            return;
        }

        // Initialize payments for all members and all cycles
        const payments: Payment[] = [];
        for (let cycle = 0; cycle < validMembers.length; cycle++) {
            validMembers.forEach(member => {
                payments.push({
                    memberId: member.id,
                    cycleIndex: cycle,
                    isPaid: false,
                    amount: parseFloat(formData.amount),
                });
            });
        }

        const newGroup: Group = {
            id: uuidv4(),
            name: formData.name,
            description: formData.description,
            amount: parseFloat(formData.amount),
            frequency: formData.frequency,
            startDate: formData.startDate,
            members: validMembers,
            payments,
            winners: [],
            currentCycle: 0,
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        addGroup(newGroup);
        setShowCreateModal(false);
        resetForm();
        loadGroups();
    };

    const resetForm = () => {
        setFormData({
            name: '',
            description: '',
            amount: '',
            frequency: 'monthly',
            startDate: new Date().toISOString().split('T')[0],
        });
        setMembers([{ name: '', email: '', phone: '' }]);
    };

    const handleDeleteGroup = (id: string) => {
        if (confirm(t('groups.confirmDelete'))) {
            deleteGroup(id);
            loadGroups();
        }
    };

    const addMember = () => {
        setMembers([...members, { name: '', email: '', phone: '' }]);
    };

    const updateMember = (index: number, field: keyof Member, value: string) => {
        const updated = [...members];
        updated[index] = { ...updated[index], [field]: value };
        setMembers(updated);
    };

    const removeMember = (index: number) => {
        if (members.length > 1) {
            setMembers(members.filter((_, i) => i !== index));
        }
    };

    const filteredGroups = groups.filter(group =>
        group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        group.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-PK', {
            style: 'currency',
            currency: 'PKR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    return (
        <div className="groups-page">
            <div className="page-header">
                <h1>{t('groups.title')}</h1>
                <button onClick={() => setShowCreateModal(true)} className="primary-button">
                    <Plus size={20} />
                    {t('groups.createGroup')}
                </button>
            </div>

            <div className="search-bar">
                <Search size={20} />
                <input
                    type="text"
                    placeholder={t('common.search')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="groups-grid">
                {filteredGroups.map(group => (
                    <div key={group.id} className="group-card">
                        <div className="group-card-header">
                            <h3>{group.name}</h3>
                            <div className="group-actions">
                                <button
                                    onClick={() => navigate(`/groups/${group.id}`)}
                                    className="icon-button"
                                    title={t('common.view')}
                                >
                                    <Edit size={18} />
                                </button>
                                <button
                                    onClick={() => handleDeleteGroup(group.id)}
                                    className="icon-button danger"
                                    title={t('common.delete')}
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>

                        <p className="group-description">{group.description}</p>

                        <div className="group-stats">
                            <div className="group-stat">
                                <Users size={16} />
                                <span>{group.members.length} members</span>
                            </div>
                            <div className="group-stat">
                                <DollarSign size={16} />
                                <span>{formatCurrency(group.amount)}</span>
                            </div>
                            <div className="group-stat">
                                <Calendar size={16} />
                                <span>{group.frequency}</span>
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

                        <span className={`status-badge ${group.isActive ? 'active' : 'inactive'}`}>
                            {group.isActive ? 'Active' : 'Inactive'}
                        </span>
                    </div>
                ))}
            </div>

            {showCreateModal && (
                <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{t('groups.createGroup')}</h2>
                            <button onClick={() => setShowCreateModal(false)} className="close-button">×</button>
                        </div>

                        <div className="modal-body">
                            <div className="form-group">
                                <label>{t('groups.groupName')}</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Monthly Committee"
                                />
                            </div>

                            <div className="form-group">
                                <label>{t('groups.description')}</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Committee details..."
                                    rows={3}
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>{t('groups.amount')} (PKR)</label>
                                    <input
                                        type="number"
                                        value={formData.amount}
                                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                        placeholder="10000"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>{t('groups.frequency')}</label>
                                    <select
                                        value={formData.frequency}
                                        onChange={(e) => setFormData({ ...formData, frequency: e.target.value as any })}
                                    >
                                        <option value="weekly">Weekly</option>
                                        <option value="monthly">Monthly</option>
                                        <option value="yearly">Yearly</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>{t('groups.startDate')}</label>
                                    <input
                                        type="date"
                                        value={formData.startDate}
                                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="members-section">
                                <div className="section-header">
                                    <h3>{t('groups.members')}</h3>
                                    <button onClick={addMember} className="secondary-button">
                                        <Plus size={16} />
                                        {t('groups.addMember')}
                                    </button>
                                </div>

                                {members.map((member, index) => (
                                    <div key={index} className="member-form">
                                        <input
                                            type="text"
                                            placeholder={t('groups.memberName')}
                                            value={member.name || ''}
                                            onChange={(e) => updateMember(index, 'name', e.target.value)}
                                        />
                                        <input
                                            type="email"
                                            placeholder={t('groups.memberEmail')}
                                            value={member.email || ''}
                                            onChange={(e) => updateMember(index, 'email', e.target.value)}
                                        />
                                        <input
                                            type="tel"
                                            placeholder={t('groups.memberPhone')}
                                            value={member.phone || ''}
                                            onChange={(e) => updateMember(index, 'phone', e.target.value)}
                                        />
                                        {members.length > 1 && (
                                            <button
                                                onClick={() => removeMember(index)}
                                                className="icon-button danger"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button onClick={() => setShowCreateModal(false)} className="secondary-button">
                                {t('groups.cancel')}
                            </button>
                            <button onClick={handleCreateGroup} className="primary-button">
                                {t('groups.save')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
