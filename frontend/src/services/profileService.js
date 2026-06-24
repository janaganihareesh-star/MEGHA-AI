import axios from 'axios';

const getHeaders = (token) => ({
  headers: { Authorization: `Bearer ${token}` }
});

const profileService = {
  // GET /api/profile/preferences
  fetchPreferences: async (token) => {
    const res = await axios.get('/api/profile/preferences', getHeaders(token));
    return res.data;
  },

  // PUT /api/profile/preferences
  updatePreferences: async (updates, token) => {
    const res = await axios.put('/api/profile/preferences', updates, getHeaders(token));
    return res.data;
  },

  // POST /api/profile/language
  setLanguage: async (language, token) => {
    const res = await axios.post('/api/profile/language', { language }, getHeaders(token));
    return res.data;
  },

  // POST /api/profile/ai-gender
  setAiGender: async (aiGender, token) => {
    const res = await axios.post('/api/profile/ai-gender', { aiGender }, getHeaders(token));
    return res.data;
  },

  // POST /api/profile/voice
  setVoice: async (selectedVoice, token) => {
    const res = await axios.post('/api/profile/voice', { selectedVoice }, getHeaders(token));
    return res.data;
  },

  // POST /api/profile/relationship
  setRelationship: async (data, token) => {
    const res = await axios.post('/api/profile/relationship', data, getHeaders(token));
    return res.data;
  },

  // POST /api/profile/ai-name
  setAiName: async (aiName, token) => {
    const res = await axios.post('/api/profile/ai-name', { aiName }, getHeaders(token));
    return res.data;
  },

  // PUT /api/profile/trusted-contacts
  updateTrustedContacts: async (contacts, token) => {
    const res = await axios.put('/api/profile/trusted-contacts', contacts, getHeaders(token));
    return res.data;
  },

  // PUT /api/profile/theme
  updateTheme: async (themeMode, token) => {
    const res = await axios.put('/api/profile/theme', { themeMode }, getHeaders(token));
    return res.data;
  },

  // GET /api/relationship/stats
  fetchRelationshipStats: async (token) => {
    const res = await axios.get('/api/relationship/stats', getHeaders(token));
    return res.data;
  },

  // GET /api/relationship/journey
  fetchRelationshipJourney: async (token) => {
    const res = await axios.get('/api/relationship/journey', getHeaders(token));
    return res.data;
  }
};

export default profileService;
