import { ChartBar, Users, Home, Settings, FileText } from 'lucide-react';

export const STORAGE_KEY = 'committee_pro_db_v1';

export const MENU_ITEMS = [
  { id: 'dashboard', icon: Home, labelKey: 'dashboard' },
  { id: 'groups', icon: Users, labelKey: 'groups' },
  { id: 'reports', icon: ChartBar, labelKey: 'reports' },
];

export const MOCK_USER = {
  id: 'u1',
  name: 'Demo User',
  phone: '03001234567'
};