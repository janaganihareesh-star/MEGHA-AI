import axios from 'axios';

const getHeaders = (token) => ({
  headers: { Authorization: `Bearer ${token}` }
});

const settingsService = {
  // GET /api/settings — basic account settings (email, mobile, theme)
  fetchSettings: async (token) => {
    const res = await axios.get('/api/settings', getHeaders(token));
    return res.data;
  },

  // GET /api/profile/preferences — full companion preferences
  fetchPreferences: async (token) => {
    const res = await axios.get('/api/profile/preferences', getHeaders(token));
    return res.data;
  },

  // PUT /api/profile/preferences — update any preference fields
  updatePreferences: async (updates, token) => {
    const res = await axios.put('/api/profile/preferences', updates, getHeaders(token));
    return res.data;
  },

  // PUT /api/profile/theme — toggle dark/light mode
  updateTheme: async (themeMode, token) => {
    const res = await axios.put('/api/profile/theme', { themeMode }, getHeaders(token));
    return res.data;
  },

  // PUT /api/profile/trusted-contacts — update emergency contacts
  updateTrustedContacts: async (contacts, token) => {
    const res = await axios.put('/api/profile/trusted-contacts', contacts, getHeaders(token));
    return res.data;
  }
};

export default settingsService;
