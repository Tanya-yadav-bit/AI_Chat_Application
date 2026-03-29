# AI Chat Application

A fully functional, modern AI chat application with a UI inspired by ChatGPT. Built using React, Vite, Tailwind CSS, Node.js, Express, and the Google Gemini API.

## Features
- **ChatGPT-like UI**: A clean, responsive design with dark mode, markdown rendering, and code highlighting.
- **Real-time Interaction**: Streaming responses text generation token-by-token directly from Gemini.
- **Chat History**: Persisted locally in your browser (`localStorage`).
- **Secure Backend**: Express server proxies requests to Gemini, keeping your API key secure.

---

## 🚀 Setup Instructions

### 1. Requirements
Ensure you have Node.js installed (v16 or higher).

### 2. Configure Environment Variables
Navigate to the `/server` directory and add your Google Gemini API key.
1. An example `.env` is already configured, but verify it: `server/.env`
2. Update it with your actual key:
   ```env
   PORT=5000
   GEMINI_API_KEY=your_actual_api_key_here
   ```

### 3. Install Dependencies
Open two terminal windows:

**Terminal 1 (Backend):**
```bash
cd server
npm install
```

**Terminal 2 (Frontend):**
```bash
cd client
npm install
```

---

## ▶️ Run Commands

To start the application locally:

**1. Start the Backend Server**
```bash
cd server
node server.js
```
*(Runs on `http://localhost:5000`)*

**2. Start the Frontend Application**
```bash
cd client
npm run dev
```
*(Runs on `http://localhost:5173`)*

Open the provided Vite URL in your browser to start chatting!

---

## Technical Stack
- **Frontend**: React (Hooks, Vite), Tailwind CSS, lucide-react (icons), react-markdown (formatting)
- **Backend**: Node.js, Express, CORS, dotenv, @google/generative-ai (Official SDK)
