import React, { useEffect, useState } from 'react';
import { db } from '../services/storageService';
import { useLanguage } from '../context/LanguageContext';
import { CommitteeGroup, DrawResult, PaymentRecord } from '../types';
import { 
  Users, 
  Calendar, 
  Wallet, 
  TrendingUp, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  Plus, 
  Sparkles,
  Trophy,
  ShieldCheck,
  ChevronRight,
  AlertCircle,
  Check,
  X
} from 'lucide-react';

interface DashboardProps {
  onSelectGroup?: (groupId: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onSelectGroup }) => {
  const { t } = useLanguage();
  const [groups, setGroups] = useState<CommitteeGroup[]>([]);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [draws, setDraws] = useState<DrawResult[]>([]);
  const [loading, setLoading] = useState(true);

  const currentUser = db.getCurrentUser();
  const isSuperAdmin = currentUser?.role === 'SUPER_ADMIN';

  const loadData = () => {
    setGroups(db.getGroups());
    setPayments(db.getPayments());
    setDraws(db.getDraws());
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

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

  const activeGroups = groups.filter(g => g.status === 'ACTIVE');
  const pendingGroups = groups.filter(g => g.status === 'PENDING_APPROVAL');
  const totalMembers = activeGroups.reduce((acc, g) => acc + g.members.length, 0);

  // Overall Total Savings Collected across active committees
  const grandTotalCollected = payments
    .filter(p => {
      const parentGroup = activeGroups.find(g => g.id === p.groupId);
      return parentGroup && p.status === 'PAID';
    })
    .reduce((sum, p) => {
      const parentGroup = activeGroups.find(g => g.id === p.groupId);
      return sum + (p.amount || (parentGroup ? parentGroup.amount : 0));
    }, 0);

  // Calculate current month date text (e.g. August 2026)
  const currentMonthFormatted = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-500 gap-3">
        <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-medium">{t.loading}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Top Welcome Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 md:p-8 rounded-3xl shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-semibold uppercase tracking-wider">
              <Sparkles size={14} />
              <span>Digital ROSCA Dashboard</span>
            </span>
            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
              isSuperAdmin ? 'bg-purple-500/30 text-purple-200 border border-purple-400/40' : 'bg-indigo-500/30 text-indigo-200 border border-indigo-400/40'
            }`}>
              <ShieldCheck size={14} />
              <span>{isSuperAdmin ? t.superAdmin : t.groupAdmin}</span>
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">{t.dashboard}</h1>
          <p className="text-slate-300 text-sm md:text-base">
            Track active saving committees, month-by-month collections, and digital draws in real time.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/10 text-right">
          <div className="p-2.5 bg-indigo-600/50 rounded-xl text-white">
            <Calendar size={22} />
          </div>
          <div>
            <div className="text-xs text-indigo-200 uppercase font-bold tracking-wider">{t.currentMonth}</div>
            <div className="text-lg font-bold text-white">{currentMonthFormatted}</div>
          </div>
        </div>
      </header>

      {/* Pending Committee Creation Requests Card for Super Head Admin */}
      {pendingGroups.length > 0 && (
        <section className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-amber-500/20 rounded-2xl text-amber-800">
                <AlertCircle size={24} />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">{t.pendingRequests}</h3>
                <p className="text-xs text-amber-800">
                  {isSuperAdmin 
                    ? "As Super Head Admin (سپر ہیڈ ایڈمن), review and activate committee requests submitted by Group Head Admins."
                    : "Your committee request is pending Super Head Admin review."}
                </p>
              </div>
            </div>
            <span className="px-3 py-1 bg-amber-200 text-amber-900 text-xs font-black rounded-full">
              {pendingGroups.length} Pending
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingGroups.map((pGroup) => (
              <div key={pGroup.id} className="bg-white p-5 rounded-2xl border border-amber-200/80 shadow-xs flex flex-col justify-between gap-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-bold text-slate-900 text-base">{pGroup.name}</h4>
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                      PENDING APPROVAL
                    </span>
                  </div>
                  <div className="text-xs text-slate-600 space-y-1">
                    <p><strong className="text-slate-800">Monthly Contribution:</strong> PKR {pGroup.amount.toLocaleString()}</p>
                    <p><strong className="text-slate-800">Total Duration:</strong> {pGroup.totalCycles} Months ({pGroup.members.length} Members)</p>
                    <p><strong className="text-slate-800">Submitted By:</strong> {pGroup.requestedBy || 'Group Admin'}</p>
                  </div>
                </div>

                {isSuperAdmin ? (
                  <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                    <button
                      onClick={(e) => handleApprove(pGroup.id, e)}
                      className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1 shadow-xs transition-colors"
                    >
                      <Check size={16} />
                      <span>{t.approveGroup}</span>
                    </button>
                    <button
                      onClick={(e) => handleReject(pGroup.id, e)}
                      className="py-2 px-3 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl font-bold text-xs border border-rose-200 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="p-2 bg-amber-50 rounded-xl text-center text-xs text-amber-800 font-bold">
                    Awaiting Super Head Admin (سپر ہیڈ ایڈمن) Activation
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Top Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Total Collected Amount Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:border-emerald-200 transition-all group">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {t.totalSavings}
            </span>
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl group-hover:scale-110 transition-transform">
              <Wallet size={24} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">
              PKR {grandTotalCollected.toLocaleString()}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
            <ShieldCheck size={14} className="text-emerald-500" />
            <span>Verified collected contributions</span>
          </p>
        </div>

        {/* Active Groups Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:border-indigo-200 transition-all group">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {t.activeGroups}
            </span>
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl group-hover:scale-110 transition-transform">
              <Users size={24} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{activeGroups.length}</span>
            <span className="text-xs text-slate-500 font-medium">saving circles</span>
          </div>
          <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
            <TrendingUp size={14} className="text-indigo-500" />
            <span>Total enrolled members: {totalMembers}</span>
          </p>
        </div>

        {/* Next Draw / Upcoming Event */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:border-purple-200 transition-all group sm:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {t.upcomingDraw}
            </span>
            <div className="p-3 bg-purple-50 text-purple-600 rounded-xl group-hover:scale-110 transition-transform">
              <Trophy size={24} />
            </div>
          </div>
          {activeGroups.length > 0 ? (
            <div>
              <div className="text-xl font-bold text-slate-800 truncate">{activeGroups[0].name}</div>
              <p className="text-xs text-purple-600 font-medium mt-1 flex items-center gap-1">
                <Clock size={14} />
                <span>Month draw pending for current period</span>
              </p>
            </div>
          ) : (
            <div>
              <div className="text-xl font-bold text-slate-400">No active draws</div>
              <p className="text-xs text-slate-400 mt-1">Create a committee to start</p>
            </div>
          )}
        </div>
      </div>

      {/* Main Active Saving Groups (Committees) Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <span>{t.activeGroups}</span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-700">
                {activeGroups.length}
              </span>
            </h2>
            <p className="text-xs md:text-sm text-slate-500 mt-0.5">
              Live status, month-by-month progress, and payment metrics per committee.
            </p>
          </div>
        </div>

        {activeGroups.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-slate-200 shadow-sm">
            <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users size={32} />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">No Active Committees Found</h3>
            <p className="text-slate-500 text-sm max-w-md mx-auto mb-6">
              Get started by creating your first saving group to organize members, track monthly contributions, and perform digital draws.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {activeGroups.map((group) => {
              // Group payments & draws
              const groupPayments = payments.filter(p => p.groupId === group.id);
              const groupDraws = draws.filter(d => d.groupId === group.id);

              // Total collected for this group across all cycles
              const totalGroupCollected = groupPayments
                .filter(p => p.status === 'PAID')
                .reduce((sum, p) => sum + (p.amount || group.amount), 0);

              // Current active month index (e.g. 1, 2, 3...)
              const currentCycleIndex = Math.min(group.totalCycles, groupDraws.length + 1);

              // Current cycle payments
              const currentCyclePayments = groupPayments.filter(p => p.cycleIndex === currentCycleIndex);
              const currentCyclePaidCount = currentCyclePayments.filter(p => p.status === 'PAID').length;
              const currentCycleCollected = currentCyclePayments
                .filter(p => p.status === 'PAID')
                .reduce((sum, p) => sum + (p.amount || group.amount), 0);
              const currentCycleTarget = group.members.length * group.amount;

              // Percentages
              const currentMonthPercent = group.members.length > 0 
                ? Math.round((currentCyclePaidCount / group.members.length) * 100) 
                : 0;

              const overallCyclePercent = group.totalCycles > 0 
                ? Math.round((groupDraws.length / group.totalCycles) * 100) 
                : 0;

              // Calculate start month text for current cycle
              const startDateObj = group.startDate ? new Date(group.startDate) : new Date();
              const currentCycleDate = new Date(startDateObj);
              currentCycleDate.setMonth(currentCycleDate.getMonth() + (currentCycleIndex - 1));
              const cycleMonthName = currentCycleDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

              return (
                <div
                  key={group.id}
                  onClick={() => onSelectGroup && onSelectGroup(group.id)}
                  className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-lg hover:border-indigo-200 transition-all cursor-pointer group flex flex-col justify-between space-y-6"
                >
                  {/* Card Header */}
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 inline-flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            ACTIVE
                          </span>
                          <span className="text-xs text-slate-400 font-medium">
                            {group.currency} {group.amount.toLocaleString()} / member / mo
                          </span>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                          {group.name}
                        </h3>
                      </div>

                      <div className="p-3 bg-slate-50 text-slate-600 rounded-2xl group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                        <ChevronRight size={20} />
                      </div>
                    </div>

                    {/* Financial Summary Pill Box */}
                    <div className="grid grid-cols-2 gap-3 p-3.5 bg-slate-50/80 rounded-2xl border border-slate-100">
                      <div>
                        <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                          {t.totalCollected}
                        </div>
                        <div className="text-base font-extrabold text-emerald-600">
                          {group.currency} {totalGroupCollected.toLocaleString()}
                        </div>
                      </div>

                      <div>
                        <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                          {t.currentMonth} ({cycleMonthName})
                        </div>
                        <div className="text-base font-extrabold text-slate-800">
                          {group.currency} {currentCycleCollected.toLocaleString()}{' '}
                          <span className="text-xs text-slate-400 font-normal">
                            / {currentCycleTarget.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Progress Bars Section */}
                  <div className="space-y-4">
                    {/* Current Month Payment Progress Bar */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-slate-700 flex items-center gap-1.5">
                          <CheckCircle2 size={14} className="text-indigo-600" />
                          <span>{t.monthlyCollection} ({t.cycle} {currentCycleIndex} of {group.totalCycles})</span>
                        </span>
                        <span className="text-indigo-600 font-bold">
                          {currentCyclePaidCount}/{group.members.length} Paid ({currentMonthPercent}%)
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                        <div
                          className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500 ease-out"
                          style={{ width: `${currentMonthPercent}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Overall Group Cycle Progress Bar */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-slate-500 flex items-center gap-1.5">
                          <Clock size={14} className="text-purple-500" />
                          <span>{t.overallProgress} ({groupDraws.length} Draws Completed)</span>
                        </span>
                        <span className="text-purple-600 font-bold">{overallCyclePercent}%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-purple-500 h-2 rounded-full transition-all duration-500 ease-out"
                          style={{ width: `${overallCyclePercent}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* Footer Info & Action */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-2 overflow-hidden">
                        {group.members.slice(0, 4).map((member) => (
                          <div
                            key={member.id}
                            className="inline-block h-7 w-7 rounded-full ring-2 ring-white bg-indigo-500 text-white font-bold text-[10px] flex items-center justify-center uppercase shadow-xs"
                          >
                            {member.name.charAt(0)}
                          </div>
                        ))}
                      </div>
                      <span className="font-semibold text-slate-700">
                        {group.members.length} {t.members}
                      </span>
                    </div>

                    <button className="flex items-center gap-1.5 font-bold text-indigo-600 group-hover:text-indigo-700 transition-colors">
                      <span>{t.viewGroup}</span>
                      <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};

