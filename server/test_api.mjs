import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

console.log('Testing Gemini API key:', process.env.GEMINI_API_KEY ? 'Found key: ' + process.env.GEMINI_API_KEY.slice(0, 10) + '...' : 'KEY NOT FOUND!');

const client = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY,
  baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/',
});

try {
  const response = await client.chat.completions.create({
    model: 'gemini-2.0-flash',
    messages: [{ role: 'user', content: 'Say exactly: IT WORKS!' }],
  });
  console.log('SUCCESS! AI replied:', response.choices[0].message.content);
} catch (err) {
  console.error('FAILED! Error status:', err.status);
  console.error('Error message:', err.message);
  if (err.error) console.error('Error detail:', JSON.stringify(err.error, null, 2));
}
