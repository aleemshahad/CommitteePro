import { Committee, Payment, DashboardStats, DashboardCommittee } from '../types';
import { storageService } from './storage';

export const calculateDashboardStats = (userId: string, userRole: string): DashboardStats => {
    const allCommittees = storageService.getAllCommittees();
    const allPayments = storageService.getAllPayments();

    // Filter based on role
    let userCommittees: Committee[];
    if (userRole === 'superadmin') {
        userCommittees = allCommittees;
    } else {
        userCommittees = storageService.getUserCommittees(userId);
    }

    const activeCommittees = userCommittees.filter(c => c.isActive);

    // Count unique members
    const memberIds = new Set<string>();
    userCommittees.forEach(committee => {
        committee.members.forEach(member => {
            memberIds.add(member.userId);
        });
    });

    // Get relevant payments
    const committeeIds = new Set(userCommittees.map(c => c.id));
    const relevantPayments = allPayments.filter(p => committeeIds.has(p.committeeId));

    const pendingPayments = relevantPayments.filter(p => p.status === 'pending').length;
    const totalCollected = relevantPayments
        .filter(p => p.status === 'completed')
        .reduce((sum, p) => sum + p.amount, 0);

    // Calculate upcoming draws (committees that haven't completed all cycles)
    const upcomingDraws = activeCommittees.filter(
        c => c.currentCycle < c.totalCycles
    ).length;

    return {
        totalCommittees: userCommittees.length,
        activeCommittees: activeCommittees.length,
        totalMembers: memberIds.size,
        pendingPayments,
        totalCollected,
        upcomingDraws,
    };
};

export const getDashboardCommittees = (userId: string, userRole: string): DashboardCommittee[] => {
    let committees: Committee[];

    if (userRole === 'superadmin') {
        committees = storageService.getAllCommittees();
    } else {
        committees = storageService.getUserCommittees(userId);
    }

    const allPayments = storageService.getAllPayments();

    return committees.map(committee => {
        const committeePayments = allPayments.filter(p => p.committeeId === committee.id);
        const currentCyclePayments = committeePayments.filter(p => p.cycle === committee.currentCycle);

        const totalExpected = committee.members.length;
        const totalCompleted = currentCyclePayments.filter(p => p.status === 'completed').length;
        const completionRate = totalExpected > 0 ? (totalCompleted / totalExpected) * 100 : 0;

        // Calculate next draw date (simplified - adds payment frequency to start date)
        const nextDrawDate = new Date(committee.startDate);
        if (committee.paymentFrequency === 'monthly') {
            nextDrawDate.setMonth(nextDrawDate.getMonth() + committee.currentCycle);
        } else if (committee.paymentFrequency === 'weekly') {
            nextDrawDate.setDate(nextDrawDate.getDate() + (committee.currentCycle * 7));
        }

        return {
            id: committee.id,
            name: committee.name,
            memberCount: committee.members.length,
            nextDrawDate: nextDrawDate.toISOString(),
            completionRate: Math.round(completionRate),
            isActive: committee.isActive,
        };
    });
};

export const formatCurrency = (amount: number): string => {
    return `Rs. ${amount.toLocaleString()}`;
};

export const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays > 0 && diffDays <= 7) return `In ${diffDays} days`;
    if (diffDays < 0 && diffDays >= -7) return `${Math.abs(diffDays)} days ago`;

    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

export const getCompletionColor = (rate: number): string => {
    if (rate >= 80) return 'var(--color-success)';
    if (rate >= 50) return 'var(--color-warning)';
    return 'var(--color-error)';
};
