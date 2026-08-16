
import React, { useState, useEffect } from 'react';
import { db } from '../services/storageService';
import { useLanguage } from '../context/LanguageContext';
import { CommitteeGroup, PaymentRecord } from '../types';
import { FileText, Download, TrendingUp, AlertTriangle } from 'lucide-react';

export const Reports: React.FC = () => {
    const { t } = useLanguage();
    const [groups, setGroups] = useState<CommitteeGroup[]>([]);
    const [allPayments, setAllPayments] = useState<PaymentRecord[]>([]);

    useEffect(() => {
        const state = db.getGroups(); // This only gets groups, need to inspect db internals or load state for full report
        // For simplicity in this demo, we will just reload state via db helpers if available, 
        // or technically we should expose a 'getAllPayments' in storageService.
        // Let's mock reading from local storage directly since storageService is simple.
        try {
            const raw = localStorage.getItem('committee_pro_db_v1');
            if (raw) {
                const parsed = JSON.parse(raw);
                setGroups(parsed.groups || []);
                setAllPayments(parsed.payments || []);
            }
        } catch(e) { console.error(e); }
    }, []);

    const totalCollected = allPayments.filter(p => p.status === 'PAID').length; // count only, multiply by amounts logic needed
    const totalPending = allPayments.filter(p => p.status === 'UNPAID').length;
    
    // Calculate Financials
    let totalAmountCollected = 0;
    let totalAmountPending = 0;

    groups.forEach(g => {
        const groupPayments = allPayments.filter(p => p.groupId === g.id);
        const paid = groupPayments.filter(p => p.status === 'PAID').length;
        const unpaid = groupPayments.filter(p => p.status === 'UNPAID').length;
        totalAmountCollected += (paid * g.amount);
        totalAmountPending += (unpaid * g.amount);
    });

    const handleExport = () => {
        alert("Export feature would generate a PDF here using 'jspdf' or similar libraries.");
    };

    return (
        <div className="space-y-6">
             <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-slate-800">{t.reports}</h2>
                    <p className="text-slate-500">Financial overview and exports.</p>
                </div>
                <button 
                    onClick={handleExport}
                    className="flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 px-6 py-3 rounded-xl font-medium transition-colors"
                >
                    <Download size={20} />
                    {t.exportPdf}
                </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white shadow-lg">
                    <div className="flex items-center gap-3 mb-2 opacity-90">
                        <TrendingUp size={24} />
                        <span className="font-medium text-emerald-100">{t.totalCollected}</span>
                    </div>
                    <h3 className="text-4xl font-bold">PKR {totalAmountCollected.toLocaleString()}</h3>
                </div>

                <div className="bg-gradient-to-br from-rose-500 to-pink-600 rounded-2xl p-6 text-white shadow-lg">
                    <div className="flex items-center gap-3 mb-2 opacity-90">
                        <AlertTriangle size={24} />
                        <span className="font-medium text-rose-100">{t.pending}</span>
                    </div>
                    <h3 className="text-4xl font-bold">PKR {totalAmountPending.toLocaleString()}</h3>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-100">
                    <h3 className="font-bold text-slate-800">Group Breakdown</h3>
                </div>
                <div className="divide-y divide-slate-100">
                    {groups.map(group => {
                        const groupPayments = allPayments.filter(p => p.groupId === group.id);
                        const paidCount = groupPayments.filter(p => p.status === 'PAID').length;
                        const totalCount = groupPayments.length;
                        const percent = totalCount > 0 ? Math.round((paidCount / totalCount) * 100) : 0;

                        return (
                            <div key={group.id} className="p-6 hover:bg-slate-50 transition-colors">
                                <div className="flex justify-between items-center mb-2">
                                    <h4 className="font-bold text-slate-700">{group.name}</h4>
                                    <span className="text-sm font-medium text-slate-500">{percent}% Collected</span>
                                </div>
                                <div className="w-full bg-slate-100 rounded-full h-2.5">
                                    <div 
                                        className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500" 
                                        style={{ width: `${percent}%` }}
                                    ></div>
                                </div>
                                <div className="mt-3 flex gap-6 text-sm">
                                    <div className="flex items-center gap-1 text-emerald-600">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                        <span>Collected: {(paidCount * group.amount).toLocaleString()}</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-rose-500">
                                        <div className="w-2 h-2 rounded-full bg-rose-500"></div>
                                        <span>Pending: {((totalCount - paidCount) * group.amount).toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                    {groups.length === 0 && (
                        <div className="p-8 text-center text-slate-400">No data available.</div>
                    )}
                </div>
            </div>
        </div>
    );
};
