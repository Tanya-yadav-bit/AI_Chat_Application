import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Initialize Google Generative AI with the AIzaSy... key from AI Studio
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post('/', async (req, res) => {
  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Messages array is required' });
  }

  try {
    // Set headers for Server-Sent Events (SSE) streaming
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash',
      systemInstruction: 'You are a helpful and concise AI assistant.',
    });

    // Convert messages from OpenAI format to Gemini format
    // Gemini uses 'user' and 'model' (not 'assistant')
    const history = messages.slice(0, -1).map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }],
    }));

    // Last message is the current user input
    const lastMessage = messages[messages.length - 1].content;

    const chat = model.startChat({ history });

    // Stream the response
    const result = await chat.sendMessageStream(lastMessage);

    for await (const chunk of result.stream) {
      const text = chunk.text();
      if (text) {
        res.write(`data: ${JSON.stringify({ content: text })}\n\n`);
      }
    }

    res.write('data: [DONE]\n\n');
    res.end();
  } catch (error) {
    console.error('Gemini API Error:', error.message);
    if (!res.headersSent) {
      res.status(500).json({ error: 'An error occurred during chat completion.' });
    } else {
      res.write(`data: ${JSON.stringify({ error: 'Server error occurred' })}\n\n`);
      res.end();
    }
  }
});

export default router;
