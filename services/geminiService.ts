
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function generateHeartfeltMessage(prompt: string, theme: string): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Write a beautiful, heartfelt message in Arabic (or English if requested) based on this theme: ${theme}. Context: ${prompt}. Keep it meaningful and artistic.`,
      config: {
        temperature: 0.8,
        topP: 0.95,
      },
    });

    return response.text || "Could not generate message. Please try again.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error generating message. Please write your own beautiful words.";
  }
}
