/**
 * knowledgeService.js
 * Domain detection for modular prompt loading.
 * Covers all domains from the Master Prompt System Layer 9 and Version 7.0 Intelligence Engines.
 */

const nicheRegistry = require('./nicheRegistry');

const detectDomains = async (message) => {
  if (!message) return [];
  const text = message.toLowerCase();

  const domains = [
    // Specialized Intelligence Engines (Added V7.0)
    { name: 'movies', keywords: ['movie', 'show', 'series', 'cinema', 'film', 'director', 'actor', 'actress', 'cast', 'screenplay', 'netflix', 'ott', 'prime video', 'disney', 'jiohotstar', 'hulu', 'apple tv', 'hbo', 'theatre', 'theater', 'movie review', 'film review', 'show review', 'series review', 'rating', 'bollywood', 'hollywood', 'tollywood', 'kollywood', 'sandalwood', 'mollywood', 'korean drama', 'kdrama', 'anime', 'animation', 'documentary', 'documentaries', 'web series', 'cinematography', 'script', 'screenwriting', 'storytelling'] },
    { name: 'travel', keywords: ['travel', 'hotel', 'flight', 'railway', 'booking', 'bus', 'irctc', 'taxi', 'cab', 'mobility', 'itinerary', 'vacation', 'trip', 'tourism', 'tourist', 'maritime', 'tatkal', 'pnr', 'boarding'] },
    { name: 'defense', keywords: ['military', 'defense', 'army', 'navy', 'air force', 'coast guard', 'warfare', 'weapon', 'fighter jet', 'tank', 'submarine', 'missile', 'drone', 'radar', 'national security', 'geopolitics', 'deterrence', 'drdo', 'hal', 'bel', 'lockheed martin', 'boeing defense', 'northrop grumman', 'military rank', 'soldier', 'pentagon', 'nuclear deterrence', 'aircraft carrier', 'destroyer', 'frigate'] },
    { name: 'civic', keywords: ['aadhaar', 'pan card', 'passport', 'voter id', 'driving license', 'birth certificate', 'death certificate', 'income certificate', 'caste certificate', 'residence certificate', 'government scheme', 'welfare scheme', 'pension scheme', 'municipal service', 'public grievance', 'legal rights', 'fundamental rights', 'consumer rights', 'tax basics', 'income tax filing', 'gst filing', 'regulatory permit', 'business registration'] },
    { name: 'academic', keywords: ['research paper', 'journal article', 'conference paper', 'white paper', 'literature review', 'academic thesis', 'dissertation', 'citation style', 'apa citation', 'ieee citation', 'mla citation', 'quantitative research', 'qualitative research', 'research methodology', 'scientific discovery', 'peer review', 'academic plagiarism', 'paper', 'thesis', 'dissertation', 'journal', 'manuscript', 'funding', 'startup'] },
    { name: 'live_news', keywords: ['breaking news', 'current events', 'latest news', 'today news', 'sports live score', 'stock price', 'market trend', 'crypto price', 'weather forecast', 'weather alert', 'government policy update', 'recent development', 'news alert'] },
    { name: 'shopping', keywords: ['best phone', 'best laptop', 'buy guide', 'product comparison', 'best price', 'smartwatch', 'tv', 'appliance', 'gaming pc', 'gaming laptop', 'laptop', 'phone', 'mobile', 'gadget', 'gift ideas', 'seasonal discounts', 'shopping offer', 'flipkart', 'amazon', 'recommendation', 'deals', 'buy', 'product', 'pricing', 'discount'] },
    { name: 'civilization', keywords: ['human evolution', 'indus valley', 'ancient egypt', 'roman empire', 'greek mythology', 'anthropology', 'historical migration', 'tribal culture', 'folklore', 'oral tradition', 'dialect translation', 'grammar tutorial', 'culture', 'civilization', 'history', 'linguist', 'dialect'] },
    { name: 'healthcare', keywords: ['symptom warning', 'medical test result', 'blood report', 'doctor specialist', 'preventive vaccine', 'nutrition tips', 'weight loss plan', 'mental health wellness', 'burnout recovery', 'medication side effect', 'hospital navigation', 'symptom', 'medical', 'doctor', 'wellness', 'stroke', 'diabetes', 'disease', 'hospital', 'pain', 'anatomy', 'health', 'clinic', 'specialist'] },
    { name: 'cybersecurity', keywords: ['phishing protection', 'ransomware attack', 'strong password', 'two-factor authentication', 'mfa setup', 'privacy settings', 'social media safety', 'device hardening', 'network vpn', 'data encryption', 'incident response', 'phishing', 'ransomware', 'password', 'mfa', '2fa', 'authentication', 'privacy', 'security', 'hacking', 'safe', 'vpn', 'encryption', 'breach'] },
    { name: 'data_analytics', keywords: ['data analytics', 'business intelligence', 'power bi', 'tableau dashboard', 'excel formula', 'sql query', 'data visualization', 'kpi reporting', 'sales forecasting', 'market research analysis', 'analytics', 'tableau', 'excel', 'dashboard', 'kpi', 'sales', 'forecasting', 'metrics', 'chart', 'visualization'] },
    { name: 'finance', keywords: ['finance', 'stock', 'mutual fund', 'shares', 'trading', 'crypto', 'bitcoin', 'nifty', 'sensex', 'portfolio', 'investment', 'loan', 'tax', 'itr', 'market trend', 'stocks', 'financial', 'funding', 'startup'] },
    { name: 'business', keywords: ['business', 'swot', 'competitor analysis', 'revenue model', 'risk analysis', 'growth plan', 'startup', 'market analysis', 'pitch deck', 'business model', 'strategy', 'venture'] },
    { name: 'code_review', keywords: ['code review', 'optimization', 'best practices', 'refactor', 'clean code', 'code smells', 'review code', 'complexity', 'refactoring', 'dry principle', 'solid principles', 'design patterns', 'review it', 'review this', 'review my code', 'clean up', 'cleanup', 'debug', 'optimize'] },
    { name: 'ats_resume', keywords: ['resume', 'ats', 'cv', 'job description', 'jd match', 'ats score', 'resume review', 'ats friendly', 'curriculum vitae'] },
    { name: 'utility_calculator', keywords: ['calculator', 'emi calculator', 'sip calculator', 'currency converter', 'age calculator', 'percentage calculator', 'calculate emi', 'calculate sip', 'conversion', 'currency conversion'] },
    { name: 'project_builder', keywords: ['project architecture', 'db schema', 'database schema', 'api endpoints', 'api route', 'frontend layout', 'backend setup', 'deployment guide', 'architecture design', 'system flow', 'api documentation', 'project structure', 'folders setup'] },
    { name: 'career_intelligence', keywords: ['career roadmap', 'skill gap', 'skill gap analysis', 'salary range', 'salary scale', 'market demand analysis', 'future roles', 'demand prediction', 'career switch', 'career advice', 'career guidance', 'resume gap', 'career opportunities', 'funding', 'startup'] },
    { name: 'document_intelligence', keywords: ['pdf analysis', 'pdf parsing', 'ppt analysis', 'excel insights', 'image ocr', 'resume parsing', 'extract text from pdf', 'read spreadsheet', 'parse resume', 'document summary', 'ocr text', 'read excel', 'analyze ppt', 'excel', 'spreadsheet', 'pdf', 'ppt', 'presentation', 'document', 'ocr', 'parse', 'slides', 'docx'] },
    { name: 'productivity', keywords: ['pomodoro', 'gtd', 'getting things done', 'smart goals', 'okrs', 'eisenhower matrix', 'time blocking', 'productivity tips', 'goal setting', 'prioritization', 'focus technique'] },
    { name: 'human_skills', keywords: ['leadership', 'communication skills', 'negotiation', 'networking', 'soft skills', 'public speaking', 'persuasion', 'conflict resolution', 'emotional intelligence', 'active listening'] },
    { name: 'parenting', keywords: ['parenting', 'child development', 'schooling', 'toddler behavior', 'babies health', 'raising children', 'parenting tips', 'discipline child', 'motherhood', 'fatherhood', 'child safety'] },
    { name: 'pets', keywords: ['dogs', 'cats', 'veterinary', 'pet health', 'dog behavior', 'cat behavior', 'pet feeding', 'puppies', 'kittens', 'pets', 'animal training'] },
    { name: 'real_estate', keywords: ['real estate', 'property buying', 'property valuation', 'lease agreement', 'mortgage rate', 'buying home', 'rent house', 'tenancy', 'property investment', 'housing market'] },
    { name: 'automobile', keywords: ['electric vehicles', 'ev comparison', 'car models', 'bike comparison', 'engine features', 'hybrid cars', 'automobile', 'car reviews', 'motorcycle', 'engine capacity'] },
    { name: 'geography', keywords: ['topography', 'maps', 'demographics', 'climate zone', 'continents', 'rivers', 'mountains', 'landforms', 'geography', 'earth crust'] },
    { name: 'sports', keywords: ['cricket', 'football', 'sports analytics', 'fitness rules', 'athlete training', 'match rules', 'game tactics', 'olympics', 'world cup', 'basketball', 'badminton'] },
    { name: 'religion_spirituality', keywords: ['theology', 'meditation', 'sacred texts', 'religious rituals', 'spirituality', 'hinduism', 'islam', 'christianity', 'buddhism philosophy', 'spiritual growth', 'karma', 'dharma', 'bhakti', 'sufism'] },
    { name: 'environment_sustainability', keywords: ['climate change', 'recycling', 'solar energy', 'carbon footprint', 'wind energy', 'biodiversity', 'pollution', 'conservation', 'sustainability', 'global warming'] },
    { name: 'space_astronomy', keywords: ['astrophysics', 'rocket propulsion', 'galaxy', 'astronomy', 'space exploration', 'planets', 'stars', 'nasa', 'isro', 'spacex', 'cosmology', 'mars mission'] },

    // Programming Languages
    { name: 'java', keywords: ['java', 'jdk', 'jvm', 'spring boot', 'hibernate', 'maven', 'gradle', 'servlet', 'jdbc'] },
    { name: 'python', keywords: ['python', 'django', 'flask', 'fastapi', 'pandas', 'numpy', 'matplotlib', 'scikit', 'pytorch', 'tensorflow', 'pip'] },
    { name: 'javascript', keywords: ['javascript', 'typescript', 'js', 'ts', 'es6', 'es2015', 'promise', 'async await', 'closure', 'prototype'] },
    { name: 'c_cpp', keywords: ['c programming', 'c++', 'cpp', 'pointer', 'malloc', 'struct', 'preprocessor', 'header file', '.h file'] },

    // Web / Frontend
    { name: 'react', keywords: ['react', 'jsx', 'useState', 'useEffect', 'useContext', 'redux', 'component', 'hooks', 'props', 'virtual dom'] },
    { name: 'html_css', keywords: ['html', 'css', 'flexbox', 'grid', 'tailwind', 'bootstrap', 'scss', 'sass', 'responsive', 'media query'] },

    // Backend / Full Stack
    { name: 'mern', keywords: ['mern', 'express', 'node.js', 'nodejs', 'mongoose', 'rest api', 'middleware', 'cors', 'jwt', 'bcrypt'] },
    { name: 'mongodb', keywords: ['mongodb', 'mongo', 'atlas', 'nosql', 'collection', 'document', 'aggregation', 'pipeline', 'compass'] },
    { name: 'sql', keywords: ['sql', 'mysql', 'postgresql', 'postgres', 'sqlite', 'oracle', 'join', 'query', 'index', 'foreign key', 'primary key', 'normalization'] },

    // DSA & CS Fundamentals
    { name: 'dsa', keywords: ['dsa', 'data structure', 'algorithm', 'binary tree', 'graph', 'sorting', 'searching', 'dynamic programming', 'recursion', 'stack', 'queue', 'linked list', 'array', 'hash', 'bfs', 'dfs', 'complexity', 'big o'] },

    // Cloud & DevOps
    { name: 'cloud_devops', keywords: ['aws', 'azure', 'gcp', 'cloud', 's3', 'ec2', 'lambda', 'docker', 'kubernetes', 'k8s', 'devops', 'cicd', 'ci/cd', 'jenkins', 'github actions', 'terraform', 'ansible', 'nginx', 'linux'] },

    // AI/ML
    { name: 'ai_ml', keywords: ['machine learning', 'deep learning', 'neural network', 'ai', 'ml', 'nlp', 'computer vision', 'model training', 'overfitting', 'regression', 'classification', 'clustering', 'transformer', 'llm'] },

    // System Design
    { name: 'system_design', keywords: ['system design', 'scalability', 'load balancer', 'caching', 'microservice', 'monolith', 'distributed', 'cap theorem', 'sharding', 'replication', 'message queue', 'kafka', 'redis'] },

    // Exam Prep
    { name: 'upsc', keywords: ['upsc', 'ias', 'ips', 'civil service', 'polity', 'gs1', 'gs2', 'gs3', 'prelims', 'mains', 'essay', 'current affairs'] },
    { name: 'ssc', keywords: ['ssc', 'cgl', 'chsl', 'gd constable', 'mts', 'ssc exam', 'tier 1', 'tier 2'] },
    { name: 'banking', keywords: ['ibps', 'sbi', 'rbi', 'banking exam', 'po exam', 'clerk exam', 'rrb', 'nabard', 'quantitative aptitude', 'reasoning'] },
    { name: 'tspsc_appsc', keywords: ['tspsc', 'appsc', 'group 1', 'group 2', 'group 4', 'dsc', 'state exam', 'panchayat secretary', 'si exam'] },
    { name: 'eamcet_jee_neet', keywords: ['eamcet', 'jee', 'neet', 'bitsat', 'viteee', 'mhtcet', 'kcet', 'mpc', 'bipc', 'entrance exam'] },
    { name: 'gate', keywords: ['gate', 'gate exam', 'gate cse', 'gate ece', 'gate ee', 'gate preparation'] },

    // Academic Subjects
    { name: 'mathematics', keywords: ['maths', 'mathematics', 'calculus', 'algebra', 'geometry', 'trigonometry', 'statistics', 'probability', 'matrices', 'integration', 'differentiation'] },
    { name: 'physics', keywords: ['physics', 'mechanics', 'thermodynamics', 'electromagnetism', 'optics', 'quantum', 'relativity', 'waves', 'newton'] },
    { name: 'chemistry', keywords: ['chemistry', 'organic', 'inorganic', 'physical chemistry', 'periodic table', 'bonding', 'reaction', 'mole', 'titration'] },
    { name: 'biology', keywords: ['biology', 'cell', 'genetics', 'dna', 'rna', 'evolution', 'ecology', 'botany', 'zoology', 'physiology', 'anatomy', 'photosynthesis'] },

    // Humanities & Social Sciences
    { name: 'history', keywords: ['history', 'ancient india', 'medieval', 'british india', 'freedom struggle', 'world war', 'mughal', 'maratha', 'maurya', 'gupta'] },
    { name: 'geography', keywords: ['geography', 'climate', 'landforms', 'rivers', 'mountains', 'ocean', 'environment', 'ecosystem', 'latitude', 'longitude', 'monsoon'] },
    { name: 'economics', keywords: ['economics', 'gdp', 'inflation', 'monetary policy', 'fiscal policy', 'demand', 'supply', 'microeconomics', 'macroeconomics', 'rbi policy'] },
    { name: 'polity', keywords: ['polity', 'constitution', 'fundamental rights', 'directive principles', 'parliament', 'judiciary', 'preamble', 'amendment', 'article 370', 'lok sabha'] },
    { name: 'psychology', keywords: ['psychology', 'behavior', 'cognition', 'emotion', 'memory', 'personality', 'motivation', 'freud', 'piaget', 'maslow', 'therapy'] },

    // Hindu Mythology
    { name: 'mythology', keywords: ['ramayana', 'mahabharata', 'bhagavad gita', 'gita', 'krishna', 'rama', 'shiva', 'vishnu', 'brahma', 'hanuman', 'arjuna', 'purana', 'upanishad', 'vedas', 'mythology', 'hindu', 'deity', 'avatar', 'dharma', 'karma'] },

    // Philosophy & Spirituality
    { name: 'philosophy', keywords: ['buddhism', 'jainism', 'sikhism', 'philosophy', 'stoicism', 'existentialism', 'ethics', 'metaphysics', 'vedanta', 'advaita'] },

    // Current Affairs & General Knowledge
    { name: 'current_affairs', keywords: ['current affairs', 'news', 'latest', 'recent', 'today', 'government scheme', 'budget', 'summit', 'award', 'g20', 'g7', 'un'] }
  ];

  const matched = [];
  const processedNames = new Set();

  // 1. Process Niche Registry first (custom overrides and new domains)
  for (const name of Object.keys(nicheRegistry)) {
    const entry = nicheRegistry[name];
    processedNames.add(name);
    
    const flatKeywords = Array.isArray(entry.keywords) ? entry.keywords.flat(Infinity) : [];
    
    for (const kw of flatKeywords) {
      if (typeof kw !== 'string') continue;
      const escapedKw = kw.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      const regex = new RegExp('\\b' + escapedKw + '\\b', 'i');
      if (regex.test(text)) {
        matched.push(name);
        break; // Stop checking keywords for this domain once a match is found
      }
    }
  }

  // 2. Process baseline domains
  for (const domain of domains) {
    if (processedNames.has(domain.name)) continue;
    
    const flatKeywords = Array.isArray(domain.keywords) ? domain.keywords.flat(Infinity) : [];
    
    for (const kw of flatKeywords) {
      if (typeof kw !== 'string') continue;
      const escapedKw = kw.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      const regex = new RegExp('\\b' + escapedKw + '\\b', 'i');
      if (regex.test(text)) {
        matched.push(domain.name);
        break; // Stop checking keywords for this domain once a match is found
      }
    }
  }

  return matched;
};

const detectDomain = async (message) => {
  const matched = await detectDomains(message);
  return matched.length > 0 ? matched[0] : null;
};

/**
 * Get domain display name for UI
 */
const getDomainLabel = (domain) => {
  if (nicheRegistry[domain]) {
    return nicheRegistry[domain].label;
  }

  const labels = {
    // V7.0 Intelligence Engines
    movies: 'Movies & Entertainment',
    travel: 'Travel Ecosystem',
    defense: 'Defense & Military',
    civic: 'Government, Legal & Civic',
    academic: 'Research & Academics',
    live_news: 'Live Web & News',
    shopping: 'Shopping & Products',
    civilization: 'Language, Culture & Civilization',
    healthcare: 'Healthcare & Medical',
    cybersecurity: 'Cybersecurity & Privacy',
    data_analytics: 'Data Analytics & BI',
    finance: 'Finance & Stock Market',
    business: 'Business Strategy & Analysis',
    code_review: 'Coding Review Framework',
    ats_resume: 'Resume ATS Engine',
    utility_calculator: 'Utility & Mathematics Calculator',
    project_builder: 'Project Builder Engine',
    career_intelligence: 'Career Intelligence Engine',
    document_intelligence: 'Document Intelligence Engine',
    productivity: 'Productivity Engine',
    human_skills: 'Human Skills Engine',
    parenting: 'Parenting Engine',
    pets: 'Pets Engine',
    real_estate: 'Real Estate Engine',
    automobile: 'Automobile Engine',
    geography: 'Geography Engine',
    sports: 'Sports Intelligence Engine',
    religion_spirituality: 'Religion & Spiritual Engine',
    environment_sustainability: 'Environment & Sustainability Engine',
    space_astronomy: 'Space & Astronomy Engine',

    // Programming
    java: 'Java Programming',
    python: 'Python Programming',
    javascript: 'JavaScript',
    c_cpp: 'C/C++ Programming',
    react: 'React.js',
    html_css: 'HTML & CSS',
    mern: 'MERN Stack',
    mongodb: 'MongoDB',
    sql: 'SQL & Databases',
    dsa: 'Data Structures & Algorithms',
    cloud_devops: 'Cloud & DevOps',
    ai_ml: 'AI & Machine Learning',
    system_design: 'System Design',
    upsc: 'UPSC Preparation',
    ssc: 'SSC Preparation',
    banking: 'Banking Exams',
    tspsc_appsc: 'TSPSC/APPSC',
    eamcet_jee_neet: 'EAMCET/JEE/NEET',
    gate: 'GATE Preparation',
    mathematics: 'Mathematics',
    physics: 'Physics',
    chemistry: 'Chemistry',
    biology: 'Biology',
    history: 'History',
    geography: 'Geography',
    economics: 'Economics',
    polity: 'Polity & Constitution',
    psychology: 'Psychology',
    mythology: 'Hindu Mythology',
    philosophy: 'Philosophy',
    current_affairs: 'Current Affairs'
  };
  return labels[domain] || 'General Knowledge';
};

module.exports = {
  detectDomain,
  detectDomains,
  getDomainLabel
};
