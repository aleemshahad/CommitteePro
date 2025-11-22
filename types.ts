
export interface User {
  id: string;
  name: string;
  emailOrPhone: string;
  joinedAt: string;
}

export interface Member {
  id: string;
  name: string;
  phone: string;
  joinedAt: string;
}

export interface CommitteeGroup {
  id: string;
  name: string;
  amount: number; // Contribution amount
  totalCycles: number;
  startDate: string;
  members: Member[];
  status: 'ACTIVE' | 'COMPLETED' | 'ARCHIVED';
  currency: string;
}

export interface PaymentRecord {
  id: string;
  groupId: string;
  cycleIndex: number; // 1-based index
  memberId: string;
  status: 'PAID' | 'UNPAID';
  paidDate?: string;
}

export interface DrawResult {
  id: string;
  groupId: string;
  cycleIndex: number;
  winnerMemberId: string;
  drawDate: string;
}

export interface AppState {
  currentUser: User | null;
  users: User[]; // Database of registered users
  groups: CommitteeGroup[];
  payments: PaymentRecord[];
  draws: DrawResult[];
}

export type Language = 'en' | 'ur';

export const TRANSLATIONS = {
  en: {
    dashboard: "Dashboard",
    groups: "My Groups",
    reports: "Reports",
    settings: "Settings",
    activeGroups: "Active Groups",
    pending: "Pending Payments",
    upcomingDraw: "Upcoming Draw",
    createGroup: "Create New Committee",
    groupName: "Group Name",
    amount: "Amount",
    cycles: "Total Cycles",
    members: "Members",
    addMember: "Add Member",
    save: "Save",
    cancel: "Cancel",
    cycle: "Cycle",
    winner: "Winner",
    status: "Status",
    paid: "Paid",
    unpaid: "Unpaid",
    markPaid: "Mark Paid",
    drawTitle: "Digital Draw",
    performDraw: "Spin Wheel",
    noWinner: "No winner yet",
    loading: "Loading...",
    language: "Language",
    logout: "Logout",
    totalCollected: "Total Collected",
    exportPdf: "Export Report",
    generateReminder: "Draft Reminder (AI)",
    loginTitle: "Welcome to CommitteePro",
    loginSubtitle: "Manage your savings circles with trust and ease.",
    emailOrPhone: "Email or Phone Number",
    sendMagicLink: "Send Magic Link",
    checkInbox: "Check your inbox!",
    magicLinkSent: "We sent a magic link to",
    clickToLogin: "Simulate Clicking Link",
    backToLogin: "Use a different email",
  },
  ur: {
    dashboard: "ڈیش بورڈ",
    groups: "میری کمیٹیاں",
    reports: "رپورٹس",
    settings: "ترتیبات",
    activeGroups: "فعال گروپس",
    pending: "بقایا جات",
    upcomingDraw: "اگلی قرعہ اندازی",
    createGroup: "نئی کمیٹی بنائیں",
    groupName: "گروپ کا نام",
    amount: "رقم",
    cycles: "کل دورانیہ",
    members: "ممبران",
    addMember: "ممبر شامل کریں",
    save: "محفوظ کریں",
    cancel: "منسوخ کریں",
    cycle: "چکر",
    winner: "فاتح",
    status: "حیثیت",
    paid: "ادا شدہ",
    unpaid: "غیر ادا شدہ",
    markPaid: "ادائیگی درج کریں",
    drawTitle: "ڈیجیٹل قرعہ اندازی",
    performDraw: "قرعہ اندازی کریں",
    noWinner: "کوئی فاتح نہیں",
    loading: "لوڈ ہو رہا ہے...",
    language: "زبان",
    logout: "لاگ آؤٹ",
    totalCollected: "کل جمع شدہ",
    exportPdf: "رپورٹ نکالیں",
    generateReminder: "یاد دہانی لکھیں (AI)",
    loginTitle: "کمیٹی پرو میں خوش آمدید",
    loginSubtitle: "اپنی کمیٹیوں کا انتظام اعتماد اور آسانی سے کریں۔",
    emailOrPhone: "ای میل یا فون نمبر",
    sendMagicLink: "میجک لنک بھیجیں",
    checkInbox: "اپنا ان باکس چیک کریں!",
    magicLinkSent: "ہم نے ایک میجک لنک بھیجا ہے",
    clickToLogin: "لنک پر کلک کریں (فرضی)",
    backToLogin: "مختلف ای میل استعمال کریں",
  }
};
