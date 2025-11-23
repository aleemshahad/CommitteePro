import { GoogleGenerativeAI } from '@google/generative-ai';
import { getGeminiApiKey } from './storageService';
import { Member, Language } from '@/types';

export interface ReminderOptions {
    memberName: string;
    groupName: string;
    amount: number;
    cycleNumber: number;
    language: Language;
}

export const generatePaymentReminder = async (options: ReminderOptions): Promise<string> => {
    const apiKey = getGeminiApiKey();

    if (!apiKey) {
        throw new Error('Gemini API key not configured');
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = options.language === 'ur'
        ? `ایک دوستانہ اور شائستہ ادائیگی کی یاد دہانی کا پیغام لکھیں:
       رکن کا نام: ${options.memberName}
       گروپ کا نام: ${options.groupName}
       رقم: ${options.amount} روپے
       سائیکل نمبر: ${options.cycleNumber}
       
       براہ کرم ایک مختصر، شائستہ اور دوستانہ یاد دہانی کا پیغام لکھیں (250 الفاظ سے کم)۔`
        : `Generate a friendly and polite payment reminder message for:
       Member Name: ${options.memberName}
       Group Name: ${options.groupName}
       Amount: ${options.amount} PKR
       Cycle Number: ${options.cycleNumber}
       
       Please create a short, polite, and friendly reminder message (less than 250 words).`;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error('Error generating reminder:', error);
        throw new Error('Failed to generate payment reminder');
    }
};

export const generateBulkReminders = async (
    members: Member[],
    groupName: string,
    amount: number,
    cycleNumber: number,
    language: Language
): Promise<Map<string, string>> => {
    const reminders = new Map<string, string>();

    for (const member of members) {
        try {
            const reminder = await generatePaymentReminder({
                memberName: member.name,
                groupName,
                amount,
                cycleNumber,
                language,
            });
            reminders.set(member.id, reminder);
            // Add small delay to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (error) {
            console.error(`Failed to generate reminder for ${member.name}:`, error);
            reminders.set(member.id, 'Error generating reminder');
        }
    }

    return reminders;
};
