
export type UserRole = 'SUPER_ADMIN' | 'GROUP_ADMIN' | 'MEMBER';

export interface User {
  id: string;
  name: string;
  emailOrPhone: string;
  role: UserRole;
  status?: 'ACTIVE' | 'BLOCKED';
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
  totalCycles: number; // Number of months
  startDate: string;
  members: Member[];
  status: 'ACTIVE' | 'PENDING_APPROVAL' | 'REJECTED' | 'COMPLETED' | 'ARCHIVED';
  currency: string;
  requestedBy?: string;
  requestedByRole?: UserRole;
  createdAt?: string;
}

export interface PaymentRecord {
  id: string;
  groupId: string;
  cycleIndex: number; // 1-based index (Month index)
  memberId: string;
  status: 'PAID' | 'UNPAID';
  amount?: number;
  paidDate?: string;
  method?: string;
  notes?: string;
  verified?: boolean;
  recordedByRole?: UserRole;
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
    groups: "My Committees",
    reports: "Reports",
    settings: "Settings",
    activeGroups: "Active Committees",
    pending: "Pending Payments",
    upcomingDraw: "Upcoming Month Draw",
    createGroup: "Create New Committee",
    groupName: "Committee Name",
    amount: "Monthly Contribution Amount",
    cycles: "Total Duration (Months)",
    members: "Members",
    addMember: "Add Member",
    save: "Submit Request",
    cancel: "Cancel",
    cycle: "Month",
    winner: "Winner",
    status: "Status",
    paid: "Paid",
    unpaid: "Unpaid",
    markPaid: "Mark Paid",
    drawTitle: "Digital Lucky Draw",
    performDraw: "Spin Wheel",
    noWinner: "No winner yet",
    loading: "Loading...",
    language: "Language",
    logout: "Logout",
    totalCollected: "Total Savings Collected",
    currentMonth: "Current Month",
    currentCycle: "Current Month",
    overallProgress: "Overall Progress",
    monthlyCollection: "Monthly Progress",
    viewGroup: "View Details",
    poolPerCycle: "Monthly Pool Amount",
    totalSavings: "Total Savings Collected",
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
    recordPayment: "Add Payment",
    addPayment: "+ Add Payment",
    recordPaymentTitle: "Add / Edit Member Payment",
    paymentMethod: "Payment Method",
    cash: "Cash",
    bankTransfer: "Bank Transfer",
    onlineWallet: "JazzCash / EasyPaisa",
    paymentNotes: "Notes / Receipt Ref #",
    paymentDate: "Payment Date",
    recordSuccess: "Payment saved successfully!",
    selectMember: "Select Member",
    selectCycle: "Select Month",
    confirmPayment: "Confirm Payment",
    calendarMatrix: "Calendar Tracking",
    clickToToggle: "Click cell to manage or view payment status",
    paidBadge: "Paid",
    unpaidBadge: "Unpaid / Pending",
    cycleCalendar: "Month-by-Month Calendar Matrix",
    addPaymentBtn: "+ Add Payment",
    editPayment: "Edit",
    removePayment: "Remove Payment",
    verifyPayment: "Verify",
    verified: "Verified",
    unverified: "Unverified",
    superAdmin: "Super Head Admin (سپر ہیڈ ایڈمن)",
    groupAdmin: "Group Head Admin (ہیڈ ایڈمن)",
    roleSwitch: "Switch Active Admin Role",
    adminRights: "Admin Control Active",
    customAmount: "Payment Amount",
    pendingApproval: "Pending Super Admin Approval",
    approveGroup: "Approve Committee",
    rejectGroup: "Reject Committee",
    pendingRequests: "Pending Committee Approval Requests",
    requestSentNotice: "New committee request sent to Super Head Admin for approval before activation.",
    approvedSuccess: "Committee approved and activated successfully!",
    rejectedSuccess: "Committee request rejected.",
    confirmRemovePayment: "Are you sure you want to remove this payment record?",
    adminPanel: "Admin Control Center",
    usersAndAdmins: "User & Admin Management",
    addNewUser: "Add Admin / User",
    promoteToGroupAdmin: "Promote to Group Admin",
    promoteToSuperAdmin: "Promote to Super Head Admin",
    demoteToMember: "Set as Regular Member",
    blockUser: "Block Access",
    unblockUser: "Unblock Access",
    removeUser: "Remove User",
    userName: "Full Name",
    userRole: "System Role",
    userStatus: "Access Status",
    activeUsers: "Active Users & Admins",
    blockedUsers: "Blocked Accounts",
    allCommitteesFull: "All Committees (Super Admin Control)",
    deleteCommittee: "Delete Committee",
    confirmDeleteCommittee: "Are you sure you want to delete this committee?",
    userAddedSuccess: "User added successfully!",
    userUpdatedSuccess: "User updated successfully!",
  },
  ur: {
    dashboard: "ڈیش بورڈ",
    groups: "میری کمیٹیاں",
    reports: "رپورٹس",
    settings: "ترتیبات",
    activeGroups: "فعال کمیٹیاں",
    pending: "بقایا جات",
    upcomingDraw: "اگلی ماہانہ قرعہ اندازی",
    createGroup: "نئی کمیٹی بنائیں",
    groupName: "کمیٹی کا نام",
    amount: "ماہانہ کمیٹی رقم",
    cycles: "کل مدت (ماہ)",
    members: "ارکان",
    addMember: "عہدیدار / رکن شامل کریں",
    save: "درخواست جمع کریں",
    cancel: "منسوخ کریں",
    cycle: "ماہ",
    winner: "قرعہ اندازی کا فاتح",
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
    totalCollected: "کل جمع شدہ رقم",
    currentMonth: "موجودہ ماہ",
    currentCycle: "موجودہ ماہ",
    overallProgress: "مجموعی پیشرفت",
    monthlyCollection: "ماہانہ جمع دہندگان",
    viewGroup: "تفصیلات دیکھیں",
    poolPerCycle: "ماہانہ پول کی رقم",
    totalSavings: "کل جمع شدہ بچت",
    exportPdf: "رپورٹ ڈاؤن لوڈ کریں",
    generateReminder: "یاد دہانی کا پیغام (AI)",
    loginTitle: "کمیٹی پرو میں خوش آمدید",
    loginSubtitle: "اپنی کمیٹیوں کا انتظام اعتماد اور شفافیت سے کریں۔",
    emailOrPhone: "ای میل یا فون نمبر",
    sendMagicLink: "میجک لنک بھیجیں",
    checkInbox: "اپنا ان باکس چیک کریں!",
    magicLinkSent: "ہم نے ایک میجک لنک بھیجا ہے",
    clickToLogin: "لنک پر کلک کریں",
    backToLogin: "مختلف ای میل استعمال کریں",
    recordPayment: "پیمنٹ درج کریں",
    addPayment: "+ پیمنٹ ایڈ کریں",
    recordPaymentTitle: "رکن کی ادائیگی درج یا تبدیل کریں",
    paymentMethod: "ادائیگی کا طریقہ",
    cash: "نقد (کیش)",
    bankTransfer: "بینک ٹرانسفر",
    onlineWallet: "جاز کیش / ایزی پیسہ",
    paymentNotes: "نوٹ / رسید نمبر",
    paymentDate: "ادائیگی کی تاریخ",
    recordSuccess: "ادائیگی کامیابی سے درج ہو گئی!",
    selectMember: "رکن منتخب کریں",
    selectCycle: "ماہ منتخب کریں",
    confirmPayment: "ادائیگی کی تصدیق کریں",
    calendarMatrix: "کالینڈر ٹریکنگ",
    clickToToggle: "ادائیگی کی تفصیلات کے لیے خانے پر کلک کریں",
    paidBadge: "ادا شدہ",
    unpaidBadge: "بقایا جات",
    cycleCalendar: "ماہ بہ ماہ کالینڈر میٹرکس",
    addPaymentBtn: "+ پیمنٹ ایڈ کریں",
    editPayment: "ایڈٹ کریں",
    removePayment: "پیمنٹ ختم کریں",
    verifyPayment: "تصدیق کریں",
    verified: "تصدیق شدہ",
    unverified: "غیر تصدیق شدہ",
    superAdmin: "سپر ہیڈ ایڈمن (Super Head Admin)",
    groupAdmin: "گروپ ہیڈ ایڈمن (Group Admin)",
    roleSwitch: "ایڈمن کا عہدہ تبدیل کریں",
    adminRights: "ایڈمن کا اختیار فعال ہے",
    customAmount: "پیمنٹ کی رقم",
    pendingApproval: "سپر ہیڈ ایڈمن کی منظوری کے لیے زیر التواء",
    approveGroup: "کمیٹی منظور کریں",
    rejectGroup: "کمیٹی مسترد کریں",
    pendingRequests: "کمیٹی منظور کرنے کی درخواستیں",
    requestSentNotice: "نئی کمیٹی کی درخواست سپر ہیڈ ایڈمن کو منظوری کے لیے بھیج دی گئی ہے۔",
    approvedSuccess: "کمیٹی کامیابی سے منظور اور فعال کر دی گئی ہے!",
    rejectedSuccess: "کمیٹی کی درخواست مسترد کر دی گئی۔",
    confirmRemovePayment: "کیا آپ واقعی یہ ادائیگی ختم کرنا چاہتے ہیں؟",
    adminPanel: "ایڈمن کنٹرول سینٹر",
    usersAndAdmins: "ایڈمنز اور یوزرز کا انتظام",
    addNewUser: "نیا ایڈمن / یوزر شامل کریں",
    promoteToGroupAdmin: "گروپ ہیڈ ایڈمن بنائیں",
    promoteToSuperAdmin: "سپر ہیڈ ایڈمن بنائیں",
    demoteToMember: "عام رکن بنائیں",
    blockUser: "بلاک کریں",
    unblockUser: "ان بلاک کریں",
    removeUser: "ختم کریں",
    userName: "پورا نام",
    userRole: "سسٹم کا عہدہ",
    userStatus: "رسیار / حیثت",
    activeUsers: "فعال ایڈمنز اور ارکان",
    blockedUsers: "بلاک شدہ اکاؤنٹس",
    allCommitteesFull: "تمام کمیٹیاں (سپر ایڈمن کنٹرول)",
    deleteCommittee: "کمیٹی ڈیلیٹ کریں",
    confirmDeleteCommittee: "کیا آپ واقعی یہ کمیٹی ڈیلیٹ کرنا چاہتے ہیں؟",
    userAddedSuccess: "یوزر کامیابی سے شامل ہو گیا!",
    userUpdatedSuccess: "یوزر کامیابی سے اپ ڈیٹ ہو گیا!",
  }
};
