import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

const key = process.env.GEMINI_API_KEY;
console.log('Key found:', key ? key.slice(0,15)+'...' : 'MISSING');

const genAI = new GoogleGenerativeAI(key);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

try {
  const result = await model.generateContent('Say exactly: IT WORKS!');
  console.log('SUCCESS! AI replied:', result.response.text());
} catch(e) {
  console.error('FAILED:', e.message);
}
