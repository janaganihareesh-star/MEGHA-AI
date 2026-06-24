const express = require('express');
const router = express.Router();
const goalController = require('../controllers/goalController');
const auth = require('../middleware/auth');

// Protect all dates endpoints with JWT auth
router.use(auth);

router.get('/', goalController.getImportantDates);
router.post('/', goalController.createImportantDate);
router.delete('/:id', goalController.deleteImportantDate);

module.exports = router;
