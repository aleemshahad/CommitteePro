# CommitteePro - Committee Management System

A comprehensive committee management web and mobile application that allows users to create and manage groups, track member payments, and conduct random draws, enhanced with AI-powered payment reminders and multi-language support.

## Features

- ✨ **Magic Link Authentication** - Secure passwordless login system
- 📊 **Dashboard** - Overview of active committees and statistics
- 👥 **Group Management** - Create and manage multiple committees with member details
- 💰 **Payment Tracking** - Track payment status across payment cycles
- 🎯 **Digital Draw System** - Fair random selection via spinning wheel
- 🌍 **Multi-language Support** - English and Urdu with RTL layout
- 🤖 **AI-Powered Reminders** - Google Gemini AI for personalized payment reminders
- 📄 **PDF Reports** - Generate and export detailed reports
- 💾 **Local Storage** - Persistent data storage for offline use
- 📱 **Mobile Support** - Capacitor integration for native mobile apps

## Tech Stack

- **Frontend**: React 18, TypeScript
- **Build Tool**: Vite
- **Routing**: React Router DOM
- **Icons**: Lucide React
- **AI**: Google Gemini AI
- **Mobile**: Capacitor
- **State**: React Context API
- **Storage**: LocalStorage

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Google Gemini API key (for AI reminders)

### Installation

1. Clone the repository:
\`\`\`bash
git clone <repository-url>
cd CommitteePro
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Start the development server:
\`\`\`bash
npm run dev
\`\`\`

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

\`\`\`bash
npm run build
\`\`\`

### Mobile Development

To build for mobile platforms:

1. Build the web app:
\`\`\`bash
npm run build
\`\`\`

2. Sync with Capacitor:
\`\`\`bash
npx cap sync
\`\`\`

3. Open in native IDE:
\`\`\`bash
# For Android
npx cap open android

# For iOS
npx cap open ios
\`\`\`

## Configuration

### Google Gemini AI Setup

1. Get an API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Navigate to Settings in the app
3. Enter your API key in the Gemini API Key field
4. Save the key

## Usage

### Creating a Committee

1. Navigate to Groups
2. Click "Create Group"
3. Fill in group details (name, description, amount, frequency)
4. Add members with their contact information
5. click "Save"

### Tracking Payments

1. Open a group from the Groups page
2. Navigate to the "Payments" tab
3. Click on payment boxes to toggle paid/unpaid status
4. View payment summary at the bottom

### Conducting a Draw

1. Open a group
2. Navigate to the "Draw" tab
3. Click "Spin the Wheel"
4. The system will randomly select a winner from eligible members
5. Winner is automatically recorded

### Generating AI Reminders

1. Open a group
2. Navigate to the "Reminders" tab
3. Select members with pending payments
4. Click "Generate Reminder"
5. Review AI-generated message
6. Send reminder to members

### Exporting Reports

1. Navigate to Reports
2. Select a group
3. Review the report data
4. Click "Export PDF"
5. Open the HTML file and save as PDF

## Project Structure

\`\`\`
CommitteePro/
├── src/
│   ├── components/      # Reusable components
│   │   ├── DrawWheel.tsx
│   │   └── Layout.tsx
│   ├── context/         # React context providers
│   │   └── LanguageContext.tsx
│   ├── i18n/           # Translations
│   │   └── translations.ts
│   ├── pages/          # Page components
│   │   ├── Dashboard.tsx
│   │   ├── Groups.tsx
│   │   ├── GroupDetail.tsx
│   │   ├── Login.tsx
│   │   ├── Reports.tsx
│   │   └── Settings.tsx
│   ├── services/       # Business logic services
│   │   ├── geminiService.ts
│   │   └── storageService.ts
│   ├── App.tsx         # Main app component
│   ├── constants.ts    # App constants
│   ├── index.css       # Global styles
│   ├── main.tsx        # Entry point
│   └── types.ts        # TypeScript types
├── public/             # Static assets
├── capacitor.config.ts # Capacitor configuration
├── package.json
├── tsconfig.json
└── vite.config.ts
\`\`\`

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

© 2025 CommitteePro. All rights reserved.

## Support

For support, please open an issue in the repository or contact the development team.
