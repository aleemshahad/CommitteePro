import React, { useState, useEffect } from 'react';
import { db } from '../services/storageService';
import { useLanguage } from '../context/LanguageContext';
import { CommitteeGroup, PaymentRecord } from '../types';
import { X, CheckCircle2, DollarSign, CreditCard, Wallet, Calendar, FileText, Trash2, Check, ShieldCheck } from 'lucide-react';

interface RecordPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  preselectedGroupId?: string;
  preselectedMemberId?: string;
  preselectedCycle?: number;
  existingPayment?: PaymentRecord | null;
}

export const RecordPaymentModal: React.FC<RecordPaymentModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  preselectedGroupId,
  preselectedMemberId,
  preselectedCycle,
  existingPayment
}) => {
  const { t, language } = useLanguage();
  const [groups, setGroups] = useState<CommitteeGroup[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState<string>(preselectedGroupId || '');
  const [selectedMemberId, setSelectedMemberId] = useState<string>(preselectedMemberId || '');
  const [selectedCycle, setSelectedCycle] = useState<number>(preselectedCycle || 1);
  const [amount, setAmount] = useState<number>(0);
  const [paidDate, setPaidDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState<string>('Cash');
  const [paymentNotes, setPaymentNotes] = useState<string>('');
  const [isVerified, setIsVerified] = useState<boolean>(true);
  const [successMessage, setSuccessMessage] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      const activeGroups = db.getGroups().filter(g => g.status === 'ACTIVE');
      setGroups(activeGroups);
      
      const targetGrpId = preselectedGroupId || (activeGroups[0]?.id || '');
      setSelectedGroupId(targetGrpId);
      if (preselectedMemberId) setSelectedMemberId(preselectedMemberId);
      if (preselectedCycle) setSelectedCycle(preselectedCycle);

      const targetGroup = activeGroups.find(g => g.id === targetGrpId);

      // Check if existing payment passed or in db
      const currentPayments = db.getPayments();
      const existing = existingPayment || currentPayments.find(
        p => p.groupId === targetGrpId && p.memberId === preselectedMemberId && p.cycleIndex === preselectedCycle
      );

      if (existing && existing.status === 'PAID') {
        setAmount(existing.amount || targetGroup?.amount || 0);
        setPaidDate(existing.paidDate ? new Date(existing.paidDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]);
        setPaymentMethod(existing.method || 'Cash');
        setPaymentNotes(existing.notes || '');
        setIsVerified(existing.verified !== undefined ? existing.verified : true);
      } else {
        setAmount(targetGroup?.amount || 0);
        setPaidDate(new Date().toISOString().split('T')[0]);
        setPaymentMethod('Cash');
        setPaymentNotes('');
        setIsVerified(true);
      }
    }
  }, [isOpen, preselectedGroupId, preselectedMemberId, preselectedCycle, existingPayment]);

  const currentGroup = groups.find(g => g.id === selectedGroupId);

  useEffect(() => {
    if (currentGroup) {
      if (!amount || amount === 0) setAmount(currentGroup.amount);
      if (currentGroup.members.length > 0 && !selectedMemberId) {
        setSelectedMemberId(currentGroup.members[0].id);
      }
    }
  }, [currentGroup, selectedMemberId]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGroupId || !selectedMemberId || !selectedCycle) return;

    db.savePaymentRecord({
      groupId: selectedGroupId,
      memberId: selectedMemberId,
      cycleIndex: selectedCycle,
      status: 'PAID',
      amount: amount || currentGroup?.amount || 0,
      paidDate: new Date(paidDate).toISOString(),
      method: paymentMethod,
      notes: paymentNotes,
      verified: isVerified
    });

    setSuccessMessage(true);
    setTimeout(() => {
      setSuccessMessage(false);
      if (onSuccess) onSuccess();
      onClose();
    }, 1000);
  };

  const handleRemovePayment = () => {
    const paymentId = `${selectedGroupId}_c${selectedCycle}_${selectedMemberId}`;
    db.removePaymentRecord(paymentId);
    if (onSuccess) onSuccess();
    onClose();
  };

  const isEditingPaidRecord = db.getPayments().some(
    p => p.groupId === selectedGroupId && p.memberId === selectedMemberId && p.cycleIndex === selectedCycle && p.status === 'PAID'
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-100 transform transition-all">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white p-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-2xl border border-emerald-500/30">
              <DollarSign size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold tracking-tight">{t.recordPaymentTitle}</h3>
              <p className="text-indigo-200 text-xs mt-0.5">Admin Management Control</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        {successMessage ? (
          <div className="p-10 flex flex-col items-center justify-center text-center space-y-3">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center animate-bounce">
              <CheckCircle2 size={36} />
            </div>
            <h4 className="text-xl font-bold text-slate-800">{t.recordSuccess}</h4>
            <p className="text-sm text-slate-500">Payment calendar & statistics updated!</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Committee Selection */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                {t.activeGroups}
              </label>
              <select
                value={selectedGroupId}
                onChange={(e) => {
                  setSelectedGroupId(e.target.value);
                  const grp = groups.find(g => g.id === e.target.value);
                  if (grp) {
                    setAmount(grp.amount);
                    if (grp.members.length > 0) setSelectedMemberId(grp.members[0].id);
                  }
                }}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 text-sm font-semibold focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                required
              >
                {groups.map(g => (
                  <option key={g.id} value={g.id}>
                    {g.name} ({g.currency} {g.amount.toLocaleString()} / mo)
                  </option>
                ))}
              </select>
            </div>

            {/* Member & Cycle Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Member Selection */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  {t.selectMember}
                </label>
                <select
                  value={selectedMemberId}
                  onChange={(e) => setSelectedMemberId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 text-sm font-semibold focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  required
                >
                  {currentGroup?.members.map(m => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.phone})
                    </option>
                  ))}
                </select>
              </div>

              {/* Cycle Index */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  {t.selectCycle}
                </label>
                <select
                  value={selectedCycle}
                  onChange={(e) => setSelectedCycle(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 text-sm font-semibold focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  required
                >
                  {Array.from({ length: currentGroup?.totalCycles || 12 }).map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {t.cycle} {i + 1}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Amount & Date with Calendar Selector */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  {t.customAmount} ({currentGroup?.currency || 'PKR'})
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 text-sm font-bold focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1">
                  <Calendar size={14} className="text-indigo-600" />
                  <span>{t.paymentDate}</span>
                </label>
                <input
                  type="date"
                  value={paidDate}
                  onChange={(e) => setPaidDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 text-sm font-bold focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
            </div>

            {/* Payment Method Selector */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                {t.paymentMethod}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'Cash', label: t.cash, icon: Wallet },
                  { id: 'Bank Transfer', label: t.bankTransfer, icon: CreditCard },
                  { id: 'JazzCash / EasyPaisa', label: t.onlineWallet, icon: DollarSign }
                ].map((item) => {
                  const Icon = item.icon;
                  const isSelected = paymentMethod === item.id;
                  return (
                    <button
                      type="button"
                      key={item.id}
                      onClick={() => setPaymentMethod(item.id)}
                      className={`flex flex-col items-center justify-center p-2.5 rounded-2xl border text-xs font-bold transition-all gap-1 ${
                        isSelected
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/20'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <Icon size={16} />
                      <span className="truncate w-full text-center">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Verification Status */}
            <div className="flex items-center justify-between bg-slate-50 p-3 rounded-2xl border border-slate-200">
              <div className="flex items-center gap-2">
                <ShieldCheck size={18} className="text-emerald-600" />
                <span className="text-xs font-bold text-slate-700">Admin Verified Status</span>
              </div>
              <button
                type="button"
                onClick={() => setIsVerified(!isVerified)}
                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1 ${
                  isVerified
                    ? 'bg-emerald-500 text-white shadow-xs'
                    : 'bg-slate-200 text-slate-600'
                }`}
              >
                {isVerified ? <Check size={14} /> : null}
                <span>{isVerified ? t.verified : t.unverified}</span>
              </button>
            </div>

            {/* Optional Notes */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                {t.paymentNotes}
              </label>
              <input
                type="text"
                placeholder="e.g. Receipt #1042 or handed over to Admin"
                value={paymentNotes}
                onChange={(e) => setPaymentNotes(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Actions */}
            <div className="pt-2 flex items-center justify-between gap-3 border-t border-slate-100">
              {isEditingPaidRecord ? (
                <button
                  type="button"
                  onClick={handleRemovePayment}
                  className="px-4 py-2.5 rounded-xl text-xs font-extrabold text-rose-600 bg-rose-50 hover:bg-rose-100 transition-colors flex items-center gap-1.5"
                >
                  <Trash2 size={15} />
                  <span>{t.removePayment}</span>
                </button>
              ) : <div />}

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-extrabold bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-600/30 transition-all flex items-center gap-1.5"
                >
                  <CheckCircle2 size={16} />
                  <span>{t.confirmPayment}</span>
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
