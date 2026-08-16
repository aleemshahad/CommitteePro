import React, { useState, useEffect } from 'react';
import { db } from '../services/storageService';
import { useLanguage } from '../context/LanguageContext';
import { CommitteeGroup, Member } from '../types';
import { Plus, Users, ArrowRight, ShieldCheck, ShieldAlert, CheckCircle2, XCircle, Clock } from 'lucide-react';

const generateId = () => Math.random().toString(36).substr(2, 9);

interface GroupsProps {
    onSelectGroup: (groupId: string) => void;
}

export const Groups: React.FC<GroupsProps> = ({ onSelectGroup }) => {
  const { t } = useLanguage();
  const [groups, setGroups] = useState<CommitteeGroup[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [cycles, setCycles] = useState('');
  const [newMembers, setNewMembers] = useState<string>('');

  const currentUser = db.getCurrentUser();
  const isSuperAdmin = currentUser?.role === 'SUPER_ADMIN';

  const loadData = () => {
    setGroups(db.getGroups());
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Parse members
    const memberNames = newMembers.split(',').map(s => s.trim()).filter(Boolean);
    const membersList: Member[] = memberNames.map(n => ({
        id: generateId(),
        name: n,
        phone: '',
        joinedAt: new Date().toISOString()
    }));

    if (membersList.length === 0) {
        alert("Please add at least one member name");
        return;
    }

    const initialStatus = isSuperAdmin ? 'ACTIVE' : 'PENDING_APPROVAL';

    const newGroup: CommitteeGroup = {
        id: generateId(),
        name,
        amount: Number(amount),
        totalCycles: Number(cycles) || membersList.length,
        members: membersList,
        startDate: new Date().toISOString(),
        status: initialStatus,
        currency: 'PKR',
        requestedBy: currentUser?.name || 'Group Admin',
        requestedByRole: currentUser?.role || 'GROUP_ADMIN',
        createdAt: new Date().toISOString()
    };

    db.addGroup(newGroup);
    loadData();
    setIsCreating(false);

    if (!isSuperAdmin) {
      setNotice(t.requestSentNotice || "New committee creation request sent to Super Head Admin for approval!");
    } else {
      setNotice(t.approvedSuccess || "Committee created and activated!");
    }

    setTimeout(() => setNotice(null), 5000);
    resetForm();
  };

  const handleApprove = (groupId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    db.approveGroup(groupId);
    loadData();
  };

  const handleReject = (groupId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    db.rejectGroup(groupId);
    loadData();
  };

  const resetForm = () => {
    setName(''); setAmount(''); setCycles(''); setNewMembers('');
  };

  const pendingGroups = groups.filter(g => g.status === 'PENDING_APPROVAL');
  const activeAndOtherGroups = groups.filter(g => g.status !== 'PENDING_APPROVAL');

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">{t.groups}</h2>
                <p className="text-slate-500 text-sm mt-1">Create and manage your saving committees with approval controls.</p>
            </div>
            <button 
                onClick={() => setIsCreating(true)}
                className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl font-bold text-sm transition-all shadow-lg shadow-indigo-600/30"
            >
                <Plus size={20} />
                <span>{t.createGroup}</span>
            </button>
        </header>

        {notice && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 p-4 rounded-2xl text-sm font-bold flex items-center gap-3 animate-fade-in">
            <CheckCircle2 size={20} className="text-emerald-600 shrink-0" />
            <span>{notice}</span>
          </div>
        )}

        {/* Super Admin Pending Approval Banner */}
        {pendingGroups.length > 0 && (
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-3xl p-6 space-y-4 shadow-xs">
            <div className="flex items-center gap-3 text-amber-900">
              <div className="p-2.5 bg-amber-500/20 rounded-2xl text-amber-700">
                <Clock size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold">{t.pendingRequests}</h3>
                <p className="text-xs text-amber-700">
                  {isSuperAdmin 
                    ? "Super Head Admin Approval Required: Review requested committees below" 
                    : "Your submitted committees are pending Super Head Admin review"}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pendingGroups.map(group => (
                <div key={group.id} className="bg-white p-5 rounded-2xl border border-amber-200 shadow-sm flex flex-col justify-between gap-3">
                  <div>
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-slate-900 text-base">{group.name}</h4>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-800 uppercase">
                        Pending
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 mt-1 space-y-0.5">
                      <p><strong className="text-slate-700">Amount:</strong> PKR {group.amount.toLocaleString()} / month</p>
                      <p><strong className="text-slate-700">Duration:</strong> {group.totalCycles} Months | {group.members.length} Members</p>
                      <p><strong className="text-slate-700">Requested By:</strong> {group.requestedBy || 'Group Admin'}</p>
                    </div>
                  </div>

                  {isSuperAdmin ? (
                    <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                      <button
                        onClick={(e) => handleApprove(group.id, e)}
                        className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        <CheckCircle2 size={16} />
                        <span>{t.approveGroup}</span>
                      </button>
                      <button
                        onClick={(e) => handleReject(group.id, e)}
                        className="py-2 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-xs border border-rose-200"
                      >
                        <XCircle size={16} />
                      </button>
                    </div>
                  ) : (
                    <div className="text-[11px] text-amber-700 bg-amber-50 p-2 rounded-xl text-center font-bold">
                      Waiting for Super Head Admin (سپر ہیڈ ایڈمن) Approval
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {isCreating && (
            <div className="bg-white p-6 md:p-8 rounded-3xl shadow-xl border border-indigo-100 animate-fade-in space-y-5">
                <div>
                  <h3 className="text-xl font-extrabold text-slate-900">{t.createGroup}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {!isSuperAdmin ? t.requestSentNotice : "Super Head Admin direct committee setup"}
                  </p>
                </div>

                <form onSubmit={handleCreate} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">{t.groupName}</label>
                            <input required type="text" value={name} onChange={e => setName(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 font-semibold text-sm outline-none" placeholder="e.g. Office Executive Committee" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">{t.amount} (PKR)</label>
                            <input required type="number" value={amount} onChange={e => setAmount(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 font-semibold text-sm outline-none" placeholder="e.g. 10000" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">{t.cycles} (Months)</label>
                            <input required type="number" value={cycles} onChange={e => setCycles(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 font-semibold text-sm outline-none" placeholder="e.g. 6 or 12" />
                        </div>
                    </div>
                    <div>
                         <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">{t.members} (Comma separated names)</label>
                         <textarea required value={newMembers} onChange={e => setNewMembers(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 font-medium text-sm outline-none h-24" placeholder="Ali Khan, Sara Ahmed, Usman Malik, Tariq Raza..." />
                    </div>
                    
                    <div className="flex justify-end gap-3 pt-3">
                        <button type="button" onClick={() => setIsCreating(false)} className="px-5 py-2.5 text-slate-600 font-bold text-xs hover:bg-slate-100 rounded-xl">{t.cancel}</button>
                        <button type="submit" className="px-6 py-2.5 bg-indigo-600 text-white font-bold text-xs rounded-xl hover:bg-indigo-700 shadow-md shadow-indigo-600/30">{t.save}</button>
                    </div>
                </form>
            </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {activeAndOtherGroups.map(group => (
                <div 
                  key={group.id} 
                  className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-lg transition-all group cursor-pointer flex flex-col justify-between space-y-4" 
                  onClick={() => onSelectGroup(group.id)}
                >
                    <div>
                      <div className="flex justify-between items-start mb-3">
                          <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                              <Users size={24} />
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                            group.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                          }`}>
                              {group.status}
                          </span>
                      </div>
                      
                      <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors mb-1">{group.name}</h3>
                      <div className="flex items-baseline gap-1 text-slate-600 mb-2">
                          <span className="text-xs font-semibold text-slate-400">PKR</span>
                          <span className="text-2xl font-extrabold text-slate-900">{group.amount.toLocaleString()}</span>
                          <span className="text-xs text-slate-400">/ member / mo</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                        <span>{group.members.length} {t.members}</span>
                        <span>{group.totalCycles} Months Duration</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2">
                          <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '40%' }}></div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-indigo-600 group-hover:text-indigo-700">
                        <span>{t.viewGroup}</span>
                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                </div>
            ))}
        </div>
    </div>
  );
};
