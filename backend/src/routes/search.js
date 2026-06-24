const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const sc = require('../controllers/searchController');

router.use(auth);

router.post('/query',          sc.searchQuery);
router.post('/deep-research',  sc.deepResearch);
router.get('/history',         sc.getSearchHistory);
router.put('/history/:id/pin', sc.pinSearch);
router.delete('/history/:id',  sc.deleteSearch);

module.exports = router;
