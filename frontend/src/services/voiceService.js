import axios from 'axios';

const getHeaders = (token) => ({
  headers: { Authorization: `Bearer ${token}` }
});

const voiceService = {
  uploadVoice: async (formData, token) => {
    const res = await axios.post('/api/voice/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`
      }
    });
    return res.data;
  },
  transcribeVoice: async (audioUrl, token) => {
    const res = await axios.post('/api/voice/transcribe', { audioUrl }, getHeaders(token));
    return res.data;
  },
  speakText: async (text, language, token) => {
    const res = await axios.post('/api/voice/speak', { text, language }, {
      headers: { Authorization: `Bearer ${token}` },
      responseType: 'blob'
    });
    return res.data;
  }
};

export default voiceService;