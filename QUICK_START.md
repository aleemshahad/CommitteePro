# 🚀 Quick Start Guide - CommitteePro

## Welcome to CommitteePro!

This guide will help you get started with your committee management system in just a few minutes.

## 📋 Prerequisites

Before you begin, ensure you have:
- ✅ Node.js 18 or higher installed
- ✅ npm (comes with Node.js)
- ✅ A Google Gemini API key (optional, for AI reminders)

## 🎯 5-Minute Setup

### Step 1: Install Dependencies (Already Done! ✅)
The dependencies are already installed and the server is running!

### Step 2: Access the Application
Open your browser and go to:
```
http://localhost:5173
```

### Step 3: Create Your Account
1. Enter your email address
2. Click "Send Magic Link"
3. Enter your name
4. Click "Continue"

You're now logged in! 🎉

## 🎓 First Time Tutorial

### Create Your First Committee

1. **Click "Create Group"** on the dashboard
2. **Fill in the details**:
   - Name: e.g., "Monthly Savings Committee"
   - Description: e.g., "Family savings group"
   - Amount: e.g., "10000" PKR
   - Frequency: Select "Monthly"
   - Start Date: Choose your start date

3. **Add Members**:
   - Click "Add Member" to add more rows
   - Fill in:
     - Name (required)
     - Email (optional)
     - Phone (optional)
   - Add at least 2-3 members

4. **Click "Save"**

Congratulations! You've created your first committee! 🎉

### Track Payments

1. **Click on your group** card
2. **Go to "Payments" tab**
3. **Click the X or ✓ buttons** to mark payments as paid/unpaid
4. The summary updates automatically

### Conduct Your First Draw

1. **Open your group**
2. **Click "Draw" tab**
3. **Click "Spin the Wheel"**
4. Watch the wheel spin and select a winner! 🎯

The winner is automatically recorded and excluded from future draws.

### Generate AI Reminders (Optional)

1. **Go to Settings**
2. **Enter your Google Gemini API Key**
   - Get one free at: https://makersuite.google.com/app/apikey
3. **Save the key**
4. **Go to a group → Reminders tab**
5. **Click "Generate Reminder"** for any member
6. AI will create a personalized payment reminder! 🤖

### Switch to Urdu

1. **Go to Settings**
2. **Click "اردو (Urdu)"** button
3. The entire interface switches to Urdu with RTL layout! 🌍

### Generate Reports

1. **Go to Reports page**
2. **Select a group**
3. **Review the report**
4. **Click "Export PDF"**
5. **Open the downloaded HTML file**
6. **Print → Save as PDF**

## 🎨 Pro Tips

### Dashboard Tips
- The dashboard shows real-time statistics
- Click any group card to view details
- Use the progress bar to track cycle completion

### Payment Tips
- Green ✓ = Paid
- Red X = Unpaid
- Click any cell to toggle status
- Check the summary at the bottom for totals

### Draw Tips
- The wheel only shows eligible members
- Previous winners are automatically excluded
- Each member can win only once per committee cycle

### Group Management Tips
- Use the search bar to find groups quickly
- Delete confirmation prevents accidents
- Edit groups by clicking on them

## 📱 Mobile Usage

To use on mobile devices:

### Option 1: Browser
Just open http://localhost:5173 on your mobile browser (connect to same WiFi)

### Option 2: Native App
```bash
npm run build
npx cap sync
npx cap open android  # or ios
```

## 🆘 Common Questions

**Q: Where is my data stored?**
A: All data is stored in your browser's localStorage. It's completely private and stays on your device.

**Q: Can I use this offline?**
A: Yes! Once loaded, the app works offline. Only AI reminders require internet.

**Q: How do I backup my data?**
A: Currently, data is stored locally. For backups, use your browser's export functionality.

**Q: Is my API key safe?**
A: Yes, it's stored locally in your browser and never sent anywhere except to Google's Gemini API.

**Q: Can multiple people use this?**
A: Currently, it's single-user. Each person needs their own device/browser.

## 🎯 Feature Quick Reference

| Feature | Location | Purpose |
|---------|----------|---------|
| Create Group | Groups → Create Group | Start a new committee |
| Track Payments | Group Detail → Payments tab | Mark who has paid |
| Conduct Draw | Group Detail → Draw tab | Select random winner |
| AI Reminders | Group Detail → Reminders tab | Generate payment reminders |
| Reports | Reports page | Export committee reports |
| Language | Settings | Switch English/Urdu |
| API Key | Settings | Configure Gemini AI |

## 🌟 Best Practices

1. **Regular Updates**: Update payment status after each collection
2. **Timely Draws**: Conduct draws on schedule to maintain trust
3. **Member Communication**: Use AI reminders before payment deadlines
4. **Record Keeping**: Generate monthly reports for transparency
5. **Backup**: Periodically export reports as backup

## 🎉 You're All Set!

You now know everything you need to manage your committees efficiently!

**Current Status**: ✅ Server is running on http://localhost:5173

**Need Help?**
- Check the README.md for detailed documentation
- Review PROJECT_SUMMARY.md for feature details

Happy Committee Managing! 🎊
