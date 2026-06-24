const express = require('express');
const http = require('http');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();


// ─────────────────────────────────────────────────────────────────────────────
const connectDB = require('./config/db');
const { verifySMTP } = require('./config/mail');
const socketConfig = require('./config/socket');
const { generalLimiter } = require('./middleware/rateLimiter');
const errorHandler = require('./middleware/errorHandler');

const authRoutes = require('./routes/auth');
const chatRoutes = require('./routes/chat');
const voiceRoutes = require('./routes/voice');
const memoryRoutes = require('./routes/memory');
const goalRoutes = require('./routes/goals');
const achievementRoutes = require('./routes/achievements');
const resumeRoutes = require('./routes/resume');
const interviewRoutes = require('./routes/interview');
const learningRoutes = require('./routes/learning');
const notificationRoutes = require('./routes/notifications');
const profileRoutes = require('./routes/profile');
const relationshipRoutes = require('./routes/relationship');
const moodRoutes = require('./routes/mood');
const dreamboardRoutes = require('./routes/dreamboard');
const datesRoutes = require('./routes/dates');
const weeklyReflectionRoutes = require('./routes/weeklyReflection');
const summaryRoutes = require('./routes/summary');
const settingsRoutes = require('./routes/settings');
const timelineRoutes = require('./routes/timeline');
const careerRoutes = require('./routes/career');
const projectRoutes = require('./routes/project');
const productivityRoutes = require('./routes/productivity');
const searchRoutes = require('./routes/search');
const pushRoutes = require('./routes/push');

// Engines 35-46
const documentRoutes    = require('./routes/document');
const codeRoutes        = require('./routes/code');
const translateRoutes   = require('./routes/translate');
const promptsRoutes     = require('./routes/prompts');
const contentRoutes     = require('./routes/content');
const academicRoutes    = require('./routes/academic');
const calculateRoutes   = require('./routes/calculate');
const draftRoutes       = require('./routes/draft');
const businessRoutes    = require('./routes/business');
const ttsRoutes         = require('./routes/tts');

const app = express();
const server = http.createServer(app);

// Database and SMTP connections are validated in the startServer function at the bottom

// Initialize Socket.IO
socketConfig.init(server);

// Start scheduled wellness cron alerts
const { initCronJobs } = require('./services/notificationService');
initCronJobs();

// Phase 3: Background Proactive Agents (AI-driven check-ins)
const { startProactiveAgents } = require('./services/cronService');
startProactiveAgents();

// Security & Logging Middleware
app.use(helmet({
  contentSecurityPolicy: false // Disabled for ease of connection during development
}));

app.use(cors({
  origin: [
    process.env.FRONTEND_URL, 
    'http://localhost:5173',
    'https://megha-ai-3mru.vercel.app'
  ].filter(Boolean),
  credentials: true
}));

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate Limiting disabled by user request
// app.use(generalLimiter);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/voice', voiceRoutes);
app.use('/api/memory', memoryRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/achievements', achievementRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/interview', interviewRoutes);
app.use('/api/learning', learningRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/relationship', relationshipRoutes);
app.use('/api/mood', moodRoutes);
app.use('/api/dreamboard', dreamboardRoutes);
app.use('/api/dates', datesRoutes);
app.use('/api/weekly-reflection', weeklyReflectionRoutes);
app.use('/api/summary', summaryRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/timeline', timelineRoutes);
app.use('/api/career', careerRoutes);
app.use('/api/project', projectRoutes);
app.use('/api/productivity', productivityRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/push', pushRoutes);
app.use('/api/tts', ttsRoutes);

// Engines 35-46
app.use('/api/document',  documentRoutes);
app.use('/api/code',      codeRoutes);
app.use('/api/translate', translateRoutes);
app.use('/api/prompts',   promptsRoutes);
app.use('/api/content',   contentRoutes);
app.use('/api/academic',  academicRoutes);
app.use('/api/calculate', calculateRoutes);
app.use('/api/draft',     draftRoutes);
app.use('/api/business',  businessRoutes);

app.get('/', (req, res) => {
  res.send('<h2>Megha AI Backend API is running successfully.</h2><p>Please use the frontend URL (e.g., http://localhost:5173/) to access the application interface.</p>');
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', time: new Date() });
});

// Global Error Handler
app.use(errorHandler);

const { initScheduler } = require('./services/schedulerService');

const startServer = async () => {
  try {
    await connectDB();
    await verifySMTP();
    
    // Initialize Workflow OS Scheduler
    await initScheduler();

    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => {
      console.log(`Server Listening On Port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err.message);
    process.exit(1);
  }
};

startServer(); // Trigger clean restart
// trigger restart
