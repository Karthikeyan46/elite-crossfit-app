import { GoogleGenerativeAI } from '@google/generative-ai';

// Uses gemini-2.5-flash for speed and reliability
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

export async function analyzeFoodImage(base64WithPrefix) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    
    // Extract base64 data regardless of prefix
    const base64Data = base64WithPrefix.includes(',') ? base64WithPrefix.split(',')[1] : base64WithPrefix;

    const prompt = `Analyse this food image. Return ONLY a JSON object, no markdown:
    {
      "name": "food name",
      "calories": number,
      "protein": number,
      "carbs": number,
      "fats": number,
      "serving_size": "e.g. 1 cup"
    }
    Use accurately estimated nutritional values.`;

    const result = await model.generateContent([
      prompt,
      { inlineData: { mimeType: 'image/jpeg', data: base64Data } }
    ]);

    const text = result.response.text().replace(/```json|```/g, '').trim();
    return JSON.parse(text);
  } catch (error) {
    console.error('Gemini Vision Error:', error);
    throw error;
  }
}

export async function analyzeFoodText(query) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const prompt = `Estimate nutrition for: "${query}". Return ONLY JSON: {name, calories, protein, carbs, fats, serving_size}`;
    
    const result = await model.generateContent(prompt);
    const text = result.response.text().replace(/```json|```/g, '').trim();
    return JSON.parse(text);
  } catch (error) {
    console.error('Gemini Text Error:', error);
    throw error;
  }
}
