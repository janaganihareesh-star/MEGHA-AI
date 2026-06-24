import axios from 'axios';

const getHeaders = (token) => ({
  headers: { Authorization: `Bearer ${token}` }
});

const goalService = {
  fetchGoals: async (token) => {
    const res = await axios.get('/api/goals', getHeaders(token));
    return res.data;
  },
  createGoal: async (goalData, token) => {
    const res = await axios.post('/api/goals', goalData, getHeaders(token));
    return res.data;
  },
  updateGoal: async (id, goalData, token) => {
    const res = await axios.put(`/api/goals/${id}`, goalData, getHeaders(token));
    return res.data;
  },
  deleteGoal: async (id, token) => {
    const res = await axios.delete(`/api/goals/${id}`, getHeaders(token));
    return res.data;
  },
  breakdownGoal: async (id, token) => {
    const res = await axios.post(`/api/goals/${id}/breakdown`, {}, getHeaders(token));
    return res.data;
  },
  fetchAchievements: async (token) => {
    const res = await axios.get('/api/achievements', getHeaders(token));
    return res.data;
  },
  fetchDreams: async (token) => {
    const res = await axios.get('/api/dreamboard', getHeaders(token));
    return res.data;
  },
  createDream: async (dreamData, token) => {
    const res = await axios.post('/api/dreamboard', dreamData, getHeaders(token));
    return res.data;
  },
  updateDream: async (id, dreamData, token) => {
    const res = await axios.put(`/api/dreamboard/${id}`, dreamData, getHeaders(token));
    return res.data;
  },
  deleteDream: async (id, token) => {
    const res = await axios.delete(`/api/dreamboard/${id}`, getHeaders(token));
    return res.data;
  }
};

export default goalService;