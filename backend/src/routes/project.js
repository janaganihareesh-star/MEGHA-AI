const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const c = require('../controllers/projectController');

router.use(auth);

router.post('/idea',         c.generateIdeas);
router.post('/architecture', c.generateArchitecture);
router.post('/database',     c.generateSchema);
router.post('/apis',         c.generateApis);
router.post('/deployment',   c.generateDeployment);
router.get('/blueprints',    c.getBlueprints);
router.post('/blueprint',    c.createBlueprint);

module.exports = router;
