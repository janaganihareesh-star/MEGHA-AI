import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import axios from 'axios';
import {
  Briefcase,
  Play,
  ArrowRight,
  CheckCircle,
  HelpCircle,
  Award,
  Loader2,
  ChevronDown,
  ChevronUp,
  FileText,
  UserCheck,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function MockInterviewPage() {
  const user = useSelector((state) => state.auth.user);
  const userName = user ? user.fullName.split(' ')[0] : 'Friend';
  const token = useSelector((state) => state.auth.token);

  // States
  const [step, setStep] = useState('setup'); // 'setup' | 'active' | 'evaluating' | 'result'
  const [interviewType, setInterviewType] = useState('Technical'); // 'HR' | 'Technical' | 'Resume-based'
  const [targetRole, setTargetRole] = useState('Software Engineer');
  const [resumes, setResumes] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState('');
  
  // Active session details
  const [sessionId, setSessionId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [totalQuestions, setTotalQuestions] = useState(10);
  
  // Live question feedback
  const [lastQuestionFeedback, setLastQuestionFeedback] = useState(null);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [isStartLoading, setIsStartLoading] = useState(false);

  // Final summary details
  const [finalResult, setFinalResult] = useState(null);
  const [isLoadingResult, setIsLoadingResult] = useState(false);
  const [openAccordions, setOpenAccordions] = useState({});

  useEffect(() => {
    if (token && interviewType === 'Resume-based') {
      axios.get('/api/resume/history', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => {
        setResumes(res.data.history || []);
        if (res.data.history?.length > 0) {
          setSelectedResumeId(res.data.history[0]._id);
        }
      })
      .catch(e => console.error('Failed to load resumes:', e));
    }
  }, [token, interviewType]);

  const handleStartInterview = async (e) => {
    e.preventDefault();
    if (interviewType === 'Resume-based' && !selectedResumeId) {
      toast.error(`You need to select an uploaded resume, ${userName}!`);
      return;
    }

    setIsStartLoading(true);
    try {
      const res = await axios.post('/api/interview/start', {
        type: interviewType,
        role: targetRole,
        resumeId: interviewType === 'Resume-based' ? selectedResumeId : undefined
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setSessionId(res.data.sessionId);
      setCurrentQuestion(res.data.firstQuestion);
      setTotalQuestions(res.data.totalQuestions);
      setCurrentQuestionIndex(0);
      setUserAnswer('');
      setLastQuestionFeedback(null);
      setStep('active');
      toast.success('AI Interviewer initialized! Best of luck. 🚀');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to start interview.');
    } finally {
      setIsStartLoading(false);
    }
  };

  const handleSubmitAnswer = async (e) => {
    e.preventDefault();
    if (!userAnswer.trim()) {
      toast.error(`Write down your answer before submitting, ${userName}!`);
      return;
    }

    setIsSubmitLoading(true);
    setStep('evaluating');
    try {
      const res = await axios.post('/api/interview/answer', {
        sessionId,
        questionIndex: currentQuestionIndex,
        answer: userAnswer
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setLastQuestionFeedback(res.data.evaluation);
      
      if (res.data.completed) {
        toast.success('Interview session complete! Compiling metrics... 📈');
        fetchFinalResult();
      } else {
        // Move forward info is ready when they click "next question"
        // Cache the next question data
        setNextQuestionData({
          question: res.data.nextQuestion,
          index: res.data.nextQuestionIndex
        });
      }
    } catch (err) {
      toast.error('Failed to evaluate answer.');
      setStep('active');
    } finally {
      setIsSubmitLoading(false);
    }
  };

  const [nextQuestionData, setNextQuestionData] = useState(null);

  const handleNextQuestion = () => {
    if (nextQuestionData) {
      setCurrentQuestion(nextQuestionData.question);
      setCurrentQuestionIndex(nextQuestionData.index);
      setUserAnswer('');
      setLastQuestionFeedback(null);
      setNextQuestionData(null);
      setStep('active');
    }
  };

  const fetchFinalResult = async () => {
    setIsLoadingResult(true);
    setStep('result');
    try {
      const res = await axios.get(`/api/interview/result/${sessionId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFinalResult(res.data);
    } catch (err) {
      toast.error('Failed to compile results dashboard.');
    } finally {
      setIsLoadingResult(false);
    }
  };

  const toggleAccordion = (idx) => {
    setOpenAccordions(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  const handleReset = () => {
    setStep('setup');
    setSessionId(null);
    setCurrentQuestionIndex(0);
    setUserAnswer('');
    setLastQuestionFeedback(null);
    setFinalResult(null);
    setNextQuestionData(null);
  };

  return (
    <div className="flex min-h-screen bg-bg text-text">
      <Sidebar />

      <main className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-3xl font-extrabold font-outfit text-text flex items-center gap-2">
            <UserCheck className="w-8 h-8 text-rose" /> Mock Interview
          </h2>
          <p className="text-muted text-sm mt-0.5">Practice roles with real-time feedback simulator powered by Gemini AI brains.</p>
        </div>

        <AnimatePresence mode="wait">
          {/* STEP 1: SETUP SCREEN */}
          {step === 'setup' && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="max-w-2xl bg-surface border border-border rounded-2xl p-6 shadow-card space-y-6 mx-auto mt-6"
            >
              <h3 className="text-xl font-extrabold font-outfit text-text text-center">
                Configure Practice Session
              </h3>

              <form onSubmit={handleStartInterview} className="space-y-5">
                {/* Role selection */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-muted">Target Job Role</label>
                  <input
                    type="text"
                    required
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    placeholder="e.g. Node Backend Engineer"
                    className="w-full px-4 py-3 bg-panel border border-border rounded-xl text-sm focus:border-rose outline-none text-text"
                  />
                </div>

                {/* Type Selection Cards */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted">Interview Focus Type</label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { name: 'Technical', desc: 'Code logic, databases, architectures', icon: '💻' },
                      { name: 'HR', desc: 'Behavioral, teamwork, conflict resolutions', icon: '🤝' },
                      { name: 'Resume-based', desc: 'Queries tailored to your uploaded CV', icon: '📄' }
                    ].map((t) => (
                      <div
                        key={t.name}
                        onClick={() => setInterviewType(t.name)}
                        className={`p-4 rounded-xl border cursor-pointer transition text-left space-y-2 ${
                          interviewType === t.name
                            ? 'bg-panel border-rose text-rose font-bold shadow-sm'
                            : 'bg-panel/40 border-border/60 hover:bg-panel text-text hover:border-rose/30'
                        }`}
                      >
                        <span className="text-2xl block">{t.icon}</span>
                        <h4 className="text-xs font-bold font-outfit">{t.name}</h4>
                        <p className="text-[10px] text-muted leading-relaxed font-normal">{t.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Resume Dropdown if Resume-based */}
                {interviewType === 'Resume-based' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="space-y-1.5"
                  >
                    <label className="text-xs font-bold text-muted">Select Target Resume</label>
                    {resumes.length > 0 ? (
                      <select
                        value={selectedResumeId}
                        onChange={(e) => setSelectedResumeId(e.target.value)}
                        className="w-full px-4 py-3 bg-panel border border-border rounded-xl text-sm focus:border-rose outline-none text-text cursor-pointer"
                      >
                        {resumes.map((r) => (
                          <option key={r._id} value={r._id} className="bg-surface">
                            ATS Score: {r.atsScore}% - {new Date(r.createdAt).toLocaleDateString()}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <div className="p-4 bg-panel/30 border border-dashed border-border rounded-xl text-center text-xs text-muted">
                        No resumes found, ${userName}. Please upload one first in the{' '}
                        <button
                          type="button"
                          onClick={() => window.location.href='/resume-analyzer'}
                          className="text-rose font-bold hover:underline"
                        >
                          Resume Analyzer
                        </button>
                        !
                      </div>
                    )}
                  </motion.div>
                )}

                <button
                  type="submit"
                  disabled={isStartLoading || (interviewType === 'Resume-based' && resumes.length === 0)}
                  className="w-full py-3 bg-rose text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition disabled:opacity-50 cursor-pointer text-sm font-outfit"
                >
                  {isStartLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Assembling questions checklist...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" /> Start Mock Interview
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          )}

          {/* STEP 2: ACTIVE SESSION */}
          {step === 'active' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-2xl bg-surface border border-border rounded-2xl p-6 shadow-card space-y-6 mx-auto mt-6"
            >
              <div className="flex justify-between items-center border-b border-border/40 pb-3">
                <span className="text-xs font-bold text-rose px-2.5 py-0.5 bg-rose/10 border border-rose/20 rounded-full">
                  {interviewType} Interview - {targetRole}
                </span>
                <span className="text-xs font-bold text-muted">
                  Question {currentQuestionIndex + 1} of {totalQuestions}
                </span>
              </div>

              {/* Question Text */}
              <div className="p-4 bg-panel border-l-4 border-rose rounded-r-xl space-y-1">
                <span className="text-[10px] font-bold text-rose uppercase tracking-wider">Interviewer Ask:</span>
                <p className="text-sm font-bold leading-relaxed">{currentQuestion}</p>
              </div>

              <form onSubmit={handleSubmitAnswer} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-muted">Type Your Answer</label>
                  <textarea
                    required
                    rows={6}
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder="Provide your professional reply. Mention code patterns, technologies, or team logic where fitting..."
                    className="w-full px-4 py-3 bg-panel border border-border rounded-xl text-sm focus:border-rose outline-none text-text"
                  />
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => { if(window.confirm('Quit this session?')) handleReset(); }}
                    className="px-5 py-3 border border-border text-muted font-bold rounded-xl text-sm hover:bg-panel transition cursor-pointer"
                  >
                    Quit
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-3 bg-rose text-white font-bold rounded-xl text-sm hover:opacity-90 transition cursor-pointer flex items-center gap-1.5"
                  >
                    Submit Answer <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {/* STEP 3: EVALUATING SCREEN */}
          {step === 'evaluating' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-2xl bg-surface border border-border rounded-2xl p-6 shadow-card space-y-6 mx-auto mt-6 text-center py-12"
            >
              {isSubmitLoading ? (
                <div className="space-y-4 flex flex-col items-center">
                  <Loader2 className="w-10 h-10 text-rose animate-spin" />
                  <div className="space-y-1">
                    <h3 className="font-bold text-text font-outfit">Analyzing your response...</h3>
                    <p className="text-muted text-xs">Gemini is scoring your technical accuracy, wording structure, and depth.</p>
                  </div>
                </div>
              ) : (
                lastQuestionFeedback && (
                  <div className="space-y-6 text-left">
                    <div className="flex justify-between items-center border-b border-border/40 pb-3">
                      <h3 className="text-lg font-bold font-outfit text-text flex items-center gap-1.5">
                        <Award className="w-5 h-5 text-rose animate-pulse" /> Assessment Output
                      </h3>
                      <span className="text-xs font-bold text-rose px-3 py-1 bg-rose/10 border border-rose/20 rounded-full">
                        Score: {lastQuestionFeedback.score}/10
                      </span>
                    </div>

                    <div className="space-y-4">
                      {/* Feedback Text */}
                      <div className="space-y-1 p-4 bg-panel border border-border rounded-xl">
                        <span className="text-[10px] font-bold text-rose uppercase tracking-wider block">Critic Evaluation:</span>
                        <p className="text-xs leading-relaxed text-text font-semibold">{lastQuestionFeedback.feedback}</p>
                      </div>

                      {/* Better Answer advice */}
                      <div className="space-y-1 p-4 bg-emerald/5 border border-emerald/20 rounded-xl">
                        <span className="text-[10px] font-bold text-emerald uppercase tracking-wider block">Recommended Model Answer:</span>
                        <p className="text-xs leading-relaxed text-text font-medium border-l border-emerald/30 pl-3 italic whitespace-pre-line">
                          {lastQuestionFeedback.betterAnswer}
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-end pt-3">
                      {currentQuestionIndex === totalQuestions - 1 ? (
                        <button
                          onClick={fetchFinalResult}
                          className="px-6 py-3 bg-rose text-white font-bold rounded-xl text-sm hover:opacity-90 transition cursor-pointer flex items-center gap-1.5"
                        >
                          <Loader2 className="w-4 h-4 animate-spin hidden" /> View Performance Report <ArrowRight className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          onClick={handleNextQuestion}
                          className="px-6 py-3 bg-rose text-white font-bold rounded-xl text-sm hover:opacity-90 transition cursor-pointer flex items-center gap-1.5"
                        >
                          Next Question <ArrowRight className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                )
              )}
            </motion.div>
          )}

          {/* STEP 4: RESULT SCREEN */}
          {step === 'result' && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl space-y-6 mx-auto mt-6"
            >
              {isLoadingResult ? (
                <div className="bg-surface border border-border rounded-2xl p-12 text-center flex flex-col items-center justify-center space-y-4 min-h-[400px]">
                  <Loader2 className="w-10 h-10 text-rose animate-spin" />
                  <div className="space-y-1.5">
                    <h3 className="font-bold text-text text-lg font-outfit">Compiling Interview Results Dashboard...</h3>
                    <p className="text-muted text-xs">Averaging response scores and writing summary feedback panels.</p>
                  </div>
                </div>
              ) : (
                finalResult && (
                  <>
                    {/* Overview Dashboard Card */}
                    <div className="p-6 rounded-2xl bg-surface border border-border shadow-card flex flex-col md:flex-row gap-6 items-center justify-between">
                      <div className="text-left space-y-2">
                        <span className="text-xs font-bold text-rose px-2.5 py-0.5 bg-rose/10 border border-rose/20 rounded-full">
                          {finalResult.type} Assessment - {finalResult.role}
                        </span>
                        <h3 className="text-2xl font-extrabold font-outfit text-text">Session Final Report</h3>
                        <p className="text-muted text-xs leading-relaxed max-w-md">
                          {finalResult.summary}
                        </p>
                      </div>

                      {/* score box */}
                      <div className="flex flex-col items-center justify-center p-6 bg-panel border border-border rounded-2xl text-center min-w-[140px]">
                        <span className="text-muted text-[10px] font-bold tracking-wider uppercase">Average Score</span>
                        <span className="text-4xl font-black font-outfit text-rose mt-1">
                          {finalResult.averageScore}
                        </span>
                        <span className="text-[10px] text-muted font-bold">out of 10</span>
                      </div>
                    </div>

                    {/* Accordion Questions List */}
                    <div className="space-y-4">
                      <h4 className="font-bold text-text flex items-center gap-1.5 text-sm">
                        <HelpCircle className="w-5 h-5 text-rose animate-pulse" /> Detailed Question Checklist Breakdown
                      </h4>

                      {finalResult.questions.map((q, idx) => (
                        <div
                          key={idx}
                          className="bg-surface border border-border rounded-xl overflow-hidden shadow-sm"
                        >
                          <button
                            onClick={() => toggleAccordion(idx)}
                            className="w-full p-4 flex justify-between items-center text-left hover:bg-panel transition text-xs font-bold cursor-pointer"
                          >
                            <span className="text-text max-w-[85%]">
                              Q{idx + 1}: {q}
                            </span>
                            <div className="flex items-center gap-3">
                              <span className="px-2 py-0.5 rounded text-[10px] bg-bg font-extrabold text-rose">
                                Score: {finalResult.evaluations[idx]?.score}/10
                              </span>
                              {openAccordions[idx] ? <ChevronUp className="w-4 h-4 text-muted" /> : <ChevronDown className="w-4 h-4 text-muted" />}
                            </div>
                          </button>

                          {openAccordions[idx] && (
                            <div className="p-4 border-t border-border/40 bg-panel/30 space-y-3 text-xs leading-relaxed">
                              <div>
                                <span className="text-[10px] font-bold text-muted uppercase">Your Answer:</span>
                                <p className="text-text font-semibold pl-2.5 border-l-2 border-border mt-0.5">
                                  {finalResult.answers[idx]}
                                </p>
                              </div>
                              
                              <div>
                                <span className="text-[10px] font-bold text-rose uppercase">Evaluator Feedback:</span>
                                <p className="text-muted font-medium mt-0.5">
                                  {finalResult.evaluations[idx]?.feedback}
                                </p>
                              </div>

                              <div>
                                <span className="text-[10px] font-bold text-emerald uppercase">AI Coaching Alternate Answer:</span>
                                <p className="text-text font-medium bg-emerald/5 border border-emerald/10 p-3 rounded-lg mt-1 italic whitespace-pre-line">
                                  {finalResult.evaluations[idx]?.betterAnswer}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-center pt-4">
                      <button
                        onClick={handleReset}
                        className="px-6 py-3 bg-rose text-white font-bold rounded-xl text-sm hover:opacity-90 transition flex items-center gap-1.5 cursor-pointer shadow-card"
                      >
                        <RefreshCw className="w-4 h-4" /> Start Another Interview
                      </button>
                    </div>
                  </>
                )
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
