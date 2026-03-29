import https from 'https';
import dotenv from 'dotenv';
dotenv.config();

const key = process.env.GEMINI_API_KEY;
console.log('Key found:', key ? key.slice(0,15)+'...' : 'MISSING');

// Test directly against the native Gemini REST API (not OpenAI compat layer)
const body = JSON.stringify({
  contents: [{ role: 'user', parts: [{ text: 'Say: IT WORKS' }] }]
});

const options = {
  hostname: 'generativelanguage.googleapis.com',
  path: `/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`,
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) }
};

const req = https.request(options, (res) => {
  let data = '';
  res.on('data', d => data += d);
  res.on('end', () => {
    console.log('HTTP Status:', res.statusCode);
    const parsed = JSON.parse(data);
    if (res.statusCode === 200) {
      console.log('SUCCESS! Response:', parsed.candidates[0].content.parts[0].text);
    } else {
      console.error('ERROR:', JSON.stringify(parsed, null, 2));
    }
  });
});
req.on('error', e => console.error('Request error:', e));
req.write(body);
req.end();
