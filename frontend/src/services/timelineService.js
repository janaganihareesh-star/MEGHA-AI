import axios from 'axios';

const getHeaders = (token) => ({
  headers: { Authorization: `Bearer ${token}` }
});

const timelineService = {
  // GET /api/timeline — aggregated life timeline (summaries, milestones, reflections, achievements)
  fetchTimeline: async (token) => {
    const res = await axios.get('/api/timeline', getHeaders(token));
    return res.data;
  }
};

export default timelineService;
