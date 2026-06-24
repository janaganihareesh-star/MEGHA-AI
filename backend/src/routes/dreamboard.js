const express = require('express');
const router = express.Router();
const goalController = require('../controllers/goalController');
const auth = require('../middleware/auth');

// Protect all dreamboard endpoints with JWT auth
router.use(auth);

router.get('/', goalController.getDreams);
router.post('/', goalController.createDream);
router.put('/:id', goalController.updateDream);
router.delete('/:id', goalController.deleteDream);

module.exports = router;
