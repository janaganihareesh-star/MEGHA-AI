import axios from 'axios';

const getHeaders = (token) => ({
  headers: { Authorization: `Bearer ${token}` }
});

const resumeService = {
  uploadResume: async (formData, token) => {
    const res = await axios.post('/api/resume/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`
      }
    });
    return res.data;
  },
  analyzeResume: async (resumeId, targetRole, token) => {
    const res = await axios.post('/api/resume/analyze', { resumeId, targetRole }, getHeaders(token));
    return res.data;
  },
  fetchHistory: async (token) => {
    const res = await axios.get('/api/resume/history', getHeaders(token));
    return res.data;
  }
};

export default resumeService;