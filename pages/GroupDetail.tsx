
import React, { useState, useEffect } from 'react';
import { db } from '../services/storageService';
import { generateReminderMessage } from '../services/geminiService';
import { useLanguage } from '../context/LanguageContext';
import { CommitteeGroup, DrawResult, Member, PaymentRecord } from '../types';
import { ArrowLeft, CheckCircle, XCircle, MessageCircle, Calendar, Trophy, Users, DollarSign } from 'lucide-react';
import { DrawWheel } from '../components/DrawWheel';

interface GroupDetailProps {
    groupId: string;
    onBack: () => void;
}

export const GroupDetail: React.FC<GroupDetailProps> = ({ groupId, onBack }) => {
    const { t, language } = useLanguage();
    const [data, setData] = useState<{ group?: CommitteeGroup; payments: PaymentRecord[]; draws: DrawResult[] }>({ payments: [], draws: [] });
    const [activeTab, setActiveTab] = useState<'payments' | 'draw' | 'members'>('payments');
    const [selectedCycle, setSelectedCycle] = useState(1);
    
    // AI Reminder State
    const [reminderLoading, setReminderLoading] = useState<string | null>(null);

    const loadData = () => {
        const details = db.getGroupDetails(groupId);
        setData(details);
        // Determine current cycle based on draws if not manually set yet
        if (details.draws.length > 0 && selectedCycle === 1) {
            // Default to next cycle or last one
             const nextCycle = Math.min(details.group?.totalCycles || 1, details.draws.length + 1);
             setSelectedCycle(nextCycle);
        }
    };

    useEffect(() => {
        loadData();
    }, [groupId]);

    if (!data.group) return <div className="p-8 text-center">Group not found</div>;

    const currentCyclePayments = data.payments.filter(p => p.cycleIndex === selectedCycle);
    const currentWinner = data.draws.find(d => d.cycleIndex === selectedCycle);

    const togglePayment = (payment: PaymentRecord) => {
        const newStatus = payment.status === 'PAID' ? 'UNPAID' : 'PAID';
        db.updatePayment(payment.id, newStatus);
        loadData();
    };

    const handleReminder = async (memberId: string) => {
        const member = data.group!.members.find(m => m.id === memberId);
        if (!member) return;
        
        setReminderLoading(memberId);
        const msg = await generateReminderMessage(member, data.group!.amount, language);
        setReminderLoading(null);
        
        // Open WhatsApp
        const encodedMsg = encodeURIComponent(msg);
        // Assuming generic format, user would likely need to clean phone number in real app
        window.open(`https://wa.me/${member.phone}?text=${encodedMsg}`, '_blank');
    };

    const handleDrawWinner = (winner: Member) => {
        const newDraw: DrawResult = {
            id: Date.now().toString(),
            groupId: data.group!.id,
            cycleIndex: selectedCycle,
            winnerMemberId: winner.id,
            drawDate: new Date().toISOString()
        };
        db.recordDraw(newDraw);
        loadData();
    };

    // Filter candidates for draw: Members who haven't won yet
    const previousWinners = new Set(data.draws.map(d => d.winnerMemberId));
    const eligibleCandidates = data.group.members.filter(m => !previousWinners.has(m.id));

    return (
        <div className="space-y-6 pb-20">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                <button onClick={onBack} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                    <ArrowLeft size={24} />
                </button>
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">{data.group.name}</h2>
                    <p className="text-slate-500 text-sm">
                        {data.group.currency} {data.group.amount.toLocaleString()} × {data.group.totalCycles} Cycles
                    </p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-slate-200 mb-6">
                <button 
                    onClick={() => setActiveTab('payments')}
                    className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${activeTab === 'payments' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                >
                    Payments
                </button>
                <button 
                    onClick={() => setActiveTab('draw')}
                    className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${activeTab === 'draw' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                >
                    Digital Draw
                </button>
                <button 
                    onClick={() => setActiveTab('members')}
                    className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${activeTab === 'members' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                >
                    Members Info
                </button>
            </div>

            {/* Cycle Selector (Common for Payments and Draw) */}
            <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                <span className="font-medium text-slate-700">Current Cycle:</span>
                <div className="flex gap-2 overflow-x-auto no-scrollbar">
                    {Array.from({ length: data.group.totalCycles }).map((_, i) => {
                        const cycleNum = i + 1;
                        return (
                            <button
                                key={cycleNum}
                                onClick={() => setSelectedCycle(cycleNum)}
                                className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold transition-all ${
                                    selectedCycle === cycleNum 
                                        ? 'bg-indigo-600 text-white shadow-md' 
                                        : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                                }`}
                            >
                                {cycleNum}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* PAYMENTS TAB */}
            {activeTab === 'payments' && (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden animate-fade-in">
                    <div className="p-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                         <h3 className="font-bold text-slate-700">Cycle {selectedCycle} Status</h3>
                         <div className="text-sm font-medium text-slate-500">
                            Collected: {currentCyclePayments.filter(p => p.status === 'PAID').length * data.group.amount} / {data.group.members.length * data.group.amount}
                         </div>
                    </div>
                    <div className="divide-y divide-slate-100">
                        {data.group.members.map(member => {
                            const payment = currentCyclePayments.find(p => p.memberId === member.id);
                            if (!payment) return null;
                            const isPaid = payment.status === 'PAID';

                            return (
                                <div key={member.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${isPaid ? 'bg-emerald-500' : 'bg-slate-300'}`}>
                                            {member.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-800">{member.name}</p>
                                            <p className="text-xs text-slate-500">{member.phone}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        {!isPaid && (
                                            <button 
                                                onClick={() => handleReminder(member.id)}
                                                disabled={reminderLoading === member.id}
                                                className="p-2 text-indigo-500 hover:bg-indigo-50 rounded-full transition-colors"
                                                title="Send WhatsApp Reminder"
                                            >
                                                {reminderLoading === member.id ? (
                                                    <span className="w-5 h-5 block border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></span>
                                                ) : (
                                                    <MessageCircle size={20} />
                                                )}
                                            </button>
                                        )}
                                        <button
                                            onClick={() => togglePayment(payment)}
                                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                                                isPaid 
                                                    ? 'bg-emerald-100 text-emerald-700' 
                                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                            }`}
                                        >
                                            {isPaid ? (
                                                <><CheckCircle size={16} /> Paid</>
                                            ) : (
                                                <><XCircle size={16} /> Unpaid</>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* DRAW TAB */}
            {activeTab === 'draw' && (
                <div className="animate-fade-in">
                    {currentWinner ? (
                         <div className="flex flex-col items-center justify-center p-10 bg-white rounded-2xl shadow-sm border-2 border-indigo-100 text-center">
                            <div className="w-24 h-24 bg-yellow-400 rounded-full flex items-center justify-center mb-6 shadow-xl ring-4 ring-yellow-100">
                                <Trophy className="text-white w-12 h-12" />
                            </div>
                            <h3 className="text-sm uppercase tracking-widest text-indigo-400 font-bold mb-2">Cycle {selectedCycle} Winner</h3>
                            <h2 className="text-3xl font-extrabold text-slate-800 mb-2">
                                {data.group.members.find(m => m.id === currentWinner.winnerMemberId)?.name || 'Unknown'}
                            </h2>
                            <p className="text-slate-500">
                                Drawn on {new Date(currentWinner.drawDate).toLocaleDateString()}
                            </p>
                        </div>
                    ) : (
                        <div>
                            <div className="bg-blue-50 p-4 rounded-xl mb-6 border border-blue-100 text-blue-800 text-sm text-center">
                                ⚠️ Performing the draw is permanent. Ensure all payments are collected.
                            </div>
                            <DrawWheel 
                                candidates={eligibleCandidates} 
                                onWinnerSelected={handleDrawWinner} 
                            />
                        </div>
                    )}
                </div>
            )}

            {/* MEMBERS TAB */}
            {activeTab === 'members' && (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden animate-fade-in">
                     <table className="w-full">
                        <thead className="bg-slate-50 text-left text-xs text-slate-500 uppercase font-semibold">
                            <tr>
                                <th className="px-6 py-4">Name</th>
                                <th className="px-6 py-4">Contact</th>
                                <th className="px-6 py-4">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {data.group.members.map(m => {
                                const hasWon = previousWinners.has(m.id);
                                return (
                                    <tr key={m.id}>
                                        <td className="px-6 py-4 font-medium text-slate-800">{m.name}</td>
                                        <td className="px-6 py-4 text-slate-500">{m.phone}</td>
                                        <td className="px-6 py-4">
                                            {hasWon ? (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                                    Winner
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                                                    Waiting
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                     </table>
                </div>
            )}
        </div>
    );
};
