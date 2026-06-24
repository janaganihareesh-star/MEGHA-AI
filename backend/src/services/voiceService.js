const langCodeMap = {
  'English': 'en',
  'Telugu': 'te',
  'Hindi': 'hi',
  'Tamil': 'ta',
  'Kannada': 'kn',
  'Malayalam': 'ml',
  'Bengali': 'bn',
  'Marathi': 'mr',
  'Gujarati': 'gu',
  'Odia': 'or',
  'Punjabi': 'pa',
  'Urdu': 'ur',
  'Sanskrit': 'sa',
  'Kashmiri': 'ks',
  'Konkani': 'kok',
  'Nepali': 'ne',
  'Manipuri': 'mni',
  'Sindhi': 'sd'
};

async function textToSpeech(text, language = 'English', voiceId = '') {
  try {
    const langCode = langCodeMap[language] || 'en';
    // Clean text to keep url length valid
    const cleanText = text.replace(/[*_#`~[\]]/g, '').substring(0, 200);
    const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&q=${encodeURIComponent(cleanText)}&tl=${langCode}`;
    return ttsUrl;
  } catch (err) {
    console.error('Error generating TTS url:', err.message);
    return 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'; // Fallback audio
  }
}

module.exports = {
  textToSpeech
};
