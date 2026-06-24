const axios = require('axios');
const InterviewSession = require('../models/InterviewSession');
const ResumeUpload = require('../models/ResumeUpload');

// POST /api/interview/start
exports.startInterview = async (req, res, next) => {
  try {
    const { type, role, resumeId } = req.body;
    const userId = req.user.id;

    if (!type || !role) {
      return res.status(400).json({ success: false, message: 'Interview type and target role are required.' });
    }

    let resumeText = '';
    if (type === 'Resume-based' && resumeId) {
      const resume = await ResumeUpload.findOne({ _id: resumeId, userId });
      if (resume) {
        resumeText = resume.extractedText;
      }
    }

    const apiKey = process.env.GEMINI_API_KEY;
    let questions = [];

    if (!apiKey || apiKey === 'AIzaSyDummyKeyForGeminiAPI') {
      // Return mock questions list
      questions = [
        `What experience do you have with the ${role} position?`,
        `Can you describe a challenging technical problem you solved while working on ${role}?`,
        `How do you keep updated with technologies relevant to ${role}?`,
        `How do you handle team disagreements regarding code layouts or tools?`,
        `Explain your experience working with REST APIs and databases.`,
        `Why do you want to join our organization as a ${role}?`,
        `Where do you see yourself in the next 5 years in your career?`,
        `What are your biggest technical and non-technical strengths?`,
        `How do you manage deadlines when multiple projects are assigned?`,
        `Do you have any questions for us?`
      ];
    } else {
      let promptText = `Generate exactly 10 distinct interview questions for a "${type}" interview for the role of "${role}".`;
      if (resumeText) {
        promptText += ` Base the questions heavily on this candidate resume text:\n${resumeText}`;
      }
      
      const systemPrompt = `You are a professional hiring manager. Generate exactly 10 interview questions as requested.
Return ONLY JSON array of strings: ["question 1?", "question 2?", ..., "question 10?"]. Do not wrap in markdown code blocks.`;

      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`;

      const requestBody = {
        contents: [{ role: 'user', parts: [{ text: promptText }] }],
        systemInstruction: { parts: [{ text: systemPrompt }] },
        generationConfig: { temperature: 0.7, responseMimeType: 'application/json' }
      };

      try {
        const response = await axios.post(url, requestBody);
        const responseText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || '[]';
        try {
          questions = JSON.parse(responseText);
        } catch (err) {
          const cleaned = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
          questions = JSON.parse(cleaned);
        }
      } catch (geminiErr) {
        console.error('Failed to generate interview questions, using fallback list:', geminiErr.message);
        questions = [
          'Tell me about yourself.',
          `Why are you applying for the ${role} position?`,
          'What is your experience with software design patterns?',
          'How do you manage state in React?',
          'What are MongoDB transactions?',
          'Explain the difference between synchronous and asynchronous calls in Javascript.',
          'How do you handle routing in Express?',
          'How do you handle pressure and tight deadlines?',
          'Describe a time you failed and what you learned.',
          'Do you have any questions about this role?'
        ];
      }
    }

    // Save session
    const session = await InterviewSession.create({
      userId,
      role,
      type,
      resumeId,
      questions,
      currentQuestionIndex: 0
    });

    res.status(201).json({
      success: true,
      sessionId: session._id,
      firstQuestion: questions[0],
      totalQuestions: questions.length
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/interview/answer
exports.answerQuestion = async (req, res, next) => {
  try {
    const { sessionId, questionIndex, answer } = req.body;
    const userId = req.user.id;

    if (!sessionId || questionIndex === undefined || !answer) {
      return res.status(400).json({ success: false, message: 'Session ID, question index, and user answer are required.' });
    }

    const session = await InterviewSession.findOne({ _id: sessionId, userId });
    if (!session) {
      return res.status(404).json({ success: false, message: 'Interview session not found.' });
    }

    if (questionIndex !== session.currentQuestionIndex) {
      return res.status(400).json({
        success: false,
        message: `Mismatch in question index. Active question is Q${session.currentQuestionIndex + 1}.`
      });
    }

    const question = session.questions[questionIndex];
    const apiKey = process.env.GEMINI_API_KEY;
    let evaluation = { score: 7, feedback: 'Good start. Try adding more tech details.', betterAnswer: 'Structured code example here.' };

    if (apiKey && apiKey !== 'AIzaSyDummyKeyForGeminiAPI') {
      const systemPrompt = `You are a senior technical interviewer.
Evaluate the candidate's answer to the interview question.
Question: "${question}"
Candidate Answer: "${answer}"
Provide:
1. Score from 0 to 10 (as integer).
2. Constructive feedback.
3. A better, more structured alternative answer.
Return ONLY JSON response structure:
{
  "score": number,
  "feedback": "...",
  "betterAnswer": "..."
}
Do not wrap in markdown tags.`;

      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`;

      const requestBody = {
        contents: [{ role: 'user', parts: [{ text: 'Evaluate response' }] }],
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
        console.error('Failed to evaluate answer via Gemini:', geminiErr.message);
      }
    }

    // Save answer and evaluation details
    session.answers.push(answer);
    session.evaluations.push({
      score: evaluation.score || 5,
      feedback: evaluation.feedback || 'Answer logged.',
      betterAnswer: evaluation.betterAnswer || 'Consider adding more structured details.'
    });

    const isLastQuestion = questionIndex === session.questions.length - 1;

    if (isLastQuestion) {
      session.completed = true;
    } else {
      session.currentQuestionIndex += 1;
    }

    await session.save();

    res.status(200).json({
      success: true,
      evaluation,
      completed: session.completed,
      nextQuestion: isLastQuestion ? null : session.questions[session.currentQuestionIndex],
      nextQuestionIndex: isLastQuestion ? null : session.currentQuestionIndex
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/interview/result/:sessionId
exports.getResult = async (req, res, next) => {
  try {
    const sessionId = req.params.sessionId;
    const userId = req.user.id;

    const session = await InterviewSession.findOne({ _id: sessionId, userId });
    if (!session) {
      return res.status(404).json({ success: false, message: 'Interview session not found.' });
    }

    // Calculate average score
    const scores = session.evaluations.map(e => e.score);
    const sum = scores.reduce((a, b) => a + b, 0);
    const averageScore = scores.length > 0 ? parseFloat((sum / scores.length).toFixed(1)) : 0;

    let aiSummary = 'Completed mock interview.';
    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey && apiKey !== 'AIzaSyDummyKeyForGeminiAPI' && session.evaluations.length > 0) {
      const summaryPrompt = `Evaluate the candidate's average score of ${averageScore}/10 across ${scores.length} interview questions.
Questions and feedback summary:
${session.questions.map((q, i) => `Q: ${q}\nFeedback: ${session.evaluations[i]?.feedback}`).join('\n')}
Provide a concise, 3-sentence summary of candidate strengths and key focus areas for improvement.
Return ONLY plain text.`;

      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`;

      const requestBody = {
        contents: [{ role: 'user', parts: [{ text: 'Summarize candidate performance.' }] }],
        systemInstruction: { parts: [{ text: summaryPrompt }] }
      };

      try {
        const response = await axios.post(url, requestBody);
        aiSummary = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || aiSummary;
      } catch (geminiErr) {
        console.error('Failed to get interview summary text:', geminiErr.message);
      }
    }

    res.status(200).json({
      success: true,
      role: session.role,
      type: session.type,
      averageScore,
      summary: aiSummary,
      questions: session.questions,
      answers: session.answers,
      evaluations: session.evaluations,
      completed: session.completed
    });
  } catch (err) {
    next(err);
  }
};