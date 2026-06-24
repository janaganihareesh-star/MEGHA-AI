import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import axios from 'axios';
import {
  FileText,
  UploadCloud,
  CheckCircle,
  AlertTriangle,
  Lightbulb,
  HelpCircle,
  History,
  Briefcase,
  Play,
  Loader2,
  X,
  ShieldAlert
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function ResumeAnalyzerPage() {
  const user = useSelector((state) => state.auth.user);
  const userName = user ? user.fullName.split(' ')[0] : 'Friend';
  const token = useSelector((state) => state.auth.token);

  // UI state
  const [selectedFile, setSelectedFile] = useState(null);
  const [targetRole, setTargetRole] = useState('Software Engineer');
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [history, setHistory] = useState([]);
  
  // Active Analysis results
  const [analysisResult, setAnalysisResult] = useState(null);
  const [activeResumeId, setActiveResumeId] = useState(null);

  // Fetch past analyzes
  const fetchHistory = async () => {
    try {
      const res = await axios.get('/api/resume/history', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setHistory(res.data.history || []);
    } catch (e) {
      console.error('Failed to load history:', e);
    }
  };

  useEffect(() => {
    if (token) {
      fetchHistory();
    }
  }, [token]);

  // Drag and Drop handlers
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const validTypes = [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/msword',
        'text/plain'
      ];
      if (validTypes.includes(file.type) || file.name.endsWith('.docx') || file.name.endsWith('.pdf')) {
        setSelectedFile(file);
      } else {
        toast.error(`Only PDF, DOCX or TXT files are accepted, ${userName}!`);
      }
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUploadAndAnalyze = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      toast.error('Please drop or browse a resume file first!');
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('resume', selectedFile);

    try {
      // 1. Upload
      const uploadRes = await axios.post('/api/resume/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });
      const { resumeId } = uploadRes.data;
      setActiveResumeId(resumeId);
      setIsUploading(false);
      
      // 2. Analyze
      setIsAnalyzing(true);
      const analyzeRes = await axios.post('/api/resume/analyze', {
        resumeId,
        targetRole
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setAnalysisResult(analyzeRes.data.analysis);
      toast.success('Resume ATS scoring complete! 📊');
      fetchHistory(); // refresh past runs
    } catch (err) {
      toast.error(err.response?.data?.message || 'Resume Analysis failed.');
    } finally {
      setIsUploading(false);
      setIsAnalyzing(false);
    }
  };

  const loadPastAnalysis = async (pastItem) => {
    setIsAnalyzing(true);
    try {
      // Trigger analyze to load detail (cached in db fields)
      const analyzeRes = await axios.post('/api/resume/analyze', {
        resumeId: pastItem._id,
        targetRole: targetRole || 'Software Engineer'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAnalysisResult(analyzeRes.data.analysis);
      setActiveResumeId(pastItem._id);
    } catch (e) {
      toast.error('Could not reload past analysis.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Radial Score Ring helper
  const score = analysisResult ? analysisResult.atsScore : 0;
  const radius = 55;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getScoreColor = (s) => {
    if (s >= 80) return 'text-emerald stroke-emerald';
    if (s >= 60) return 'text-amber stroke-amber';
    return 'text-rose stroke-rose';
  };

  return (
    <div className="flex min-h-screen bg-bg text-text">
      <Sidebar />

      <main className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-3xl font-extrabold font-outfit text-text flex items-center gap-2">
              <FileText className="w-8 h-8 text-accent animate-pulse" /> AI Resume Analyzer
            </h2>
            <p className="text-muted text-sm mt-0.5">Optimize your resume against ATS tracking algorithms using Gemini AI recruiter models, ${userName}.</p>
          </div>
        </div>

        {/* Workspace Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left / Input form Column */}
          <div className="lg:col-span-1 space-y-6">
            {/* 1. UPLOADER CARD */}
            <div className="p-6 rounded-2xl bg-surface border border-border shadow-card space-y-4">
              <h3 className="font-bold font-outfit text-lg flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-accent" /> Analysis Parameters
              </h3>

              <form onSubmit={handleUploadAndAnalyze} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-muted">Target Job Role</label>
                  <input
                    type="text"
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    placeholder="e.g. Frontend Engineer, Data Scientist"
                    className="w-full px-4 py-3 bg-panel border border-border rounded-xl text-sm focus:border-accent outline-none text-text"
                  />
                </div>

                {/* Drag zone */}
                <div
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition relative ${
                    dragActive ? 'border-accent bg-accent/5' : 'border-border hover:border-accent/40 bg-panel'
                  }`}
                >
                  <input
                    type="file"
                    id="file-browse"
                    onChange={handleFileChange}
                    accept=".pdf,.docx,.doc,.txt"
                    className="hidden"
                  />
                  <label htmlFor="file-browse" className="cursor-pointer space-y-3 block">
                    <UploadCloud className="w-10 h-10 text-muted mx-auto" />
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-text">
                        {selectedFile ? selectedFile.name : 'Drag & Drop your resume here'}
                      </p>
                      <p className="text-[10px] text-muted">Supports PDF, DOCX or TXT (Max 5MB)</p>
                    </div>
                  </label>
                  {selectedFile && (
                    <button
                      type="button"
                      onClick={() => setSelectedFile(null)}
                      className="absolute top-2 right-2 p-1 text-muted hover:text-rose rounded bg-surface border border-border"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isUploading || isAnalyzing || !selectedFile}
                  className="w-full py-3 bg-accent text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition disabled:opacity-50 cursor-pointer text-sm font-outfit"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Uploading resume document...
                    </>
                  ) : isAnalyzing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Evaluating ATS metrics...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" /> Run ATS Assessment
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* 2. HISTORY LIST CARD */}
            <div className="p-6 rounded-2xl bg-surface border border-border shadow-card space-y-4">
              <h3 className="font-bold font-outfit text-lg flex items-center gap-2">
                <History className="w-5 h-5 text-muted" /> Analysis History
              </h3>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {history.length > 0 ? (
                  history.map((item) => (
                    <div
                      key={item._id}
                      onClick={() => loadPastAnalysis(item)}
                      className={`p-3 rounded-xl border cursor-pointer transition text-xs flex justify-between items-center ${
                        activeResumeId === item._id
                          ? 'bg-panel border-accent/40 text-accent font-bold'
                          : 'bg-panel/40 border-border/60 hover:bg-panel text-text hover:text-accent'
                      }`}
                    >
                      <div className="space-y-0.5 truncate pr-2">
                        <p className="font-semibold truncate">Target: {targetRole}</p>
                        <p className="text-[10px] text-muted">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <span className={`px-2 py-1.5 rounded-lg font-extrabold text-[10px] bg-bg ${
                        item.atsScore >= 80 ? 'text-emerald' : item.atsScore >= 60 ? 'text-amber' : 'text-rose'
                      }`}>
                        {item.atsScore}%
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-muted text-xs text-center py-4">No assessment histories found, ${userName}.</p>
                )}
              </div>
            </div>
          </div>

          {/* Right / Results Column */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {isAnalyzing ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-surface border border-border rounded-2xl p-12 text-center flex flex-col items-center justify-center space-y-4 min-h-[500px]"
                >
                  <Loader2 className="w-12 h-12 text-accent animate-spin" />
                  <div className="space-y-1.5">
                    <h3 className="font-bold text-text text-lg font-outfit">Recruiters are scanning your profile...</h3>
                    <p className="text-muted text-xs max-w-sm">
                      Evaluating keyword matches, verifying formatting criteria, listing missing skillsets, and synthesizing core sample prep questions.
                    </p>
                  </div>
                </motion.div>
              ) : analysisResult ? (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="space-y-6"
                >
                  {/* Score & Banner Card */}
                  <div className="p-6 rounded-2xl bg-surface border border-border shadow-card flex flex-col md:flex-row gap-6 items-center justify-between">
                    <div className="text-left space-y-2">
                      <span className="text-xs font-bold text-accent px-2.5 py-0.5 rounded-full bg-accent/10 border border-accent/20">
                        Target Role: {targetRole}
                      </span>
                      <h3 className="text-2xl font-extrabold font-outfit text-text">Assessment Complete</h3>
                      <p className="text-muted text-xs max-w-md">
                        Your resume has been parsed and scored. We recommend resolving the missing skills and improvements below to target a score above 85%, ${userName}!
                      </p>
                    </div>

                    {/* Circular Score Visualizer */}
                    <div className="relative flex items-center justify-center w-32 h-32 flex-shrink-0">
                      <svg className="w-32 h-32 transform -rotate-90">
                        <circle
                          cx="64"
                          cy="64"
                          r={radius}
                          className="stroke-border/40"
                          strokeWidth="8"
                          fill="transparent"
                        />
                        <circle
                          cx="64"
                          cy="64"
                          r={radius}
                          className={`stroke-current ${getScoreColor(score).split(' ')[1]}`}
                          strokeWidth="8"
                          fill="transparent"
                          strokeDasharray={circumference}
                          strokeDashoffset={strokeDashoffset}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute flex flex-col items-center justify-center">
                        <span className={`text-3xl font-black font-outfit ${getScoreColor(score).split(' ')[0]}`}>
                          {score}
                        </span>
                        <span className="text-[10px] text-muted font-bold tracking-wider">ATS SCORE</span>
                      </div>
                    </div>
                  </div>

                  {/* Main assessment grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Strengths checkmarks */}
                    <div className="p-6 rounded-2xl bg-surface border border-border shadow-card space-y-4">
                      <h4 className="font-bold text-text flex items-center gap-2 text-sm border-b border-border/40 pb-2">
                        <CheckCircle className="w-4.5 h-4.5 text-emerald" /> Core Strengths
                      </h4>
                      <ul className="space-y-3">
                        {analysisResult.strengths?.map((str, idx) => (
                          <li key={idx} className="flex gap-2.5 text-xs text-text items-start">
                            <span className="text-emerald mt-0.5">✔️</span>
                            <span className="leading-relaxed">{str}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Missing skills checkmarks */}
                    <div className="p-6 rounded-2xl bg-surface border border-border shadow-card space-y-4">
                      <h4 className="font-bold text-text flex items-center gap-2 text-sm border-b border-border/40 pb-2">
                        <AlertTriangle className="w-4.5 h-4.5 text-rose" /> Missing Skills / Keywords
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {analysisResult.missingSkills?.map((skill, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-1 text-[10px] font-bold bg-rose/10 border border-rose/30 text-rose rounded-lg"
                          >
                            ⚠️ {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Improvement bullets */}
                    <div className="p-6 rounded-2xl bg-surface border border-border shadow-card space-y-4 md:col-span-2">
                      <h4 className="font-bold text-text flex items-center gap-2 text-sm border-b border-border/40 pb-2">
                        <Lightbulb className="w-4.5 h-4.5 text-amber" /> Recommended Optimization Action Items
                      </h4>
                      <ul className="space-y-3">
                        {analysisResult.improvements?.map((imp, idx) => (
                          <li key={idx} className="flex gap-2.5 text-xs text-text items-start">
                            <span className="text-amber font-bold">💡</span>
                            <span className="leading-relaxed font-semibold">{imp}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Sample Interview questions */}
                    <div className="p-6 rounded-2xl bg-surface border border-border shadow-card space-y-4 md:col-span-2">
                      <h4 className="font-bold text-text flex items-center gap-2 text-sm border-b border-border/40 pb-2">
                        <HelpCircle className="w-4.5 h-4.5 text-cyan" /> Prep Questions based on Resume
                      </h4>
                      <div className="space-y-3">
                        {analysisResult.interviewQuestions?.map((q, idx) => (
                          <div key={idx} className="flex gap-3 text-xs bg-panel border border-border p-3 rounded-xl items-start">
                            <span className="text-cyan font-bold font-outfit text-sm">Q{idx + 1}</span>
                            <p className="leading-relaxed font-semibold">{q}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="bg-surface border border-border rounded-2xl p-12 text-center flex flex-col items-center justify-center space-y-3 min-h-[500px]">
                  <UploadCloud className="w-12 h-12 text-muted" />
                  <div className="space-y-1">
                    <h3 className="font-bold text-text text-lg font-outfit">No Assessment Results Loaded</h3>
                    <p className="text-muted text-xs max-w-sm mx-auto">
                      Please upload your CV using the upload box on the left, set your target role, and trigger the assessor.
                    </p>
                  </div>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}
