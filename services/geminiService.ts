import { GoogleGenAI } from "@google/genai";
import { Member } from "../types";

// In a real app, this would be proxied or user-provided. 
// For this demo, we assume the environment variable or a safe client-side key handling.
// NOTE: Since I cannot ask user for key in code as per instructions, we rely on process.env.API_KEY
// If it's missing, we handle gracefully.

export const generateReminderMessage = async (
  member: Member, 
  amount: number, 
  language: 'en' | 'ur'
): Promise<string> => {
  if (!process.env.API_KEY) {
    return language === 'en' 
      ? `Hello ${member.name}, friendly reminder to pay your committee installment of ${amount}.`
      : `السلام علیکم ${member.name}، آپ کی کمیٹی کی قسط ${amount} واجب الادا ہے۔`;
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const prompt = language === 'ur'
      ? `Write a polite and professional short WhatsApp message in Urdu (Urdu script) to remind ${member.name} to pay their monthly committee contribution of ${amount}. Keep it friendly.`
      : `Write a polite and professional short WhatsApp message in English to remind ${member.name} to pay their monthly committee contribution of ${amount}. Keep it friendly.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Could not generate message.";
  } catch (error) {
    console.error("Gemini API Error:", error);
     return language === 'en' 
      ? `Hello ${member.name}, friendly reminder to pay your committee installment of ${amount}.`
      : `السلام علیکم ${member.name}، آپ کی کمیٹی کی قسط ${amount} واجب الادا ہے۔`;
  }
};