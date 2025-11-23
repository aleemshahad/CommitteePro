// Storage keys
export const STORAGE_KEYS = {
    USER: 'committeepro_user',
    GROUPS: 'committeepro_groups',
    LANGUAGE: 'committeepro_language',
    THEME: 'committeepro_theme',
    GEMINI_API_KEY: 'committeepro_gemini_key',
} as const;

// App constants
export const APP_NAME = 'CommitteePro';
export const APP_VERSION = '1.0.0';

// Frequency options
export const FREQUENCY_OPTIONS = [
    { value: 'weekly', labelEn: 'Weekly', labelUr: 'ہفتہ وار' },
    { value: 'monthly', labelEn: 'Monthly', labelUr: 'ماہانہ' },
    { value: 'yearly', labelEn: 'Yearly', labelUr: 'سالانہ' },
] as const;
