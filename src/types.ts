// User types
export interface User {
    id: string;
    email: string;
    name: string;
    createdAt: string;
}

// Member types
export interface Member {
    id: string;
    name: string;
    email: string;
    phone: string;
}

// Payment tracking
export interface Payment {
    memberId: string;
    cycleIndex: number;
    isPaid: boolean;
    paidAt?: string;
    amount: number;
}

// Group/Committee types
export interface Group {
    id: string;
    name: string;
    description: string;
    amount: number;
    frequency: 'weekly' | 'monthly' | 'yearly';
    startDate: string;
    members: Member[];
    payments: Payment[];
    winners: Winner[];
    currentCycle: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

// Winner tracking
export interface Winner {
    memberId: string;
    memberName: string;
    cycleIndex: number;
    selectedAt: string;
    amount: number;
}

// Language support
export type Language = 'en' | 'ur';

export interface Translation {
    [key: string]: string | Translation;
}

export interface Translations {
    en: Translation;
    ur: Translation;
}

// Dashboard stats
export interface DashboardStats {
    totalGroups: number;
    activeGroups: number;
    totalMembers: number;
    pendingPayments: number;
    totalCollected: number;
}

// Report types
export interface ReportData {
    groupId: string;
    groupName: string;
    generatedAt: string;
    stats: {
        totalMembers: number;
        totalCycles: number;
        completedCycles: number;
        totalAmount: number;
        paidAmount: number;
        pendingAmount: number;
    };
    paymentHistory: Payment[];
    winnerHistory: Winner[];
}
