
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getShoppingAdvice = async (userPrompt: string, products: any[]) => {
  try {
    const context = `You are "ElectroBot", a smart shopping assistant for ElectroHub. 
    Here is our catalog: ${JSON.stringify(products.map(p => ({ name: p.name, category: p.category, price: p.price })))}.
    Help the user find products or answer technical questions. Be brief and professional.`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: userPrompt,
      config: {
        systemInstruction: context,
        temperature: 0.7,
      },
    });

    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "I'm sorry, I'm having trouble connecting to my brain right now. Please try again!";
  }
};
