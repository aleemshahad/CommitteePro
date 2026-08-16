# 📱 CommitteePro — Android & Web Committee (ROSCA) Manager

<p align="center">
  <strong>کمیٹی پرو — ڈیجیٹل بچت کمیٹی اور بی سی مینجمنٹ سسٹم</strong><br>
  A modern, offline-first financial management system and Android mobile application designed to manage community savings groups (Committees, Kameti, BC, Chit Funds) with complete transparency, bilingual support (English & Urdu), digital lucky draws, and AI-assisted reminders.
</p>
[![Deploy Jekyll with GitHub Pages dependencies preinstalled](https://github.com/aleemshahad/CommitteePro/actions/workflows/jekyll-gh-pages.yml/badge.svg)](https://github.com/aleemshahad/CommitteePro/actions/workflows/jekyll-gh-pages.yml)
<p align="center">
  <img src="https://img.shields.io/badge/Platform-Android%20%7C%20Web-brightgreen?style=flat-square" alt="Platform">
  <img src="https://img.shields.io/badge/React-19-blue?style=flat-square" alt="React">
  <img src="https://img.shields.io/badge/TypeScript-5.8-blue?style=flat-square" alt="TypeScript">
  <img src="https://img.shields.io/badge/TailwindCSS-3.4-38bdf8?style=flat-square" alt="Tailwind">
  <img src="https://img.shields.io/badge/Capacitor-6.0-1192e8?style=flat-square" alt="Capacitor">
  <img src="https://img.shields.io/badge/AI-Gemini%202.5%20Flash-orange?style=flat-square" alt="Gemini">
  <img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" alt="License">
</p>

---

## 🌟 Key Features

### 1. 👥 Multi-Tier Administrative Governance (RBAC)
- **Super Head Admin (سپر ہیڈ ایڈمن):**
  - Full system oversight: approve or reject newly submitted committee proposals.
  - User and admin control directory: promote members to admins, demote, or block fraudulent users.
  - Delete or archive stale committee records.
- **Group Head Admin (گروپ ہیڈ ایڈمن):**
  - Submit committee proposals with monthly contributions (PKR) and member counts.
  - Track monthly payments, record cash/online transaction methods, and execute lucky draws.
- **Member (عام ممبر):**
  - Transparent view of payment status across all months, draw winners list, and payout schedules.

### 2. 📅 Month-by-Month Calendar Matrix
- Interactive visual grid showing all members along the Y-axis and all committee **Months (ماہ)** along the X-axis.
- Instant color-coded badges for **Paid** (Green) vs. **Pending/Unpaid** (Slate).
- Direct payment logging modal with payment method selection (`CASH`, `BANK_TRANSFER`, `ONLINE_WALLET` JazzCash/EasyPaisa), notes, and receipt verification.

### 3. 🎡 Digital Lucky Draw Wheel (قرعہ اندازی)
- 60 FPS Canvas-rendered interactive spinning wheel.
- Automatic exclusion algorithm for members who won in previous months to ensure fair, zero-bias selection.
- Audit history logging winning member, draw date, month index, and disbursement notes.

### 4. 🤖 AI-Powered Polite Reminder Generator (Google Gemini 2.5 Flash)
- Generates polite, culturally respectful WhatsApp payment reminders.
- Bilingual output in **Urdu (اردو اسکرپٹ)** and **English**.
- Automatic offline fallback templates when no internet connection is present.

### 5. 🌐 Bilingual & Culturally Localized
- 1-click toggle between **English** and **Urdu (اردو)**.
- Authentic South Asian financial terms: *کمیٹی (Committee), قسط (Installment), قرعہ اندازی (Draw), بچت (Savings)*.

---

## 🏗️ Architecture Overview

```
                      ┌─────────────────────────────────────────┐
                      │    CommitteePro Android / Web Client   │
                      └────────────────────┬────────────────────┘
                                           │
         ┌─────────────────────────────────┼─────────────────────────────────┐
         │                                 │                                 │
┌────────▼────────┐              ┌─────────▼─────────┐             ┌─────────▼────────┐
│  Presentation   │              │  State & Storage  │             │ Hybrid Bridge    │
│  - React 19     │              │  - StorageService │             │ - Capacitor 6    │
│  - Tailwind CSS │              │  - LocalStorage   │             │ - Android Gradle │
│  - Lucide Icons │              │  - 100% Offline   │             │ - Native Haptics │
└─────────────────┘              └───────────────────┘             └──────────────────┘
```

---

## 🚀 Getting Started & Local Web Development

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18.0 or higher)
- [npm](https://www.npmjs.com/) or [bun](https://bun.sh/)

### Installation & Run

1. **Clone the repository:**
   ```bash
   git clone https://github.com/aleemshahad/CommitteePro.git
   cd CommitteePro
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

4. **Build the production web bundle:**
   ```bash
   npm run build
   ```

---

## 📱 Building the Android App (APK / AAB)

CommitteePro is fully configured for packaging into a high-performance native Android application using **Capacitor 6** and **Android Studio**.

### Step 1: Install Capacitor CLI & Android Platform
```bash
npm install @capacitor/core @capacitor/cli @capacitor/android
npx cap init "CommitteePro" "com.committeepro.app" --web-dir "dist"
```

### Step 2: Build Web Assets & Add Android
```bash
# 1. Compile the production bundle
npm run build

# 2. Add Android platform
npx cap add android

# 3. Sync web assets into Android project
npx cap sync android
```

### Step 3: Open in Android Studio & Generate APK
```bash
npx cap open android
```

In **Android Studio**:
1. Wait for Gradle sync to complete.
2. Select **Build** $\rightarrow$ **Build Bundle(s) / APK(s)** $\rightarrow$ **Build APK(s)**.
3. Your installable Debug APK will be generated at:
   `android/app/build/outputs/apk/debug/app-debug.apk`

---

## 📂 Project Structure

```
├── components/                 # UI components
│   ├── DrawWheel.tsx           # Canvas 60 FPS Lucky Draw spinning wheel
│   ├── Layout.tsx              # Sidebar, navigation bar, language switcher
│   └── RecordPaymentModal.tsx  # Payment entry & verification modal
├── context/
│   └── LanguageContext.tsx     # Bilingual English & Urdu translation context
├── pages/
│   ├── AdminPanel.tsx          # Super Head Admin user and committee manager
│   ├── Dashboard.tsx           # Financial stats, pending approvals, quick actions
│   ├── GroupDetail.tsx         # Month-by-Month matrix ledger & draw controls
│   ├── Groups.tsx              # List of active committees & creation dialog
│   ├── Login.tsx               # Role switcher (Super Admin, Group Admin, Member)
│   └── Reports.tsx             # Aggregate financial analytics & progress charts
├── services/
│   ├── geminiService.ts        # Google Gemini 2.5 Flash reminder generator
│   └── storageService.ts       # Offline-first reactive local database
├── types.ts                    # TypeScript types & interface definitions
├── constants.ts                # English & Urdu translation dictionaries
├── PRD.md                      # Comprehensive Product Requirements Document
├── package.json                # Project dependencies and build scripts
└── vite.config.ts              # Vite configuration
```

---

## 🔐 Default Demo Accounts

For testing, select any of the pre-configured accounts on the Login screen:

| Account Name | Role | Capabilities |
| :--- | :--- | :--- |
| **Aleem (Super Admin)** | `SUPER_ADMIN` | Full control: user management, committee approval/rejection, global analytics. |
| **Sarah Khan (Admin)** | `GROUP_ADMIN` | Create committees, manage members, record payments, execute draws. |
| **Kamran Akmal (Member)** | `MEMBER` | View assigned committee, payment history, and lucky draw logs. |

---

## 📄 Documentation
For detailed architectural specifications, user flows, and technical schema, see [PRD.md](./PRD.md).

---

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to open an issue or submit a pull request.

---

## 📝 License
Distributed under the **MIT License**.
