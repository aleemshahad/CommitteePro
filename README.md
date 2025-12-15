# 🎯 CommitteePro - Committee Management System

A comprehensive, modern web and mobile application for managing committees with payment tracking, digital draws, AI-powered reminders, and multi-language support.

## ✨ Features

- ✅ **Magic Link Authentication** - Passwordless, secure login
- ✅ **Dashboard** - Beautiful overview with statistics and quick actions  
- ✅ **Group Management** - Create and manage multiple committees
- ✅ **Payment Tracking** - Track payments across cycles
- ✅ **Digital Draw System** - Fair random selection (Coming Soon)
- ✅ **Multi-language** - English & Urdu with RTL support
- ✅ **AI Reminders** - Google Gemini-powered personalized messages
- ✅ **PDF Reports** - Generate professional reports
- ✅ **Local Storage** - Persistent data, works offline
- ✅ **Mobile Ready** - Capacitor for iOS & Android
- ✅ **Role-based Access** - Member, Admin, Super Admin

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone and install dependencies:**
```bash
cd CommitteePro
npm install
```

2. **Set up environment variables (optional):**
```bash
# Copy the example file
copy .env.example .env

# Add your Gemini API key for AI features (optional)
VITE_GEMINI_API_KEY=your_key_here
```

3. **Run development server:**
```bash
npm run dev
```

4. **Open in browser:**
Navigate to `http://localhost:5173`

## 👤 Demo Accounts

Try these demo credentials for quick testing:

- **Super Admin**: `admin@committeepro.com`
- **Member**: `member@example.com`

> **Note**: In development mode, any email will auto-login after entering it. In production, implement proper magic link email sending.

## 📱 Mobile App Setup

### Initialize Capacitor:
```bash
npx cap init
```

### Add platforms:
```bash
npx cap add android
npx cap add ios
```

### Build and sync:
```bash
npm run build
npx cap sync
```

### Open in native IDE:
```bash
# For Android
npx cap open android

# For iOS
npx cap open ios
```

## 🏗️ Project Structure

```
CommitteePro/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── common/          # Navigation, Header, etc.
│   │   └── dashboard/       # Dashboard-specific components
│   ├── pages/               # Main application pages
│   │   ├── Login/           # Authentication
│   │   ├── Dashboard/       # Main dashboard
│   │   └── PlaceholderPages.tsx
│   ├── contexts/            # React Context providers
│   │   ├── AuthContext.tsx  # Authentication state
│   │   └── LanguageContext.tsx # i18n & RTL
│   ├── services/            # External services
│   │   ├── gemini.ts        # AI reminder generation
│   │   └── reports.ts       # PDF generation
│   ├── utils/               # Utility functions
│   │   ├── storage.ts       # LocalStorage wrapper
│   │   └── dashboard.ts     # Dashboard calculations
│   ├── types/               # TypeScript definitions
│   ├── i18n/                # Translations (EN/UR)
│   └── index.css            # Design system
├── public/                  # Static assets
├── capacitor.config.ts      # Mobile configuration
└── package.json
```

## 🎨 Design System

The app features a premium, modern design with:

- **Custom CSS Properties** - Consistent design tokens
- **Gradient Backgrounds** - Beautiful color schemes
- **Smooth Animations** - Engaging micro-interactions
- **Glassmorphism** - Modern blur effects
- **Dark Mode Ready** - Theme switching support
- **Responsive Design** - Mobile-first approach
- **RTL Support** - Full Urdu language support

## 🌐 Multi-language Support

Switch between English and Urdu seamlessly:

- **English (LTR)** - Left-to-right layout
- **Urdu (RTL)** - Right-to-left layout with proper fonts

The language preference is saved locally and persists across sessions.

## 🔐 Authentication

The app uses a magic link authentication system:

1. User enters email
2. Magic link is generated (auto-login in dev)
3. Token verification
4. Session creation

In production, integrate with an email service to send magic links.

## 💾 Data Storage

All data is stored in browser's LocalStorage:

- **Users** - User accounts and profiles
- **Committees** - Committee details and config
- **Members** - Committee membership
- **Payments** - Payment records and status
- **Draws** - Draw history and winners
- **Settings** - App preferences

### Data Management:

```javascript
// Export all data
const jsonData = storageService.exportData();

// Import data
storageService.importData(jsonData);

// Clear all data
storageService.clearAllData();
```

## 🤖 AI Features

### Payment Reminders

Generate personalized reminders using Google Gemini AI:

1. Add your API key in Settings
2. Select a member with pending payment
3. Click "Send AI Reminder"
4. AI generates a polite, personalized message

The system includes template fallbacks if AI is unavailable.

## 📄 PDF Reports

Generate professional reports:

- **Payment Reports** - Payment history and status
- **Committee Reports** - Full committee overview
- **Draw Reports** - Draw history and winners

Reports support both English and Urdu with proper formatting.

## 🚧 Coming Soon

- 🎯 **Spinning Wheel** - Animated draw system
- 📧 **Email Integration** - Real magic link sending
- 🔔 **Push Notifications** - Mobile notifications
- 📊 **Advanced Analytics** - Charts and insights
- 👥 **Member Detail Pages** - Individual member profiles
- ⚙️ **Advanced Settings** - More customization
- 🌙 **Dark Mode Toggle** - Theme switching UI

## 🛠️ Tech Stack

- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite 7
- **Routing**: React Router v7
- **Styling**: Vanilla CSS (Custom Design System)
- **i18n**: Custom translation system
- **PDF**: jsPDF + jsPDF-AutoTable
- **AI**: Google Generative AI (Gemini)
- **Mobile**: Capacitor 6
- **Storage**: LocalStorage API
- **Date Handling**: date-fns

## 📜 Available Scripts

```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint

# Type check
npx tsc --noEmit
```

## 🐛 Troubleshooting

### Port already in use:
```bash
# Kill process on port 5173
npx kill-port 5173
# Or use different port
npm run dev -- --port 3000
```

### Clear browser data:
If you encounter data issues, clear LocalStorage:
```javascript
// In browser console
localStorage.clear();
location.reload();
```

### Vulnerabilities:
```bash
# Check vulnerabilities
npm audit

# Auto-fix (careful with breaking changes)
npm audit fix
```

## 📧 Support & Contact

For questions, issues, or contributions:

- Create an issue on GitHub
- Contact: dev@committeepro.com

## 📝 License

MIT License - feel free to use this project for learning or production!

## 🙏 Acknowledgments

- Google Fonts for typography
- Google Gemini for AI capabilities
- React team for amazing framework
- Vite team for blazing fast tooling

---

**Built with ❤️ using React, TypeScript, and modern web technologies**

🚀 **Ready to revolutionize committee management!**
