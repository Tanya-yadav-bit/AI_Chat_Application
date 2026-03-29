import https from 'https';
import dotenv from 'dotenv';
dotenv.config();

const key = process.env.GEMINI_API_KEY;

if (!key) {
  console.error('No GEMINI_API_KEY found in .env');
  process.exit(1);
}

const options = {
  hostname: 'generativelanguage.googleapis.com',
  path: `/v1beta/models?key=${key}`,
  method: 'GET',
};

const req = https.request(options, (res) => {
  let data = '';
  res.on('data', d => data += d);
  res.on('end', () => {
    if (res.statusCode === 200) {
      const parsed = JSON.parse(data);
      console.log('Available Models:');
      if (parsed.models) {
        parsed.models.forEach(m => console.log(`- ${m.name} (Supported methods: ${m.supportedGenerationMethods?.join(', ')})`));
      } else {
        console.log('No models returned:', parsed);
      }
    } else {
      console.error('ERROR (Status ' + res.statusCode + '):', data);
    }
  });
});

req.on('error', e => console.error('Request error:', e));
req.end();
