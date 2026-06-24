import axios from 'axios';

const getHeaders = (token) => ({
  headers: { Authorization: `Bearer ${token}` }
});

const moodService = {
  // GET /api/mood/trend?days=30 — mood trend chart data
  fetchTrend: async (token, days = 30) => {
    const res = await axios.get(`/api/mood/trend?days=${days}`, getHeaders(token));
    return res.data;
  },

  // GET /api/mood/analytics — current vs last month distributions + trend insight
  fetchAnalytics: async (token) => {
    const res = await axios.get('/api/mood/analytics', getHeaders(token));
    return res.data;
  },

  // GET /api/mood/history?page=1&limit=20 — paginated mood history log
  fetchHistory: async (token, page = 1, limit = 20) => {
    const res = await axios.get(`/api/mood/history?page=${page}&limit=${limit}`, getHeaders(token));
    return res.data;
  }
};

export default moodService;
