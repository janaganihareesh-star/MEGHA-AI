import axios from 'axios';

const getHeaders = (token) => ({
  headers: { Authorization: `Bearer ${token}` }
});

const dreamboardService = {
  // GET /api/dreamboard
  fetchDreams: async (token) => {
    const res = await axios.get('/api/dreamboard', getHeaders(token));
    return res.data;
  },

  // POST /api/dreamboard
  createDream: async (dreamData, token) => {
    const res = await axios.post('/api/dreamboard', dreamData, getHeaders(token));
    return res.data;
  },

  // PUT /api/dreamboard/:id
  updateDream: async (id, updates, token) => {
    const res = await axios.put(`/api/dreamboard/${id}`, updates, getHeaders(token));
    return res.data;
  },

  // DELETE /api/dreamboard/:id
  deleteDream: async (id, token) => {
    const res = await axios.delete(`/api/dreamboard/${id}`, getHeaders(token));
    return res.data;
  }
};

export default dreamboardService;
