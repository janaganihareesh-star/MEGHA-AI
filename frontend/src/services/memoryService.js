import axios from 'axios';

const getHeaders = (token) => ({
  headers: { Authorization: `Bearer ${token}` }
});

const memoryService = {
  fetchMemories: async (grouped = false, token) => {
    const res = await axios.get(`/api/memory?grouped=${grouped}`, getHeaders(token));
    return res.data;
  },
  createMemory: async (memoryData, token) => {
    const res = await axios.post('/api/memory', memoryData, getHeaders(token));
    return res.data;
  },
  updateMemory: async (id, memoryData, token) => {
    const res = await axios.put(`/api/memory/${id}`, memoryData, getHeaders(token));
    return res.data;
  },
  deleteMemory: async (id, token) => {
    const res = await axios.delete(`/api/memory/${id}`, getHeaders(token));
    return res.data;
  },
  togglePin: async (id, token) => {
    const res = await axios.put(`/api/memory/${id}/pin`, {}, getHeaders(token));
    return res.data;
  }
};

export default memoryService;