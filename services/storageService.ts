
import { STORAGE_KEY } from '../constants';
import { AppState, CommitteeGroup, DrawResult, PaymentRecord, User } from '../types';
import { v4 as uuidv4 } from 'uuid';

const generateId = () => Math.random().toString(36).substr(2, 9);

const createSampleState = (): AppState => {
  const sampleUser: User = {
    id: 'u_demo',
    name: 'Super Admin (Head)',
    emailOrPhone: 'admin@committeepro.com',
    role: 'SUPER_ADMIN',
    status: 'ACTIVE',
    joinedAt: new Date().toISOString()
  };

  const sampleGroupAdmin: User = {
    id: 'u_ga1',
    name: 'Tariq Group Head',
    emailOrPhone: 'tariq.admin@committeepro.com',
    role: 'GROUP_ADMIN',
    status: 'ACTIVE',
    joinedAt: new Date().toISOString()
  };

  const sampleMemberUser: User = {
    id: 'u_mem1',
    name: 'Ali Khan',
    emailOrPhone: 'ali.khan@committeepro.com',
    role: 'MEMBER',
    status: 'ACTIVE',
    joinedAt: new Date().toISOString()
  };

  const g1Members = [
    { id: 'm1_1', name: 'Ali Khan', phone: '03001234567', joinedAt: '2026-05-01' },
    { id: 'm1_2', name: 'Sara Ahmed', phone: '03019876543', joinedAt: '2026-05-01' },
    { id: 'm1_3', name: 'Usman Malik', phone: '03025554433', joinedAt: '2026-05-01' },
    { id: 'm1_4', name: 'Zainab Tariq', phone: '03031112233', joinedAt: '2026-05-01' },
    { id: 'm1_5', name: 'Hamza Hassan', phone: '03049998877', joinedAt: '2026-05-01' },
    { id: 'm1_6', name: 'Fatima Sheikh', phone: '03054443322', joinedAt: '2026-05-01' },
    { id: 'm1_7', name: 'Omer Farooq', phone: '03067776655', joinedAt: '2026-05-01' },
    { id: 'm1_8', name: 'Bilal Raza', phone: '03078889900', joinedAt: '2026-05-01' },
  ];

  const g2Members = [
    { id: 'm2_1', name: 'Tariq Mehmood', phone: '03101234567', joinedAt: '2026-06-01' },
    { id: 'm2_2', name: 'Ayesha Tariq', phone: '03119876543', joinedAt: '2026-06-01' },
    { id: 'm2_3', name: 'Sana Bibi', phone: '03125554433', joinedAt: '2026-06-01' },
    { id: 'm2_4', name: 'Rashid Minhas', phone: '03131112233', joinedAt: '2026-06-01' },
    { id: 'm2_5', name: 'Huma Parveen', phone: '03149998877', joinedAt: '2026-06-01' },
    { id: 'm2_6', name: 'Kamran Shah', phone: '03154443322', joinedAt: '2026-06-01' },
  ];

  const groups: CommitteeGroup[] = [
    {
      id: 'g1',
      name: 'Executive Savings Circle',
      amount: 15000,
      totalCycles: 8,
      startDate: '2026-05-01T00:00:00.000Z',
      members: g1Members,
      status: 'ACTIVE',
      currency: 'PKR'
    },
    {
      id: 'g2',
      name: 'Family Committee 2026',
      amount: 10000,
      totalCycles: 6,
      startDate: '2026-06-01T00:00:00.000Z',
      members: g2Members,
      status: 'ACTIVE',
      currency: 'PKR'
    }
  ];

  const draws: DrawResult[] = [
    { id: 'd1_1', groupId: 'g1', cycleIndex: 1, winnerMemberId: 'm1_1', drawDate: '2026-05-31T10:00:00.000Z' },
    { id: 'd1_2', groupId: 'g1', cycleIndex: 2, winnerMemberId: 'm1_2', drawDate: '2026-06-30T10:00:00.000Z' },
    { id: 'd2_1', groupId: 'g2', cycleIndex: 1, winnerMemberId: 'm2_1', drawDate: '2026-06-30T10:00:00.000Z' },
  ];

  const payments: PaymentRecord[] = [];

  // Group 1 payments
  for (let c = 1; c <= 8; c++) {
    g1Members.forEach((m, idx) => {
      let status: 'PAID' | 'UNPAID' = 'UNPAID';
      if (c === 1 || c === 2) {
        status = 'PAID';
      } else if (c === 3 && idx < 6) { // Cycle 3 (current month): 6 paid out of 8
        status = 'PAID';
      }
      payments.push({
        id: `g1_c${c}_${m.id}`,
        groupId: 'g1',
        cycleIndex: c,
        memberId: m.id,
        status,
        paidDate: status === 'PAID' ? '2026-08-02T12:00:00.000Z' : undefined
      });
    });
  }

  // Group 2 payments
  for (let c = 1; c <= 6; c++) {
    g2Members.forEach((m, idx) => {
      let status: 'PAID' | 'UNPAID' = 'UNPAID';
      if (c === 1) {
        status = 'PAID';
      } else if (c === 2 && idx < 4) { // Cycle 2 (current month): 4 paid out of 6
        status = 'PAID';
      }
      payments.push({
        id: `g2_c${c}_${m.id}`,
        groupId: 'g2',
        cycleIndex: c,
        memberId: m.id,
        status,
        paidDate: status === 'PAID' ? '2026-08-05T12:00:00.000Z' : undefined
      });
    });
  }

  return {
    currentUser: sampleUser,
    users: [sampleUser, sampleGroupAdmin, sampleMemberUser],
    groups,
    payments,
    draws
  };
};

export const loadState = (): AppState => {
  try {
    const serialized = localStorage.getItem(STORAGE_KEY);
    if (!serialized) {
      const initial = createSampleState();
      saveState(initial);
      return initial;
    }
    const parsed = JSON.parse(serialized);
    if (!parsed.groups || parsed.groups.length === 0) {
      const initial = createSampleState();
      saveState(initial);
      return initial;
    }
    return { ...createSampleState(), ...parsed };
  } catch (e) {
    console.error("Failed to load state", e);
    return createSampleState();
  }
};

export const saveState = (state: AppState) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error("Failed to save state", e);
  }
};

// Helper methods to simulate DB operations
export const db = {
  getGroups: (): CommitteeGroup[] => loadState().groups,
  getPayments: (): PaymentRecord[] => loadState().payments,
  getDraws: (): DrawResult[] => loadState().draws,
  
  getCurrentUser: (): User | null => loadState().currentUser,

  loginUser: (emailOrPhone: string, role: 'SUPER_ADMIN' | 'GROUP_ADMIN' = 'SUPER_ADMIN'): User => {
    const state = loadState();
    let user = state.users.find(u => u.emailOrPhone === emailOrPhone);
    
    if (!user) {
        user = {
            id: generateId(),
            name: emailOrPhone.split('@')[0],
            emailOrPhone,
            role,
            joinedAt: new Date().toISOString()
        };
        state.users.push(user);
    } else {
        user.role = role;
    }
    
    state.currentUser = user;
    saveState(state);
    return user;
  },

  switchUserRole: (role: 'SUPER_ADMIN' | 'GROUP_ADMIN') => {
    const state = loadState();
    if (state.currentUser) {
      state.currentUser.role = role;
      const idx = state.users.findIndex(u => u.id === state.currentUser?.id);
      if (idx >= 0) state.users[idx].role = role;
      saveState(state);
    }
  },

  logoutUser: () => {
    const state = loadState();
    state.currentUser = null;
    saveState(state);
  },

  addGroup: (group: CommitteeGroup) => {
    const state = loadState();
    const currentUserRole = state.currentUser?.role || 'SUPER_ADMIN';
    
    // If created by Group Admin, require Super Admin approval
    if (currentUserRole === 'GROUP_ADMIN' && group.status !== 'ACTIVE') {
      group.status = 'PENDING_APPROVAL';
    } else {
      group.status = group.status || 'ACTIVE';
    }

    group.requestedByRole = currentUserRole;
    group.createdAt = new Date().toISOString();

    state.groups.push(group);
    // Initialize payments for all cycles/members as unpaid
    const newPayments: PaymentRecord[] = [];
    for (let c = 1; c <= group.totalCycles; c++) {
      group.members.forEach(m => {
        newPayments.push({
          id: `${group.id}_c${c}_${m.id}`,
          groupId: group.id,
          cycleIndex: c,
          memberId: m.id,
          status: 'UNPAID'
        });
      });
    }
    state.payments = [...state.payments, ...newPayments];
    saveState(state);
  },

  approveGroup: (groupId: string) => {
    const state = loadState();
    const group = state.groups.find(g => g.id === groupId);
    if (group) {
      group.status = 'ACTIVE';
      saveState(state);
    }
  },

  rejectGroup: (groupId: string) => {
    const state = loadState();
    const idx = state.groups.findIndex(g => g.id === groupId);
    if (idx >= 0) {
      state.groups[idx].status = 'REJECTED';
      saveState(state);
    }
  },

  updatePayment: (paymentId: string, status: 'PAID' | 'UNPAID', method?: string, notes?: string) => {
    const state = loadState();
    const idx = state.payments.findIndex(p => p.id === paymentId);
    if (idx >= 0) {
      state.payments[idx].status = status;
      state.payments[idx].paidDate = status === 'PAID' ? (state.payments[idx].paidDate || new Date().toISOString()) : undefined;
      if (method) state.payments[idx].method = method;
      if (notes !== undefined) state.payments[idx].notes = notes;
      saveState(state);
    }
  },

  savePaymentRecord: (paymentData: Partial<PaymentRecord> & { groupId: string; memberId: string; cycleIndex: number }) => {
    const state = loadState();
    const id = paymentData.id || `${paymentData.groupId}_c${paymentData.cycleIndex}_${paymentData.memberId}`;
    const userRole = state.currentUser?.role || 'SUPER_ADMIN';

    const existingIdx = state.payments.findIndex(p => p.id === id || (p.groupId === paymentData.groupId && p.memberId === paymentData.memberId && p.cycleIndex === paymentData.cycleIndex));

    const updatedPayment: PaymentRecord = {
      id,
      groupId: paymentData.groupId,
      cycleIndex: paymentData.cycleIndex,
      memberId: paymentData.memberId,
      status: paymentData.status || 'PAID',
      amount: paymentData.amount,
      paidDate: paymentData.paidDate || new Date().toISOString(),
      method: paymentData.method || 'Cash',
      notes: paymentData.notes || '',
      verified: paymentData.verified !== undefined ? paymentData.verified : true,
      recordedByRole: userRole
    };

    if (existingIdx >= 0) {
      state.payments[existingIdx] = updatedPayment;
    } else {
      state.payments.push(updatedPayment);
    }
    saveState(state);
    return updatedPayment;
  },

  removePaymentRecord: (paymentId: string) => {
    const state = loadState();
    const idx = state.payments.findIndex(p => p.id === paymentId);
    if (idx >= 0) {
      // Revert status to UNPAID and clear details
      state.payments[idx] = {
        id: paymentId,
        groupId: state.payments[idx].groupId,
        cycleIndex: state.payments[idx].cycleIndex,
        memberId: state.payments[idx].memberId,
        status: 'UNPAID'
      };
      saveState(state);
    }
  },

  verifyPaymentRecord: (paymentId: string, verifiedStatus: boolean = true) => {
    const state = loadState();
    const idx = state.payments.findIndex(p => p.id === paymentId);
    if (idx >= 0) {
      state.payments[idx].verified = verifiedStatus;
      saveState(state);
    }
  },

  recordDraw: (draw: DrawResult) => {
    const state = loadState();
    state.draws.push(draw);
    saveState(state);
  },

  getGroupDetails: (groupId: string) => {
    const state = loadState();
    const group = state.groups.find(g => g.id === groupId);
    const payments = state.payments.filter(p => p.groupId === groupId);
    const draws = state.draws.filter(d => d.groupId === groupId);
    return { group, payments, draws };
  },

  getUsers: (): User[] => loadState().users,

  addUser: (userData: { name: string; emailOrPhone: string; role: 'SUPER_ADMIN' | 'GROUP_ADMIN' | 'MEMBER'; status?: 'ACTIVE' | 'BLOCKED' }): User => {
    const state = loadState();
    const newUser: User = {
      id: generateId(),
      name: userData.name,
      emailOrPhone: userData.emailOrPhone,
      role: userData.role,
      status: userData.status || 'ACTIVE',
      joinedAt: new Date().toISOString()
    };
    state.users.push(newUser);
    saveState(state);
    return newUser;
  },

  updateUserRole: (userId: string, role: 'SUPER_ADMIN' | 'GROUP_ADMIN' | 'MEMBER') => {
    const state = loadState();
    const idx = state.users.findIndex(u => u.id === userId);
    if (idx >= 0) {
      state.users[idx].role = role;
      if (state.currentUser && state.currentUser.id === userId) {
        state.currentUser.role = role;
      }
      saveState(state);
    }
  },

  updateUserStatus: (userId: string, status: 'ACTIVE' | 'BLOCKED') => {
    const state = loadState();
    const idx = state.users.findIndex(u => u.id === userId);
    if (idx >= 0) {
      state.users[idx].status = status;
      saveState(state);
    }
  },

  removeUser: (userId: string) => {
    const state = loadState();
    state.users = state.users.filter(u => u.id !== userId);
    saveState(state);
  },

  deleteGroup: (groupId: string) => {
    const state = loadState();
    state.groups = state.groups.filter(g => g.id !== groupId);
    state.payments = state.payments.filter(p => p.groupId !== groupId);
    state.draws = state.draws.filter(d => d.groupId !== groupId);
    saveState(state);
  }
};
