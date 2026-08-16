# Product Requirements Document (PRD)

## Project: CommitteePro — Digital ROSCA & Savings Committee Manager
**Version:** 1.2.0  
**Status:** Approved / Active  
**Author:** AI Studio Product Engineering Team  
**Target Runtime:** Web (Responsive SPA) & Android (Capacitor Hybrid / TWA)

---

## 1. Executive Summary & Vision

### 1.1 Problem Statement
Rotating Savings and Credit Associations (ROSCAs) — commonly known as **Committees (کمیٹیاں)**, **Kameti / BC (Bachat Committee)**, **Chit Funds**, or **Tandas** — are widespread community-based financial instruments used by millions of people across South Asia and emerging markets. However, traditional manual tracking via paper notebooks, spreadsheets, or informal messaging channels causes:
- High administrative overhead and human calculation errors.
- Lack of transparency regarding who paid, who defaulted, and when payments occurred.
- Disputes over manual physical lucky draws.
- Awkward and time-consuming manual payment reminder chasing.
- No unified governance between super-administrators and individual group organizers.

### 1.2 Product Vision
**CommitteePro** is an offline-first, bilingual (English and Urdu) digital financial management platform engineered to digitize community savings committees with total transparency, automated tracking, unbiased digital lucky draws, AI-assisted reminder drafting, and multi-tier administrative governance.

---

## 2. User Personas & Target Audience

| Persona | Role | Key Goals & Pain Points |
| :--- | :--- | :--- |
| **Super Head Admin (سپر ہیڈ ایڈمن)** | System Owner / Community Lead | Needs 360-degree governance: approving new committee requests, promoting group organizers, blocking fraudulent users, and inspecting cross-committee metrics. |
| **Group Head Admin (گروپ ہیڈ ایڈمن)** | Committee Organizer | Manages specific committee circles, records member cash/digital payments, configures monthly pools, and hosts monthly lucky draws. |
| **Committee Member (رکن / ممبر)** | Participant / Saver | Wants instant visibility into their payment history, next payout month, transparent lucky draw logs, and polite reminder messages. |

---

## 3. Roles & Permissions Hierarchy (RBAC)

The system implements strict Role-Based Access Control:

```
                  ┌─────────────────────────────────────────┐
                  │       SUPER HEAD ADMIN (سپر ہیڈ ایڈمن)       │
                  │ - System-wide user & admin management   │
                  │ - Approve / Reject new committees       │
                  │ - Promote / Demote / Block users        │
                  │ - Delete / Purge committees             │
                  └────────────────────┬────────────────────┘
                                       │
                  ┌────────────────────▼────────────────────┐
                  │       GROUP HEAD ADMIN (گروپ ہیڈ ایڈمن)      │
                  │ - Submit new committee requests         │
                  │ - Manage assigned committee members     │
                  │ - Record / Edit / Delete payments       │
                  │ - Execute monthly digital lucky draws   │
                  │ - Generate AI payment reminders         │
                  └────────────────────┬────────────────────┘
                                       │
                  ┌────────────────────▼────────────────────┐
                  │           MEMBER (عام ممبر / رکن)         │
                  │ - View committee details & progress     │
                  │ - Inspect personal payment status       │
                  │ - View draw winners & payout schedules  │
                  └─────────────────────────────────────────┘
```

---

## 4. Functional Requirements & Core Feature Modules

### 4.1 Committee Creation & Super Admin Approval Workflow
1. **Creation Submission:**
   - Group Admins submit committee name, monthly installment amount (PKR), total duration in **Months** (e.g., 6 or 12 months), and member roster.
   - User-facing terminology is strictly formatted as **Month 1, Month 2, Month 3...** (avoiding developer jargon like "cycles").
2. **Approval Gate:**
   - If created by a `GROUP_ADMIN`, status defaults to `PENDING_APPROVAL`.
   - If created directly by `SUPER_ADMIN`, status defaults to `ACTIVE`.
3. **Super Head Admin Actions:**
   - Review pending queue in Dashboard and Admin Panel.
   - One-click **Approve (منظور کریں)** to activate the committee and generate full payment schedule matrices.
   - One-click **Reject (مسترد کریں)** to decline unverified requests.

---

### 4.2 Month-by-Month Payment Matrix & Accounting
1. **Calendar Matrix Grid:**
   - Interactive matrix displaying all members along the Y-axis and all committee **Months (ماہ)** along the X-axis.
   - Instant visual indicators: **Paid (Green Check)** vs. **Unpaid / Pending (Slate Clock)**.
2. **Payment Recording Modal:**
   - Add/edit payment records with amount, payment date, method (`CASH`, `BANK_TRANSFER`, `ONLINE_WALLET` such as JazzCash/EasyPaisa), receipt/transaction note, and verification toggle.
3. **Financial Math & Aggregations:**
   - Real-time calculations of Total Savings Collected, Monthly Pool Target, Current Month Progress (%), and Overall Committee Completion (%).

---

### 4.3 Digital Lucky Draw & Distribution Engine
1. **Interactive Wheel of Fortune:**
   - High-performance Canvas/SVG spinning wheel displaying all eligible committee members.
2. **Fairness & Eligibility Rules:**
   - Members who have already won previous month draws are excluded from subsequent spins.
   - Spin calculation picks winners randomly with dynamic decelerating physics animation.
3. **Audit History:**
   - Every draw result records winning member ID, winning month index, timestamp, and payout notes.

---

### 4.4 Super Head Admin Control Center
1. **User & Admin Management Table:**
   - Live roster of all system accounts with search, role filters, and join dates.
2. **Role Promotions / Demotions:**
   - Promote Member $\rightarrow$ Group Admin $\rightarrow$ Super Head Admin in real-time.
   - Demote admins to regular members.
3. **Access Controls:**
   - Instant **Block / Unblock** account status toggle.
   - Remove user account.
4. **All Committees Master Control:**
   - Full visibility across all active, pending, and archived committees with instant delete/purge controls.

---

### 4.5 AI-Powered Polite Reminder Generator (Google Gemini 2.5 Flash)
1. **Smart Contextual Prompts:**
   - Automatically passes member name, outstanding monthly amount, and language context to Gemini 2.5 Flash.
2. **Bilingual Output:**
   - **Urdu:** Polite, culturally respectful WhatsApp reminder in Nastaliq/Urdu script.
   - **English:** Professional, courteous WhatsApp payment reminder.
3. **Graceful Fallback:**
   - Built-in deterministic offline templates when network or API keys are unavailable.

---

### 4.6 Localization & Accessibility
1. **Dual Language Engine:**
   - Instant toggling between **English** and **Urdu (اردو)**.
   - Culturally adapted financial terminology (*BC, Committee, Kameti, Kisht, Draw*).
2. **Responsive Typography & Contrast:**
   - Clean slate-900 / indigo / emerald theme passing WCAG AA standards.
   - Mobile-first responsive layout with min 44px touch targets.

---

## 5. Technical Architecture & Tech Stack

```
 ┌─────────────────────────────────────────────────────────────────────────┐
 │                            FRONTEND LAYER                               │
 │  React 19+ | TypeScript | Tailwind CSS | Lucide React | Vite            │
 └────────────────────────────────────┬────────────────────────────────────┘
                                      │
 ┌────────────────────────────────────▼────────────────────────────────────┐
 │                            STATE & STORAGE                              │
 │  Reactive Local Storage Service (`committee_pro_db_v1`)                 │
 │  - Local Persistence & Instant Sync                                     │
 │  - Zero-Cold-Start In-Memory State Machine                              │
 └────────────────────────────────────┬────────────────────────────────────┘
                                      │
 ┌────────────────────────────────────▼────────────────────────────────────┐
 │                           EXTERNAL SERVICES                             │
 │  - Google GenAI SDK (`@google/genai` with Gemini 2.5 Flash)             │
 │  - Capacitor Android Bridge (`@capacitor/android`)                      │
 └─────────────────────────────────────────────────────────────────────────┘
```

### 5.1 Core Data Models

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
  amount: number;             // Monthly contribution amount
  totalCycles: number;        // Number of months (Duration)
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

## 6. Android Platform & Distribution Strategy

To ensure seamless distribution on Google Play Store and Android devices:

1. **Packaging Framework:** **Capacitor 6 / Android SDK**
   - Web Assets Output: `dist/`
   - Android Package ID: `com.committeepro.app`
   - Target Android SDK: 34+ (Android 14/15)
2. **Offline & Performance Enhancements:**
   - Hardware-accelerated Canvas for lucky draw wheel animations.
   - LocalStorage offline synchronization.
   - Android back-button hardware event handling.

---

## 7. Non-Functional Requirements (NFR)

- **Performance:** App initial load time under 1.2s; draw animation maintaining steady 60 FPS.
- **Reliability:** 100% offline functionality for standard ledger and draw activities.
- **Data Integrity:** Idempotent payment ID generation preventing double-entry errors.
- **Usability:** No technical jargon ("cycles", "CRMs"); clear conversational labels in English and Urdu.

---

## 8. Release Milestones & Roadmap

| Phase | Deliverable | Status |
| :--- | :--- | :--- |
| **Phase 1** | Core Committee Management & Month Matrix Tracking | **Completed** |
| **Phase 2** | Lucky Draw Wheel & English/Urdu Bilingual Engine | **Completed** |
| **Phase 3** | Super Head Admin Approval & User Role Control Center | **Completed** |
| **Phase 4** | Gemini 2.5 Flash AI Automated Reminder Generation | **Completed** |
| **Phase 5** | Android APK / Capacitor Hybrid Packaging Guide | **Completed** |
| **Phase 6 (Future)**| WhatsApp Direct API Integration & PDF Receipts Export | *Planned* |
