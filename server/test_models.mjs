import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

const key = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(key);

try {
  // Try a few different model IDs
  const models = ['gemini-pro', 'gemini-1.0-pro', 'gemini-1.5-pro', 'gemini-1.5-flash', 'gemini-2.0-flash-lite'];
  for (const modelId of models) {
    try {
      const model = genAI.getGenerativeModel({ model: modelId });
      const result = await model.generateContent('Say: hi');
      console.log(`SUCCESS with model ${modelId}:`, result.response.text());
      break;
    } catch(e) {
      console.log(`Model ${modelId} FAILED:`, e.message.slice(0,80));
    }
  }
} catch(e) {
  console.error('FAILED:', e.message);
}
