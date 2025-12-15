// User and Authentication Types
export type UserRole = 'member' | 'admin' | 'superadmin';

export interface User {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    phone?: string;
    createdAt: string;
    lastLogin?: string;
}

export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
}

// Committee/Group Types
export interface Committee {
    id: string;
    name: string;
    description: string;
    adminId: string;
    adminName: string;
    members: Member[];
    paymentAmount: number;
    paymentFrequency: 'monthly' | 'weekly' | 'custom';
    startDate: string;
    totalCycles: number;
    currentCycle: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface Member {
    id: string;
    userId: string;
    name: string;
    email: string;
    phone?: string;
    joinedAt: string;
    isActive: boolean;
    hasWon: boolean;
    wonAt?: string;
}

// Payment Types
export interface Payment {
    id: string;
    committeeId: string;
    memberId: string;
    memberName: string;
    amount: number;
    cycle: number;
    status: 'pending' | 'completed' | 'overdue';
    paidAt?: string;
    recordedBy: string;
    notes?: string;
    createdAt: string;
}

export interface PaymentCycle {
    cycle: number;
    dueDate: string;
    payments: Payment[];
    totalCollected: number;
    totalExpected: number;
    completionRate: number;
}

// Draw Types
export interface Draw {
    id: string;
    committeeId: string;
    committeeName: string;
    cycle: number;
    winnerId: string;
    winnerName: string;
    amount: number;
    conductedBy: string;
    conductedAt: string;
    participants: string[]; // Member IDs
    notes?: string;
}

// Dashboard Types
export interface DashboardStats {
    totalCommittees: number;
    activeCommittees: number;
    totalMembers: number;
    pendingPayments: number;
    totalCollected: number;
    upcomingDraws: number;
}

export interface DashboardCommittee {
    id: string;
    name: string;
    memberCount: number;
    nextDrawDate: string;
    completionRate: number;
    isActive: boolean;
}

// Language Types
export type Language = 'en' | 'ur';

export interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
    isRTL: boolean;
}

// Notification Types
export interface Notification {
    id: string;
    type: 'payment' | 'draw' | 'system' | 'reminder';
    title: string;
    message: string;
    isRead: boolean;
    createdAt: string;
    userId: string;
    committeeId?: string;
}

// Report Types
export interface ReportFilters {
    committeeId?: string;
    startDate?: string;
    endDate?: string;
    memberId?: string;
    paymentStatus?: 'all' | 'pending' | 'completed' | 'overdue';
}

export interface ReportData {
    type: 'payment' | 'committee' | 'member' | 'draw';
    title: string;
    generatedAt: string;
    generatedBy: string;
    data: any;
    filters: ReportFilters;
}

// API Response Types
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

// Storage Types
export interface StorageData {
    users: User[];
    committees: Committee[];
    payments: Payment[];
    draws: Draw[];
    notifications: Notification[];
    settings: AppSettings;
}

export interface AppSettings {
    language: Language;
    theme: 'light' | 'dark';
    notifications: boolean;
    emailReminders: boolean;
    geminiApiKey?: string;
}

// Magic Link Types
export interface MagicLinkRequest {
    email: string;
}

export interface MagicLinkToken {
    token: string;
    email: string;
    expiresAt: string;
}

// AI Reminder Types
export interface ReminderConfig {
    enabled: boolean;
    daysBefore: number;
    language: Language;
    customMessage?: string;
}

export interface AIReminderRequest {
    memberName: string;
    committeeName: string;
    amount: number;
    dueDate: string;
    language: Language;
}
