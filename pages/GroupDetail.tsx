
import React, { useState, useEffect } from 'react';
import { db } from '../services/storageService';
import { generateReminderMessage } from '../services/geminiService';
import { useLanguage } from '../context/LanguageContext';
import { CommitteeGroup, DrawResult, Member, PaymentRecord } from '../types';
import { ArrowLeft, CheckCircle, XCircle, MessageCircle, Calendar, Trophy, Users, DollarSign, PlusCircle, CreditCard, Wallet, Check, X, CalendarDays, Edit3, Trash2, ShieldCheck, ShieldAlert } from 'lucide-react';
import { DrawWheel } from '../components/DrawWheel';
import { RecordPaymentModal } from '../components/RecordPaymentModal';

interface GroupDetailProps {
    groupId: string;
    onBack: () => void;
}

export const GroupDetail: React.FC<GroupDetailProps> = ({ groupId, onBack }) => {
    const { t, language } = useLanguage();
    const [data, setData] = useState<{ group?: CommitteeGroup; payments: PaymentRecord[]; draws: DrawResult[] }>({ payments: [], draws: [] });
    const [activeTab, setActiveTab] = useState<'payments' | 'calendar' | 'draw' | 'members'>('payments');
    const [selectedCycle, setSelectedCycle] = useState(1);
    
    // Payment Modal State
    const [modalState, setModalState] = useState<{ isOpen: boolean; memberId?: string; existingPayment?: PaymentRecord | null }>({ isOpen: false });

    // AI Reminder State
    const [reminderLoading, setReminderLoading] = useState<string | null>(null);

    const loadData = () => {
        const details = db.getGroupDetails(groupId);
        setData(details);
        if (details.draws.length > 0 && selectedCycle === 1) {
             const nextCycle = Math.min(details.group?.totalCycles || 1, details.draws.length + 1);
             setSelectedCycle(nextCycle);
        }
    };

    useEffect(() => {
        loadData();
        const handleStorageChange = () => loadData();
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, [groupId]);

    if (!data.group) return <div className="p-8 text-center">{t.loading}</div>;

    const currentCyclePayments = data.payments.filter(p => p.cycleIndex === selectedCycle);
    const currentWinner = data.draws.find(d => d.cycleIndex === selectedCycle);

    const handleRemovePayment = (paymentId: string) => {
        if (window.confirm(t.confirmRemovePayment || 'Are you sure you want to remove this payment record?')) {
            db.removePaymentRecord(paymentId);
            loadData();
        }
    };

    const handleToggleVerify = (paymentId: string, currentVerified?: boolean) => {
        db.verifyPaymentRecord(paymentId, !currentVerified);
        loadData();
    };

    const handleReminder = async (memberId: string) => {
        const member = data.group!.members.find(m => m.id === memberId);
        if (!member) return;
        
        setReminderLoading(memberId);
        const msg = await generateReminderMessage(member, data.group!.amount, language);
        setReminderLoading(null);
        
        const encodedMsg = encodeURIComponent(msg);
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

    const previousWinners = new Set(data.draws.map(d => d.winnerMemberId));
    const eligibleCandidates = data.group.members.filter(m => !previousWinners.has(m.id));

    return (
        <div className="space-y-6 pb-20 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl shadow-xs border border-slate-100">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="p-2.5 hover:bg-slate-100 text-slate-700 rounded-2xl transition-colors">
                        <ArrowLeft size={22} />
                    </button>
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-700">
                                {data.group.currency} {data.group.amount.toLocaleString()} / mo
                            </span>
                        </div>
                        <h2 className="text-2xl font-extrabold text-slate-900 mt-0.5">{data.group.name}</h2>
                    </div>
                </div>

                <button
                    onClick={() => setModalState({ isOpen: true })}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
                >
                    <PlusCircle size={18} />
                    <span>{t.addPayment}</span>
                </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-slate-200 overflow-x-auto no-scrollbar">
                <button 
                    onClick={() => setActiveTab('payments')}
                    className={`px-5 py-3 font-bold text-sm border-b-2 whitespace-nowrap transition-colors ${activeTab === 'payments' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                >
                    {t.monthlyCollection}
                </button>
                <button 
                    onClick={() => setActiveTab('calendar')}
                    className={`px-5 py-3 font-bold text-sm border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${activeTab === 'calendar' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                >
                    <CalendarDays size={16} />
                    <span>{t.calendarMatrix}</span>
                </button>
                <button 
                    onClick={() => setActiveTab('draw')}
                    className={`px-5 py-3 font-bold text-sm border-b-2 whitespace-nowrap transition-colors ${activeTab === 'draw' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                >
                    {t.drawTitle}
                </button>
                <button 
                    onClick={() => setActiveTab('members')}
                    className={`px-5 py-3 font-bold text-sm border-b-2 whitespace-nowrap transition-colors ${activeTab === 'members' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                >
                    {t.members} ({data.group.members.length})
                </button>
            </div>

            {/* Cycle Selector (For Payments & Draw tabs) */}
            {activeTab !== 'calendar' && (
                <div className="flex items-center justify-between bg-white p-4 rounded-2xl shadow-xs border border-slate-100">
                    <span className="font-bold text-slate-700 text-sm">{t.selectCycle}:</span>
                    <div className="flex gap-2 overflow-x-auto no-scrollbar">
                        {Array.from({ length: data.group.totalCycles }).map((_, i) => {
                            const cycleNum = i + 1;
                            return (
                                <button
                                    key={cycleNum}
                                    onClick={() => setSelectedCycle(cycleNum)}
                                    className={`px-3 py-2 rounded-xl flex items-center justify-center text-xs font-bold transition-all whitespace-nowrap ${
                                        selectedCycle === cycleNum 
                                            ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30' 
                                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                    }`}
                                >
                                    {t.cycle} {cycleNum}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* PAYMENTS TAB */}
            {activeTab === 'payments' && (
                <div className="bg-white rounded-3xl shadow-xs border border-slate-100 overflow-hidden">
                    <div className="p-5 bg-slate-50/80 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                         <div>
                            <h3 className="font-bold text-slate-800 text-base">{t.cycle} {selectedCycle} Collection Status</h3>
                            <p className="text-xs text-slate-500">Super Admin & Group Admin Management Panel</p>
                         </div>
                         <div className="text-sm font-extrabold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-xl border border-indigo-100">
                            Collected: {data.group.currency} {(currentCyclePayments.filter(p => p.status === 'PAID').reduce((sum, p) => sum + (p.amount || data.group!.amount), 0)).toLocaleString()} / {(data.group.members.length * data.group.amount).toLocaleString()}
                         </div>
                    </div>
                    <div className="divide-y divide-slate-100">
                        {data.group.members.map(member => {
                            const payment = currentCyclePayments.find(p => p.memberId === member.id);
                            const isPaid = payment?.status === 'PAID';

                            return (
                                <div key={member.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/60 transition-colors">
                                    <div className="flex items-center gap-3.5">
                                        <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-white font-extrabold text-sm shadow-xs shrink-0 ${isPaid ? 'bg-emerald-500' : 'bg-slate-300'}`}>
                                            {member.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <p className="font-bold text-slate-900">{member.name}</p>
                                                {isPaid && payment?.verified && (
                                                    <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                                                        <ShieldCheck size={12} />
                                                        <span>{t.verified}</span>
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mt-0.5">
                                                <span>{member.phone}</span>
                                                {isPaid && payment?.amount && (
                                                    <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                                                        {data.group!.currency} {payment.amount.toLocaleString()}
                                                    </span>
                                                )}
                                                {isPaid && payment?.paidDate && (
                                                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                                                        <Calendar size={12} />
                                                        {new Date(payment.paidDate).toLocaleDateString()}
                                                    </span>
                                                )}
                                                {isPaid && payment?.method && (
                                                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-semibold text-[10px]">
                                                        {payment.method}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-2 self-end sm:self-center">
                                        {!isPaid ? (
                                            <>
                                                <button 
                                                    onClick={() => handleReminder(member.id)}
                                                    disabled={reminderLoading === member.id}
                                                    className="p-2.5 text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors border border-indigo-100"
                                                    title="Send WhatsApp Reminder"
                                                >
                                                    {reminderLoading === member.id ? (
                                                        <span className="w-4 h-4 block border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></span>
                                                    ) : (
                                                        <MessageCircle size={18} />
                                                    )}
                                                </button>

                                                {/* Add Payment Button with Amount & Calendar Date Picker */}
                                                <button
                                                    onClick={() => setModalState({ isOpen: true, memberId: member.id, existingPayment: null })}
                                                    className="px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm transition-all flex items-center gap-1.5"
                                                >
                                                    <PlusCircle size={15} />
                                                    <span>{t.addPayment}</span>
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                {/* Edit Payment */}
                                                <button
                                                    onClick={() => setModalState({ isOpen: true, memberId: member.id, existingPayment: payment })}
                                                    className="p-2 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors border border-indigo-100 flex items-center gap-1 text-xs font-bold"
                                                    title={t.editPayment}
                                                >
                                                    <Edit3 size={15} />
                                                    <span className="hidden sm:inline">{t.editPayment}</span>
                                                </button>

                                                {/* Verify Toggle */}
                                                <button
                                                    onClick={() => payment && handleToggleVerify(payment.id, payment.verified)}
                                                    className={`p-2 rounded-xl transition-colors flex items-center gap-1 text-xs font-bold ${
                                                        payment?.verified 
                                                            ? 'text-emerald-700 bg-emerald-100 hover:bg-emerald-200'
                                                            : 'text-amber-700 bg-amber-100 hover:bg-amber-200'
                                                    }`}
                                                    title={t.verifyPayment}
                                                >
                                                    <ShieldCheck size={15} />
                                                    <span className="hidden sm:inline">{payment?.verified ? t.verified : t.verifyPayment}</span>
                                                </button>

                                                {/* Remove Payment */}
                                                <button
                                                    onClick={() => payment && handleRemovePayment(payment.id)}
                                                    className="p-2 text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors border border-rose-100"
                                                    title={t.removePayment}
                                                >
                                                    <Trash2 size={15} />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* CALENDAR TRACKING MATRIX TAB */}
            {activeTab === 'calendar' && (
                <div className="bg-white rounded-3xl shadow-xs border border-slate-100 overflow-hidden animate-fade-in">
                    <div className="p-6 bg-slate-900 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h3 className="text-xl font-extrabold flex items-center gap-2">
                                <CalendarDays className="text-emerald-400" size={22} />
                                <span>{t.cycleCalendar}</span>
                            </h3>
                            <p className="text-xs text-slate-300 mt-1">
                                {t.clickToToggle} (Head Admin & Super Admin Access)
                            </p>
                        </div>

                        {/* Legend */}
                        <div className="flex items-center gap-4 bg-slate-800/90 px-4 py-2 rounded-2xl border border-slate-700 text-xs font-bold">
                            <div className="flex items-center gap-1.5">
                                <span className="w-5 h-5 rounded-lg bg-emerald-500 text-white flex items-center justify-center font-extrabold text-xs shadow-xs">✓</span>
                                <span className="text-emerald-300">{t.paidBadge}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span className="w-5 h-5 rounded-lg bg-slate-700 border border-slate-600 text-slate-400 flex items-center justify-center font-extrabold text-xs">✕</span>
                                <span className="text-slate-300">{t.unpaidBadge}</span>
                            </div>
                        </div>
                    </div>

                    {/* Matrix Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-extrabold text-slate-600 uppercase tracking-wider">
                                    <th className="p-4 sticky left-0 bg-slate-50 z-10 min-w-[180px] shadow-xs">
                                        Member Name
                                    </th>
                                    {Array.from({ length: data.group.totalCycles }).map((_, i) => {
                                        const cIdx = i + 1;
                                        const isWinnerCycle = data.draws.some(d => d.cycleIndex === cIdx);
                                        return (
                                            <th key={cIdx} className="p-4 text-center min-w-[75px]">
                                                <div>{t.cycle} {cIdx}</div>
                                                {isWinnerCycle && (
                                                    <span className="text-[10px] text-amber-600 font-bold block mt-0.5">🏆 Winner</span>
                                                )}
                                            </th>
                                        );
                                    })}
                                    <th className="p-4 text-center min-w-[110px]">Progress</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-sm">
                                {data.group.members.map(member => {
                                    const memberPayments = data.payments.filter(p => p.memberId === member.id && p.status === 'PAID');
                                    const paidCount = memberPayments.length;
                                    const total = data.group?.totalCycles || 1;
                                    const pct = Math.round((paidCount / total) * 100);

                                    return (
                                        <tr key={member.id} className="hover:bg-indigo-50/30 transition-colors">
                                            {/* Sticky Member Column */}
                                            <td className="p-4 sticky left-0 bg-white group-hover:bg-indigo-50/30 z-10 font-bold text-slate-800 shadow-xs flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 font-extrabold text-xs flex items-center justify-center shrink-0">
                                                    {member.name.charAt(0)}
                                                </div>
                                                <div className="truncate">
                                                    <div className="truncate font-bold">{member.name}</div>
                                                    <div className="text-[11px] font-normal text-slate-400">{member.phone}</div>
                                                </div>
                                            </td>

                                            {/* Cycles Tick Checkboxes */}
                                            {Array.from({ length: data.group.totalCycles }).map((_, i) => {
                                                const cIdx = i + 1;
                                                const payment = data.payments.find(p => p.memberId === member.id && p.cycleIndex === cIdx);
                                                const isPaid = payment?.status === 'PAID';

                                                return (
                                                    <td key={cIdx} className="p-3 text-center align-middle">
                                                        <button
                                                            onClick={() => setModalState({ isOpen: true, memberId: member.id, existingPayment: payment })}
                                                            title={isPaid ? `Paid: ${data.group?.currency} ${payment?.amount || data.group?.amount}. Click to edit payment/date.` : 'Unpaid. Click to add payment.'}
                                                            className={`w-9 h-9 mx-auto rounded-xl flex items-center justify-center font-extrabold text-sm transition-all transform active:scale-90 ${
                                                                isPaid
                                                                    ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30 hover:bg-emerald-600'
                                                                    : 'bg-slate-100 text-slate-300 border border-slate-200 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-300'
                                                            }`}
                                                        >
                                                            {isPaid ? (
                                                                <Check size={18} strokeWidth={3} />
                                                            ) : (
                                                                <X size={15} strokeWidth={2.5} />
                                                            )}
                                                        </button>
                                                    </td>
                                                );
                                            })}

                                            {/* Progress summary */}
                                            <td className="p-4 text-center font-extrabold">
                                                <span className={`inline-flex items-center px-2.5 py-1 rounded-xl text-xs ${
                                                    paidCount === total
                                                        ? 'bg-emerald-100 text-emerald-800'
                                                        : 'bg-indigo-50 text-indigo-700'
                                                }`}>
                                                    {paidCount}/{total} ({pct}%)
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* DRAW TAB */}
            {activeTab === 'draw' && (
                <div className="animate-fade-in">
                    {currentWinner ? (
                         <div className="flex flex-col items-center justify-center p-10 bg-white rounded-3xl shadow-xs border border-indigo-100 text-center">
                            <div className="w-24 h-24 bg-gradient-to-tr from-yellow-400 to-amber-500 rounded-full flex items-center justify-center mb-6 shadow-xl ring-4 ring-yellow-100">
                                <Trophy className="text-white w-12 h-12" />
                            </div>
                            <h3 className="text-xs uppercase tracking-widest text-indigo-500 font-bold mb-2">Cycle {selectedCycle} {t.winner}</h3>
                            <h2 className="text-3xl font-extrabold text-slate-900 mb-2">
                                {data.group.members.find(m => m.id === currentWinner.winnerMemberId)?.name || 'Unknown'}
                            </h2>
                            <p className="text-slate-500 text-sm">
                                Drawn on {new Date(currentWinner.drawDate).toLocaleDateString()}
                            </p>
                        </div>
                    ) : (
                        <div>
                            <div className="bg-amber-50 p-4 rounded-2xl mb-6 border border-amber-200 text-amber-900 text-sm text-center font-medium">
                                ⚠️ Performing the draw is permanent for Cycle {selectedCycle}.
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
                <div className="bg-white rounded-3xl shadow-xs border border-slate-100 overflow-hidden animate-fade-in">
                     <table className="w-full">
                        <thead className="bg-slate-50/80 text-left text-xs text-slate-500 uppercase font-bold">
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
                                    <tr key={m.id} className="hover:bg-slate-50/50">
                                        <td className="px-6 py-4 font-bold text-slate-900">{m.name}</td>
                                        <td className="px-6 py-4 text-slate-500 text-sm">{m.phone}</td>
                                        <td className="px-6 py-4">
                                            {hasWon ? (
                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                                                    Won Draw
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600">
                                                    Eligible for next draw
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

            {/* Dedicated Record Payment Modal */}
            <RecordPaymentModal
                isOpen={modalState.isOpen}
                onClose={() => setModalState({ isOpen: false })}
                onSuccess={loadData}
                preselectedGroupId={data.group.id}
                preselectedMemberId={modalState.memberId}
                preselectedCycle={selectedCycle}
                existingPayment={modalState.existingPayment}
            />
        </div>
    );
};
