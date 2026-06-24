import axios from 'axios';

const getHeaders = (token) => ({
  headers: { Authorization: `Bearer ${token}` }
});

const chatService = {
  fetchHistory: async (token, limit = 50) => {
    const res = await axios.get(`/api/chat/history?limit=${limit}`, getHeaders(token));
    return res.data;
  },
  sendMessage: async (messageText, token) => {
    const res = await axios.post('/api/chat/message', { message: messageText }, getHeaders(token));
    return res.data;
  },
  searchHistory: async (query, token) => {
    const res = await axios.get(`/api/chat/search?q=${query}`, getHeaders(token));
    return res.data;
  }
};

export default chatService;