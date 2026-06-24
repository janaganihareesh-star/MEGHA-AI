/**
 * projectController.js
 * Section 108 — Project Builder Engine: 5 sub-engines
 * Idea Generator | Architecture | Database Schema | API Designer | Deployment Roadmap
 */

const axios = require('axios');
const UserPreference = require('../models/UserPreference');
const ProjectBlueprint = require('../models/ProjectBlueprint');

async function callGemini(prompt) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'AIzaSyDummyKeyForGeminiAPI') {
    return { mock: true, message: 'Configure GEMINI_API_KEY in .env' };
  }
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`;
  const res = await axios.post(url, {
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: { temperature: 0.7, maxOutputTokens: 2048, responseMimeType: 'application/json' }
  });
  const text = res.data?.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
  try { return JSON.parse(text); }
  catch { return JSON.parse(text.replace(/```json/g, '').replace(/```/g, '').trim()); }
}

async function getUserLanguage(userId) {
  const pref = await UserPreference.findOne({ userId }).select('language').lean();
  return pref?.language || 'English';
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. PROJECT IDEA GENERATOR
// POST /api/project/idea
// ─────────────────────────────────────────────────────────────────────────────
exports.generateIdeas = async (req, res, next) => {
  try {
    const { stack, domain, experience, timeline } = req.body;
    const language = await getUserLanguage(req.user.id);

    const prompt = `Generate 5 unique project ideas for a ${experience || 'intermediate'} ${stack || 'MERN'} developer.
Domain preference: ${domain || 'any'}. Timeline: ${timeline || '1month'}.

For each idea:
1. Real problem it solves (not another todo app)
2. Unique differentiating feature vs existing apps
3. Clear target users
4. Resume impact assessment (will recruiters be impressed?)

Return ONLY valid JSON:
{
  "ideas": [
    {
      "name": "string",
      "tagline": "string (1-sentence elevator pitch)",
      "problem": "string (real problem it solves)",
      "targetUsers": "string",
      "uniqueFeature": "string (what makes it different?)",
      "difficulty": "easy|medium|hard",
      "estimatedDays": 0,
      "resumeImpact": "high|medium|low",
      "techStack": { "frontend": "", "backend": "", "database": "", "cloud": "", "extras": [] },
      "mvpFeatures": [],
      "stretchFeatures": [],
      "monetizationIdea": "string"
    }
  ]
}
Language: ${language}`;

    const result = await callGemini(prompt);
    res.status(200).json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// 2. FULL PROJECT ARCHITECTURE + FOLDER STRUCTURE
// POST /api/project/architecture
// ─────────────────────────────────────────────────────────────────────────────
exports.generateArchitecture = async (req, res, next) => {
  try {
    const { projectName, stack, features, database, blueprintId } = req.body;
    const language = await getUserLanguage(req.user.id);

    const prompt = `Generate complete project architecture for: ${projectName}
Stack: ${stack || 'MERN'}. Features: ${Array.isArray(features) ? features.join(', ') : features}. Database: ${database || 'MongoDB'}.

MERN Architecture Rules (apply if MERN):
- Backend: MVC pattern (models/controllers/routes/middleware/services)
- Frontend: Feature-based folder structure (not type-based)
  features/auth/ { components, hooks, services, store }
  features/chat/ { components, hooks, services, store }
- State: Redux Toolkit with separate slice per feature
- API: RESTful with versioning /api/v1/
- Auth: JWT access token (15min) + refresh token (7 days) pattern
- Error: global error boundary + axios interceptor pattern

Return ONLY valid JSON:
{
  "architectureDiagram": "string (text-based ASCII diagram)",
  "folderStructure": {
    "frontend": { "structure": "string (indented tree)", "keyFiles": [{ "file": "", "purpose": "" }] },
    "backend":  { "structure": "string (indented tree)", "keyFiles": [{ "file": "", "purpose": "" }] }
  },
  "techDecisions": [{ "decision": "", "reason": "", "alternatives": [] }],
  "scalabilityNotes": "string",
  "securityChecklist": [],
  "performancePatterns": [],
  "bashCommands": "string (mkdir -p commands to scaffold the folder)"
}
Language: ${language}`;

    const result = await callGemini(prompt);

    // Save to blueprint if blueprintId provided
    if (blueprintId) {
      await ProjectBlueprint.findByIdAndUpdate(blueprintId, {
        architecture: result, phase: 'database'
      });
    }

    res.status(200).json({ success: true, architecture: result });
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// 3. DATABASE SCHEMA DESIGNER
// POST /api/project/database
// ─────────────────────────────────────────────────────────────────────────────
exports.generateSchema = async (req, res, next) => {
  try {
    const { projectName, features, dbType, scale, blueprintId } = req.body;
    const language = await getUserLanguage(req.user.id);

    const mongoRules = dbType !== 'postgresql' && dbType !== 'mysql' ? `
MongoDB Rules:
- Embed if: data always fetched together, 1-to-few relationship
- Reference if: data large, 1-to-many, independently queried
- Always: timestamps: true, _id auto
- Add compound indexes for common query patterns
- Add text indexes for search fields` : '';

    const prompt = `Design complete database schema for ${projectName}.
Database: ${dbType || 'mongodb'}. Features: ${Array.isArray(features) ? features.join(', ') : features}. Expected scale: ${scale || 'medium'}.
${mongoRules}

Return ONLY valid JSON:
{
  "models": [
    {
      "name": "string",
      "fields": [{ "name": "", "type": "", "required": false, "unique": false, "index": false, "ref": null, "description": "" }],
      "indexes": [{ "fields": [], "type": "compound|single", "reason": "" }],
      "relationships": [{ "model": "", "type": "1:1|1:N|N:N", "via": "" }],
      "codeSnippet": "string (Mongoose schema OR SQL CREATE TABLE)"
    }
  ],
  "erdDescription": "string",
  "migrationOrder": [],
  "seedData": [{ "model": "", "sample": {} }],
  "scalingNotes": "string"
}
Language: ${language}`;

    const result = await callGemini(prompt);

    if (blueprintId) {
      await ProjectBlueprint.findByIdAndUpdate(blueprintId, {
        database: result, phase: 'apis'
      });
    }

    res.status(200).json({ success: true, schema: result });
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// 4. API ENDPOINTS DESIGNER
// POST /api/project/apis
// ─────────────────────────────────────────────────────────────────────────────
exports.generateApis = async (req, res, next) => {
  try {
    const { projectName, features, authType, blueprintId } = req.body;
    const language = await getUserLanguage(req.user.id);

    const prompt = `Design complete REST API for ${projectName}.
Features: ${Array.isArray(features) ? features.join(', ') : features}. Auth: ${authType || 'jwt'}.

API Design Rules:
- Use nouns not verbs: /users not /getUsers
- Use plural: /products not /product  
- Nested resources: /users/:id/orders (max 2 levels deep)
- Filtering: GET /products?category=X&sort=price&order=asc
- Pagination: { page, limit, total, hasNext }
- Versioning: /api/v1/ prefix
- Status codes: 200/201/204/400/401/403/404/409/429/500

Return ONLY valid JSON:
{
  "baseUrl": "/api/v1",
  "authEndpoints": [],
  "endpoints": [
    {
      "group": "string",
      "method": "GET|POST|PUT|PATCH|DELETE",
      "path": "string",
      "auth": false,
      "description": "string",
      "requestBody": null,
      "queryParams": [],
      "responseSuccess": { "status": 200, "body": {} },
      "responseError": [{ "status": 0, "message": "" }],
      "rateLimit": null
    }
  ],
  "middlewareNeeded": [],
  "postmanCollection": "string (JSON for Postman import)"
}
Language: ${language}`;

    const result = await callGemini(prompt);

    if (blueprintId) {
      await ProjectBlueprint.findByIdAndUpdate(blueprintId, {
        apis: result, phase: 'deployment'
      });
    }

    res.status(200).json({ success: true, apis: result });
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// 5. DEPLOYMENT ROADMAP
// POST /api/project/deployment
// ─────────────────────────────────────────────────────────────────────────────
exports.generateDeployment = async (req, res, next) => {
  try {
    const { stack, projectType, budget, blueprintId } = req.body;
    const language = await getUserLanguage(req.user.id);

    const freeStack = budget === 'free' ? `
Default Free Tier Stack for MERN:
- Frontend:  Vercel (free) — auto-deploy from GitHub
- Backend:   Render (free) — Node.js web service
- Database:  MongoDB Atlas (512MB free)
- Storage:   Cloudinary (25GB free)
- Domain:    Custom + Cloudflare (free SSL)
- CI/CD:     GitHub Actions (free for public repos)
- Monitor:   Sentry (free) + UptimeRobot (free)` : '';

    const prompt = `Create complete deployment guide for ${stack || 'MERN'} project.
Type: ${projectType || 'startup-mvp'}. Budget: ${budget || 'free'}.
${freeStack}

Return ONLY valid JSON:
{
  "phases": [
    {
      "phase": "Development|Staging|Production",
      "environment": { "frontend": "", "backend": "", "database": "", "storage": "" },
      "steps": [],
      "tools": [{ "name": "", "purpose": "", "cost": "", "setupGuide": "" }],
      "envVariables": [{ "key": "", "description": "", "example": "" }]
    }
  ],
  "cicdPipeline": {
    "tool": "string",
    "stages": [],
    "yamlSnippet": "string"
  },
  "monitoring": [{ "tool": "", "purpose": "", "free": true }],
  "securityChecklist": [],
  "costEstimate": { "monthly": "", "breakdown": {} },
  "scalingPath": "string"
}
Language: ${language}`;

    const result = await callGemini(prompt);

    if (blueprintId) {
      await ProjectBlueprint.findByIdAndUpdate(blueprintId, {
        deployment: result, phase: 'complete'
      });
    }

    res.status(200).json({ success: true, deployment: result });
  } catch (err) {
    next(err);
  }
};

// GET /api/project/blueprints — saved blueprints
exports.getBlueprints = async (req, res, next) => {
  try {
    const blueprints = await ProjectBlueprint.find({ userId: req.user.id })
      .sort({ updatedAt: -1 })
      .select('projectName stack phase createdAt updatedAt');
    res.status(200).json({ success: true, blueprints });
  } catch (err) {
    next(err);
  }
};

// POST /api/project/blueprint — create blank blueprint
exports.createBlueprint = async (req, res, next) => {
  try {
    const { projectName, stack, idea } = req.body;
    const blueprint = await ProjectBlueprint.create({
      userId: req.user.id, projectName, stack, idea, phase: 'idea'
    });
    res.status(201).json({ success: true, blueprint });
  } catch (err) {
    next(err);
  }
};
