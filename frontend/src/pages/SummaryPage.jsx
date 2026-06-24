import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import axios from 'axios';
import {
  FileText,
  Calendar,
  Sparkles,
  Loader2,
  AlertCircle,
  TrendingUp,
  Inbox,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  TrendingDown,
  BookOpen
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function SummaryPage() {
  const user = useSelector((state) => state.auth.user);
  const userName = user ? user.fullName.split(' ')[0] : 'Friend';
  const token = useSelector((state) => state.auth.token);
  const preferences = useSelector((state) => state.settings.preferences);

  // States
  const [summaries, setSummaries] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Generating inputs
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  
  // Accordion details
  const [openAccordions, setOpenAccordions] = useState({});

  const fetchSummaries = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get('/api/summary', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSummaries(res.data.summaries || []);
    } catch (e) {
      toast.error('Failed to load summary list.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchSummaries();
    }
  }, [token]);

  const handleGenerateSummary = async (e) => {
    e.preventDefault();
    setIsGenerating(true);
    try {
      const res = await axios.post('/api/summary/generate', {
        month: Number(selectedMonth),
        year: Number(selectedYear)
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      toast.success('Monthly summary compiled and saved! 📈');
      fetchSummaries();
    } catch (err) {
      toast.error(err.response?.data?.message || `Failed to generate monthly summary. Ensure you have messages logged during this period, ${userName}!`);
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleAccordion = (id) => {
    setOpenAccordions(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const getMonthName = (monthNumber) => {
    const date = new Date();
    date.setMonth(monthNumber - 1);
    return date.toLocaleString(undefined, { month: 'long' });
  };

  const companionName = preferences?.aiName || 'Companion';

  return (
    <div className="flex min-h-screen bg-bg text-text">
      <Sidebar />

      <main className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-3xl font-extrabold font-outfit text-text flex items-center gap-2">
              <FileText className="w-8 h-8 text-cyan animate-pulse" /> Monthly Summaries
            </h2>
            <p className="text-muted text-sm mt-0.5">Explore monthly AI reflections covering conversation topics, goals achieved, and mood trends, ${userName}.</p>
          </div>
        </div>

        {/* Generate card */}
        <div className="p-6 rounded-2xl bg-surface border border-border shadow-card space-y-4 max-w-2xl">
          <h3 className="text-base font-extrabold font-outfit text-text flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-cyan animate-pulse" /> Generate New Monthly Review
          </h3>
          <p className="text-muted text-xs leading-relaxed">
            Your AI compiles all chats, messages, active goals, and emotional mood swings into a structured periodic report.
          </p>

          <form onSubmit={handleGenerateSummary} className="flex flex-wrap gap-4 items-end">
            <div className="space-y-1.5 flex-1 min-w-[140px]">
              <label className="text-xs font-bold text-muted">Month</label>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="w-full px-4 py-2.5 bg-panel border border-border rounded-xl text-xs focus:border-cyan outline-none text-text cursor-pointer"
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                  <option key={m} value={m} className="bg-surface">
                    {getMonthName(m)}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5 flex-1 min-w-[140px]">
              <label className="text-xs font-bold text-muted">Year</label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full px-4 py-2.5 bg-panel border border-border rounded-xl text-xs focus:border-cyan outline-none text-text cursor-pointer"
              >
                {[new Date().getFullYear(), new Date().getFullYear() - 1].map((y) => (
                  <option key={y} value={y} className="bg-surface">
                    {y}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={isGenerating}
              className="px-5 py-2.5 bg-cyan text-white font-bold rounded-xl text-xs hover:opacity-90 transition disabled:opacity-50 cursor-pointer flex items-center gap-1.5 h-10"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Compiling...
                </>
              ) : (
                <>
                  Compile Monthly Summary <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* List Grid */}
        <div className="space-y-4 max-w-2xl">
          <h3 className="font-bold text-text flex items-center gap-2 text-sm border-b border-border/40 pb-2">
            <BookOpen className="w-5 h-5 text-cyan" /> Monthly Archive History
          </h3>

          {isLoading ? (
            <div className="py-20 flex justify-center items-center gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-cyan" />
              <span className="text-muted text-sm font-outfit">Retrieving monthly summaries...</span>
            </div>
          ) : summaries.length > 0 ? (
            <div className="space-y-3">
              <AnimatePresence mode="popLayout">
                {summaries.map((item) => (
                  <div
                    key={item._id}
                    className="bg-surface border border-border rounded-xl overflow-hidden shadow-sm"
                  >
                    <button
                      onClick={() => toggleAccordion(item._id)}
                      className="w-full p-4 flex justify-between items-center text-left hover:bg-panel transition text-xs font-bold cursor-pointer"
                    >
                      <span className="text-text flex items-center gap-2">
                        📅 Review: {getMonthName(item.month)} {item.year}
                      </span>
                      {openAccordions[item._id] ? <ChevronUp className="w-4 h-4 text-muted" /> : <ChevronDown className="w-4 h-4 text-muted" />}
                    </button>

                    {openAccordions[item._id] && (
                      <div className="p-5 border-t border-border/40 bg-panel/30 space-y-4 text-xs leading-relaxed">
                        
                        {/* Summary text */}
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-cyan uppercase tracking-wider block">Summary Overview:</span>
                          <p className="text-text font-semibold pl-2.5 border-l-2 border-cyan/40">
                            {item.summary}
                          </p>
                        </div>

                        {/* Split tags grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                          {/* Topics */}
                          {item.keyTopics?.length > 0 && (
                            <div className="space-y-1.5">
                              <span className="text-[9px] font-bold text-muted uppercase">🗣️ Topics Discussed</span>
                              <div className="flex flex-wrap gap-1">
                                {item.keyTopics.map((topic, idx) => (
                                  <span key={idx} className="px-2 py-0.5 bg-cyan/15 text-cyan border border-cyan/35 rounded text-[10px] capitalize font-semibold">
                                    {topic}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Achievements */}
                          {item.achievements?.length > 0 && (
                            <div className="space-y-1.5">
                              <span className="text-[9px] font-bold text-muted uppercase">🎯 Goals Completed</span>
                              <div className="flex flex-wrap gap-1">
                                {item.achievements.map((ach, idx) => (
                                  <span key={idx} className="px-2 py-0.5 bg-emerald/15 text-emerald border border-emerald/35 rounded text-[10px] font-semibold">
                                    {ach}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                      </div>
                    )}
                  </div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="py-20 text-center bg-surface border border-dashed border-border rounded-2xl flex flex-col items-center justify-center space-y-3">
              <Inbox className="w-10 h-10 text-muted" />
              <div className="space-y-1">
                <h3 className="font-bold text-text">No Summaries Logged</h3>
                <p className="text-muted text-xs max-w-xs mx-auto">
                  No monthly summaries compiled yet, ${userName}. Generate your first summary above to analyze companion feedback.
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
