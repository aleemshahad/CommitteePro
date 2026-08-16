# Product Requirements Document (PRD)

## Project: CommitteePro — Digital ROSCA & Savings Committee Manager (Android & Web)
**Document Version:** 2.0.0 (Android Native & Hybrid Architecture Edition)  
**Status:** Approved / Production Ready  
**Target Runtimes:**
- **Android OS:** Android 8.0 (API Level 26) up to Android 15 (API Level 35) via Capacitor 6 & Android Gradle Plugin
- **Web SPA:** Modern Chromium, WebKit, and Gecko browsers (Mobile Responsive & PWA)

---

## 1. Executive Summary & Vision

### 1.1 Problem Statement
Rotating Savings and Credit Associations (ROSCAs) — locally known as **Committees (کمیٹیاں)**, **Kameti / BC (Bachat Committee)**, **Chit Funds**, or **Tandas** — are community-driven micro-financing engines utilized by hundreds of millions worldwide. However, managing committees manually via paper registers, chat apps, or spreadsheets introduces severe liabilities:
- High human accounting calculation error rates and lost records.
- Zero auditability on who paid, when payment occurred, and who is overdue.
- Distrust and friction around manual physical paper slip draws.
- Awkward, time-consuming payment reminder follow-ups.
- Absence of structured administrative hierarchy between community supervisors (Super Admins) and group heads.

### 1.2 Product Vision
**CommitteePro** provides a native-grade, offline-first mobile and web application engineered specifically for the South Asian and international community savings ecosystem. It combines 100% offline-first accounting, unbiased physics-based digital lucky draws, AI-crafted polite WhatsApp reminders in Urdu and English, and hierarchical role-based governance (Super Head Admin, Group Admin, and Member).

---

## 2. Target Personas & Stakeholders

| Persona | Role | Key Goals & Needs |
| :--- | :--- | :--- |
| **Super Head Admin (سپر ہیڈ ایڈمن)** | System Owner / Community Lead | Needs master oversight: approving/rejecting newly submitted committees, assigning roles (promoting/demoting), blocking bad actors, and tracking aggregate community metrics. |
| **Group Head Admin (گروپ ہیڈ ایڈمن)** | Committee Organizer | Manages specific committee circles, adds members, logs cash/online installments, monitors monthly collection progress, and executes fair digital lucky draws. |
| **Committee Member (رکن / ممبر)** | Saver / Participant | Requires clear transparency: tracking personal payment history, viewing committee timelines, inspecting lucky draw winner records, and receiving friendly payment alerts. |

---

## 3. Role-Based Access Control (RBAC) Architecture

```
                  ┌─────────────────────────────────────────┐
                  │       SUPER HEAD ADMIN (سپر ہیڈ ایڈمن)       │
                  │ - System-wide user roster & role manager│
                  │ - Approve / Reject new committee pools  │
                  │ - Promote / Demote / Block users        │
                  │ - Delete / Purge obsolete committees    │
                  └────────────────────┬────────────────────┘
                                       │
                  ┌────────────────────▼────────────────────┐
                  │       GROUP HEAD ADMIN (گروپ ہیڈ ایڈمن)      │
                  │ - Submit new committee proposals        │
                  │ - Manage member lists & phone contacts  │
                  │ - Record, update, and verify payments   │
                  │ - Run monthly physics-based lucky draws │
                  │ - Dispatch AI-assisted polite reminders │
                  └────────────────────┬────────────────────┘
                                       │
                  ┌────────────────────▼────────────────────┐
                  │           MEMBER (عام ممبر / رکن)         │
                  │ - View assigned committee details       │
                  │ - Review personal payment status        │
                  │ - Inspect draw results & payout order   │
                  └─────────────────────────────────────────┘
```

---

## 4. Functional Requirements & Feature Modules

### 4.1 Committee Creation & Super Admin Approval Gate
1. **Creation Submission:**
   - Group Admins provide Committee Name, Monthly Amount (PKR), Duration in **Months** (e.g., 6, 10, or 12 Months), and Member Roster.
   - User-facing nomenclature strictly utilizes **Month 1, Month 2, Month 3...** (avoiding confusing technical terms like "cycles").
2. **Approval Verification:**
   - Committees requested by Group Admins remain in `PENDING_APPROVAL` status until reviewed.
   - Committees created by Super Head Admin immediately transition to `ACTIVE`.
3. **Super Head Admin Actions:**
   - Review pending queue in Dashboard and dedicated Admin Panel.
   - One-tap **Approve (منظور کریں)** to activate the committee and populate the month-by-month accounting ledger.
   - One-tap **Reject (مسترد کریں)** with audit log.

### 4.2 Month-by-Month Payment Matrix Ledger
1. **Interactive Calendar Matrix:**
   - Visual grid listing all members along rows and all committee **Months (ماہ)** along columns.
   - Instant status badges: **Paid (Green Check)** vs. **Unpaid / Pending (Slate Clock)**.
2. **Payment Entry Modal:**
   - Record payment amount, timestamp, payment method (`CASH`, `BANK_TRANSFER`, `ONLINE_WALLET` like JazzCash/EasyPaisa), receipt reference, and manual verification toggle.
3. **Real-Time Financial Metrics:**
   - Total Collected Amount, Total Pending Pool, Current Month Collection Percentage, and Overall Committee Health.

### 4.3 Digital Lucky Draw & Distribution Engine
1. **Canvas Wheel of Fortune:**
   - 60 FPS Canvas-rendered interactive spinning wheel featuring active committee members.
2. **Fairness & Exclusion Logic:**
   - Automatically excludes members who have previously won in prior months.
   - Decelerating physics animation with randomized landing calculation.
3. **Historical Audit Log:**
   - Persists winning member, draw date, month index, and disbursement notes.

### 4.4 Super Head Admin Management Center
1. **User & Admin Control Table:**
   - Complete directory of all system accounts with search, role filters, and join dates.
2. **Promotions & Demotions:**
   - Real-time role transitions: Member $\leftrightarrow$ Group Admin $\leftrightarrow$ Super Head Admin.
3. **Security Controls:**
   - Instant **Block / Unblock** account status toggle.
   - Permanent account removal.
4. **Global Committee Directory:**
   - Master ledger of all active, pending, completed, and archived groups with instant purge capabilities.

### 4.5 AI-Powered Polite Reminder Generator (Gemini 2.5 Flash)
1. **Smart Contextual Prompts:**
   - Synthesizes member name, outstanding dues, and language context.
2. **Bilingual Message Drafting:**
   - **Urdu:** Polite, culturally respectful WhatsApp reminder in Urdu script.
   - **English:** Courteous, professional payment reminder.
3. **Deterministic Offline Fallbacks:**
   - Built-in templates when network connectivity or API tokens are unavailable.

### 4.6 Bilingual Localization & UX
- Dynamic instant switching between **English** and **Urdu (اردو)**.
- Culturally accurate terminology (*BC, Committee, Kameti, Kisht, Draw, Mahana*).
- High-contrast slate-900 / indigo / emerald theme satisfying WCAG AA accessibility standards.

---

## 5. Android Framework & Architecture Specification

```
┌─────────────────────────────────────────────────────────────────────────┐
│                      ANDROID NATIVE CONTAINER (APK / AAB)               │
│                                                                         │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │                    CAPACITOR 6 RUNTIME BRIDGE                     │  │
│  │  - App State & Hardware Back-Button Listener                      │  │
│  │  - Native Status Bar & Splash Screen Plugin                       │  │
│  │  - Haptics Feedback on Lucky Draw Spins                           │  │
│  │  - Local File System & Preferences Storage Sync                   │  │
│  └─────────────────────────────────┬─────────────────────────────────┘  │
│                                    │                                    │
│  ┌─────────────────────────────────▼─────────────────────────────────┐  │
│  │                  HYBRID WEB ASSETS (/android/app/src/main/assets) │  │
│  │  React 19 | TypeScript | Tailwind CSS | Lucide Icons | Vite       │  │
│  └─────────────────────────────────┬─────────────────────────────────┘  │
└────────────────────────────────────┼────────────────────────────────────┘
                                     │
┌────────────────────────────────────▼────────────────────────────────────┐
│                    ANDROID OS SERVICES & INTEGRATIONS                   │
│  - Android SDK 34/35 (Android 14/15) Target API                         │
│  - Android Hardware Back Button Navigation Handling                     │
│  - Deep Linking & Intent Sharing (WhatsApp Reminder Dispatch)           │
│  - Android Keystore & ProGuard / R8 Optimization                        │
└─────────────────────────────────────────────────────────────────────────┘
```

### 5.1 Android Platform Configuration
- **Application Package ID:** `com.committeepro.app`
- **Application Name:** `CommitteePro` (اردو: کمیٹی پرو)
- **Minimum SDK Version:** `API 26 (Android 8.0 Oreo)` — covers 96%+ of active Android devices.
- **Target SDK Version:** `API 34 / 35 (Android 14 / Android 15)` — 100% compliant with Google Play 2026 requirements.
- **Orientation:** Portrait locked (`screenOrientation="portrait"`).
- **Window Soft Input Mode:** `adjustResize` to prevent form inputs from being obstructed by the soft keyboard.

### 5.2 Android Permissions & Hardware Capabilities (`AndroidManifest.xml`)

| Permission | Purpose |
| :--- | :--- |
| `android.permission.INTERNET` | Optional AI Reminder generation via Gemini API & remote synchronization. |
| `android.permission.ACCESS_NETWORK_STATE` | Detects online/offline connectivity transitions. |
| `android.permission.VIBRATE` | Haptic tactile feedback on lucky draw wheel rotation and completion. |

### 5.3 Mobile Lifecycle & UX Optimization
1. **Hardware Back Button Handling:**
   - Pressing Android physical back button closes active modals (Payment Modal, Draw Modal, AI Reminder Drawer) before navigating back, preventing accidental app exit.
2. **Safe Area Insets:**
   - Full support for Android display cutouts (notches) and edge-to-edge system navigation bars via CSS `env(safe-area-inset-top)` and `env(safe-area-inset-bottom)`.
3. **Offline Persistence Bridge:**
   - Synchronous LocalStorage backed by native encrypted SharedPreferences / IndexedDB for zero latency on cold start.

---

## 6. Technical Data Models & Schema

```typescript
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
  phone?: string;
  joinedAt: string;
}

export interface CommitteeGroup {
  id: string;
  name: string;
  amount: number;             // Monthly installment (PKR)
  totalCycles: number;        // Total duration in Months
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
  cycleIndex: number;         // Month index (1-based)
  memberId: string;
  status: 'PAID' | 'UNPAID';
  amount?: number;
  paymentMethod?: 'CASH' | 'BANK_TRANSFER' | 'ONLINE_WALLET';
  paidAt?: string;
  notes?: string;
  isVerified?: boolean;
}

export interface DrawResult {
  id: string;
  groupId: string;
  cycleIndex: number;         // Month index (1-based)
  winnerMemberId: string;
  drawnAt: string;
  notes?: string;
}
```

---

## 7. Android Build & Deployment Pipeline

1. **Web Bundle Compilation:**
   ```bash
   npm run build
   ```
2. **Capacitor Sync to Android Studio Project:**
   ```bash
   npx cap sync android
   ```
3. **Gradle Build Execution:**
   - **Debug APK:** `./gradlew assembleDebug` (Outputs to `android/app/build/outputs/apk/debug/app-debug.apk`)
   - **Release Android App Bundle (AAB):** `./gradlew bundleRelease` (Outputs to `android/app/build/outputs/bundle/release/app-release.aab` for Google Play Store upload).

---

## 8. Non-Functional Requirements (NFR)

- **Cold Start Time:** Under 1.2 seconds on mid-range Android devices (Snapdragon 680 / Helio G85).
- **Frame Rate:** Consistent 60 FPS on lucky draw animations without stutter or garbage collection spikes.
- **Memory Footprint:** Resident Set Size (RSS) under 65 MB on Android.
- **Offline Resilience:** Complete core functionality accessible with zero active cellular/Wi-Fi connection.

---

## 9. Release Milestones & Delivery Roadmap

| Phase | Deliverable | Status |
| :--- | :--- | :--- |
| **Phase 1** | Core Committee Engine & Month-by-Month Matrix | **Completed** |
| **Phase 2** | Canvas Lucky Draw Wheel & Urdu/English Localization | **Completed** |
| **Phase 3** | Super Head Admin Approval Workflows & RBAC Center | **Completed** |
| **Phase 4** | Google Gemini 2.5 Flash Bilingual Reminder Generator | **Completed** |
| **Phase 5** | Capacitor 6 Android Hybrid Framework Setup | **Completed** |
| **Phase 6 (Next)** | WhatsApp Direct Intent Dispatch & PDF Receipt Engine | *Scheduled* |
