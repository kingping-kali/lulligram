import { GoogleGenAI } from "@google/genai";

// Initialize Gemini
// Note: In a production app, the key should be secured.
// Using process.env.API_KEY as per instructions.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateListingDescription = async (title: string, category: string, price: number): Promise<string> => {
  if (!process.env.API_KEY) {
    return "Please configure your API Key to use AI features. This is a mock description.";
  }

  try {
    const prompt = `Write a short, catchy, and professional marketplace listing description for an item titled "${title}" in the category "${category}" priced at $${price}. Include hashtags. Max 50 words.`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || 'Could not generate description.';
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error generating description. Please try again.";
  }
};

export const generateSmartReply = async (lastMessage: string): Promise<string> => {
   if (!process.env.API_KEY) {
    return "Sure, I'm interested!";
  }

  try {
    const prompt = `You are a polite buyer/seller on a marketplace app. The other person said: "${lastMessage}". Suggest a short, polite, and relevant reply (max 15 words).`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || 'Okay, thanks!';
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Sounds good!";
  }
}
