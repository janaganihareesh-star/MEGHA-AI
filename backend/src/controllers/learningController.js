const axios = require('axios');
const LearningProgress = require('../models/LearningProgress');
const UserPreference = require('../models/UserPreference');

// Define static syllabus roadmaps for the supported subjects
const ROADMAPS = {
  java: {
    subject: 'Java',
    phases: [
      { phaseTitle: 'Phase 1: Foundations', topics: ['Syntax & Variables', 'Control Flows', 'Functions & Methods', 'Arrays'] },
      { phaseTitle: 'Phase 2: OOP Concepts', topics: ['Classes & Objects', 'Inheritance', 'Polymorphism', 'Abstraction & Interfaces'] },
      { phaseTitle: 'Phase 3: Collections & Exceptions', topics: ['Exceptions Handling', 'List & Set', 'Map & HashMap', 'Generics'] },
      { phaseTitle: 'Phase 4: Multi-threading & JDBC', topics: ['Threads & Lifecycle', 'Synchronizations', 'JDBC Connections', 'File I/O'] },
      { phaseTitle: 'Phase 5: Spring Boot Web API', topics: ['Spring Core IoC', 'REST Controllers', 'Spring Data JPA', 'Security Configuration'] }
    ]
  },
  python: {
    subject: 'Python',
    phases: [
      { phaseTitle: 'Phase 1: Basics', topics: ['Variables & Data Types', 'Conditionals & Loops', 'List & Tuple & Dict', 'Functions'] },
      { phaseTitle: 'Phase 2: Advanced Data & Files', topics: ['Modules & Packages', 'File System Operations', 'Exception Handling', 'List Comprehensions'] },
      { phaseTitle: 'Phase 3: OOP in Python', topics: ['Classes & Objects', 'Methods & Attributes', 'Inheritance & Overriding'] },
      { phaseTitle: 'Phase 4: Core Libraries', topics: ['Regex Pattern Matching', 'DateTime Operations', 'JSON Parsing', 'Requests Module'] },
      { phaseTitle: 'Phase 5: Flask & Django Frameworks', topics: ['Routing & Views', 'Models & ORM', 'APIs Serialization', 'Form Validations'] }
    ]
  },
  mern: {
    subject: 'MERN Stack',
    phases: [
      { phaseTitle: 'Phase 1: React Foundations', topics: ['React Components', 'Props & State Hooks', 'Event Handling', 'Conditional Rendering'] },
      { phaseTitle: 'Phase 2: React State & Routing', topics: ['React Router', 'Context API', 'Redux Toolkit Store', 'Side Effects & useEffect'] },
      { phaseTitle: 'Phase 3: Node.js & Express Basics', topics: ['Node Event Loop', 'HTTP Module', 'Express Routing', 'CORS & BodyParsers Middleware'] },
      { phaseTitle: 'Phase 4: MongoDB & Mongoose ORM', topics: ['Mongoose Schemas', 'CRUD Operations APIs', 'DB Indexes & Aggregations', 'JWT Authentication Middleware'] },
      { phaseTitle: 'Phase 5: Deployment & Sockets', topics: ['Socket.IO Real-time Events', 'Webpack/Vite Builds', 'Render/Heroku Deployments', 'Secure Headers with Helmet'] }
    ]
  },
  sql: {
    subject: 'SQL & Database',
    phases: [
      { phaseTitle: 'Phase 1: Relational Basics', topics: ['Relational Concepts', 'SQL Syntax & Datatypes', 'Table Creation & DDL'] },
      { phaseTitle: 'Phase 2: CRUD Queries', topics: ['SELECT Filters', 'INSERT & UPDATE Statements', 'DELETE Actions'] },
      { phaseTitle: 'Phase 3: Aggregations & Grouping', topics: ['GROUP BY & HAVING', 'SUM & AVG Count Functions', 'Order By Sorting'] },
      { phaseTitle: 'Phase 4: Advanced Joins', topics: ['Inner Joins', 'Left & Right Outer Joins', 'Subqueries & Nested filters'] },
      { phaseTitle: 'Phase 5: Triggers & StoreProcs', topics: ['Stored Procedures', 'Triggers Events', 'Database Views', 'SQL Query Index Tunning'] }
    ]
  },
  dsa: {
    subject: 'Data Structures & Algorithms',
    phases: [
      { phaseTitle: 'Phase 1: Linear Structures', topics: ['Arrays Operations', 'Singly Linked List', 'Doubly Linked List', 'Stacks & Queues'] },
      { phaseTitle: 'Phase 2: Trees', topics: ['Binary Search Tree', 'Tree Traversal DFS/BFS', 'AVL Trees balanced check'] },
      { phaseTitle: 'Phase 3: Sorting & Searching', topics: ['Binary Search Array', 'Quick Sort & Merge Sort', 'Bubble & Insertion Sort'] },
      { phaseTitle: 'Phase 4: Hash Table & Graph', topics: ['HashMap HashCollisions', 'Graph Node Adjacency', 'BFS Graph Traversal', 'DFS Graph search'] },
      { phaseTitle: 'Phase 5: Dynamic Programming', topics: ['Memoization Patterns', 'Fibonacci DP Sequence', 'Knapsack Matrix Problem'] }
    ]
  },
  cloud: {
    subject: 'Cloud Engineering',
    phases: [
      { phaseTitle: 'Phase 1: Cloud Concepts', topics: ['Cloud Architectures models', 'SaaS vs PaaS vs IaaS', 'AWS Management Console'] },
      { phaseTitle: 'Phase 2: Compute services', topics: ['EC2 Instance provisioning', 'AWS Lambda serverless', 'Auto-scaling groups'] },
      { phaseTitle: 'Phase 3: Databases & Storage', topics: ['S3 Buckets storage', 'RDS Databases', 'DynamoDB NoSQL tables'] },
      { phaseTitle: 'Phase 4: Network Routing', topics: ['VPC Subnets', 'Route53 DNS Management', 'Load Balancers configurations'] },
      { phaseTitle: 'Phase 5: IAM policies', topics: ['IAM Users and Roles', 'Secret Manager keys', 'CloudWatch log reviews'] }
    ]
  },
  devops: {
    subject: 'DevOps & CI/CD',
    phases: [
      { phaseTitle: 'Phase 1: Version Control', topics: ['Git Branching strategies', 'Pull Requests reviews', 'Git Rebase vs Merge'] },
      { phaseTitle: 'Phase 2: Docker Containers', topics: ['Dockerfiles builds', 'Docker Compose files', 'Containers volumes & ports'] },
      { phaseTitle: 'Phase 3: Orchestrations', topics: ['Kubernetes Pods configs', 'K8s Deployments yaml', 'K8s Services mapping'] },
      { phaseTitle: 'Phase 4: Jenkins Pipelines', topics: ['Jenkinsfile scripts', 'GitHub Actions setup', 'Auto deployments runs'] },
      { phaseTitle: 'Phase 5: Infrastructures as Code', topics: ['Terraform provider scripts', 'Ansible playbooks configurations', 'Prometheus monitoring charts'] }
    ]
  }
};

// GET /api/learning/roadmap/:subject
exports.getRoadmap = async (req, res, next) => {
  try {
    const subject = req.params.subject.toLowerCase();
    const roadmap = ROADMAPS[subject];

    if (!roadmap) {
      return res.status(404).json({ success: false, message: 'Roadmap for this subject not found.' });
    }

    res.status(200).json({ success: true, roadmap });
  } catch (err) {
    next(err);
  }
};

// GET /api/learning/topics/:subject
exports.getTopics = async (req, res, next) => {
  try {
    const subject = req.params.subject.toLowerCase();
    const userId = req.user.id;

    const roadmap = ROADMAPS[subject];
    if (!roadmap) {
      return res.status(404).json({ success: false, message: 'Subject not supported.' });
    }

    // Load progress logs completed by the user
    const completedProgress = await LearningProgress.find({ userId, subject: roadmap.subject });
    
    // Map topics with completion logs
    const topicStatusList = [];
    roadmap.phases.forEach(phase => {
      phase.topics.forEach(topicName => {
        const matchingLog = completedProgress.find(p => p.topic.toLowerCase() === topicName.toLowerCase());
        topicStatusList.push({
          phaseTitle: phase.phaseTitle,
          topic: topicName,
          completed: matchingLog ? matchingLog.completed : false,
          score: matchingLog ? matchingLog.score : 0,
          practiceCount: matchingLog ? matchingLog.practiceCount : 0
        });
      });
    });

    res.status(200).json({ success: true, subjectName: roadmap.subject, topics: topicStatusList });
  } catch (err) {
    next(err);
  }
};

// POST /api/learning/ask
exports.askQuestion = async (req, res, next) => {
  try {
    const { subject, topic, question } = req.body;
    const userId = req.user.id;

    if (!subject || !topic || !question) {
      return res.status(400).json({ success: false, message: 'Subject, topic, and question text are required.' });
    }

    // Load user preferred language
    const pref = await UserPreference.findOne({ userId });
    const userLanguage = pref ? pref.language : 'English';

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'AIzaSyDummyKeyForGeminiAPI') {
      return res.status(200).json({
        success: true,
        explanation: `Here is a patient explanation about "${topic}" in ${subject}:\nTo use this feature, please configure a real Gemini API Key. Happy learning!`
      });
    }

    const systemPrompt = `You are a patient, supportive, and expert ${subject} teacher.
Explain the topic "${topic}" clearly as it relates to the user's question: "${question}".
Use simple language. Provide clear code examples. Speak/respond ONLY in ${userLanguage}.`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`;

    const requestBody = {
      contents: [{ role: 'user', parts: [{ text: `Explain: ${question}` }] }],
      systemInstruction: { parts: [{ text: systemPrompt }] }
    };

    const response = await axios.post(url, requestBody);
    const explanation = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || '';

    res.status(200).json({ success: true, explanation });
  } catch (err) {
    next(err);
  }
};

// POST /api/learning/question
exports.getPracticeQuestion = async (req, res, next) => {
  try {
    const { subject, topic, difficulty = 'medium' } = req.body;

    if (!subject || !topic) {
      return res.status(400).json({ success: false, message: 'Subject and topic are required.' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'AIzaSyDummyKeyForGeminiAPI') {
      return res.status(200).json({
        success: true,
        question: `Write a simple program to demonstrate ${topic} coding patterns in ${subject}.`,
        hints: ['Remember to define standard constructors.', 'Use structured variables.']
      });
    }

    const systemPrompt = `You are a technical coding teacher.
Generate 1 practical exercise question for the topic "${topic}" in "${subject}" with difficulty "${difficulty}".
Return a JSON object exactly with:
{
  "question": "question task text here...",
  "hints": ["hint 1", "hint 2"]
}
Do not wrap in markdown tags.`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`;

    const requestBody = {
      contents: [{ role: 'user', parts: [{ text: 'Generate exercise question' }] }],
      systemInstruction: { parts: [{ text: systemPrompt }] },
      generationConfig: { temperature: 0.7, responseMimeType: 'application/json' }
    };

    const response = await axios.post(url, requestBody);
    const responseText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || '{}';

    let practice;
    try {
      practice = JSON.parse(responseText);
    } catch (err) {
      const cleaned = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      practice = JSON.parse(cleaned);
    }

    res.status(200).json({
      success: true,
      question: practice.question || `Write a simple program demonstrating ${topic}.`,
      hints: practice.hints || []
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/learning/evaluate
exports.evaluateAnswer = async (req, res, next) => {
  try {
    const { subject, topic, question, userAnswer } = req.body;
    const userId = req.user.id;

    if (!subject || !topic || !question || !userAnswer) {
      return res.status(400).json({ success: false, message: 'Subject, topic, question, and user answer are required.' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    let evaluation = { correct: true, score: 8, feedback: 'Well written answer.', correctAnswer: 'Constructed code alternative.', explanation: 'Topic analysis.' };

    if (apiKey && apiKey !== 'AIzaSyDummyKeyForGeminiAPI') {
      const systemPrompt = `You are a technical examiner evaluating a student response.
Question: "${question}"
Student Answer: "${userAnswer}"
Return a JSON object:
{
  "correct": boolean (true if score >= 7),
  "score": number (0-10),
  "feedback": "constructive feedback text...",
  "correctAnswer": "provide code snippet example...",
  "explanation": "why this answer is correct/incorrect..."
}
Do not wrap in markdown tags.`;

      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`;

      const requestBody = {
        contents: [{ role: 'user', parts: [{ text: 'Evaluate student coding answer' }] }],
        systemInstruction: { parts: [{ text: systemPrompt }] },
        generationConfig: { temperature: 0.3, responseMimeType: 'application/json' }
      };

      try {
        const response = await axios.post(url, requestBody);
        const responseText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
        try {
          evaluation = JSON.parse(responseText);
        } catch (jsonErr) {
          const cleaned = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
          evaluation = JSON.parse(cleaned);
        }
      } catch (geminiErr) {
        console.error('Failed evaluating practice answer:', geminiErr.message);
      }
    }

    // Save/Update LearningProgress
    const matchingLog = await LearningProgress.findOne({ userId, subject, topic });
    const scoreVal = evaluation.score || 6;
    const completedVal = scoreVal >= 7;

    if (matchingLog) {
      matchingLog.practiceCount += 1;
      matchingLog.lastPracticed = new Date();
      // Keep highest score
      if (scoreVal > matchingLog.score) {
        matchingLog.score = scoreVal;
      }
      if (completedVal) {
        matchingLog.completed = true;
      }
      await matchingLog.save();
    } else {
      await LearningProgress.create({
        userId,
        subject,
        topic,
        score: scoreVal,
        completed: completedVal,
        practiceCount: 1,
        lastPracticed: new Date()
      });
    }

    res.status(200).json({ success: true, evaluation });
  } catch (err) {
    next(err);
  }
};

// GET /api/learning/progress
exports.getProgress = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Fetch user progress records
    const progressList = await LearningProgress.find({ userId });

    // Calculate progress statistics grouped by subject
    const subjectStats = {};
    Object.entries(ROADMAPS).forEach(([key, value]) => {
      let totalTopics = 0;
      value.phases.forEach(p => { totalTopics += p.topics.length; });

      const completedCount = progressList.filter(p => 
        p.subject.toLowerCase() === value.subject.toLowerCase() && p.completed
      ).length;

      const pct = totalTopics > 0 ? Math.round((completedCount / totalTopics) * 100) : 0;

      subjectStats[value.subject] = {
        completedTopics: completedCount,
        totalTopics,
        percentage: pct
      };
    });

    res.status(200).json({ success: true, progress: subjectStats });
  } catch (err) {
    next(err);
  }
};

// POST /api/learning/chat
exports.chatTutor = async (req, res, next) => {
  try {
    const { message, history = [] } = req.body;
    const userId = req.user.id;

    if (!message) {
      return res.status(400).json({ success: false, message: 'Message is required.' });
    }

    // Load user's learning preferences
    const pref = await UserPreference.findOne({ userId });
    const language = pref?.language || 'English';
    const educationLevel = pref?.educationLevel || 'btech';
    const learningStyle = pref?.learningStyle || 'practical';
    const learningSpeed = pref?.learningSpeed || 'medium';
    const teluguDialect = pref?.teluguDialect || 'standard';
    const learningSubjects = pref?.learningSubjects?.join(', ') || 'General subjects';

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'AIzaSyDummyKeyForGeminiAPI') {
      return res.status(200).json({
        success: true,
        reply: `Hello ra! I am your AI Learning Companion. I see your education level is ${educationLevel} and learning style is ${learningStyle}. Let's discuss! (Note: Please configure a real GEMINI_API_KEY for actual explanations).`
      });
    }

    // Build personalized system instructions
    const systemPrompt = `You are a patient, encouraging, and expert AI Learning Mentor, Tutor, and Career Guide.
Your student profile:
- Education Level: ${educationLevel}
- Learning Style: ${learningStyle} (explain visual style with ASCII/diagrams, practical style with coding examples, theory style with structured concepts)
- Learning Speed: ${learningSpeed}
- Selected Subjects: ${learningSubjects}
- Output Language: ${language}

CORE RULES:
1. Explain subjects and solve doubts interactively fitting their academic level (${educationLevel}).
2. Focus on natural teaching style, not static roadmaps or course cards.
3. Respond ONLY in the requested language: ${language}.
4. IMPORTANT: If the language is Telugu, adapt your tone naturally to the Telugu dialect: "${teluguDialect}". E.g., if Telangana, use Telangana words and tone; if Rayalaseema/Coastal/Godavari/Chittoor, speak accordingly.
5. Keep explanations clear, engaging, and friendly.`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`;

    // Map history to Gemini format
    // Add current user message at the end
    const contents = [...history, { role: 'user', parts: [{ text: message }] }];

    const requestBody = {
      contents,
      systemInstruction: {
        parts: [{ text: systemPrompt }]
      },
      generationConfig: {
        temperature: 0.8,
        maxOutputTokens: 1024
      }
    };

    const response = await axios.post(url, requestBody);
    const reply = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || '';

    res.status(200).json({ success: true, reply });
  } catch (err) {
    next(err);
  }
};