const express = require('express');
const router = express.Router();
const memoryController = require('../controllers/memoryController');
const auth = require('../middleware/auth');

// Protect all memory endpoints with JWT auth
router.use(auth);

router.get('/', memoryController.getMemories);
router.post('/', memoryController.createMemory);
router.get('/export', memoryController.exportMemories);
router.delete('/all', memoryController.deleteAllMemories);
router.get('/search', memoryController.searchMemories);
router.put('/correct', memoryController.correctMemory);

router.put('/:id', memoryController.updateMemory);
router.delete('/:id', memoryController.deleteMemory);
router.put('/:id/pin', memoryController.togglePin);

module.exports = router;