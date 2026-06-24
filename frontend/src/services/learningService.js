import axios from 'axios';

const getHeaders = (token) => ({
  headers: { Authorization: `Bearer ${token}` }
});

const learningService = {
  getTopics: async (subject, token) => {
    const res = await axios.get(`/api/learning/topics/${subject}`, getHeaders(token));
    return res.data;
  },
  askQuestion: async (subject, topic, question, token) => {
    const res = await axios.post('/api/learning/ask', { subject, topic, question }, getHeaders(token));
    return res.data;
  },
  chatTutor: async (message, history, token) => {
    const res = await axios.post('/api/learning/chat', { message, history }, getHeaders(token));
    return res.data;
  },
  getPracticeQuestion: async (subject, topic, difficulty, token) => {
    const res = await axios.post('/api/learning/question', { subject, topic, difficulty }, getHeaders(token));
    return res.data;
  },
  evaluateAnswer: async (subject, topic, question, userAnswer, token) => {
    const res = await axios.post('/api/learning/evaluate', { subject, topic, question, userAnswer }, getHeaders(token));
    return res.data;
  },
  getProgress: async (token) => {
    const res = await axios.get('/api/learning/progress', getHeaders(token));
    return res.data;
  }
};

export default learningService;