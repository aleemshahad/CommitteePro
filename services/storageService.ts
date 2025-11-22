
import { STORAGE_KEY } from '../constants';
import { AppState, CommitteeGroup, DrawResult, PaymentRecord, User } from '../types';
import { v4 as uuidv4 } from 'uuid';

const generateId = () => Math.random().toString(36).substr(2, 9);

const defaultState: AppState = {
  currentUser: null,
  users: [],
  groups: [],
  payments: [],
  draws: [],
};

export const loadState = (): AppState => {
  try {
    const serialized = localStorage.getItem(STORAGE_KEY);
    if (!serialized) return defaultState;
    const parsed = JSON.parse(serialized);
    // Ensure new fields exist if loading old state
    return { ...defaultState, ...parsed };
  } catch (e) {
    console.error("Failed to load state", e);
    return defaultState;
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
  
  getCurrentUser: (): User | null => loadState().currentUser,

  loginUser: (emailOrPhone: string): User => {
    const state = loadState();
    let user = state.users.find(u => u.emailOrPhone === emailOrPhone);
    
    if (!user) {
        // Create new user if not exists
        user = {
            id: generateId(),
            name: emailOrPhone.split('@')[0], // Simple default name
            emailOrPhone,
            joinedAt: new Date().toISOString()
        };
        state.users.push(user);
    }
    
    state.currentUser = user;
    saveState(state);
    return user;
  },

  logoutUser: () => {
    const state = loadState();
    state.currentUser = null;
    saveState(state);
  },

  addGroup: (group: CommitteeGroup) => {
    const state = loadState();
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

  updatePayment: (paymentId: string, status: 'PAID' | 'UNPAID') => {
    const state = loadState();
    const idx = state.payments.findIndex(p => p.id === paymentId);
    if (idx >= 0) {
      state.payments[idx].status = status;
      state.payments[idx].paidDate = status === 'PAID' ? new Date().toISOString() : undefined;
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
  }
};
