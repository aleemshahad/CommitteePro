import { User, Committee, Payment, Draw, Notification, AppSettings, StorageData } from '../types';

class StorageService {
    private readonly STORAGE_VERSION = '1.0.0';

    // Initialize storage with default data if not exists
    initialize(): void {
        if (!localStorage.getItem('storageVersion')) {
            const initialData: Partial<StorageData> = {
                users: [],
                committees: [],
                payments: [],
                draws: [],
                notifications: [],
                settings: {
                    language: 'en',
                    theme: 'light',
                    notifications: true,
                    emailReminders: true,
                },
            };

            localStorage.setItem('storageVersion', this.STORAGE_VERSION);
            localStorage.setItem('users', JSON.stringify(initialData.users));
            localStorage.setItem('committees', JSON.stringify(initialData.committees));
            localStorage.setItem('payments', JSON.stringify(initialData.payments));
            localStorage.setItem('draws', JSON.stringify(initialData.draws));
            localStorage.setItem('notifications', JSON.stringify(initialData.notifications));
            localStorage.setItem('settings', JSON.stringify(initialData.settings));
        }
    }

    // Users
    getAllUsers(): User[] {
        const data = localStorage.getItem('users');
        return data ? JSON.parse(data) : [];
    }

    getUserById(id: string): User | null {
        const users = this.getAllUsers();
        return users.find(u => u.id === id) || null;
    }

    getUserByEmail(email: string): User | null {
        const users = this.getAllUsers();
        return users.find(u => u.email === email) || null;
    }

    saveUser(user: User): void {
        const users = this.getAllUsers();
        const index = users.findIndex(u => u.id === user.id);
        if (index !== -1) {
            users[index] = user;
        } else {
            users.push(user);
        }
        localStorage.setItem('users', JSON.stringify(users));
    }

    deleteUser(id: string): void {
        const users = this.getAllUsers().filter(u => u.id !== id);
        localStorage.setItem('users', JSON.stringify(users));
    }

    // Committees
    getAllCommittees(): Committee[] {
        const data = localStorage.getItem('committees');
        return data ? JSON.parse(data) : [];
    }

    getCommitteeById(id: string): Committee | null {
        const committees = this.getAllCommittees();
        return committees.find(c => c.id === id) || null;
    }

    getCommitteesByAdminId(adminId: string): Committee[] {
        return this.getAllCommittees().filter(c => c.adminId === adminId);
    }

    getUserCommittees(userId: string): Committee[] {
        return this.getAllCommittees().filter(c =>
            c.adminId === userId || c.members.some(m => m.userId === userId)
        );
    }

    saveCommittee(committee: Committee): void {
        const committees = this.getAllCommittees();
        const index = committees.findIndex(c => c.id === committee.id);
        if (index !== -1) {
            committees[index] = committee;
        } else {
            committees.push(committee);
        }
        localStorage.setItem('committees', JSON.stringify(committees));
    }

    deleteCommittee(id: string): void {
        const committees = this.getAllCommittees().filter(c => c.id !== id);
        localStorage.setItem('committees', JSON.stringify(committees));

        // Also delete related payments and draws
        const payments = this.getAllPayments().filter(p => p.committeeId !== id);
        localStorage.setItem('payments', JSON.stringify(payments));

        const draws = this.getAllDraws().filter(d => d.committeeId !== id);
        localStorage.setItem('draws', JSON.stringify(draws));
    }

    // Payments
    getAllPayments(): Payment[] {
        const data = localStorage.getItem('payments');
        return data ? JSON.parse(data) : [];
    }

    getPaymentById(id: string): Payment | null {
        const payments = this.getAllPayments();
        return payments.find(p => p.id === id) || null;
    }

    getPaymentsByCommittee(committeeId: string): Payment[] {
        return this.getAllPayments().filter(p => p.committeeId === committeeId);
    }

    getPaymentsByMember(memberId: string): Payment[] {
        return this.getAllPayments().filter(p => p.memberId === memberId);
    }

    getPaymentsByCycle(committeeId: string, cycle: number): Payment[] {
        return this.getAllPayments().filter(
            p => p.committeeId === committeeId && p.cycle === cycle
        );
    }

    savePayment(payment: Payment): void {
        const payments = this.getAllPayments();
        const index = payments.findIndex(p => p.id === payment.id);
        if (index !== -1) {
            payments[index] = payment;
        } else {
            payments.push(payment);
        }
        localStorage.setItem('payments', JSON.stringify(payments));
    }

    deletePayment(id: string): void {
        const payments = this.getAllPayments().filter(p => p.id !== id);
        localStorage.setItem('payments', JSON.stringify(payments));
    }

    // Draws
    getAllDraws(): Draw[] {
        const data = localStorage.getItem('draws');
        return data ? JSON.parse(data) : [];
    }

    getDrawById(id: string): Draw | null {
        const draws = this.getAllDraws();
        return draws.find(d => d.id === id) || null;
    }

    getDrawsByCommittee(committeeId: string): Draw[] {
        return this.getAllDraws().filter(d => d.committeeId === committeeId);
    }

    saveDraw(draw: Draw): void {
        const draws = this.getAllDraws();
        const index = draws.findIndex(d => d.id === draw.id);
        if (index !== -1) {
            draws[index] = draw;
        } else {
            draws.push(draw);
        }
        localStorage.setItem('draws', JSON.stringify(draws));
    }

    deleteDraw(id: string): void {
        const draws = this.getAllDraws().filter(d => d.id !== id);
        localStorage.setItem('draws', JSON.stringify(draws));
    }

    // Notifications
    getAllNotifications(): Notification[] {
        const data = localStorage.getItem('notifications');
        return data ? JSON.parse(data) : [];
    }

    getUserNotifications(userId: string): Notification[] {
        return this.getAllNotifications().filter(n => n.userId === userId);
    }

    saveNotification(notification: Notification): void {
        const notifications = this.getAllNotifications();
        notifications.unshift(notification); // Add to beginning
        localStorage.setItem('notifications', JSON.stringify(notifications));
    }

    markNotificationAsRead(id: string): void {
        const notifications = this.getAllNotifications();
        const notification = notifications.find(n => n.id === id);
        if (notification) {
            notification.isRead = true;
            localStorage.setItem('notifications', JSON.stringify(notifications));
        }
    }

    deleteNotification(id: string): void {
        const notifications = this.getAllNotifications().filter(n => n.id !== id);
        localStorage.setItem('notifications', JSON.stringify(notifications));
    }

    // Settings
    getSettings(): AppSettings {
        const data = localStorage.getItem('settings');
        return data ? JSON.parse(data) : {
            language: 'en',
            theme: 'light',
            notifications: true,
            emailReminders: true,
        };
    }

    saveSettings(settings: AppSettings): void {
        localStorage.setItem('settings', JSON.stringify(settings));
    }

    // Utility methods
    clearAllData(): void {
        const keys = ['users', 'committees', 'payments', 'draws', 'notifications', 'settings', 'currentUser'];
        keys.forEach(key => localStorage.removeItem(key));
        this.initialize();
    }

    exportData(): string {
        const data: StorageData = {
            users: this.getAllUsers(),
            committees: this.getAllCommittees(),
            payments: this.getAllPayments(),
            draws: this.getAllDraws(),
            notifications: this.getAllNotifications(),
            settings: this.getSettings(),
        };
        return JSON.stringify(data, null, 2);
    }

    importData(jsonData: string): void {
        try {
            const data: StorageData = JSON.parse(jsonData);
            localStorage.setItem('users', JSON.stringify(data.users));
            localStorage.setItem('committees', JSON.stringify(data.committees));
            localStorage.setItem('payments', JSON.stringify(data.payments));
            localStorage.setItem('draws', JSON.stringify(data.draws));
            localStorage.setItem('notifications', JSON.stringify(data.notifications));
            localStorage.setItem('settings', JSON.stringify(data.settings));
        } catch (error) {
            console.error('Error importing data:', error);
            throw new Error('Invalid data format');
        }
    }
}

export const storageService = new StorageService();

// Initialize storage on module load
storageService.initialize();
