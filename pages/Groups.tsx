import React, { useState, useEffect } from 'react';
import { db } from '../services/storageService';
import { useLanguage } from '../context/LanguageContext';
import { CommitteeGroup, Member } from '../types';
import { Plus, Users, ArrowRight } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid'; // Simulate with random string if lib not available, but user said simple logic. I'll use simple math random for zero deps in this generated code block.

// Simple ID generator to avoid deps
const generateId = () => Math.random().toString(36).substr(2, 9);

interface GroupsProps {
    onSelectGroup: (groupId: string) => void;
}

export const Groups: React.FC<GroupsProps> = ({ onSelectGroup }) => {
  const { t } = useLanguage();
  const [groups, setGroups] = useState<CommitteeGroup[]>([]);
  const [isCreating, setIsCreating] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [cycles, setCycles] = useState('');
  const [newMembers, setNewMembers] = useState<string>(''); // comma separated for quick entry

  useEffect(() => {
    setGroups(db.getGroups());
  }, []);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Parse members
    const memberNames = newMembers.split(',').map(s => s.trim()).filter(Boolean);
    const membersList: Member[] = memberNames.map(n => ({
        id: generateId(),
        name: n,
        phone: '', // Optional in quick create
        joinedAt: new Date().toISOString()
    }));

    if (membersList.length === 0) {
        alert("Please add at least one member");
        return;
    }

    const newGroup: CommitteeGroup = {
        id: generateId(),
        name,
        amount: Number(amount),
        totalCycles: Number(cycles) || membersList.length,
        members: membersList,
        startDate: new Date().toISOString(),
        status: 'ACTIVE',
        currency: 'PKR'
    };

    db.addGroup(newGroup);
    setGroups(db.getGroups());
    setIsCreating(false);
    resetForm();
  };

  const resetForm = () => {
    setName(''); setAmount(''); setCycles(''); setNewMembers('');
  };

  return (
    <div className="space-y-6">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <h2 className="text-3xl font-bold text-slate-800">{t.groups}</h2>
                <p className="text-slate-500">Manage your saving circles.</p>
            </div>
            <button 
                onClick={() => setIsCreating(true)}
                className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-medium transition-colors shadow-lg shadow-indigo-200"
            >
                <Plus size={20} />
                {t.createGroup}
            </button>
        </header>

        {isCreating && (
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-indigo-100 animate-fade-in-down">
                <h3 className="text-xl font-bold text-slate-800 mb-4">{t.createGroup}</h3>
                <form onSubmit={handleCreate} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">{t.groupName}</label>
                            <input required type="text" value={name} onChange={e => setName(e.target.value)} className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="e.g. Office Committee" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">{t.amount}</label>
                            <input required type="number" value={amount} onChange={e => setAmount(e.target.value)} className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="e.g. 5000" />
                        </div>
                    </div>
                    <div>
                         <label className="block text-sm font-medium text-slate-700 mb-1">{t.members} (Names separated by comma)</label>
                         <textarea required value={newMembers} onChange={e => setNewMembers(e.target.value)} className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none h-24" placeholder="Ali, Sara, Ahmed..." />
                    </div>
                    
                    <div className="flex justify-end gap-3 pt-4">
                        <button type="button" onClick={() => setIsCreating(false)} className="px-6 py-2 text-slate-600 font-medium hover:bg-slate-100 rounded-lg">{t.cancel}</button>
                        <button type="submit" className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 shadow-md">{t.save}</button>
                    </div>
                </form>
            </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {groups.map(group => (
                <div key={group.id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow group cursor-pointer" onClick={() => onSelectGroup(group.id)}>
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                            <Users size={24} />
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${group.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                            {group.status}
                        </span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-slate-800 mb-1">{group.name}</h3>
                    <div className="flex items-baseline gap-1 text-slate-600 mb-4">
                        <span className="text-sm font-medium">PKR</span>
                        <span className="text-2xl font-bold text-slate-900">{group.amount.toLocaleString()}</span>
                        <span className="text-xs text-slate-400">/ member</span>
                    </div>

                    <div className="w-full bg-slate-100 rounded-full h-2 mb-4">
                        <div className="bg-indigo-500 h-2 rounded-full" style={{ width: '30%' }}></div>
                    </div>

                    <div className="flex items-center justify-between text-sm text-slate-500">
                        <span>{group.members.length} Members</span>
                        <button className="flex items-center gap-1 text-indigo-600 font-medium hover:gap-2 transition-all">
                            View Details <ArrowRight size={16} />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    </div>
  );
};