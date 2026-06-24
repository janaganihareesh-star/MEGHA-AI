import axios from 'axios';

const getHeaders = (token) => ({
  headers: { Authorization: `Bearer ${token}` }
});

const notificationService = {
  // GET /api/notifications
  fetchAll: async (token) => {
    const res = await axios.get('/api/notifications', getHeaders(token));
    return res.data;
  },

  // PUT /api/notifications/read — mark specific IDs as read (pass array of ids)
  markRead: async (ids, token) => {
    const res = await axios.put('/api/notifications/read', { ids }, getHeaders(token));
    return res.data;
  },

  // DELETE /api/notifications/:id
  deleteOne: async (id, token) => {
    const res = await axios.delete(`/api/notifications/${id}`, getHeaders(token));
    return res.data;
  }
};

export default notificationService;
