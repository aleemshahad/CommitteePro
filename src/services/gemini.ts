import { GoogleGenerativeAI } from '@google/generative-ai';
import { AIReminderRequest, Language } from '../types';

class GeminiService {
    private apiKey: string | null = null;
    private genAI: GoogleGenerativeAI | null = null;

    initialize(apiKey: string): void {
        this.apiKey = apiKey;
        this.genAI = new GoogleGenerativeAI(apiKey);
    }

    isInitialized(): boolean {
        return this.genAI !== null;
    }

    async generatePaymentReminder(request: AIReminderRequest): Promise<string> {
        if (!this.genAI) {
            throw new Error('Gemini API not initialized. Please add your API key in settings.');
        }

        const model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });

        const prompt = this.buildReminderPrompt(request);

        try {
            const result = await model.generateContent(prompt);
            const response = await result.response;
            return response.text();
        } catch (error) {
            console.error('Error generating reminder:', error);
            // Fallback to template-based reminder
            return this.getTemplateReminder(request);
        }
    }

    private buildReminderPrompt(request: AIReminderRequest): string {
        const { memberName, committeeName, amount, dueDate, language } = request;

        if (language === 'ur') {
            return `
آپ ایک مددگار اور دوستانہ کمیٹی مینیجر ہیں۔ ایک شائستہ اور ذاتی نوعیت کی ادائیگی کی یاددہانی پیغام لکھیں:

رکن کا نام: ${memberName}
کمیٹی کا نام: ${committeeName}
ادائیگی کی رقم: ${amount} روپے
آخری تاریخ: ${dueDate}

پیغام مختصر، شائستہ اور حوصلہ افزا ہونا چاہیے۔ رسمی لیکن دوستانہ لہجہ استعمال کریں۔
صرف یاددہانی کا پیغام لکھیں، کوئی اضافی وضاحت نہیں۔
      `.trim();
        } else {
            return `
You are a helpful and friendly committee manager. Write a polite and personalized payment reminder message:

Member Name: ${memberName}
Committee Name: ${committeeName}
Payment Amount: ${amount}
Due Date: ${dueDate}

The message should be brief, polite, and encouraging. Use a formal but friendly tone.
Write only the reminder message, no additional explanations.
      `.trim();
        }
    }

    private getTemplateReminder(request: AIReminderRequest): string {
        const { memberName, committeeName, amount, dueDate, language } = request;

        if (language === 'ur') {
            return `
محترم ${memberName}،

یہ ${committeeName} کمیٹی کی ادائیگی کی دوستانہ یاددہانی ہے۔

ادائیگی کی تفصیلات:
• رقم: ${amount} روپے
• آخری تاریخ: ${dueDate}

برائے مہربانی وقت پر ادائیگی کی تکمیل یقینی بنائیں۔ اگر آپ کو کوئی مسئلہ درپیش ہے تو براہ کرم ہم سے رابطہ کریں۔

شکریہ،
${committeeName} ٹیم
      `.trim();
        } else {
            return `
Dear ${memberName},

This is a friendly reminder for your ${committeeName} committee payment.

Payment Details:
• Amount: ${amount}
• Due Date: ${dueDate}

Please ensure timely payment completion. If you face any issues, please contact us.

Thank you,
${committeeName} Team
      `.trim();
        }
    }

    async generateCommitteeSummary(
        committeeName: string,
        stats: { totalMembers: number; totalCollected: number; cycleNumber: number },
        language: Language
    ): Promise<string> {
        if (!this.genAI) {
            return this.getTemplateSummary(committeeName, stats, language);
        }

        const model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });

        const prompt = language === 'ur'
            ? `${committeeName} کمیٹی کے لیے ایک مختصر ماہانہ خلاصہ لکھیں:
کل اراکین: ${stats.totalMembers}
جمع شدہ رقم: ${stats.totalCollected} روپے
موجودہ چکر: ${stats.cycleNumber}

خلاصہ مثبت اور حوصلہ افزا ہونا چاہیے۔`
            : `Write a brief monthly summary for ${committeeName} committee:
Total Members: ${stats.totalMembers}
Total Collected: ${stats.totalCollected}
Current Cycle: ${stats.cycleNumber}

The summary should be positive and encouraging.`;

        try {
            const result = await model.generateContent(prompt);
            const response = await result.response;
            return response.text();
        } catch (error) {
            console.error('Error generating summary:', error);
            return this.getTemplateSummary(committeeName, stats, language);
        }
    }

    private getTemplateSummary(
        committeeName: string,
        stats: { totalMembers: number; totalCollected: number; cycleNumber: number },
        language: Language
    ): string {
        if (language === 'ur') {
            return `${committeeName} - چکر ${stats.cycleNumber}

کل اراکین: ${stats.totalMembers}
جمع شدہ رقم: ${stats.totalCollected} روپے

ہماری کمیٹی اچھی کارکردگی دکھا رہی ہے۔ سب اراکین کا تعاون قابل تعریف ہے!`;
        } else {
            return `${committeeName} - Cycle ${stats.cycleNumber}

Total Members: ${stats.totalMembers}
Total Collected: ${stats.totalCollected}

Our committee is performing well. Great cooperation from all members!`;
        }
    }
}

export const geminiService = new GeminiService();
