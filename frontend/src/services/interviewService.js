import axios from 'axios';

const getHeaders = (token) => ({
  headers: { Authorization: `Bearer ${token}` }
});

const interviewService = {
  startInterview: async (type, role, resumeId, token) => {
    const res = await axios.post('/api/interview/start', { type, role, resumeId }, getHeaders(token));
    return res.data;
  },
  submitAnswer: async (sessionId, questionIndex, answer, token) => {
    const res = await axios.post('/api/interview/answer', { sessionId, questionIndex, answer }, getHeaders(token));
    return res.data;
  },
  fetchResults: async (sessionId, token) => {
    const res = await axios.get(`/api/interview/result/${sessionId}`, getHeaders(token));
    return res.data;
  }
};

export default interviewService;