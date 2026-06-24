const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const c = require('../controllers/careerController');

router.use(auth);

// Resume
router.post('/resume/build',    c.buildResume);
router.post('/resume/ats-check', c.atsCheck);

// Cover Letter
router.post('/cover-letter/generate', c.generateCoverLetter);

// LinkedIn
router.post('/linkedin/optimize', c.optimizeLinkedIn);

// Interview
router.post('/interview/prep',       c.interviewPrep);
router.post('/interview/technical',  c.technicalInterview);

// Salary
router.post('/salary/research', c.salaryResearch);
router.post('/salary/script',   c.salaryScript);

// Company Prep
router.post('/company-prep', c.companyPrep);

module.exports = router;
