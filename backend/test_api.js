const fs = require('fs');
const env = fs.readFileSync('.env', 'utf8');
const keyMatch = env.match(/GEMINI_API_KEYS?=([^\n]+)/);
if (keyMatch) {
  const key = keyMatch[1].split(',')[0].trim().replace(/['"]/g, '');
  const body = JSON.stringify({ contents: [{ parts: [{ text: 'hi '.repeat(1000) }] }] });
  
  fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-lite-latest:generateContent?key=' + key, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body
  }).then(async r => {
    console.log('flash-lite-latest Status:', r.status);
    console.log('flash-lite-latest Body:', await r.text());
  });
}
