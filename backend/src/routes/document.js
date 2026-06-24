const router = require('express').Router();
const auth = require('../middleware/auth');
const c = require('../controllers/documentController');

router.use(auth);

// Engine 35 — Document Generation
router.post('/generate',        c.generateDocument);
router.post('/export',          c.exportDocument);
router.get('/history',          c.getHistory);
router.delete('/:id',           c.deleteDocument);

// Engine 36 — Document Intelligence
router.post('/upload',          c.uploadMiddleware, c.uploadDocument);
router.post('/summarize',       c.summarizeDoc);
router.post('/explain',         c.explainDoc);
router.post('/translate',       c.translateDoc);
router.post('/mcq',             c.generateMCQs);
router.post('/interview-questions', c.generateInterviewQs);
router.post('/notes',           c.generateNotes);
router.post('/extract-tables',  c.extractTables);

module.exports = router;
