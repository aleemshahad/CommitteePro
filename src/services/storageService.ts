import { User, Group, Language } from '@/types';
import { STORAGE_KEYS } from '@/constants';

// User management
export const saveUser = (user: User): void => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
};

export const getUser = (): User | null => {
    const data = localStorage.getItem(STORAGE_KEYS.USER);
    return data ? JSON.parse(data) : null;
};

export const clearUser = (): void => {
    localStorage.removeItem(STORAGE_KEYS.USER);
};

// Groups management
export const saveGroups = (groups: Group[]): void => {
    localStorage.setItem(STORAGE_KEYS.GROUPS, JSON.stringify(groups));
};

export const getGroups = (): Group[] => {
    const data = localStorage.getItem(STORAGE_KEYS.GROUPS);
    return data ? JSON.parse(data) : [];
};

export const getGroupById = (id: string): Group | null => {
    const groups = getGroups();
    return groups.find(g => g.id === id) || null;
};

export const addGroup = (group: Group): void => {
    const groups = getGroups();
    groups.push(group);
    saveGroups(groups);
};

export const updateGroup = (updatedGroup: Group): void => {
    const groups = getGroups();
    const index = groups.findIndex(g => g.id === updatedGroup.id);
    if (index !== -1) {
        groups[index] = { ...updatedGroup, updatedAt: new Date().toISOString() };
        saveGroups(groups);
    }
};

export const deleteGroup = (id: string): void => {
    const groups = getGroups();
    const filtered = groups.filter(g => g.id !== id);
    saveGroups(filtered);
};

// Language management
export const saveLanguage = (language: Language): void => {
    localStorage.setItem(STORAGE_KEYS.LANGUAGE, language);
};

export const getLanguage = (): Language => {
    const lang = localStorage.getItem(STORAGE_KEYS.LANGUAGE);
    return (lang as Language) || 'en';
};

// Gemini API Key management
export const saveGeminiApiKey = (apiKey: string): void => {
    localStorage.setItem(STORAGE_KEYS.GEMINI_API_KEY, apiKey);
};

export const getGeminiApiKey = (): string | null => {
    return localStorage.getItem(STORAGE_KEYS.GEMINI_API_KEY);
};

// Clear all data
export const clearAllData = (): void => {
    localStorage.clear();
};
