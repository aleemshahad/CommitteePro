import React, { useEffect, useState } from 'react';
import { db } from '../services/storageService';
import { useLanguage } from '../context/LanguageContext';
import { CommitteeGroup } from '../types';
import { Users, AlertCircle, Calendar } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { t } = useLanguage();
  const [groups, setGroups] = useState<CommitteeGroup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setGroups(db.getGroups());
    setLoading(false);
  }, []);

  const activeGroups = groups.filter(g => g.status === 'ACTIVE');
  // Simple calculation for demo
  const totalMembers = activeGroups.reduce((acc, g) => acc + g.members.length, 0);
  
  if (loading) return <div className="p-8 text-center">{t.loading}</div>;

  return (
    <div className="space-y-6">
      <header className="mb-8">
        <h2 className="text-3xl font-bold text-slate-800">{t.dashboard}</h2>
        <p className="text-slate-500">Welcome back to your committee manager.</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-start justify-between">
          <div>
            <p className="text-slate-500 text-sm font-medium uppercase tracking-wider mb-1">{t.activeGroups}</p>
            <h3 className="text-4xl font-bold text-slate-800">{activeGroups.length}</h3>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Users size={24} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-start justify-between">
          <div>
            <p className="text-slate-500 text-sm font-medium uppercase tracking-wider mb-1">Total Members</p>
            <h3 className="text-4xl font-bold text-slate-800">{totalMembers}</h3>
          </div>
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
            <Users size={24} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-start justify-between">
           <div>
            <p className="text-slate-500 text-sm font-medium uppercase tracking-wider mb-1">{t.upcomingDraw}</p>
            <h3 className="text-lg font-bold text-slate-800">
                {activeGroups.length > 0 ? activeGroups[0].name : "N/A"}
            </h3>
            <span className="text-xs text-slate-400">Next Cycle</span>
          </div>
           <div className="p-3 bg-orange-50 text-orange-600 rounded-xl">
            <Calendar size={24} />
          </div>
        </div>
      </div>

      {/* Recent Activity / Active Groups List */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100">
            <h3 className="text-lg font-bold text-slate-800">{t.activeGroups}</h3>
        </div>
        <div className="p-0">
            {activeGroups.length === 0 ? (
                <div className="p-8 text-center text-slate-400">
                    No active groups. Create one to get started!
                </div>
            ) : (
                <table className="w-full">
                    <thead className="bg-slate-50 text-left text-xs text-slate-500 uppercase font-semibold">
                        <tr>
                            <th className="px-6 py-4">{t.groupName}</th>
                            <th className="px-6 py-4">{t.amount}</th>
                            <th className="px-6 py-4">{t.cycle}</th>
                            <th className="px-6 py-4">{t.status}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {activeGroups.map(group => (
                            <tr key={group.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4 font-medium text-slate-800">{group.name}</td>
                                <td className="px-6 py-4 text-slate-600">{group.currency} {group.amount}</td>
                                <td className="px-6 py-4">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                        {group.members.length} {t.cycles}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                        Active
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
      </div>
    </div>
  );
};